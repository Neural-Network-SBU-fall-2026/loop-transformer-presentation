# Presentation metadata

- University: Shahid Beheshti University
- Course: Neural Networks
- Presenter: Alireza Kamarzardi
- Instructor: Saeed Reza Kheradpisheh (سعیدرضا خردپیشه)
- Instructor Google Scholar: https://scholar.google.com/citations?user=ZisNRVMAAAAJ&hl=en
- Presenter email: a.kamarzardi@mail.sbu.ac.ir
- Term: Fall 2026
- University logo: temporary SBU wordmark until an official logo asset is supplied and verified.

---

# How to Loop Your Transformer — 17-slide final storyboard

**Target duration:** 18–19 minutes · **Language:** English · **Audience:** Graduate Neural Networks  
**Primary paper:** Ekbote et al., *How to Loop Your Transformer: Loop Scaling, Specialization, and Parallel Inference*, arXiv:2610.40325v1 (preprint).

**Narrative reference:** The supplied Mehrzad Samadi presentation informs visual storytelling only: editorial headlines, graph-paper background, one claim per slide, diagrams-first explanation, progressive reveals, and restrained handwritten annotations. It does not supply scientific claims for this talk.

---

## Act I — The Scaling Era

### Slide 01 — Want a smarter model? The default answer was: make it bigger.
**On-screen:** More parameters. More data. More compute.

**Visual:** A carefully sourced timeline of language-model scale. Use a logarithmic parameter axis only where the parameter counts are public and comparable. Distinguish published counts from estimates with filled versus hollow markers.

**Narration:** “For years, one reliable strategy was to scale: increase model capacity, train on more data, and spend more compute. This produced major capability gains. But scale is not free, and parameter count alone does not tell the whole story.”

**Source discipline:** Do not present an unverified 10T model as fact. If a 10T marker is retained, label it hypothetical or an outside estimate. For MoE models, distinguish total from active parameters.

### Slide 02 — Scaling works — but the budget has three dimensions.
**On-screen:** Parameters × Data × Compute.

**Visual:** Reveal a three-axis budget. Show that increasing one variable changes the compute-optimal allocation of the others.

**Narration:** “Kaplan et al. documented empirical scaling trends for language models. Hoffmann et al., in Chinchilla, showed why model size and training-token count must be balanced under a fixed compute budget. The lesson is not simply ‘bigger is always better’; it is that quality depends on how resources are allocated.”

**References:** Kaplan et al. (2020), *Scaling Laws for Neural Language Models*; Hoffmann et al. (2022), *Training Compute-Optimal Large Language Models*.

### Slide 03 — The bottleneck is no longer just model quality.
**On-screen:** Weight memory · Training FLOPs · Serving latency · Energy.

**Visual:** Four resource meters connected to one model. Each meter lights up as the model scales.

**Narration:** “A model must fit in memory, be trained within a compute budget, and serve tokens at an acceptable latency and cost. Sparse MoE architectures add another distinction: total parameters and active parameters are not the same.”

**Takeaway:** Scaling is a systems problem as well as a modeling problem.

---

## Act II — The Efficiency Toolkit

### Slide 04 — Researchers learned to spend computation differently.
**On-screen:** MoE · Distillation · Quantization · Pruning · Parameter sharing.

**Visual:** Five compact mechanism diagrams, each with its own bottleneck label.

**Narration:** “These methods are not interchangeable. MoE activates selected experts. Distillation transfers behaviour to a smaller student. Quantization reduces numerical precision and memory. Pruning removes selected weights or structures. Parameter sharing reuses learned transformations. Each changes a different part of the cost.”

**Takeaway:** The question is which resource bottleneck a method actually addresses.

### Slide 05 — Do we need new weights for every computational step?
**On-screen:** Can depth be executed rather than fully stored?

**Visual:** Show a standard stack with a different θ label on each block. Pause. Highlight the repeated transformation idea without revealing the loop yet.

**Narration:** “In a conventional deep Transformer, adding a block generally adds another parameter set. But computation and parameter storage are different quantities. Could the same learned block be applied again to a representation that has already changed?”

---

## Act III — The Loop

### Slide 06 — 100 layers — or 25 layers run four times?
**On-screen:** 100 independent blocks vs. 25 shared blocks × 4 passes.

**Visual:** Animate 100 independent blocks collapsing into 25 shared blocks, then run the 25-block stack four times. Counters show 100 block applications on both sides, but different numbers of unique block parameter sets.

**Narration:** “Here is a deliberately simple thought experiment. One design stores 100 independent blocks. Another stores 25 blocks and executes that shared stack four times. Both perform 100 block applications, but the second reuses the same base weights.”

**Scientific qualifier:** This is a conceptual Full-Stack Looping illustration, not an experiment reported in the paper. Total model parameters are not necessarily one quarter because embeddings, output heads, and other non-looped components may remain.

### Slide 07 — Same weights. A new hidden state on every pass.
**On-screen equations:**
[
H^{(0)}=\operatorname{Embedding}(X),\qquad
H^{(k+1)}=T_\theta(H^{(k)}),\qquad
Y=\operatorname{LMHead}(H^{(L)}).
]

**Visual:** Open a Transformer block: normalization → self-attention → residual → MLP → residual. Animate the hidden-state representation changing while θ remains fixed.

**Narration:** “A looped Transformer re-applies a shared transformation. The weights remain the same; the hidden representation changes on every pass. Reusing parameters does not make computation free: the block still executes again.”

---

## Act IV — Loop Design and Specialization

### Slide 08 — Where you put the loop changes the computation.
**On-screen:** Joint / Attention-only / MLP-only / Independent; Full-Stack / Per-Layer / Middle-Stack / Middle-Layer.

**Visual:** Use original Figure 2 and progressively illuminate the repeated region and execution order for each design.

**Narration:** “The paper studies a design space, not one single loop. It varies which components repeat and where recurrence sits in the stack. These schedules reuse weights differently and do not compute identical functions.”

### Slide 09 — More loops help — until the returns diminish.
**On-screen:** Diminishing returns · Saturation · Regression · Instability.

**Visual:** Use original Figure 3 and the relevant appendix plots. Keep the metric and axes visible.

**Narration:** “At moderate loop factors, looping improves DCLM validation BPB in many tested settings. But marginal gains diminish, and some high-loop configurations saturate, regress, or become unstable. The turning point depends on architecture and training-token budget.”

**Metric:** Bits per byte (BPB), lower is better.  
**Scope warning:** The 1B sweeps reach at most four loops. The maximum of 32 loops occurs in smaller-model sweeps.

### Slide 10 — Share the backbone. Let each loop adapt.
**On-screen:**
[
W^{(\ell)}=W+\frac{\alpha}{r}B^{(\ell)}A^{(\ell)}
]

[
A^{(\ell)}\in\mathbb{R}^{r\times d_{in}},\quad
B^{(\ell)}\in\mathbb{R}^{d_{out}\times r}.
]

**Visual:** Keep W fixed; attach a small low-rank correction to each loop. Show dimensions and rank.

**Narration:** “Loop LoRA relaxes strict sharing without giving every pass a full independent Transformer. The adapter product has the same shape as W but rank at most r. In the reported specialization setup, rank is at most 8.”

### Slide 11 — A loop can mix a pool of low-rank components.
**On-screen:**
[
\Delta W^{(\ell)}=\sum_{j=1}^{L}M_{\ell j}B_jA_j,
\qquad M\in\mathbb{R}^{L\times L}.
]

**Visual:** Animate a row of M selecting a mixture of adapter components. Then show row-wise Softmax normalization.

**Narration:** “Loop Matrix lets each loop mix a shared pool of low-rank components. Loop Softmax constrains each row to non-negative coefficients summing to one. The paper reports clearer specialization gains at four and eight loops than at two; Loop Matrix is strongest among the tested variants.”

---

## Act V — Inference and Parallelism

### Slide 12 — Weight sharing does not remove sequential latency.
**On-screen:** Loop 1 → Loop 2 → Loop 3 → Loop 4.

**Visual:** A token moves through recurrent stages; each stage waits for the previous same-token state.

**Narration:** “Ordinary looping saves duplicated base weights, but the same token still passes through loop stages sequentially. Every repeated block executes, so parameter efficiency does not automatically imply faster autoregressive decoding.”

### Slide 13 — Shift the connection across token positions.
**On-screen:**
[
b_n^{(\ell)}=e_n+h_{n-1}^{(\ell-1)}.
]

**Visual:** Token × Loop dependency grid. First show same-token recurrence, then shift the dependency to the preceding token.

**Narration:** “Parallel Loop Transformers shift the cross-loop connection across token positions. The previous token's state is already available, exposing concurrency across loop stages for the current token. But the information path has changed; this is not merely a scheduling trick.”

**Critical distinction:** The unshifted control uses the same-token previous-loop state and remains sequential.

### Slide 14 — Two vectors can enter the same sum at different scales.
**On-screen:** Separate RMSNorm + controlled mixing.

[
\bar e_n=\operatorname{RMSNorm}(e_n),\qquad
\bar h_{n-1}^{(\ell-1)}=\operatorname{RMSNorm}(h_{n-1}^{(\ell-1)})
]

[
b_n^{(\ell)}=g_n^{(\ell)}\odot\bar e_n+
(1-g_n^{(\ell)})\odot\bar h_{n-1}^{(\ell-1)}.
]

**Visual:** Show raw vector magnitudes, dominance at addition, separate normalization, then controlled mixing.

**Narration:** “The current-token embedding and shifted hidden state can have different RMS magnitudes. Direct addition can let one dominate. The paper separately normalizes both sources and controls their mixture. A fixed 50/50 mixture is already strong; learned gates perform similarly, with the rank-8 linear gate marginally better in the reported experiments.”

**Ablation:** Removing the current-token embedding makes shifted PLT worse than the no-loop baseline, with several runs diverging.

### Slide 15 — Parallelism and cache compression solve different problems.
**On-screen:** Shared global KV cache + loop-local sliding window + G-SWA.

**Visual:** Show the first loop's global cache reused by later loops, local recent-token caches, and gated fusion of global and local attention outputs.

**Narration:** “Cross-Loop Parallelism changes serial dependencies. KV sharing and Gated Sliding-Window Attention address cache memory. Later loops reuse the global cache and maintain a short local window; a learned head-wise gate combines the two attention outputs.”

**Do not conflate variants:** Original PLT combines CLP, KV sharing, and G-SWA. Later normalized shifted/unshifted comparisons use separate per-loop KV caches.

---

## Act VI — Evidence and Limits

### Slide 16 — A controlled study across scale and training budget.
**On-screen:** 70M–1B parameters · 10–160 tokens per parameter · DCLM validation.

**Visual:** Original Table 1 and a compact experimental matrix. Add a small evaluation strip for language modeling, math, code, and choice-based tasks.

**Narration:** “The authors train dense decoder-only Transformers from scratch, across model sizes from 70M to 1B, and training budgets from 10 to 160 tokens per parameter. DCLM validation is the primary language-modeling evaluation, with additional datasets and downstream tasks in the appendices.”

**Metric:** BPB is lower-is-better. Do not equate it with human preference or general reasoning.

### Slide 17 — There is no universally best loop.
**On-screen:** Parameter storage · Training FLOPs · Inference latency · KV-cache memory.

**Visual:** Original Figure 1, then a four-axis resource summary and final open question.

**Narration:** “Full-Stack is strong at fixed parameter and data budgets. Middle-Stack can give better returns under constrained training FLOPs. Normalized shifted PLT recovers much of the quality lost by raw shifted recurrence. The efficiency estimates depend on a fitted vanilla scaling law; they are not direct wall-clock speedups.”

“ The study is limited to dense decoder-only models trained from scratch, up to one billion parameters. It does not establish universal transfer to MoE, frontier-scale, or post-trained assistants.”

**Closing question:** “If the same weights can be applied again, what should the next pass be allowed to know?”

---

## Speaker and source policy

- Keep the 100 → 25×4 illustration explicitly conceptual.
- Use only original paper figures for empirical claims.
- Distinguish original figures from teaching reconstructions.
- Keep parameter storage, training FLOPs, inference latency, and KV-cache memory separate.
- Label external scaling-law context with its own citations.
- No unsupported 10T model claim.
