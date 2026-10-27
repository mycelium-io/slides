// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Mycelium Contributors
//
// Print the workshop deck to workshop/pdf/workshop-deck.pdf, as it looks in
// the browser. A slide with an animated diagram (a canvas scene) gets one page
// per click, because the clicks are the story. Any other slide gets one page,
// with all its steps shown.
//
//   cd workshop/pdf && npm install && node build.mjs
//
// It drives the real deck in headless Chromium, so the scenes are drawn as
// they are on stage. A browser print of the deck can't draw them.

import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const deck = pathToFileURL(join(here, "..", "index.html")).href;
const out = join(here, "workshop-deck.pdf");
const shots = mkdtempSync(join(tmpdir(), "deck-pdf-"));
const wait = ms => new Promise(r => setTimeout(r, ms));

// --use-mock-keychain keeps the browser out of the system keychain.
const browser = await chromium.launch({ args: ["--use-mock-keychain", "--password-store=basic"] });
const open = async () => {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  // No step may wait forever: a stalled screenshot once hung a build for hours.
  page.setDefaultTimeout(30000);
  return page;
};

let page = await open();
await page.goto(deck + "#1", { waitUntil: "domcontentloaded" });
await wait(1500);
const count = await page.evaluate(() => document.querySelectorAll(".deck > .slide").length);
await page.close();

const files = [];
for (let n = 1; n <= count; n++) {
  // A fresh page per slide, so every slide starts from its first step and
  // the scenes' WebGL and canvases don't pile up in one tab.
  // Web fonts can hold up "load" on a slow network, so wait for the DOM and then a beat.
  // A load now and then never finishes (a web font that never answers), so
  // try a slide again on a fresh page before giving up on the build.
  for (let attempt = 1; ; attempt++) {
    page = await open();
    try {
      await page.goto(`${deck}?print=${n}#${n}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      break;
    } catch (e) {
      await page.close();
      if (attempt === 3) throw e;
      console.log(`${n}/${count} load timed out, trying again`);
    }
  }
  await page.evaluate(() => document.fonts.ready);
  await wait(1600);
  await page.mouse.click(5, 5);
  const info = await page.evaluate(() => {
    const s = document.querySelector(".slide.active");
    const steps = [...s.querySelectorAll(".step")];
    // A step marked "with" comes in on the same click as the one before it.
    const clicks = steps.filter(e => !e.classList.contains("with")).length;
    return { clicks, scene: !!s.querySelector("canvas.scene"), title: s.dataset.title };
  });
  const snap = async label => {
    const file = join(shots, `${String(n).padStart(2, "0")}-${label}.png`);
    await page.screenshot({ path: file });
    files.push(file);
  };
  if (info.scene) {
    await snap("0");
    for (let k = 1; k <= info.clicks; k++) {
      await page.keyboard.press("ArrowRight");
      await wait(2200);
      await snap(String(k));
    }
  } else {
    for (let k = 1; k <= info.clicks; k++) {
      await page.keyboard.press("ArrowRight");
      await wait(150);
    }
    await wait(1200);
    await snap("final");
  }
  await page.close();
  console.log(`${n}/${count} ${info.title}${info.scene ? ` (${info.clicks + 1} pages)` : ""}`);
}

page = await open();

// One 1920x1080 page per screenshot.
const html = `<!doctype html><style>@page{size:1920px 1080px;margin:0}body{margin:0}img{display:block;width:1920px;height:1080px;break-after:page}</style>`
  + files.map(f => `<img src="${pathToFileURL(f).href}">`).join("");
const sheet = join(shots, "pages.html");
writeFileSync(sheet, html);
await page.goto(pathToFileURL(sheet).href);
await page.waitForFunction(() => [...document.images].every(i => i.complete));
await page.pdf({ path: out, width: "1920px", height: "1080px", printBackground: true });
await browser.close();
rmSync(shots, { recursive: true, force: true });
console.log(`Wrote ${out} (${files.length} pages)`);
