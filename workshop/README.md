<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- Copyright 2026 Mycelium Contributors -->

# The workshop deck, and the slide template

Live at <https://mycelium-io.github.io/slides/workshop/>. Copy this folder to
start a new talk.

A slide deck in plain HTML, for talks and workshops. It uses the docs' palette
and type: IBM Plex Sans for headings and text, Cormorant Garamond italic only
as an accent (one phrase in a heading, marked `<em>`), and Geist Mono.
Most slides are flat: a plain dark background with diagrams of outlined boxes
and thin arrows. A slide marked `data-glass` shows the glass instead: a field
of drifting motes (the docs' spores) with a lens over it, used for the title,
section openers and the close. On a slide that is also `data-logo`, the lens
holds the Mycelium mark, seen undistorted in its flat middle.

## Presenting

Open `index.html` in Chrome. There is no build step and no server. It needs
the internet for the fonts. Without a connection the type falls back to Georgia and system fonts.

| Key | |
|---|---|
| → Space PageDown | next step, then next slide (clickers send these) |
| ← PageUp | back |
| O | overview of every slide; click a tile to jump to it |
| S | speaker view: notes, what comes next, elapsed time, the clock |
| F | fullscreen |
| T | light / dark (light suits a bright room or a weak projector) |
| B or . | blackout |
| a number, then ⏎ | go to that slide |
| D | draw on the slide; U undoes, C clears it, Esc puts the pen down |
| ? | the key list |

## Live terminals

```bash
uv run workshop/serve.py --cwd ~/workshop
```

This serves the deck at `http://127.0.0.1:8765/workshop/index.html?token=…`
and opens it. Each terminal pane is then a real shell: bash with a plain
prompt, started in `--cwd`, running as you with your environment, so
`mycelium` there is your own CLI talking to your own hub. `--login` gives
you your own shell and prompt instead. Each terminal keeps its shell while
the server runs, and a reload replays what was on it.

- Each press of → types the pane's next prepared command and runs it, one
  per press, before the deck moves on. That way the demo goes as rehearsed,
  with no typos.
- Click into a terminal to type yourself. The keys go to the shell until you
  press Esc, which hands them back to the deck (Esc never reaches the shell).
- The speaker view counts the commands left.
- Opened as a file, or without the server, every terminal is the static one
  it was written as.

The server listens on 127.0.0.1 only. Terminal requests must carry the
token from the URL, come to that host by name and, from a browser, from
that origin, so no other page can type into a shell. It needs Python 3.10+
and nothing else, on macOS or Linux. xterm.js loads from jsDelivr.

To make a pane live, give it a `data-term` id and a script:

```html
<div class="term pane" data-term="board">
  <div class="bar"><i></i><i></i><i></i><span>room · passkeys</span></div>
  <template class="script">
    mycelium board new "Ship passkey login"
    mycelium board
  </template>
  <pre>…what it shows without the server…</pre>
</div>
```

## App screenshots

An app pane shows a screenshot of the app or a website in a browser frame:

```html
<div class="app pane">
  <div class="bar"><i></i><i></i><i></i><span class="addr">mycelium</span></div>
  <div class="app-view"><img src="media/room.png" alt="What the screenshot shows"></div>
</div>
```

The deck doesn't run the app live: a screenshot or a short video loads
instantly, works offline, and can't stall on stage.

## Drawing

Press D (or pick a tool) to draw over the whole slide,
terminals included. A toolbar appears at the bottom with three tools: a
pen (it follows a stylus's pressure), a highlighter, and laser ink that
fades a moment after you lift. It has five colours from the palette, and
Undo, Clear and Done. The deck keys still move between slides while you
draw. Ink belongs to its slide: it is kept in stage pixels, so it scales
with the window and is still there when you come back. U or ⌘/Ctrl-Z
undoes, C clears the slide, and D or Esc puts the pen down. Ink isn't
printed.

## Scenes: show, don't tell

A scene is a small living diagram drawn in the deck's glass: beads for
agents and people, hyphae between them, pulses for messages. Put
`<canvas class="scene" data-scene="name">` on a `layout-scene` slide and
add one empty `<i class="step beat"></i>` for each stage after the first:
each press moves the scene on, like any other step, and arriving backwards
shows its last stage. The slide carries `data-stage`, so a heading can
change with it:

```html
<div class="swap">
  <h2 data-at="0">One agent</h2>
  <h2 data-at="1">An orchestrator</h2>
</div>
```

The scenes, in `scenes.js`:

| | stages |
|---|---|
| `coworkers` | one agent making tool calls → an orchestrator handing work to subagents that send summaries up and go → one bad instruction going wrong all the way down → agents that each own a piece of the codebase, keep their context and talk to each other |
| `lifecycle` | one agent that keeps everything and swells → workers that finish and leave notes in the room's memory → new workers that read the notes first |
| `threeways` | five agents in one group chat → around a room's board, each message going to its task's row → one task running a flow that gives each agent a turn |
| `asking` | `@builder` mentions `@reviewer` in a task's thread → `@reviewer` wakes, answers in the thread and goes back to waiting |
| `scale` | you and one agent → three in parallel → three repeatable chains → a swarm (with `.stages` words as its steps) |
| `lanes` | everything in one conversation → the chat apart, each task's thread in its own lane |
| `trust` | a swarm behind frosted glass (`.veil`) with outcomes coming out → the glass clears to show the agent pane |

A new scene is a function in `defs` that returns `frame(draw, dt, stage)`
(and optionally `stage(next, prev)`), drawing in stage pixels with the
helpers `bead`, `ring`, `edge`, `pulse` and `label`.

The URL hash is the slide number (`index.html#7`). To make a PDF, print from
Chrome with background graphics on. Each slide prints as one 1920×1080 page
with a still lens drawn in CSS.

Beads are flat discs, and messages travel along the hyphae as plain dots, to
match the flat diagrams.

## Flat diagrams

Lay a diagram's boxes out with HTML and CSS (`.box`, `.box.hi`, `.box.warn`,
and layouts such as `.stair`, `.rows`, `.funnel`, `.triad`, `.grid2`), name
the boxes a wire joins with `data-node`, and add an `<svg class="wires">` with
one `<path data-from="a" data-to="b">` per wire. `flat.js` draws each wire from
the side of one box that faces the other; `data-route="elbow"` bends it at a
right angle and `data-axis="h"` or `"v"` picks the direction. A wire can be a
`.step`. A `.callout[data-part]` beside a terminal pane is placed next to the
`.part` it names, the same way.

## Photos and media

The "Who we are" slide reads `people/julia.jpg` and `people/jodee.jpg`, the two
presenters' headshots, published with the deck with their permission. Add a
photo of a person only once they have said yes: the site is served from this
public repo. A missing one shows a placeholder naming the file.
Third-party images (screenshots of posts and announcements, other companies'
logos, other people's slides) go in `media/`, shown with
`<figure class="media" data-media="name.png" data-alt="…">`, and are published
with the deck.

## Writing slides

Each slide is a `<section class="slide">` on a 1920×1080 stage. Lay slides
out in stage pixels and the deck scales them to fit the screen.

```html
<section class="slide" data-title="Agenda" data-lens="1600 600 250">
  <h2 class="rise">Agenda</h2>
  …
  <aside class="notes"><p>Shown in the speaker view.</p></aside>
</section>
```

- `data-glass` shows the glass background on this slide; without it the slide
  is flat.
- `data-lens="x y r"` is where the lens sits on a glass slide and how big it
  is, in stage pixels. Give up to three, separated by commas
  (`"1520 470 330, 1130 860 54"` is a lens with a bead beside it), or `none`.
- `data-title` names the slide in the tab and the speaker view.
- `data-logo` puts the Mycelium mark inside the slide's first lens.
- `data-bare` hides the footer. On the `.deck` itself, `data-talk` names the
  talk in the tab and the speaker view, and `data-footer` puts a line in the
  middle of every footer.
- `.rise` elements arrive one after another when their slide opens.
- `.step` elements are revealed one per key press before the deck moves on. A
  step with its own `data-lens` moves the lens while it is the latest one shown.
- `.pane` is frosted glass. Use it for anything that sits over the lens.
- `<div class="timer" data-minutes="10" style="--x:1500px; --y:560px">` is a
  countdown centred on that point: click to start or pause, double-click to
  reset. The exercise slide centres one on its lens.

`deck.css` has a layout for each of these, and `index.html` uses some of them: `layout-title`, a terminal
(`layout-terminal`), an agenda (`.agenda`), `layout-section`,
`layout-statement`, `.cards`, `layout-diagram` (an SVG in stage coordinates
with the lens over its centre), a flow of `.step`s, `.numbers`,
`layout-exercise` with a timer, `layout-image`, `layout-app` (a screenshot in a browser frame), `.compare`,
`layout-isnt` (two "not" panes and a line revealed under them), `layout-lanes` (the room's
chat over parallel task threads), `.points` (three short points under a statement),
`layout-trio` (three big lines, one per press) and `layout-close`.
Copy the one closest to what you need.

## Files

| | |
|---|---|
| `index.html` | the slides |
| `deck.css` | palette (dark, and light under `data-theme="light"`), type, layouts, print |
| `deck.js` | fitting the stage, keys, steps, overview, speaker view, timers |
| `lens.js` | the background: the motes and the lens, in one WebGL shader |
| `logo.js` | the Mycelium mark, inlined, because a WebGL texture can't come from a `file://` image |
| `term.js` | live terminals: xterm.js panes over the shells `serve.py` runs |
| `ink.js` | drawing over the deck: pen, highlighter and laser ink, kept per slide |
| `scenes.js` | the living diagrams: one canvas per scene slide, moved on by the slide's steps |
| `flat.js` | the wires between a flat diagram's boxes, and callouts beside a terminal pane |
| `board.png` | the board slide's screenshot |
| `media/site-install.png` | the download slide's screenshot of the website |
| `logo.png` | the Mycelium mark in the footer and the tab |
| `serve.py` | serves the deck on 127.0.0.1 and runs a shell on a pseudo-terminal per pane |

With `prefers-reduced-motion`, the motes hold still and the lens jumps
between positions. Without WebGL, the CSS lens from print is used on screen.
