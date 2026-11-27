# How to Loop Your Transformer

A 17-slide English scientific presentation for a 17–19 minute graduate-level talk.

## Creative direction

Scientific Editorial, inspired by the supplied reference slides:
- very light graph-paper canvas and fine grid
- editorial serif headlines
- monospace scientific labels
- navy computation paths, muted blue secondary elements, yellow highlights
- diagram-first storytelling and progressive reveal
- no decorative card-heavy layout

The reference is used for visual storytelling only. Scientific claims come from the cited research sources.

## Narrative

The talk now begins with the scaling era and scaling laws, explains the systems cost, surveys efficiency approaches, then reveals the central 100-layer versus 25×4 conceptual example before teaching the paper's actual loop architectures, specialization, parallel inference, KV-cache mechanisms, experiments, and limitations.

The 100 → 25×4 example is explicitly conceptual and is not presented as a paper experiment.

## Quick start

```bash
npm install
npm run dev
```

Build: `npm run build`  
PowerPoint: `npm run pptx`  
PDF: `npm run pdf`

## Controls

Arrow Left/Right: navigate · Space/PageDown: next · PageUp: previous · Home/End: first/last · F: fullscreen · Play: autoplay.

## Sources and scientific integrity

Primary paper: Ekbote et al., *How to Loop Your Transformer: Loop Scaling, Specialization, and Parallel Inference*, arXiv:2610.40325v1 (preprint).

Scaling-law context:
- Kaplan et al. (2020), *Scaling Laws for Neural Language Models*.
- Hoffmann et al. (2022), *Training Compute-Optimal Large Language Models* (Chinchilla).

Do not assert an unverified 10T deployed model. Separate published parameter counts from outside estimates, and total parameters from active MoE parameters. Empirical plots must use the original paper figures or faithful source-attributed reconstructions. BPB is lower-is-better; fitted scaling-law frontier estimates are not wall-clock speedups.

## Project map

- `content/STORYLINE.md`: six-act narrative and timing.
- `content/SLIDE_CONTENT.md`: 17-slide script and speaker notes.
- `src/slides.ts`: web-deck slide data.
- `src/App.tsx`: scene renderer and navigation.
- `src/styles.css`: Scientific Editorial design system and scene animations.
- `public/assets/paper-original/`: extracted original paper figures and tables.
- `public/assets/figures/`: authored teaching diagrams, not original paper figures.
- `scripts/generate-pptx.mjs`: editable PowerPoint generator.
- `docs/ASSET_PROVENANCE.md`: asset provenance.
