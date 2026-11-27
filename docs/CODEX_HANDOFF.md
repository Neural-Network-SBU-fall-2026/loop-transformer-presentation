# Codex Handoff — Final Production Presentation

## Mission

Turn this repository into a polished, scientifically rigorous, approximately 20-minute presentation of **How to Loop Your Transformer**. The web presentation is the primary live experience. Editable PowerPoint and a high-quality static PDF are required companion deliverables.

**Do not blindly preserve the current implementation.** Audit the repository, identify the simplest reliable architecture that satisfies the requirements, compare reasonable alternatives where needed, and make the best engineering and design decisions autonomously. The current prototype is a visual and narrative reference, not a binding implementation blueprint.

## Decision authority

Codex owns technical and implementation decisions, including:
- whether to retain, refactor, or replace the current React / Three.js / React Three Fiber / GSAP implementation;
- how to structure slide content, scene components, state, transitions, animation timelines, and reusable visual primitives;
- how to eliminate duplicated content and keep Web, PPTX, and PDF outputs consistent;
- how to consolidate CSS, dependencies, scripts, build workflows, and documentation;
- how to implement custom charts, diagrams, 3D scenes, video/motion assets, and export pipelines;
- how to organize references, speaker notes, appendix slides, and acceptance tests.

Do not ask the user to choose between routine engineering alternatives. Make a defensible decision, record the rationale briefly, and proceed. Ask only when a genuinely essential fact is unavailable and cannot safely be inferred. Never invent missing information.

## Non-negotiable user and presentation requirements

### Identity and metadata
- University: Shahid Beheshti University.
- Course: Neural Networks.
- Presenter: **Alireza Kamarzardi**.
- Instructor: **Saeed Reza Kheradpisheh** (Persian: سعیدرضا خردپیشه).
- Presenter email: **a.kamarzardi@mail.sbu.ac.ir**.
- Term: Fall 2026.
- Official university SVG: `public/assets/brand/sbu-logo.svg`.
- Logo attribution and license: `public/assets/brand/ATTRIBUTION.md`.
- Do not invent a faculty / department name. Omit it unless verified from an authoritative university source.

### Narrative and audience
- Presentation language: English.
- Target duration: about 20 minutes.
- Preserve the approved story arc: scaling era and scaling laws → efficiency approaches → why parameter sharing/recurrence matters → the 100-vs-25×4 conceptual explanation → actual loop architectures → specialization → sequential inference bottleneck → shifted/parallel loop computation → normalization/gating → KV-cache mechanisms → experimental evidence, trade-offs, limitations, and takeaways.
- The supplied Mehrzad Samadi slides are a **visual storytelling reference only**: strong editorial headlines, one central idea per slide, diagrams-first teaching, progressive reveals, clear annotations, and restrained visual language. Do not copy their subject matter or imply endorsement.
- Aim for an accessible narrative with a genuinely advanced technical layer. Advanced content must be mathematically meaningful and explained; do not make slides intentionally obscure just to appear difficult.
- Keep the main talk near 20 minutes. Add cover, references, Q&A, and any backup/appendix slides without allowing the core talk to become overloaded.

### Visual identity and experience
- Preserve the approved Scientific Editorial direction: light academic canvas, subtle graph-paper/grid texture, editorial serif headlines, technical monospace labels, restrained navy/blue/yellow palette, clean alignment, and high readability.
- Maintain one coherent design system across every slide and output.
- No raw original paper figures in the final presentation. Original paper images may remain in the research archive as evidence/source material only.
- Redraw diagrams, charts, architecture illustrations, and explanatory figures in the presentation's own visual language. Keep source attribution close to every empirical visualization.
- Use real 3D/WebGL when depth materially improves understanding (e.g. Transformer stacks, repeated blocks, architecture transformations). Use precise 2D/SVG when it communicates tensor flow, attention, residual paths, or equations more clearly. Do not force 3D onto every diagram.
- Important scenes must be step-by-step, interactive, and animated. Support direct step selection, next/previous, keyboard navigation, pause/play, and meaningful transitions. Transitions should teach the relationship between scenes rather than add decoration.
- The loop-design scene must explain the separate design axes accurately: **what component is looped** (e.g. full block, attention, MLP, independent components) and **where/how the loop is scheduled** (Full-Stack, Per-Layer, Middle-Stack, Middle-Layer). Show each relevant design individually and then provide a useful comparison view.
- The efficiency-methods section must explain mechanisms and trade-offs, not just list method names. Do not imply an unsourced chronological progression. If a historical timeline is used, date and source each milestone; otherwise present it as a conceptual evolution/map.
- The Transformer architecture scene must show the actual relevant data path: token/hidden states, attention, Q/K/V where appropriate, residual paths, normalization, MLP/FFN, and shared parameters. Verify exact norm type, norm placement, residual order, positional encoding, and other architectural details against the primary paper before drawing them. Do not assume a generic Transformer block is identical to the paper's implementation.
- Include a formal cover slide and a closing Thank You / Questions slide with the supplied presenter email and university logo.

## Scientific integrity — absolute constraints

### Primary source
The primary study is **Ekbote et al., “How to Loop Your Transformer: Loop Scaling, Specialization, and Parallel Inference,” arXiv:2610.40325v1**. Treat this as a preprint unless an authoritative source establishes a later peer-reviewed publication. Do not call it a Q1-published paper without evidence.

Read the primary paper and relevant appendices before finalizing scientific claims, formulas, diagrams, chart data, or conclusions. Use the repository's extracted manifest and assets as navigation/source material, but verify claims against the actual paper.

### Conceptual 100 → 25×4 illustration
- Clearly label it as a **conceptual teaching example**, not a configuration or experiment reported by the paper.
- Explain the distinction between unique parameter sets and block applications: 25 shared blocks executed four times produce 100 block applications, but not the same function as 100 independently parameterized blocks.
- Do not claim that total model parameters become exactly one quarter. Embeddings, output heads, norms, and non-looped components may remain outside the repeated region.
- Do not imply equal FLOPs, latency, or quality without evidence.

### Empirical charts and numerical claims
- Never invent, approximate without disclosure, or visually fabricate measured data.
- Prefer exact tables or numerical values in the paper. If chart digitization is unavoidable, document the digitization method, uncertainty, source figure, and whether values are approximate.
- Custom charts must faithfully represent the source data and identify the original figure/table in a citation or source note.
- A schematic/qualitative curve must be visibly labelled **schematic / illustrative — not measured data** and must never be presented as a result.
- Distinguish BPB from NLL, lower-is-better metrics from higher-is-better metrics, fixed-parameter/data comparisons from fixed-FLOP comparisons, measured results from fitted scaling-law estimates, and parameter efficiency from inference latency.
- Distinguish total from active parameters in MoE.
- Do not claim a deployed 10T-parameter model without a reliable, directly cited source.
- Preserve the study's actual scope and limitations. Do not inflate results into general reasoning, frontier-scale, or universal performance claims.

### Technical mechanisms to verify precisely
- Looping design axes and execution order.
- Full-Stack / Per-Layer / Middle-Stack / Middle-Layer semantics, including which outer blocks execute once.
- Loop LoRA and Loop Matrix / Loop Softmax equations, dimensions, ranks, and parameter accounting.
- Standard recurrence versus shifted cross-token dependencies in Parallel Loop Transformer; explain exactly which loop/token states are available and why the dependency permits the claimed parallelism.
- Normalization and gating: exact equations, normalization axes, fixed versus learned mixing, and ablation results. Never use illustrative RMS values as if they were measured.
- KV sharing, cross-loop parallelism, local sliding windows, and G-SWA are distinct mechanisms; explain how they relate without conflating variants.
- Experimental setup, model sizes, tokens-per-parameter, training compute, evaluation datasets, baselines, and all reported metrics.

## References
- Use the primary paper plus **no more than five supporting papers** in the main talk.
- Verify complete bibliographic metadata, author names, publication/preprint status, year, and DOI/arXiv identifiers.
- Every supporting paper must have a clear role in the narrative and be cited where used.
- Do not leave incomplete references (e.g. “Wu et al. (2025)” without a verified title and full source).
- The current `research/REFERENCES.md` is a draft, not an authority. Audit and improve it.
- Add a readable references slide or slides; detailed citations may also appear in footers/speaker notes.

## Architecture and repository cleanup — Codex decides the best solution

Audit the full repository before changing it. The following are known issues to investigate, not prescribed implementation solutions:
- Slide content is duplicated between `src/slides.ts` and `scripts/generate-pptx.mjs`; choose a robust single source of truth or another clearly justified approach that prevents divergence.
- `content/SLIDE_CONTENT.md`, `content/STORYLINE.md`, `docs/PRODUCTION_SPEC.md`, `docs/ASSET_PROVENANCE.md`, `docs/BUILD_PLAN.md`, `docs/EXPORT.md`, and `README.md` may contain stale or contradictory instructions. Reconcile them and remove obsolete statements.
- `docs/ASSET_PROVENANCE.md` currently contains outdated extraction-status statements. Update it to reflect the actual manifest and current policy: source images are archived, not used as final presentation visuals.
- `docs/BUILD_PLAN.md` contains an outdated slide-count target. Update all counts and timings to match the final storyboard.
- `docs/EXPORT.md` and actual npm scripts may describe different PDF-generation paths. Pick and test the best supported workflow.
- Consolidate legacy and appended CSS; place font imports correctly; remove unused styles, components, dependencies, and assets where safe.
- Add and maintain a lockfile and use reproducible dependency installation in CI.
- Review React / Three.js / React Three Fiber / Drei version compatibility, WebGL performance, accessibility, reduced-motion behaviour, and fallbacks.
- Review `index.html`, Vite base paths, asset paths, SVG embedding, and GitHub Pages deployment configuration.
- GitHub Actions currently shows successful validation/package generation but a GitHub Pages deployment 404. Diagnose whether Pages is disabled or configuration/permissions are wrong. Fix repository-side causes. If an account/repository setting requires owner action, state the exact action rather than claiming deployment succeeded.
- Separate expensive source-paper extraction from routine build/validation if that is the more reliable architecture.
- Keep source archives, derived visuals, and generated deliverables clearly separated.

Do not simply append another layer of CSS or duplicate scene logic. Refactor cleanly where that is the best solution.

## Deliverables
1. A polished interactive Web presentation (primary).
2. An editable PowerPoint companion.
3. A high-quality 16:9 static PDF companion.
4. Presenter notes / speaker script with timing and source citations.
5. A references section and useful backup slides for technical questions.
6. Updated README, production specification, source/asset provenance, and export instructions.
7. A short decision log explaining major architecture and design choices.

The Web presentation may contain richer live interaction and 3D than PPTX/PDF. Do not falsely promise that a static PDF preserves interaction or that PowerPoint perfectly reproduces the WebGL experience. Where practical, embed selected authored motion clips in PowerPoint; keep all text, equations, and core diagrams editable when feasible.

## Acceptance criteria — do not stop at a successful compile

### Content and science
- Every core slide has one clear teaching objective, accurate content, suitable mathematical depth, a source citation, and a coherent presenter note.
- Every formula and technical diagram is checked against the primary paper.
- Every empirical chart is source-backed and traceable; no fabricated data.
- The conceptual 100 → 25×4 example is correctly qualified.
- The main talk rehearses to approximately 20 minutes.
- Supporting references do not exceed five, excluding the primary paper.

### Visual and interaction
- All slides share one coherent design system and consistent typography, spacing, alignment, colour, and motion.
- Complex mechanisms are genuinely step-driven; changing steps changes the architecture/data-flow visualization, not only a caption.
- Loop design comparison clearly shows execution order and the two independent design axes.
- The Transformer diagram visibly communicates neural-network structure and tensor flow.
- Motion is smooth, purposeful, performant, and not distracting; reduced-motion and non-WebGL fallbacks work.
- No raw paper figures appear in the final presentation.
- Cover and Q&A use the supplied SBU SVG logo and exact presenter metadata.

### Engineering and exports
- Clean install and reproducible build succeed.
- TypeScript checks, lint/tests (where configured), and production build succeed.
- Web deck works in a full-screen 16:9 desktop presentation; responsive fallback is usable.
- Keyboard controls, step controls, autoplay/pause, restart, and fullscreen work reliably.
- PowerPoint opens and is editable; PDF opens, has correct page count/aspect ratio, and has no clipping/overflow.
- Web, PPTX, PDF, notes, citations, and slide numbering remain consistent.
- GitHub Pages deployment is verified, or any required external repository setting is clearly identified.
- Inspect actual rendered slides/screenshots and exported files; do not rely on code compilation alone.

## Execution protocol

1. Inspect the complete repository, current branch/history, source paper, existing outputs, and CI logs.
2. Write a concise audit: defects, risks, conflicting docs, and proposed decisions. Do not wait for user approval for routine engineering choices.
3. Choose and document the best architecture; preserve good existing work, replace weak parts, and remove dead/contradictory work.
4. Implement the complete presentation and all companion deliverables.
5. Run clean builds, tests, export checks, visual inspections, and scientific source audits.
6. Fix failures and repeat validation until all acceptance criteria pass or a genuine external blocker is reached.
7. Update the documentation to describe the actual final state, not the intended state.
8. Report what changed, what passed, what remains blocked, and links to the live presentation and deliverables.

**Do not stop after writing a plan, producing a prototype, or achieving a green TypeScript build. Finish the end-to-end deliverable.**
