# Storyline — How to Loop Your Transformer

## Narrative contract

The audience should not hear the paper title before understanding the problem. The talk moves from a familiar historical pattern (scale models to improve capability), through the cost of that pattern, to a precise architectural question: must every additional computational stage own a new set of parameters?

The supplied Mehrzad Samadi presentation is used as a **visual-storytelling reference only**: editorial headlines, graph-paper canvas, one claim per slide, diagrams before prose, progressive reveals, restrained annotations. Its subject matter and claims are not imported.

## Six-act narrative

1. **The Scaling Era (Slides 1–3):** larger models, scaling laws, and the multidimensional cost of scaling.
2. **The Efficiency Toolkit (Slides 4–5):** MoE, distillation, quantization, pruning, and parameter sharing solve different bottlenecks; establish the question that leads to recurrence.
3. **The Loop (Slides 6–7):** the conceptual 100-layer versus 25×4 illustration, then the actual shared-weight recurrence.
4. **Loop Design and Specialization (Slides 8–11):** design space, empirical scaling, Loop LoRA, Loop Matrix.
5. **Inference and Parallelism (Slides 12–15):** serial dependency, shifted cross-loop parallelism, scale mismatch and normalization, KV sharing and G-SWA.
6. **Evidence and Limits (Slides 16–17):** training/evaluation setup, results, limitations, and open research.

## Timing

| Act | Slides | Target |
|---|---:|---:|
| Scaling Era | 1–3 | 3:00 |
| Efficiency Toolkit | 4–5 | 1:45 |
| The Loop | 6–7 | 2:30 |
| Design & Specialization | 8–11 | 4:30 |
| Inference | 12–15 | 4:00 |
| Evidence & Limits | 16–17 | 2:30 |
| **Total** | **1–17** | **18:15** |

## Accuracy rules for the opening

- Scaling laws: introduce Kaplan et al. (2020) and Hoffmann et al. (2022, Chinchilla) as empirical/compute-optimal scaling work. Do not reduce them to “more parameters always means smarter.”
- Parameter-growth timeline: use only figures with explicit provenance and distinguish published values from outside estimates. Total and active parameters are different for MoE.
- Do not claim a specific 10T-parameter deployed model unless an authoritative public source establishes it. The visual can show a hypothetical 10T marker only if labelled **hypothetical / outside estimate**.
- The 100 → 25×4 diagram is a **conceptual Full-Stack Looping illustration**, not a configuration claimed to have been trained in the paper. Total model parameters are not necessarily divided by four because non-looped components may remain.
- The paper's own experiments, not the conceptual example, establish its empirical claims.

## Visual language

- Background: very light blue-white graph paper, fine grid.
- Headlines: editorial serif with restrained italic emphasis.
- Technical labels: monospace.
- Main ink: near-black navy.
- Computation paths: deep blue.
- Key insight / active loop: yellow.
- Secondary state / context: muted blue.
- Every empirical chart is an original paper figure or a faithful, source-attributed reconstruction.
- Handwritten annotations are used sparingly for emphasis, never to carry essential data.
- Progressive reveal: problem → mechanism → consequence → evidence.
