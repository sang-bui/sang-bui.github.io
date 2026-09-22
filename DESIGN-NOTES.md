# Design notes: directions explored, inspiration, and pivots

This is a working trace of the homepage build, kept separate from `DECISIONS.md` (which is Sang's own log, not something Claude fills in). It exists so nothing gets lost before the video and the decision log get written, especially the moments where a direction got built, then overruled or reverted. Sourced from the actual session; nothing here is invented.

## Setup

- Started from the P1 template (`Mines-Coding-with-AI-Agents/P1-personal-website`), cloned into `work/p1-website`, GitHub Pages enabled on `main` / root.
- `PRODUCT.md` captures the durable product context (audience, positioning, constraints) from an interview plus the resume/recommendation-letter PDFs (kept local/gitignored, never committed: the resume has a phone number, the recommendation notes are private grad-application material).
- Installed the third-party [Impeccable](https://github.com/pbakaus/impeccable) Claude Code skill (global install) for design review; used at "lightweight" scope (no AI-generated comps or concept tournament, given plain-HTML/CSS scope and the deadline), plus its `detect` anti-slop linter, run after every round.

## v1: dark minimal build

Hero point cloud (Three.js, synthetic SLAM-style point cloud + trajectory, explicitly labeled as not real research data in code) plus three work sections. Passed `impeccable detect` after fixing an all-caps/wide-letter-spacing readability warning on the section labels.

## v2: craft pass

- Typography: swapped Archivo + JetBrains Mono (flagged by Sang as "generic, I've seen it everywhere") for Public Sans + Martian Mono, justified by the NSF NCAR / Lockheed Martin Space subject matter rather than picked arbitrarily.
- Added the Qualcomm GenAI pipeline diagram (a real system-architecture case study) and a stats strip.
- **Pivot 1**: the hero's tagline sentence ("I build systems that turn data into decisions.") was flagged as reading like a sales pitch, not a personal statement. Rewritten to a statement-style hero: name at full scale, fragment tags instead of a sentence.
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

## Still open

- The live GitHub Pages deploy needs to be reconfirmed after each merge (Pages takes a few minutes to redeploy).
- `verification/`, the video, and peer comments are not started yet.

## Removed: Qualcomm pipeline diagram

The inline-SVG system-architecture diagram added during the v2 craft pass (query → LangGraph → RAG/SQL branch → visualization) was cut after Sang said flatly he didn't like it. Removed the markup and its CSS entirely rather than trying to fix it in place, per the "just start over" instinct from the earlier texture round.

## Planned: interactive NCAR notebook content

Sang wants to bring in Jupyter notebooks from the NSF NCAR drought/PDSI research (confirmed: this is public research, not unpublished work, so it's fair game for the public repo) and turn some of it into real interactive elements on the site, not just described in bullet points. Not started, this is real scope and the deadline is imminent, so it's deliberately being held for after the notebooks are actually provided rather than guessed at now.
