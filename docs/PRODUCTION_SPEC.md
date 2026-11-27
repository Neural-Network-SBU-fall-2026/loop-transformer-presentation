# Production prototype specification — How to Loop Your Transformer

## Approved creative and delivery direction

The approved prototype must demonstrate the final experience, not just a static theme mock-up.

### Visual identity
- Scientific Editorial inspired by the supplied Mehrzad Samadi reference slides.
- Pale blue-white graph-paper background, fine grid, editorial serif headlines, monospace labels.
- Navy for computation paths, muted blue for state/context, academic yellow for active loop/highlight.
- Minimal, consistent layouts; avoid card-heavy dashboards and decorative clutter.
- All custom visuals are designed in this visual language. Original paper figures are retained only in the research archive and must not be embedded as raw visuals in the final deck.

### Narrative structure
- Cover: university, faculty/course, title, presenter, instructor, term, and university logo.
- Act I — Scaling Era: model growth, scaling laws, and systems cost.
- Act II — Efficiency Timeline: dense scaling, MoE, distillation, quantization/pruning, recurrence/parameter sharing. Each method gets its own visual mechanism and limitation.
- Act III — Loop: conceptual 100 independent blocks versus 25 shared blocks executed four times; then open a Transformer block and trace the hidden state.
- Act IV — Loop Design & Specialization: Full-Stack, Per-Layer, Middle-Stack, Middle-Layer; loop scaling; LoRA; Loop Matrix/Softmax.
- Act V — Inference: sequential dependency, shifted PLT, normalization/gating, KV sharing and G-SWA.
- Act VI — Evidence & Limits: experimental setup, results, trade-offs, limitations, and future work.
- Closing: Thank You / Questions with presenter email and subtle university identity.
- Technical appendix: derivations, ablations, and reference list.

### Interaction and motion
- Heavy scenes are step-driven, with previous/next controls and direct step selection.
- Loop-design scene must demonstrate each design individually, then show all designs together.
- Methods timeline must reveal mechanism, effect, and limitation for each method; it must not be a list of names.
- Transitions should be semantic: scaling chart forms blocks; blocks collapse into shared loop; loop graph shifts into token×loop dependency; dependency graph resolves into results.
- Web is the primary live experience. Use real WebGL 3D for block stacks and spatial architecture where it materially improves understanding, with 2.5D SVG/CSS for diagrams where it is clearer.
- Respect reduced-motion settings and provide keyboard controls.
- PowerPoint/PDF are companion exports. Do not promise that arbitrary web interactivity or live WebGL transfers unchanged to PowerPoint; use authored video/animated media for selected complex scenes where supported.

### Scientific depth
- Target a 20-minute talk with a technically demanding layer: roughly 80% accessible narrative and 20% advanced mathematical detail.
- Include recurrence equations, LoRA dimensions/rank, Loop Matrix mixing, dependency graphs, RMSNorm/gating, KV-cache complexity, and ablation logic.
- The 100→25×4 illustration is conceptual, not a reported experiment. Total parameters are not necessarily quartered because non-looped components remain.
- Use only source-backed experimental values. Never invent plot data. Custom charts must be digitized from paper evidence and cite the source figure/table in slide footnotes or speaker notes.
- Use at most five references in addition to the primary paper. Proposed set: Kaplan et al. (2020); Hoffmann et al. (2022); Dehghani et al. (2018); Shazeer et al. (2017); Hinton et al. (2015). Add a relevant PLT/recursive paper only if it replaces a less central reference and is directly used in the talk.
- Do not claim an unverified 10T deployed model. Distinguish published counts from estimates and total from active MoE parameters.

### Required editable placeholders
- Presenter: Alireza Kamarzardi
- Instructor: Saeed Reza Kheradpisheh
- Course: [Neural Networks]
- Email: a.kamarzardi@mail.sbu.ac.ir
- University mark: use an official Shahid Beheshti University logo asset once supplied/verified. Until then, show a typographic SBU placeholder and label it as temporary.

### Prototype acceptance criteria
- Cover and Q&A slides exist.
- Timeline and loop architecture scenes have step controls.
- 100→25×4 is animated/step-driven and clearly conceptual.
- Real 3D WebGL stack is demonstrated in the web prototype.
- No raw paper figures appear in the final presentation scenes.
- Every empirical chart is a custom-designed, source-backed visualization.
- Main deck and backup slides remain coherent and visually unified.
