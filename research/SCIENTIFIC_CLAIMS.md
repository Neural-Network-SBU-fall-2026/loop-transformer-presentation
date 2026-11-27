# Scientific claim register

| Claim / visual | Evidence class | Source / treatment |
|---|---|---|
| Scaling trends relate model size, data, and compute to loss | External research context | Kaplan et al. (2020); Hoffmann et al. (2022). Explain differences; do not imply a universal exponent. |
| Parameter counts rose across successive language-model generations | Historical context | Use a provenance-labelled timeline. Distinguish public counts from estimates and dense from MoE total/active parameters. |
| A 10T model exists or is deployed | Not established for this deck | Do not state as fact. A hypothetical marker must be labelled hypothetical/outside estimate. |
| 100 independent blocks versus 25 shared blocks × 4 passes | Conceptual illustration | Explains Full-Stack Looping only. Not a reported paper experiment. Total parameters are not necessarily quartered. |
| Looping architectures and execution schedules | Primary-paper result/design | Original Figure 2 and Section 2. |
| Loop scaling and BPB trends | Primary-paper empirical evidence | Original Figure 3 and appendices. BPB lower is better; 1B sweep maximum is four loops. |
| Loop LoRA / Loop Matrix / Loop Softmax | Primary-paper method and evidence | Original Figures 4–5 and corresponding sections. |
| Shifted cross-loop dependency | Primary-paper method | Original Figure 6. Unshifted control is sequential. |
| Normalization and controlled mixing | Primary-paper ablation/evidence | Original Figure 7 and Appendix G. |
| KV sharing and G-SWA | Primary-paper method | Appendix B.3. Keep separate from cross-loop parallelism. |
| Normalized shifted/unshifted results | Primary-paper empirical evidence | Original Figure 8. Normalized shifted is parallelizable; unshifted remains sequential. |
| Training scale and configuration | Primary-paper setup | Original Table 1 and Appendix C. |
| Efficiency frontier | Derived estimate | Figure 1 uses a fitted vanilla scaling-law baseline; do not call it wall-clock speedup. |
| Downstream reasoning improvement | Limited evidence | Use appendix task-level results; do not claim a general reasoning breakthrough. |

## References for opening context

- Kaplan, J. et al. (2020). *Scaling Laws for Neural Language Models*. arXiv:2001.08361.
- Hoffmann, J. et al. (2022). *Training Compute-Optimal Large Language Models*. arXiv:2203.15556.

## Primary paper

- Ekbote, C. et al. (2026). *How to Loop Your Transformer: Loop Scaling, Specialization, and Parallel Inference*. arXiv:2610.40325v1. Preprint.
