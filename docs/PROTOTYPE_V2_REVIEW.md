# Prototype v2 — Review guide

This prototype implements the approved production direction at storyboard and scene level.

## What to review

1. **Cover:** title, university identity, course, presenter, instructor, term. Presenter/instructor/email are placeholders; the SBU lockup is typographic and temporary, not the official seal.
2. **Scaling opening:** qualitative growth timeline, scaling-law resource triangle, and system-cost scene.
3. **Efficiency timeline:** step-by-step Dense Scaling → MoE → Distillation → Quantization/Pruning → Recurrence.
4. **Main reveal:** 100 independent blocks versus 25 shared blocks × 4 passes. Explicitly labelled conceptual, not an experiment.
5. **Architecture:** actual WebGL 3D stack with orbit controls, plus a Transformer-block walkthrough.
6. **Loop design:** Full-Stack, Per-Layer, Middle-Stack, Middle-Layer, then Compare All.
7. **Technical scenes:** LoRA/Loop Matrix, sequential dependency, shifted token×loop grid, RMSNorm/gate, KV/G-SWA.
8. **Evidence:** charts are currently schematic and clearly labelled as such. They are not empirical data. Before production, replace with custom charts digitized from the paper's tables/figures and cite them.
9. **Closing:** Q&A slide with editable email placeholder.

## What the PDF prototype can and cannot show

- The PDF shows the intended slide composition and static key states.
- The Web prototype has interactive step controls and live WebGL 3D. Those interactions cannot be represented fully in a static PDF.
- PowerPoint is generated as editable vector content; complex WebGL interactions will require authored video/media or simplified native PowerPoint animations.

## Review placeholders to fill before final production

- Presenter full name
- Instructor full name
- Official course title
- University email
- Official SBU logo (SVG/PNG from an authoritative university source)

## Final production gate

Do not write the Codex implementation prompt until the user approves the prototype's narrative, design density, visual identity, and scene concepts.
