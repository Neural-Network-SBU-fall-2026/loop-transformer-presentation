# How to Loop Your Transformer

An English-only, motion-rich academic presentation for a 15–20 minute graduate-level talk.

## Deliverables
- Interactive React/TypeScript web deck with CSS/SVG animation and GSAP transitions.
- Editable PowerPoint generation with PptxGenJS.
- Browser-based PDF export workflow.
- Research notes, source register, and build documentation.

## Quick start

```bash
npm install
npm run dev
```

Build with `npm run build`. Generate the editable PowerPoint with `npm run pptx`; output: `exports/How-to-Loop-Your-Transformer.pptx`.

## Controls
Arrow Left/Right: navigate · Space/PageDown: next · PageUp: previous · Home/End: first/last · F: fullscreen · Play: autoplay.

## Research integrity

Primary source: Ekbote et al., *How to Loop Your Transformer: Loop Scaling, Specialization, and Parallel Inference*, arXiv:2610.40325 (29 October 2026). This is a preprint, not a peer-reviewed Q1 journal article.

The loop-scaling curve in the web deck is conceptual, not measured data. Exact experimental charts must be transcribed from the paper PDF figures/tables before use. Findings are configuration-dependent, not universal guarantees.

Paper: https://arxiv.org/abs/2610.40325 · PDF: https://arxiv.org/pdf/2610.40325

See docs/RESEARCH_NOTES.md, docs/BUILD_PLAN.md, and docs/EXPORT.md.
