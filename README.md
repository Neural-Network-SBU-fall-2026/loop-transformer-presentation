# How to Loop Your Transformer — Interactive Prototype

A 19-slide scientific presentation prototype (cover + 17 core slides + Q&A) for a 17–20 minute graduate-level Neural Networks talk.

## Current approved direction

- Scientific Editorial identity inspired by the supplied reference: pale graph-paper canvas, editorial serif headlines, monospace labels, navy/blue/yellow palette.
- No original paper figures are embedded in the presentation scenes. Research images remain in the archive only; the final visual system uses custom-designed diagrams and source-backed charts.
- Step-driven scenes for the efficiency timeline, 100 → 25×4 conceptual transformation, loop design alternatives, Transformer block walkthrough, shifted dependency graph, and normalization/gating.
- Real WebGL 3D block-stack scene using React Three Fiber / Three.js, with orbit controls.
- Cover slide and Thank You / Questions slide with editable presenter, instructor, course, and email placeholders.
- Editable PowerPoint generator now creates 19 slides using custom vector illustrations rather than raw paper figures.

## Quick start

```bash
npm install
npm run dev
```

Build: `npm run build`  
PowerPoint: `npm run pptx`  
PDF: `npm run pdf`

## Controls

- Arrow Right / Space / PageDown: next step, then next slide.
- Arrow Left / PageUp: previous step, then previous slide.
- Step buttons: jump directly to a stage inside a complex slide.
- Home / End: cover / Q&A.
- F: fullscreen.
- Play: autoplay.

## Scientific safeguards

- The 100 → 25×4 visual is explicitly conceptual, not an experiment reported in the paper. Total model parameters are not necessarily quartered because embeddings, heads, and non-looped components may remain.
- The 10T parameter claim is not stated as a fact without a reliable source.
- MoE total parameters and active parameters are distinct.
- BPB is lower-is-better.
- The 1B experiments reach at most four loops; 32 loops occurs only in smaller model sweeps.
- Fitted scaling-law frontier estimates are not wall-clock speedups.
- No empirical plot may contain invented values. Custom charts must be digitized from source tables/figures and cite them in the slide footer or speaker notes.
- Original paper figures are retained in `public/assets/paper-original/` for research traceability only; do not insert them directly into the final deck.

## References

The talk uses the primary paper plus no more than five supporting references. See `research/REFERENCES.md`.

## Editable placeholders before final export

- Presenter: Alireza Kamarzardi
- Instructor: Saeed Reza Kheradpisheh
- Course: [Neural Networks]
- Email: a.kamarzardi@mail.sbu.ac.ir
- Official Shahid Beheshti University SVG logo is stored at `public/assets/brand/sbu-logo.svg` with CC BY-SA 4.0 attribution. The official SBU SVG mark is used on a navy background; see `public/assets/brand/ATTRIBUTION.md`.

## Project map

- `docs/PRODUCTION_SPEC.md`: approved production direction and acceptance criteria.
- `content/STORYLINE.md`: narrative structure.
- `content/SLIDE_CONTENT.md`: full slide script and speaker notes.
- `src/slides.ts`: slide content and step metadata.
- `src/App.tsx`: interactive scene renderer.
- `src/styles.css`: unified visual system and motion.
- `public/assets/paper-original/`: source archive only.
- `public/assets/figures/`: earlier custom teaching diagrams; replace/refine as scenes mature.
- `scripts/generate-pptx.mjs`: editable vector PowerPoint generator.
- `research/SCIENTIFIC_CLAIMS.md`: claim/evidence register.
- `research/REFERENCES.md`: supporting bibliography.
