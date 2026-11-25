# How to Loop Your Transformer
## Final Scientific Storyboard & Slide Script

**Talk length:** 17–19 minutes  
**Core deck:** 15 slides  
**Backup deck:** 7 technical slides  
**Audience:** Graduate Neural Networks  
**Language:** English only  
**Narrative style:** Live scientific storytelling inspired by the supplied Mehrzad Samadi transcript  
**Scientific source:** Ekbote et al., *How to Loop Your Transformer: Loop Scaling, Specialization, and Parallel Inference*, arXiv:2610.40325v1, 29 October 2026.  
**Status:** Preprint. It is not a peer-reviewed Q1 journal article.

---

# 0. Editorial contract

This is not a slide-by-slide paraphrase of the paper. It is a short scientific argument that teaches the paper's central mechanisms and evidence.

## The narrative arc

1. **The tension:** adding physical depth usually adds parameters.
2. **The conceptual unlock:** stored depth and executed depth are different.
3. **The mechanism:** reuse a learned Transformer transformation across recurrent passes.
4. **The first complication:** more loops do not always help.
5. **The second complication:** strict weight sharing can constrain later loops.
6. **The inference complication:** ordinary loops create serial dependencies.
7. **The parallelization idea:** shift cross-loop information flow across adjacent token positions.
8. **The subtle failure:** shifted recurrence changes the information path; unnormalized inputs can have mismatched scales.
9. **The repair and trade-off:** preserve the current-token embedding, normalize both inputs, control their mixture, and treat KV-cache memory separately.
10. **The conclusion:** there is no universally best loop; design for the actual resource constraint.

## Three resource axes — never conflate them

| Resource | What it measures | What looping changes |
|---|---|---|
| Parameter storage | Unique learned weights that must be stored | Weight reuse can increase executed depth without duplicating the full base weights |
| Training compute | FLOPs spent optimizing the model | Each extra loop still executes; compute grows with loop count |
| Autoregressive inference | Serial work and cache memory during token generation | Ordinary looping adds sequential dependencies; PLT changes dependencies; KV sharing/G-SWA target cache memory |

## Scientific and visual rules

- Every slide has one main claim.
- The spoken explanation carries nuance; on-screen text stays concise.
- Reveal diagrams in causal order. Never show the final architecture before the audience has seen the problem it solves.
- Use the paper's figures for empirical claims. Rebuild them only when the data, axes, legends, model scale, TPP, and metric are faithfully preserved.
- Do not invent smooth curves, benchmark values, or speedups.
- Mark explanatory illustrations as **Conceptual diagram — not measured data**.
- DCLM BPB is lower-is-better.
- Distinguish the **unshifted control** from the **parallelizable shifted PLT**: the unshifted variant is sequential.
- Do not call recurrent computation “reasoning” unless the claim is explicitly qualified.
- Do not describe the paper as Q1 or peer-reviewed.

---

# Core presentation

## Slide 1 — The cost of making a model deeper

**Time:** 1:00

### On-screen
# More depth usually means more weights.

**More parameters. More training compute. More deployment pressure.**

### Visual direction
Start with a compact Transformer. Add independently parameterized blocks one at a time. Each new block increases a visible “unique weights” counter. Keep a second counter labelled “block applications” beside it.

Freeze the animation when the two counters appear coupled.

### Speaker script
“One of the most successful ideas in deep learning has been scaling: larger models, more data, and more compute. But there is a structural cost to making a Transformer physically deeper. Every new independent block brings another set of learned weights.

Here is the question behind this paper: do we always need to store a new transformation every time we want another stage of computation?”

### Takeaway
**Can we increase executed computation without proportionally increasing stored parameters?**

### Transition
“To answer that, we need to separate two quantities.”

---

## Slide 2 — The key distinction

**Time:** 1:00

### On-screen
# Stored depth ≠ Executed depth

### Visual direction
Show two counters:
- Unique parameterized blocks
- Total block applications in one forward pass

In a standard Transformer, adding physical layers increases both. Then freeze the first counter and increase only the second by reusing a block.

### On-screen equation
\[
h_{l+1}=T_{\theta_l}(h_l)
\]

### Speaker script
“In an ordinary stack, each depth has its own parameters, so every layer is a different learned transformation.

But a computation graph can apply the same learned function more than once. The function stays the same; the representation entering it changes.

That is the distinction: the number of unique parameter sets does not have to equal the number of times a transformation is executed.”

### Takeaway
**A model can execute more transformations than it stores unique parameter sets.**

### Transition
“Now let us make that idea concrete.”

---

## Slide 3 — The loop

**Time:** 1:20

### On-screen
# Reuse the weights. Recompute the state.

### Visual direction
Morph a conventional stack into one shared Transformer stack. Feed the output back into the same stack. Keep the shared weight label fixed while the hidden-state colour changes on every pass.

### On-screen equations
\[
H^{(0)}=\operatorname{Embedding}(X)
\]

\[
H^{(k+1)}=T_{\theta}(H^{(k)})
\]

\[
Y=\operatorname{LMHead}(H^{(L)})
\]

### Speaker script
“A looped Transformer repeatedly applies the same Transformer, or a selected part of it, to token representations.

The weights are shared across passes. The hidden state is not. Every pass receives a representation that has already been transformed.

This is not free depth. We still execute the computation again. What we avoid is storing a completely new copy of the base weights for every repeated pass.”

### Technical callout
For a fixed base architecture, shared looping keeps the unique base parameter count approximately fixed while the number of executed block applications increases with the loop factor.

### Takeaway
**Shared parameters; recurrent computation; changing hidden states.**

### Transition
“But where the loop is placed changes the computation.”

---

## Slide 4 — There is more than one way to loop

**Time:** 1:30

### On-screen
# Same blocks. Different execution schedules.

### Visual direction
Rebuild Figure 2 as an animated comparison. Show the within-block choices first, then the across-stack choices.

### Within-block choices
1. Joint block: Attention and MLP repeat together.
2. Attention-only: Attention repeats; MLP does not.
3. MLP-only: MLP repeats; Attention does not.
4. Independent: Attention and MLP are looped independently.

### Across-stack choices
1. Full-Stack: the entire stack repeats as a group.
2. Per-Layer: each block repeats locally before moving to the next block.
3. Middle-Stack: a contiguous middle region repeats as a group.
4. Middle-Layer: blocks in the middle region repeat locally; outer blocks execute once.

For a model with \(B\) blocks, the first and last \(\lfloor B/3\rfloor\) blocks are run once in the middle-region designs.

### Speaker script
“The paper does not study one loop architecture. It studies a design space: which component repeats, where recurrence sits, and in what order the blocks execute.

Full-Stack repeats the whole network. Per-Layer completes the repeated applications of one block before moving to the next. Middle-Stack repeats a central group. Middle-Layer repeats the central blocks individually.

These schedules have the same broad goal—reuse weights—but they do not perform the same computation.”

### Takeaway
**Loop placement is an architectural choice, not a cosmetic implementation detail.**

### Transition
“Which schedule gives the best quality, and under what budget?”

---

## Slide 5 — The first experimental result

**Time:** 1:35

### On-screen
# More loops help — until they do not.

**Diminishing returns · Saturation · Regression · Instability**

### Visual direction
Use the actual Figure 3 from the paper. Animate the loop-factor axis, then switch to the total-training-FLOPs axis. Highlight the 100M and 500M panels. Preserve red instability markers and the lower-is-better BPB direction.

### Technical content
Primary metric:
\[
\operatorname{BPB}
=
\frac{\text{negative log-likelihood in bits}}{\text{number of bytes}}
\]

Lower BPB indicates better language-modeling fit.

### Speaker script
“The first result is not ‘more loops are always better.’ At moderate loop factors, looping improves DCLM validation BPB in many tested settings. But marginal gains diminish. At sufficiently high loop counts, some configurations saturate, regress, or become unstable.

The failure point depends on the loop design and the amount of training data. Higher tokens-per-parameter budgets tend to support more consistent gains. The independent Attention-and-MLP looping design degrades sharply as loops increase, while Full-Stack and Middle-Stack are more stable over a wider range.”

### Scope correction
- Model sizes: 70M, 100M, 200M, 300M, 500M, and 1B.
- Loop factors are tested where available from \(\{2,4,8,16,32\}\).
- 70M and 100M sweeps reach 32 loops.
- 200M–500M sweeps reach 8 loops.
- 1B sweeps reach 4 loops.

**Never imply that the 1B model was evaluated at 32 loops.**

### Takeaway
**Loop count is a budget-dependent design variable, not a monotonic quality knob.**

### Transition
“If repeated use of exactly the same weights eventually becomes restrictive, can each pass adapt a little?”

---

## Slide 6 — Specialization without duplicating the model

**Time:** 1:25

### On-screen
# Share the backbone. Specialize the loop.

### Visual direction
Show one shared weight matrix \(W\). Attach a distinct low-rank adapter to each loop. Keep \(W\) visually fixed; animate only the low-rank corrections.

### On-screen equations
\[
W^{(\ell)}
=
W+\frac{\alpha}{r}B^{(\ell)}A^{(\ell)}
\]

\[
A^{(\ell)}\in\mathbb{R}^{r\times d_{\mathrm{in}}},
\quad
B^{(\ell)}\in\mathbb{R}^{d_{\mathrm{out}}\times r}
\]

\[
r\ll \min(d_{\mathrm{in}},d_{\mathrm{out}})
\]

### Speaker script
“Later loops operate on representations that earlier loops have already changed. Exact sharing forces every pass to use the same transformation, even though the state evolves.

The authors explore a middle ground. They retain the shared base weights, but give each loop a small low-rank correction. This is Loop LoRA.

The adapter is not a second full Transformer. It is a compact update whose rank is much smaller than the dimensions of the original weight matrix.”

### Explain the dimensions
- \(W\): \(d_{\mathrm{out}}\times d_{\mathrm{in}}\)
- \(A\): \(r\times d_{\mathrm{in}}\)
- \(B\): \(d_{\mathrm{out}}\times r\)
- \(BA\): \(d_{\mathrm{out}}\times d_{\mathrm{in}}\)

The product is dimensionally compatible with \(W\), but is constrained to have rank at most \(r\).

### Takeaway
**A small loop-specific update relaxes strict sharing without storing a full independent block.**

### Transition
“The paper tests two richer ways to combine these low-rank components.”

---

## Slide 7 — Loop Matrix and Loop Softmax

**Time:** 1:25

### On-screen
# A loop can mix a shared pool of adapters.

### Visual direction
Show the adapter pool as columns and loops as rows. Animate one row of mixing coefficients to build the update for one loop.

### On-screen equations

Loop LoRA:
\[
\Delta W^{(\ell)}=B_\ell A_\ell
\]

Loop Matrix:
\[
\Delta W^{(\ell)}
=
\sum_{j=1}^{L}M_{\ell j}B_jA_j
\]

\[
M\in\mathbb{R}^{L\times L}
\]

Loop Softmax:
\[
M_{\ell j}
=
\operatorname{softmax}(S_{\ell,:})_j
\]

### Speaker script
“Loop LoRA gives each loop its own low-rank pair. Loop Matrix goes further: each loop learns a mixture of a shared pool of low-rank components. The matrix \(M\) controls how much component \(j\) contributes to loop \(\ell\).

Loop Softmax uses learned scores but normalizes each row with softmax. Its coefficients are non-negative and sum to one.

This lets each loop construct a different correction from a shared set of low-rank components.”

### Experimental result
For 300M models, the gains are marginal at two loops but become clearer at four and eight. Loop Matrix gives the largest improvement among the three tested variants. Each low-rank component has rank at most 8.

At 300M:
- Loop-specific corrections add 1.1–4.3% to non-embedding parameters.
- Doubling model depth adds 51.4% to non-embedding parameters.
- At comparable training FLOPs, the doubled-depth reference still achieves lower BPB.

### Takeaway
**Loop specialization is parameter-efficient, but the paper does not show it is compute-efficient.**

### Transition
“Even if the model is compact, there is a different cost when it generates tokens.”

---

## Slide 8 — The inference bottleneck

**Time:** 1:00

### On-screen
# Repeated computation creates a serial dependency.

### Visual direction
Show a token moving through Loop 1 → Loop 2 → Loop 3 → Loop 4. Add a timeline. Each stage waits for the previous same-token state.

### On-screen dependency
\[
h_n^{(\ell)}
=
\mathcal{F}_{\theta}
\left(e_n+h_n^{(\ell-1)}\right)
\]

### Speaker script
“In ordinary looping, loop \(\ell\) for token \(n\) needs the output of loop \(\ell-1\) for that same token. It cannot begin until that state exists.

So parameter sharing does not remove sequential computation. During autoregressive decoding, the serial work grows with the number of loops.”

### Takeaway
**Fewer unique weights do not automatically mean faster decoding.**

### Transition
“Parallel Loop Transformers change this dependency.”

---

## Slide 9 — Cross-Loop Parallelism

**Time:** 1:40

### On-screen
# Shift the connection across token positions.

### Visual direction
Build a 2D grid:
- Horizontal: token index \(n\)
- Vertical: loop index \(\ell\)

First show the same-token dependency. Then shift the recurrent edge one token to the left. Highlight the previous-token state as already available when the current token is processed.

### On-screen equations

Ordinary same-token recurrence:
\[
b_n^{(\ell)}=e_n+h_n^{(\ell-1)}
\]

Cross-Loop Parallelism:
\[
b_n^{(1)}=e_n
\]

\[
b_n^{(\ell)}
=
e_n+h_{n-1}^{(\ell-1)},
\qquad
h_n^{(\ell)}=\mathcal{F}_{\theta}(b_n^{(\ell)})
\]

### Speaker script
“The shifted design passes information from the previous loop at the preceding token position, rather than from the previous loop at the same token position.

The preceding-token state is already available during autoregressive generation. That means the loop stages for the current token can be evaluated concurrently.

But notice the price: we have changed the information available to each loop. This is not just a scheduling optimization. It is a different recurrence.”

### Critical distinction
The **unshifted control** uses \(h_n^{(\ell-1)}\) and remains sequential. Only the shifted transition enables cross-loop parallelism.

### Takeaway
**Parallelism is obtained by changing the dependency graph—and therefore the information path.**

### Transition
“The original PLT also tries to reduce cache memory. These are two separate mechanisms.”

---

## Slide 10 — KV sharing and Gated Sliding-Window Attention

**Time:** 1:30

### On-screen
# Parallel execution and cache compression solve different problems.

### Visual direction
Show a full KV cache for Loop 1. Later loops reuse this global cache, while each retains a short local sliding-window cache. Two attention outputs enter a learned gate.

### On-screen equations

Global attention:
\[
Y_{\mathrm{global}}^{(\ell)}
=
\operatorname{Attn}
(Q^{(\ell)},K_{\mathrm{share}},V_{\mathrm{share}})
\]

Local sliding-window attention:
\[
Y_{\mathrm{local}}^{(\ell)}
=
\operatorname{SWA}
(Q^{(\ell)},K_{\mathrm{local}}^{(\ell)},V_{\mathrm{local}}^{(\ell)};w)
\]

Head-wise gate:
\[
g^{(\ell)}=\sigma(f_{\mathrm{gate}}(Q^{(\ell)}))
\]

Combined output:
\[
\widetilde Y^{(\ell)}
=
g^{(\ell)}\odot Y_{\mathrm{local}}^{(\ell)}
+
(1-g^{(\ell)})\odot Y_{\mathrm{global}}^{(\ell)}
\]

### Speaker script
“Cross-Loop Parallelism changes the dependency between loop stages. KV sharing and G-SWA address a different problem: the memory required to maintain attention state for multiple loops.

Later loops reuse the full global KV cache from the first loop. Each later loop also maintains a small local cache over the most recent \(w\) positions. G-SWA computes attention over both sources and combines their outputs using a learned gate for each attention head.

The shared cache supplies global context. The local window restores recent loop-specific context.”

### Memory complexity
\[
O(ND+(L-1)wD)
\quad\text{instead of}\quad
O(LND)
\]

where \(N\) is sequence length, \(D\) summarizes the KV width, \(L\) is the number of loops, and \(w\) is the local window size.

### Takeaway
**CLP targets serial dependency; KV sharing and G-SWA target cache memory.**

### Transition
“However, the paper finds that the original shifted design loses quality. Why?”

---

## Slide 11 — The failure: mismatched representation scales

**Time:** 1:35

### On-screen
# Adding two vectors does not mean balancing two signals.

### Visual direction
Show the current-token embedding \(e_n\) and previous-token hidden state \(h_{n-1}^{(\ell-1)}\) entering an addition node. Visualize their RMS magnitudes as very different. One stream dominates.

Then normalize each separately and show a controlled mixture.

### On-screen equations

RMS magnitude:
\[
\operatorname{RMS}(x)
=
\sqrt{\frac{1}{d}\sum_{j=1}^{d}x_j^2}
=
\frac{\|x\|_2}{\sqrt d}
\]

Separate normalization:
\[
\bar e_n=\operatorname{RMSNorm}(e_n)
\]

\[
\bar h_{n-1}^{(\ell-1)}
=
\operatorname{RMSNorm}(h_{n-1}^{(\ell-1)})
\]

Controlled mixing:
\[
b_n^{(\ell)}
=
g_n^{(\ell)}\odot\bar e_n
+
(1-g_n^{(\ell)})\odot
\bar h_{n-1}^{(\ell-1)}
\]

\[
g_n^{(\ell)}\in[0,1]^d
\]

### Speaker script
“The authors measure a substantial scale difference between the current-token embedding and the shifted hidden state. Adding them with coefficient one does not make their contributions equal. If one vector has much larger RMS magnitude, it can dominate the sum.

The paper therefore normalizes the two sources separately and controls their mixture.

A fixed 50/50 gate is already a strong repair. The authors also compare scalar, rank-8 linear, and rank-8 MLP gates. They perform similarly; the rank-8 linear gate is marginally better and is used in subsequent experiments.”

### Important ablation
Removing the current-token embedding makes shifted PLT worse than the no-loop baseline, and several runs diverge. The authors hypothesize that the current embedding anchors every loop to the token that actually occurred, reducing error accumulation across token positions.

### Takeaway
**The repair is not merely “add normalization”; preserve the current token and control how the two signals interact.**

### Transition
“Now we can separate the quality result from the cache-memory result.”

---

## Slide 12 — What the PLT experiments really say

**Time:** 1:35

### On-screen
# The repair recovers quality — but the variants are not interchangeable.

### Visual direction
Use Figure 7 and Figure 8. First show the 200M raw shifted results versus normalized results. Then move to the 1B results for loop factors 1, 2, and 4 at TPP 10, 20, 40, and 80.

Use the original axes and legends. Do not redraw from approximate values unless explicitly marked as transcribed approximations.

### Speaker script
“The raw shifted transition underperforms Full-Stack Looping. In some settings, it even falls below the vanilla no-loop baseline. Adding KV sharing and G-SWA alone does not close the gap.

Separate normalization and controlled mixing recover much of the lost quality. In the 1B experiments, normalized shifted PLT at two loops achieves lower DCLM BPB than Full-Stack Looping at every displayed training budget and closely tracks the normalized unshifted control.

At four loops, it remains competitive with Full-Stack Looping, but a clearer gap to the unshifted control remains.”

### Essential distinction
- **Normalized Shifted PLT:** parallelizable; uses previous-token state.
- **Normalized Unshifted PLT:** sequential; uses same-token previous-loop state.
- Both use separate RMS normalization and a rank-8 linear gate in the reported later experiments.
- These later normalized variants maintain a separate KV cache per loop; they do not use KV sharing or G-SWA.
- Original PLT combines CLP, KV sharing, and G-SWA.

### Takeaway
**The strongest quality control is not necessarily the parallelizable model. Always label which dependency is being measured.**

### Transition
“What does the broader study establish—and how strong is the efficiency evidence?”

---

## Slide 13 — The experiment behind the claim

**Time:** 1:25

### On-screen
# A controlled study across model size and training budget.

### Visual direction
Build a compact experimental matrix:
- Model size
- Stored Transformer layers
- Tokens per parameter
- Loop factor
- Evaluation metric

### Study setup

| Model | Parameters | Stored Transformer blocks |
|---|---:|---:|
| Smallest | 70M | 4 |
| 100M | 100M | 6 |
| 200M | 200M | 8 |
| 300M | 300M | 10 |
| 500M | 500M | 12 |
| Largest | 1B | 16 |

Training budgets range from 10 to 160 tokens per parameter. Models use a common pretraining mixture of natural language, code, mathematics, and scientific content, with data sources, sampling, preprocessing, tokenizer, and training setup held fixed across architectures.

Primary validation:
- Fixed subset of DCLM Baseline 1.0
- Approximately 41 million tokens
- Metric: BPB, lower is better

Additional evaluations include C4, WikiText-103, Dolma, RedPajama, mathematical tasks, code tasks, reasoning, and question answering.

### Speaker script
“The authors train dense decoder-only Transformers from scratch. They vary model size, training-token budget, loop count, and loop design while keeping the pretraining mixture and core setup controlled.

The central comparison is not just one model against another. They ask what happens under a fixed data budget and under a fixed training-FLOP budget. Those are different questions, and they can produce different winners.”

### Takeaway
**The paper is a controlled comparison of looping designs under multiple resource constraints.**

### Transition
“Now let us put the results together.”

---

## Slide 14 — The efficiency result, with its caveat

**Time:** 1:25

### On-screen
# The best loop depends on the budget.

### Visual direction
Use Figure 1 as a three-panel result:
1. Data-efficiency gain
2. FLOPs-efficiency gain
3. Downstream accuracy

Animate each panel separately. Keep the fitted-baseline annotation visible.

### Speaker script
“The headline result is conditional. Full-Stack Looping generally gives the strongest quality at a fixed parameter budget. Middle-Stack Looping gives a better return when training FLOPs are constrained.

The paper also reports data- and FLOP-efficiency gains in an over-trained regime. In the specific comparison, two-loop models trained at 80 tokens per parameter reach a given DCLM BPB using fewer training FLOPs than vanilla models trained at 160 tokens per parameter, across model sizes from 100M to 1B.

But the efficiency gains in Figure 1 rely on an inverted fitted vanilla scaling law. They are not direct wall-clock measurements. The authors also report that four loops can achieve lower absolute BPB while providing weaker improvement per training FLOP than two loops.”

### Downstream evaluation
The right panel reports mean NLL-ranked accuracy over eight choice-based tasks for 1B models. Do not interpret this as proof of universal reasoning improvement. MMLU and MMLU-Pro results remain near chance in the reported task-level evaluation.

### Takeaway
**The paper demonstrates trade-offs and regime-dependent gains, not a universal efficiency law.**

### Transition
“What does this work add relative to prior recursive and parallel Transformer research?”

---

## Slide 15 — Contribution, limits, and the open frontier

**Time:** 1:15

### On-screen
# Looping is a resource-allocation problem.

### Visual direction
Return to the shared Transformer block. Surround it with three resource axes:
- Parameter storage
- Training FLOPs
- Autoregressive inference

Then reveal the open research directions.

### Speaker script
“This paper connects three questions in one controlled setting: where and how much to loop, whether loops should specialize, and how recurrence can be parallelized during inference.

Its contribution is not the invention of recurrence in Transformers. Earlier work introduced Universal Transformers, recursive Transformers, loop-specific adaptation, and Parallel Loop Transformers. The contribution here is a systematic comparison of these choices under shared training and evaluation conditions, plus modifications that stabilize parallel looping.

The study is limited to dense decoder-only models trained from scratch, up to one billion parameters. It does not establish that the same conclusions transfer unchanged to mixture-of-experts models, frontier-scale systems, or post-trained assistants.

The authors point to combining PLT with speculative decoding and developing a theory of normalization and current-token reinjection in recurrent computation.”

### Final statement
**The question is not only how many parameters a Transformer stores. It is how effectively those parameters are reused under real computational constraints.**

### Closing question
**If the same weights can be applied again, what should the next pass be allowed to know?**

---

# Backup slides — for questions and technical depth

## Backup 1 — Complete looping design space

Reproduce Figure 2 and include all designs:
- Joint block
- Attention-only
- MLP-only
- Independent Attention and MLP
- Full-Stack
- Per-Layer
- Middle-Stack
- Middle-Layer

Explain that the paper compares seven design families in its main experimental framing; Figure 2 visualizes the component-level and stack-level variants.

For middle-region designs, the first and last \(\lfloor B/3\rfloor\) blocks execute once.

## Backup 2 — Parameter accounting for LoRA

For one shared matrix:
\[
W\in\mathbb R^{d_{\mathrm{out}}\times d_{\mathrm{in}}}
\]

Loop-specific update:
\[
\Delta W^{(\ell)}
=
\frac{\alpha}{r}B^{(\ell)}A^{(\ell)}
\]

Parameter count of one adapter:
\[
r\,d_{\mathrm{in}}+d_{\mathrm{out}}\,r
=
r(d_{\mathrm{in}}+d_{\mathrm{out}})
\]

Compare with a full independent matrix:
\[
d_{\mathrm{out}}d_{\mathrm{in}}
\]

The low-rank factorization is attractive when:
\[
r\ll\min(d_{\mathrm{in}},d_{\mathrm{out}})
\]

For the reported specialization experiments, rank is at most 8 and shared weights plus adapters are trained jointly from initialization. The experiments use unit scaling in the reported setup.

## Backup 3 — Loop Matrix versus Loop Softmax

\[
M\in\mathbb R^{L\times L}
\]

Loop Matrix:
\[
\Delta W^{(\ell)}
=
\sum_{j=1}^{L}M_{\ell j}B_jA_j
\]

Loop Softmax:
\[
M_{\ell j}
=
\frac{\exp(S_{\ell j})}
{\sum_{q=1}^{L}\exp(S_{\ell q})}
\]

Loop Matrix allows unconstrained real-valued mixing coefficients. Loop Softmax constrains each row to a probability simplex. Both mix a pool of low-rank components; neither gives each loop a full independent Transformer.

## Backup 4 — KV-cache memory derivation

With a separate full KV cache for every loop, memory scales as:
\[
O(LND)
\]

where:
- \(L\): number of loops
- \(N\): sequence length
- \(D\): aggregate KV width

With KV sharing and local windows:
\[
O(ND+(L-1)wD)
\]

where \(w\ll N\) is the local sliding-window size.

Explain the mechanism:
1. First loop builds the shared global cache.
2. Later loops reuse it.
3. Each later loop keeps a short local cache.
4. G-SWA combines global and local attention outputs using a learned head-wise gate.

This is a cache-memory trade-off, not the mechanism that creates cross-loop parallelism.

## Backup 5 — PLT ablation ladder

Show the paper's component-by-component reconstruction:
1. Raw shifted CLP
2. CLP + KV sharing
3. Original PLT: CLP + KV sharing + G-SWA
4. Separate RMS normalization
5. Fixed 50/50 mixture
6. Learned gate alternatives
7. Current-token embedding removal ablation
8. Normalized shifted and unshifted controls

Key findings:
- Original PLT and intermediate variants do not recover Full-Stack quality in the 200M tests.
- Normalization and controlled mixing recover much of the quality loss.
- Fixed 50/50 is already strong.
- Scalar, rank-8 linear, and rank-8 MLP gates perform similarly; rank-8 linear is marginally better.
- The rank-8 linear gate is shared across loops and adds less than 0.015% non-embedding parameters.
- Removing the current-token embedding makes shifted PLT worse than vanilla and causes several runs to diverge.
- Separate per-loop KV caches give the best quality; KV sharing plus normalized G-SWA reduces cache memory and approaches that performance.

## Backup 6 — Downstream tasks and interpretation

The paper evaluates:
- Language modeling: DCLM, C4, WikiText-103, Dolma, RedPajama
- Mathematics: GSM8K, MATH
- Code: HumanEval, MBPP
- Reasoning and QA: eight choice-based tasks, including MMLU and MMLU-Pro

Use the appendix task-level tables rather than a single aggregate claim. The reported MMLU and MMLU-Pro performance remains near chance; do not claim a broad reasoning breakthrough.

## Backup 7 — Related work and novelty positioning

The paper situates itself relative to:
- Universal Transformers (Dehghani et al., 2018)
- Relaxed Recursive Transformers (Bae et al., 2025)
- Parallel Loop Transformers (Wu et al., 2025)
- Recent scaling and recurrence studies cited in Section 4

Position the contribution accurately:
- Not the invention of recurrent depth.
- Not the invention of LoRA.
- Not the invention of cross-loop parallelism.
- A joint controlled study of looping location, loop count, specialization, and inference dependencies in dense decoder-only models trained from scratch.
- A component-level diagnosis and stabilization of shifted PLT through current-token embedding preservation, separate RMS normalization, and controlled mixing.

---

# Figure, table, and evidence map

| Presentation slide | Primary paper evidence | Use |
|---|---|---|
| 3–4 | Figure 2 | Rebuild as animated architecture |
| 5 | Figure 3; Appendix E Figures 13–16 | Actual BPB-versus-loop and BPB-versus-FLOPs plots |
| 7 | Figures 4–5; Appendix F | Adapter diagrams and specialization results |
| 9 | Figure 6 | Token-by-loop dependency grid |
| 10 | Appendix B.3; Definition 10 | KV sharing and G-SWA mechanism |
| 11–12 | Figure 7; Figure 8; Appendix G/H | PLT ablations, normalized shifted results, 1B results |
| 13 | Appendix C, Table 1 | Model configurations and training budgets |
| 14 | Figure 1; Appendix D | Data/FLOP efficiency and downstream accuracy |

### Required figures in the final visual deck

- Figure 1: three-panel data efficiency, FLOPs efficiency, downstream accuracy.
- Figure 2: complete looping design space.
- Figure 3: loop factor and training FLOPs.
- Figure 4: strict sharing, Loop LoRA, Loop Matrix/Softmax.
- Figure 5: quality versus loop count, parameter increase, and training FLOPs.
- Figure 6: cross-token PLT dependency.
- Figure 7: raw versus normalized re-injection.
- Figure 8: normalized shifted PLT at 1B.
- Appendix Figure 13/14: extended loop-scaling results.
- Appendix G figures: RMS scale mismatch and gate ablations.
- Appendix H figures: cross-scale and cross-dataset PLT results.

### Required tables

- Table 1: model configurations.
- Appendix C: training and data setup.
- Appendix D: downstream task-level results.
- Appendix F: specialization results.
- Appendix G/H: PLT component and scale ablations.

### Data integrity rules

- Prefer the original paper figure with clear attribution.
- If redrawing, transcribe the values from the source figure/table and record the source location in speaker notes.
- Approximate values read from a plot must be labelled **Approximate values digitized from the figure**.
- Do not turn the fitted scaling-law efficiency estimates into measured speedups.
- Do not use the conceptual story curve as an empirical result.
- Preserve metric direction: lower BPB is better.
- Explain the fitted-vanilla-baseline dependency behind Figure 1's efficiency estimates.

---

# Source and citation

Chanakya Ekbote, Artidoro Pagnoni, Devendra Singh Sachan, Shruti Bhosale, Mike Lewis, Maryam Fazel-Zarandi, Shashank Rajput, and Sujan Kumar Gonugondla.

**How to Loop Your Transformer: Loop Scaling, Specialization, and Parallel Inference.**

arXiv:2610.40325v1, 29 October 2026. Preprint.

- Abstract: https://arxiv.org/abs/2610.40325
- Full paper HTML: https://arxiv.org/html/2610.40325v1
- PDF: https://arxiv.org/pdf/2610.40325

---

# Presenter rehearsal checklist

- Explain stored depth versus executed depth in one sentence.
- Draw the full-stack and middle-stack schedules.
- Explain why per-layer and middle-layer schedules are different.
- Derive the dimensions and parameter count of a LoRA update.
- Explain how Loop Matrix and Loop Softmax differ.
- Distinguish training-FLOP efficiency from parameter efficiency.
- Draw the PLT token-by-loop dependency graph.
- Explain the difference between CLP, KV sharing, and G-SWA.
- Derive the KV-cache complexity reduction.
- Explain why raw shifted addition can be dominated by one input.
- Explain why the current-token embedding must remain available.
- Distinguish shifted parallel PLT from the sequential unshifted control.
- State the exact scope and limitations of the evidence.
- Deliver the core narrative in 17–19 minutes; use backup slides only for questions.
