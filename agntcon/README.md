<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- Copyright 2026 Mycelium Contributors -->

# Making Swarm Work

**Coordination Primitives for Decentralized Multi-Agent Systems**

Jodee Varney, Outshift by Cisco. AGNTCon + MCPCon NA, October 2026.

A 25-minute talk about swarm, or peer-to-peer, agentic systems, and the tools
needed to help agent teams actually coordinate and collaborate. It uses
Mycelium, an open source project from the Outshift team, to show a few of those
tools: rooms, a shared board and memory, and the Accord and Concord engines.

## Abstract

Swarm architectures matter when coordination itself is the hard problem.
Central orchestration works well for decomposable tasks with clear authority,
but it breaks down in open-ended coordination: multi-party negotiation,
conflicting objectives, partial knowledge, dynamic membership, and cases where
no single agent has enough context or authority to direct the work.

This session explores what it takes to support peer-to-peer coordination in
open source agent systems. Using Mycelium, we demo coordination primitives such
as agent discovery, intent alignment, constraint negotiation, and shared state
across a collectively evolving task.

Attendees will come away with a clearer understanding of the coordination
problems that arise in peer collaboration, practical approaches to address
them, use cases where swarm is the right fit, and the infrastructure needed to
support swarm patterns.

## What the talk covers

- Why coordination between peer agents is its own problem, and where a single
  orchestrator stops being enough.
- What peers need to work together (shared intent, shared context, shared
  reasoning) and where it breaks.
- Coordination primitives: our starting point, mapped to what Mycelium has.
- Two recorded runs of the Accord and Concord engines on a contract renewal.
- What we don't know yet.

There are 25 slides, plus a backup slide with test results for the full L9
Accord and Concord protocols. Every slide has speaker notes with timings
(press S for the speaker view).

## Presenting

The deck is plain HTML with no build step. From the root of this repo:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/agntcon/> in Chrome. It needs the internet for
fonts, and to stream the two demo videos unless you have saved them (see
below).

| Key | |
|---|---|
| → Space | next step, then next slide |
| ← | back |
| O | overview of every slide |
| S | speaker view: notes, what comes next, timer |
| F | fullscreen |
| T | light / dark |
| B | blackout |
| a number, then ⏎ | go to that slide |
| D | draw on the slide |
| ? | the key list |

## Printing and PDFs

Print from Chrome with **Background graphics** on. Each slide prints as one
16:9 page.

- `agntcon/?print` prints the slides only. Wait a few seconds for the orange
  bar to say "Ready" so the animated slides are drawn, then print.
- `agntcon/?notes` prints each slide at the top of a US Letter page with its
  speaker notes underneath. The notes include internal comments, so don't send
  this version to others.

## Media

- `media/mycelium-room.png` is a screenshot of a Mycelium room (slide 11).
  Redact anything private before committing it.
- `media/outshift-logo.svg` and `media/logo-1C-goldenrod.svg` (AGNTCY) are used
  on the "Who I am" slide.
- The Accord and Concord videos are Julia Valenti's recordings of real runs.
  The deck plays `media/l9-accord.mp4` and `media/l9-concord.mp4` if they are
  there, and otherwise streams them from mycelium-io.github.io. They are not
  committed to this repo, so save them into `media/` to present offline.
- The icons on the other slides come from the workshop deck's `media/` folder.

## Credits

- Mycelium is built by the Outshift team, with Julia Valenti.
- Accord and Concord are simplified versions of L9 protocols from the Internet
  of Cognition team.
- The slide framework (`deck.css`, `deck.js`, `scenes.js` and the rest) comes
  from the Mycelium workshop deck. See `../workshop/README.md` for how it
  works: layouts, steps, scenes, wires and live panes. One change here:
  `scenes.js` supports `data-start-stage`, so a slide can show a single stage
  of the coworkers scene.

## Files

| | |
|---|---|
| `index.html` | the slides, with speaker notes |
| `deck.css`, `deck.js`, `scenes.js`, `flat.js`, `lens.js`, `logo.js`, `term.js`, `app.js`, `ink.js` | the deck framework, from the workshop deck |
| `media/` | logos, the room screenshot, icons, and the demo videos if saved |
| `people/` | headshots |
| `board.png` | the board slide's screenshot |
