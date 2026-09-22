# Design notes: directions explored, inspiration, and pivots

This is a working trace of the homepage build, kept separate from `DECISIONS.md` (which is Sang's own log, not something Claude fills in). It exists so nothing gets lost before the video and the decision log get written, especially the moments where a direction got built, then overruled or reverted. Sourced from the actual session; nothing here is invented.

## Where things stand right now (as of 2026-09-22, pending commit after `bf49420`)

The rest of this file is a history of how it got here; this section is what's actually live, for anyone (or any new Claude session) picking this up cold.

- **Layout**: fixed-left / scrolling-right, per brittanychiang.com. `.page-shell` (grid, widened to `minmax(22rem, 36rem) 1fr`) → `.side-panel` (sticky left) and `.content-column` (scrolling right: three work sections, about, footer). Collapses to one stacked column under 900px.
- **Visuals**: one Three.js scene now, not two. `pointcloud.js` (the old generic synthetic hero) is retired entirely; the career timeline (`career-timeline.js`) moved into the sidebar itself and became the panel's primary visual, sitting below the name/role and above the nav/contact links. Six real milestone dates as gradient-colored keyframe markers + pose-graph edges, an ambient point layer, a ground grid, user-driven `OrbitControls` (drag to orbit, no auto-spin, two-finger-only on touch so one-finger still scrolls), keyboard-accessible via visually-hidden buttons. The render loop runs continuously now (no `IntersectionObserver` gating), since the sidebar is always visible there's no "off-screen" state to pause for. This resolves the "make the hero and timeline look connected" problem structurally, by removing the second scene rather than trying to visually bridge two separate ones (three attempts at that: color-match, motion-sync, a literal connecting line, documented below).
- **Palette**: cool/technical, deep blue-black ground, steel-blue (`--accent`) + ice-cyan (`--accent-2`, scoped to `#data-science` only) accents. Type: Public Sans (body), Martian Mono (labels/data), Unbounded (the name only).
- **Content**: three work sections (autonomy & robotics, applied data science, full-stack + AI engineering) with real resume-backed bullets, audited against the actual resume PDF for completeness. Data-science section also has an interactive PDSI explorer (`drought-explorer.js`, real values from the reimplementation) and two real artifacts from the NCAR archive (a drought-trend figure, a link to the full PDSI-limitations poster). No stats strip, no per-section sidebar, no pipeline diagram, all of those existed at some point and were cut. About section has no GPA (Sang's preference). Footer repeats contact links.
- **Not yet done**: `verification/`, `DECISIONS.md` (all five prompts, Sang's own), the video, peer comments.
- Live at [sang-bui.github.io](https://sang-bui.github.io); `main` branch is the only branch. Always check `git log origin/main..HEAD` before assuming everything is synced.

## Setup

- Started from the P1 template (`Mines-Coding-with-AI-Agents/P1-personal-website`), cloned into `work/p1-website`, GitHub Pages enabled on `main` / root.
- `PRODUCT.md` captures the durable product context (audience, positioning, constraints) from an interview plus the resume/recommendation-letter PDFs (kept local/gitignored, never committed: the resume has a phone number, the recommendation notes are private grad-application material).
- Installed the third-party [Impeccable](https://github.com/pbakaus/impeccable) Claude Code skill (global install) for design review; used at "lightweight" scope (no AI-generated comps or concept tournament, given plain-HTML/CSS scope and the deadline), plus its `detect` anti-slop linter, run after every round.

## v1: dark minimal build

Hero point cloud (Three.js, synthetic SLAM-style point cloud + trajectory, explicitly labeled as not real research data in code) plus three work sections. Passed `impeccable detect` after fixing an all-caps/wide-letter-spacing readability warning on the section labels. GPA is intentionally left off the education section, Sang's preference, noted as a standing constraint in `PRODUCT.md` so it doesn't quietly get reintroduced later.

## v2: craft pass

- Typography: swapped Archivo + JetBrains Mono (flagged by Sang as "generic, I've seen it everywhere") for Public Sans + Martian Mono, justified by the NSF NCAR / Lockheed Martin Space subject matter rather than picked arbitrarily.
- Added the Qualcomm GenAI pipeline diagram (a real system-architecture case study, later removed, see below) and a stats strip. Also added a favicon (reusing the section-icon line art) and basic Open Graph/Twitter meta tags so the link previews properly when pasted into the Canvas discussion.
- **Pivot 1**: the hero's tagline sentence ("I build systems that turn data into decisions.") was flagged as reading like a sales pitch, not a personal statement. Rewritten to a statement-style hero: name at full scale, fragment tags instead of a sentence. A second accent color (`--accent-2`, teal) was also introduced here, scoped to the data-science section only (via a local CSS custom-property override), so the palette had some range instead of one accent used everywhere.
- **Pivot 2**: the resulting giant hero name (up to 9rem, same mono font as every label) and fully centered page layout were flagged as too large and too symmetric ("why are we so obsessed with things being centered"). Replaced with a real display font (Unbounded, chosen for its space-poster character, tied to the Lockheed Martin Space content) at a smaller scale, and the whole page (hero, stats, sections, footer) shifted to a consistent left-anchored offset instead of centered blocks.
- **Pivot 3**: the stats strip itself was cut entirely ("empty flexing," not real proof) and the warm copper/charcoal palette was called "boring." Replaced with a cooler, more clinical palette (steel blue + ice cyan on deep blue-black) across the CSS, the point cloud's colors, and the favicon.
- **Pivot 4**: the section subheadings ("Research that gets systems to know where they are.") were flagged as corny for the same reason as the original hero tagline. Cut to plain section names. Also fixed a layout bug where the section background/texture was capped to the same narrow box as the text, leaving the right side of wide screens visually dead.

## Explored and reverted: map/topology visual language

Sang asked for more inspiration from topo/climate maps, SLAM occupancy grids, and point clouds, and left the placement judgment to Claude. Built: a SLAM occupancy-grid texture (autonomy section), topographic contour bands (data-science section), a network-mesh texture (AI-engineering section), a contour layer behind the hero point cloud, and two redesigned section icons.

**Overruled**: shown to Sang, called "very very ugly." Diagnosed candidates (a hard diagonal line across the autonomy section, contour shapes as closed blobs rather than lines, icons too cluttered at 24px) and confirmed via follow-up question: the shapes themselves, the visibility level, and the icons were all wrong, and the direction should be scrapped rather than iterated. Reverted cleanly (`git restore`, since none of it had been committed yet) back to the last good commit. Replaced with a much narrower decision: keep the point cloud as the one deliberate animated visual, add no further per-section decoration.

## Explored and reverted: per-section stat sidebars

Follow-up ask: "cool stats viz" plus the right side felt bare while scrolling. Built literal, non-decorative visualizations of real facts (a timeline bar for the SLAM research date range, a full timeline bar for the 124-year drought dataset span, a scale bar for "2,000+ systems"), plus tool badges and a real citation link, as a sticky card per work section.

**Overruled again** (partially): Sang wasn't sure this was it either, and separately named a specific reference, [brittanychiang.com](https://brittanychiang.com/), a fixed left column (name, nav, contact) that stays in view while content scrolls on the right, the opposite orientation from the per-section right cards just built.

## Research: what else is out there

Before committing to a direction, searched general portfolio-design inspiration (Awwwards, Colorlib, Muzli portfolio roundups) and a more specific alternative pattern, **sidenotes/marginalia** (Tufte-CSS, [gwern.net's writeup on sidenotes](https://gwern.net/sidenote)), real margin annotations that scroll with the text, a different solution to "the right side is bare" than either the per-section cards or a fixed sidebar. Presented both options (sidenotes vs. fixed sidebar) to Sang; fixed sidebar was chosen for simplicity.

## Final: fixed-left / scrolling-right layout

Restructured the whole page: `.page-shell` grid, a sticky `.side-panel` (point cloud as a contained backdrop, name, vertical nav with scroll-linked active-section highlighting via `IntersectionObserver`, contact links) on the left, and `.content-column` (all three work sections, about, footer) scrolling on the right. The old JS-injected top nav (`reveal.js`'s `buildNav`) was removed in favor of real, always-present static nav markup, more robust and closer to the course's "verify it actually works" spirit than a script-built one. The per-section side-stat cards from the previous round were removed since the persistent sidebar replaces that job.

## Removed: Qualcomm pipeline diagram

The inline-SVG system-architecture diagram added during the v2 craft pass (query → LangGraph → RAG/SQL branch → visualization) was cut after Sang said flatly he didn't like it. Removed the markup and its CSS entirely rather than trying to fix it in place, per the "just start over" instinct from the earlier texture round.

## Delivered: interactive NCAR notebook content

Sang shared an actual Google Drive export of the NSF NCAR research (notebooks, papers, poster files, a 1.5GB dataset). Confirmed public research before using any of it, and kept the whole archive outside any git repo (`work/ncar-source/`), since it also contains copyrighted journal PDFs and private drafts that must never reach the public repo. Extracted real, small, already-computed output from `full_pdsi.ipynb` rather than trying to reprocess the giant dataset client-side or embed a raw screenshot: nine real PDSI values (3 locations × 3 historic dates) became the drought explorer widget; a real poster figure (SPI vs. SPEI) and the full PDSI-limitations poster (rendered from `.pptx` via a fresh LibreOffice install, since the poster is built from ~27 separate embedded images, not one exportable picture) both made it onto the site. A verified live link to the NCAR Climate Data Guide entry (confirmed it actually credits Sang) was added alongside. The CAFEC calibration-coefficient charts from the same notebook were identified as a second usable dataset but not built, one addition was enough for this round.

## Career timeline: several rebuilds, following direct feedback each time

Built, shown, and rebuilt multiple times in direct response to specific feedback, not guessed at repeatedly:

1. **2D SVG**, a wavy path with flat waypoints for the real dated milestones. Feedback: not SLAM-inspired enough, and wanted real 3D the visitor could move around.
2. **3D Three.js, auto-rotating spheres on a curve**. Feedback: still didn't read as real SLAM output (Sang has looked at many actual SLAM maps), and shouldn't auto-spin, the visitor should control it.
3. **Rebuilt as a SLAM pose graph**: gradient-colored octahedron "keyframe" markers connected by trajectory edges, an ambient point-cloud layer, a ground reference grid, and real `OrbitControls` (drag to orbit, no auto-rotate), the way real SLAM viewers (RTAB-Map, ORB-SLAM3) actually layer these elements. This version stuck.
4. **Follow-up design review** (Sang asked for one, plus to run Impeccable) surfaced two real bugs beyond styling: the markers had no keyboard path at all (a canvas can't expose individual 3D objects to assistive tech), and `OrbitControls` sets `touch-action: none` unconditionally, which would have fought normal one-finger page scroll on phones. Fixed both: a set of visually-hidden buttons mirror the hover/click contract for keyboard users, and touch is now two-finger-only for orbit, one-finger scrolls the page normally.
5. **"Make it feel connected to the hero point cloud"**: matched the timeline's ambient points to the hero's exact color/size/opacity, and added a small cross-module event so dragging the timeline nudges the hero's rotation too.
6. **Tried and reverted**: a literal SVG line drawn from a fixed point on the sidebar to the timeline's live on-screen position, recomputed every frame. Built and technically working (verified the projection math, the visibility gating, the mobile breakpoint), but Sang's read was "doesn't look continuous, looks like two separate things with a line between them." Removed rather than keep iterating blindly on the same idea; the color-match and motion-sync from step 5 were not flagged as bad and were kept.
7. **Tried again, more precisely**: rebuilt the connector so both ends were real points, not one real and one guessed, `pointcloud.js` started publishing its trajectory's actual live (rotating) screen position each frame, and the line drew from that real point to the timeline's real 2023 marker. Sang's response was a different idea entirely: move the timeline itself into the sidebar, replacing the hero point cloud, so there's nothing separate left to connect.
8. **Structural resolution**: `pointcloud.js` retired entirely (deleted); the career timeline moved into `.side-panel-inner`, becoming the sidebar's primary visual; the page-shell grid widened (`minmax(16rem, 26rem)` → `minmax(22rem, 36rem)`) to give it real room, per Sang's explicit "open the left more." The timeline's `IntersectionObserver` visibility-gated render loop (needed when it lived in the scrolling content column) was removed too, the sidebar is always visible, so the loop just runs continuously, the same unconditional approach the old hero used. This is a cleaner resolution than any of the connector attempts: one real, meaningful scene doing double duty as identity visual and career content, instead of one real scene plus one decorative one trying to look related.

## Process notes (not design, but real)

- The [Impeccable](https://github.com/pbakaus/impeccable) skill was installed twice: first scoped to this project, which silently failed to register in the running Claude Code session because project-level skill discovery only happens from the directory a session actually launches in, not a subdirectory `cd`'d into afterward. Reinstalled globally, which worked immediately. A real troubleshooting moment, not a clean first try.
- Claude briefly mis-marked the project's "Started" date in the private progress checklist as the day a late-session commit happened, rather than the actual first commit date; Sang caught it ("we did not start that late") and it was corrected by checking `git log` directly instead of assuming.

## Still open

- `verification/`, `DECISIONS.md`, the video, and peer comments are not started yet.
- The CAFEC calibration-coefficient charts (from the same notebook as the drought explorer) were identified as a second usable real dataset but not built.

## Picking this back up on a different computer

Everything in this repo is fully pushed (see "Where things stand right now" above for the exact commit). One thing is NOT in this repo and won't come along with a clone: the [Impeccable](https://github.com/pbakaus/impeccable) skill is installed globally (`~/.claude`) on the machine this was built on, not tracked by git at all. On a new machine, run `npx impeccable install` again (choose global) before expecting `/impeccable` or `impeccable detect` to work there.
