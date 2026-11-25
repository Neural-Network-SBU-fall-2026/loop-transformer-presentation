# How to Loop Your Transformer
## A scientific-storytelling script for a 15–20 minute presentation

**Presentation language:** English  
**Audience:** Graduate Neural Networks course  
**Visual style:** Light Academic, high-motion scientific storytelling  
**Narrative reference:** The supplied Mehrzad Samadi YouTube transcript  
**Scientific authority:** Ekbote et al., arXiv:2610.40325v1  
**Publication status:** Preprint (29 October 2026), not a peer-reviewed Q1 journal article

---

## Editorial direction

This presentation borrows the *storytelling mechanics* of the supplied video transcript, not its scientific claims or its wording:

1. Start with the bigger picture and a problem the audience already understands.
2. Explain why the obvious approach creates a new cost.
3. Briefly show the family of ways researchers try to get more capability from a fixed model.
4. Introduce the paper's central idea with a physical, intuitive analogy.
5. Reveal the actual architecture only after the intuition is established.
6. Explain the mechanism step by step, then expose the subtle failure modes.
7. Let the experiments answer the questions raised by the story.
8. Finish with the trade-offs and the question the paper leaves open.

The tone should feel like a live explanation at a whiteboard: confident, curious, visually rich, and technically serious. Avoid hype, exaggerated claims, and decorative complexity.

### Central narrative question

> **What if we could make a Transformer perform more computation without storing a new set of weights for every extra stage?**

### The three constraints that organize the whole talk

- **Parameter budget:** how many learned weights must be stored?
- **Training-compute budget:** how much computation is spent learning the model?
- **Inference latency:** how much sequential computation is required to generate the next token?

Do not collapse these into one notion of “efficiency.” The paper shows that the best design depends on which constraint dominates.

---

# Slide 1 — The scaling problem

**Time:** 1 min 40 sec  
**Role in the story:** Establish the big problem before introducing the paper.

### On-screen text

# Bigger models changed AI.
# But scale has a price.

**More parameters · More training compute · More deployment cost**

### Visual sequence

- Begin with a small neural network.
- Grow it into a deep Transformer stack.
- Let the parameter counter rise as independent blocks appear.
- Zoom out to reveal that adding layers also means storing more learned weights.
- Freeze the animation on one question: “Can we get more computation from the same parameters?”

### Speaker script

“Over the last several years, one of the most influential ideas in deep learning has been scaling. Larger models, more data, and more training compute have repeatedly produced stronger systems.

But there is a catch. When we make a Transformer physically deeper by adding independent layers, we also add more learned parameters. And larger models bring costs: memory, training compute, infrastructure, and deployment.

So there is a second question alongside ‘How do we build a bigger model?’

Can we make an existing set of parameters do more useful computation?”

### Audience takeaway

**The goal is not simply a smaller model. It is more computation per stored parameter.**

### Transition

“To understand the idea, we need to separate two things that are often treated as if they were the same.”

---

# Slide 2 — Stored depth versus executed depth

**Time:** 1 min 40 sec  
**Role in the story:** Give the audience the conceptual key.

### On-screen text

# Stored depth ≠ Executed depth

### Visual sequence

Show two counters side by side:

- **Stored blocks:** how many independently parameterized Transformer blocks exist.
- **Executed blocks:** how many block applications happen during one forward computation.

In a conventional stack, both counters grow together as layers are added.

Then freeze the stored-block counter and increase only the executed-block counter.

### Speaker script

“In a standard Transformer, every block has its own parameters. If we add another block, we add another learned transformation.

But the number of transformations we execute does not have to equal the number of unique transformations we store.

A function can be reused. The same learned block can be applied again to a representation that has already changed.

That distinction—stored depth versus executed depth—is the doorway to looped Transformers.”

### On-screen equation

\[
h_{l+1}=T_{\theta_l}(h_l)
\]

### Audience takeaway

**A network can execute a deeper computational path without storing a new independent parameter set at every step.**

### Transition

“So what happens if we take one Transformer and ask it to process its own output again?”

---

# Slide 3 — The loop: one transformation, repeated

**Time:** 2 min 10 sec  
**Role in the story:** Deliver the first “wow” moment.

### On-screen text

# Reuse the weights.
# Recompute the representation.

### Visual sequence

1. Show a conventional Transformer stack with distinct parameter labels.
2. Collapse the repeated stack into one shared Transformer.
3. Feed a token representation into the shared stack.
4. Animate the output state returning to the same stack.
5. Repeat the pass while keeping the weight label unchanged.
6. Show that the hidden representation changes after every pass.

### Speaker script

“Imagine a student solving a problem by revisiting the same method several times. The method is unchanged, but the state being worked on is different after every pass.

A looped Transformer does something structurally similar. It applies the same Transformer—or a selected part of it—repeatedly to token representations.

The important detail is that the weights are shared, but the hidden state is not frozen. Every pass transforms the representation again.

This is not free computation. The model still executes the block again. What it avoids is storing a fresh independent copy of the weights for every repeated pass.”

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

### Audience takeaway

**One shared transformation can be applied multiple times to progressively transformed representations.**

### Important clarification

Do not claim that every loop is a human-like “thought.” The paper studies repeated neural computation, not a direct measurement of internal reasoning.

### Transition

“But repeating a network is not a single design. Where we place the loop changes what the model computes.”

---

# Slide 4 — Where should the loop go?

**Time:** 1 min 50 sec  
**Role in the story:** Show that the architecture is a design space, not one trick.

### On-screen text

# Same weights.
# Different computation schedules.

### Visual sequence

Build three diagrams from the same Transformer blocks.

**Full-Stack Looping**

The complete stack repeats as a unit.

\[
(B_1\rightarrow B_2\rightarrow\cdots\rightarrow B_B)^L
\]

**Per-Layer Looping**

Each block repeats locally before computation moves to the next block.

**Middle-Stack Looping**

A contiguous middle region repeats; the blocks outside that region execute once.

Then briefly reveal that the paper also studies looping only Attention, only the MLP, or the two independently.

### Speaker script

“The first design repeats the entire Transformer stack. The output of the final block is fed back to the first block.

The second design repeats each block locally before moving forward.

The third design keeps the early and late parts of the network outside the loop and repeats only a central region.

These schedules are not equivalent. They change the order in which transformations are applied, and therefore can change how effectively a fixed parameter budget is used.”

### Audience takeaway

**Loop placement and computation order matter.**

### Transition

“Now comes the obvious question: if one loop helps, should we simply add as many loops as possible?”

---

# Slide 5 — The scaling surprise: more loops are not always better

**Time:** 2 min  
**Role in the story:** Replace the intuitive expectation with the actual experimental result.

### On-screen text

# More loops ≠ unlimited gains

**Improvement → Diminishing returns → Saturation or regression**

### Visual sequence

Use the paper's actual Figure 3 and relevant Appendix E plots.

Reveal the results in stages:
1. Moderate looping improves DCLM validation BPB in the tested settings.
2. Marginal gains diminish as loop count increases.
3. Some high-loop configurations saturate, regress, or become unstable.

Show the metric definition on screen:

**Bits per byte (BPB): lower is better.**

### Speaker script

“If repeated computation is useful, it is tempting to assume that more loops must always be better.

The experiments show a more interesting picture. With moderate loop factors, looping improves language-modeling quality across the evaluated designs and settings. But the marginal gains become smaller. At very large loop counts, performance can degrade.

The point where this happens depends on the looping strategy and the training-token budget. Lower-token-budget runs tend to saturate or regress sooner. The strategy that loops Attention and the MLP independently degrades sharply as the loop count rises, while Full-Stack and Middle-Stack looping remain stable over a wider range.”

### Experimental scope callout

- Models: 70M, 100M, 200M, 300M, 500M, and 1B.
- Loop factors tested where available: 2, 4, 8, 16, and 32.
- The 70M and 100M sweeps extend to 32 loops.
- The 200M–500M sweeps extend to 8 loops.
- The 1B sweeps extend to 4 loops.

**Do not imply that the 1B model was tested with 32 loops.**

### Audience takeaway

**Loop count is a resource-allocation decision, not a “more is always better” knob.**

### Transition

“Why do later passes become less useful if every pass is forced to use exactly the same weights?”

---

# Slide 6 — Specialization: let each loop adapt

**Time:** 1 min 50 sec  
**Role in the story:** Introduce the second major contribution.

### On-screen text

# Shared does not have to mean identical.

**One shared backbone. Small loop-specific corrections.**

### Visual sequence

- Show the same shared base matrix \(W\) used by every loop.
- Attach a small, distinct low-rank adapter to each loop.
- Animate the adapter changing while the base weights remain visually fixed.
- Show the trade-off: a small parameter increase versus fully independent copies of the Transformer.

### Speaker script

“Every loop receives a representation that has already been transformed by previous passes. Yet ordinary looping forces all passes to use exactly the same weights.

The authors ask whether this exact sharing is too restrictive.

Giving every loop a completely independent Transformer would remove much of the parameter-saving benefit. Instead, they use LoRA: each loop gets a small low-rank correction, while the main Transformer weights remain shared.

This gives later passes some room to specialize without duplicating the full network.”

### On-screen equations

\[
W^{(\ell)}=W+\Delta W^{(\ell)}
\]

For Loop LoRA:

\[
\Delta W^{(\ell)}=B_\ell A_\ell
\]

### Audience takeaway

**The backbone is shared; each loop can receive a small learned correction.**

### Transition

“And the paper goes one step further: instead of giving each loop only its own adapter, can loops learn to mix adapters?”

---

# Slide 7 — Loop Matrix: learning how to mix

**Time:** 1 min 30 sec  
**Role in the story:** Explain the most distinctive specialization variant.

### On-screen text

# A loop can learn a mixture of adapters.

### Visual sequence

- Start with one low-rank adapter per loop.
- Introduce a matrix whose rows represent loops and columns represent adapter components.
- Highlight one row and animate its weighted combination of adapter components.
- Show Loop Softmax as a constrained version of this mixture.

### On-screen equations

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
\operatorname{softmax}(S_{\ell,:})_j
\]

### Speaker script

“The authors compare three ways of specializing loops.

Loop LoRA gives each loop its own adapter.

Loop Matrix allows each loop to learn a combination of the low-rank components.

Loop Softmax uses a learned score matrix, but constrains the mixture weights to be non-negative and sum to one.

In their 300M experiments, specialization gains are marginal at two loops but clearer at four and eight. Loop Matrix gives the largest improvement among the three options.”

### Quantitative result

At 300M parameters, the specialization methods increase non-embedding parameters by **1.1–4.3%**, compared with **51.4%** for doubling the model depth.

At comparable training FLOPs, the doubled-depth reference still achieves lower BPB.

### Audience takeaway

**Loop-specific specialization is parameter-efficient, but not necessarily compute-efficient.**

### Transition

“So far, we have improved the computation. But there is another cost that appears when we actually generate text.”

---

# Slide 8 — The inference bottleneck

**Time:** 1 min 20 sec  
**Role in the story:** Introduce the practical obstacle.

### On-screen text

# Shared weights do not remove sequential latency.

### Visual sequence

Show one token moving through Loop 1, then Loop 2, then Loop 3, then Loop 4.

Put a timeline underneath. Each loop must wait for the previous loop's same-token hidden state.

Then show the next token beginning only after the autoregressive dependency permits it.

### Speaker script

“During ordinary autoregressive decoding, a token passes through the loops one after another. Loop two needs the representation produced by loop one for that same token. Loop three waits for loop two, and so on.

So although the weights are shared, the sequential computation grows with the number of loops.

This is a different efficiency problem. We have reduced parameter storage, but we have not eliminated the serial dependency during generation.”

### Audience takeaway

**Parameter efficiency is not the same as inference-latency efficiency.**

### Transition

“Can we change the information path so that different loop stages can run concurrently?”

---

# Slide 9 — Parallel Loop Transformers: shift the connection

**Time:** 2 min  
**Role in the story:** Deliver the second major “wow” moment.

### On-screen text

# What if a loop used the previous token's state?

**Cross-loop parallelism**

### Visual sequence

Use a two-dimensional grid:
- Horizontal axis: token position.
- Vertical axis: loop index.

First draw ordinary looping: loop \(\ell\) at token \(n\) depends on loop \(\ell-1\) at token \(n\).

Then animate the shifted connection: loop \(\ell\) at token \(n\) receives the state from loop \(\ell-1\) at token \(n-1\).

Highlight that the preceding-token state is already available during autoregressive decoding. The loop computations for the current token can therefore run concurrently.

### On-screen equations

Ordinary transition:

\[
b_n^{(\ell)}=e_n+h_n^{(\ell-1)}
\]

Shifted transition:

\[
b_n^{(\ell)}=e_n+h_{n-1}^{(\ell-1)}
\]

### Speaker script

“The key change is subtle. Instead of passing information from the previous loop at the same token position, the model passes information from the previous loop at the preceding token position.

That previous-token state is already available during autoregressive generation. This shift exposes parallelism across loop stages for the current token.

But we have changed more than the execution schedule. We have changed what information each loop receives. And that creates a new problem.”

### Audience takeaway

**Parallelism comes from changing the dependency across token positions.**

### Transition

“The first version of this idea loses quality. The paper investigates why.”

---

# Slide 10 — The hidden failure: two signals, two scales

**Time:** 2 min  
**Role in the story:** Explain the paper's key diagnostic and repair.

### On-screen text

# The merge is not neutral.

**One signal can overwhelm the other.**

### Visual sequence

Show two streams entering a merge:
- Current-token embedding \(e_n\).
- Previous-token hidden state \(h_{n-1}^{(\ell-1)}\).

First animate direct addition. Represent one stream as much larger so it visually dominates.

Then normalize both streams independently. Finally show controlled mixing.

### On-screen equations

\[
\hat e_n=\operatorname{RMSNorm}(e_n)
\]

\[
\hat h_{n-1}^{(\ell-1)}
=
\operatorname{RMSNorm}(h_{n-1}^{(\ell-1)})
\]

\[
b_n^{(\ell)}
=
g_n^{(\ell)}\odot\hat e_n+
(1-g_n^{(\ell)})\odot
\hat h_{n-1}^{(\ell-1)}
\]

### Speaker script

“The authors find that the RMS magnitudes of the current-token embedding and the previous-token hidden state can differ substantially. If we add them directly, the larger representation can overwhelm the smaller one.

They normalize the two signals separately and then control how they are mixed.

An important detail: normalization alone is not enough. Simply normalizing both and adding them still performs worse than controlling their relative contribution. A fixed 50/50 mixture is already a strong repair. In subsequent experiments, the authors use a shared rank-8 linear gate, which adds less than 0.015% to non-embedding parameters.”

“Another revealing ablation removes the current-token embedding. Shifted PLT then performs worse than the no-loop baseline, and several runs diverge. The authors hypothesize that the embedding anchors each loop to the token that actually occurred, limiting error accumulation across positions.”

### Audience takeaway

**Parallel execution requires a carefully designed information interface—not just a shifted arrow.**

### Transition

“Now we can ask whether the repaired parallel design recovers the benefits of ordinary looping.”

---

# Slide 11 — What the experiments actually show

**Time:** 1 min 50 sec  
**Role in the story:** Resolve the questions raised by the presentation.

### On-screen text

# There is no universally best loop.

### Visual sequence

Use the paper's actual figures:
- Figure 1 for the headline data/compute-efficiency comparisons.
- Figure 3 for loop placement and training-compute trade-offs.
- Figure 5 for loop-specific specialization.
- Figures 7–8 for PLT stabilization and 1B results.

Reveal three separate resource constraints.

### Fixed parameter and training-data budget

**Full-Stack Looping** generally gives the strongest quality.

### Constrained training FLOPs

**Middle-Stack Looping** provides the best return at lower training-compute budgets.

### Inference parallelism

**Normalized Shifted PLT** approaches ordinary Full-Stack Looping quality in the tested settings. At 1B and two loops, it achieves lower DCLM BPB than Full-Stack Looping at every displayed training budget and closely tracks the normalized unshifted control. At four loops, it remains competitive, with a wider gap to the unshifted control.

### Speaker script

“The paper's message is not that one loop design wins everywhere. It is that the right design depends on the resource constraint.

At a fixed parameter budget, full-stack looping is generally strongest. Under tighter training FLOP budgets, middle-stack looping can provide a better return. For inference, normalized shifted PLT recovers much of the quality lost by the original shifted formulation while allowing loop stages to run concurrently.”

“The paper also reports a specific over-trained regime in which two-loop models trained at 80 tokens per parameter reach a given DCLM BPB using fewer training FLOPs than vanilla models trained at 160 tokens per parameter, across model sizes from 100M to 1B. This is a measured result in that setup, not a universal scaling law.”

### Audience takeaway

**Choose the loop design for the bottleneck: parameter storage, training compute, or inference.**

---

# Slide 12 — The boundary of the claim

**Time:** 1 min 20 sec  
**Role in the story:** Demonstrate scientific maturity and end with a memorable idea.

### On-screen text

# Looping is not free depth.
# It is a different allocation of computation.

### Visual sequence

Return to the single shared Transformer from Slide 1.

Around it, reveal three constraints:
- Stored parameters
- Training FLOPs
- Autoregressive inference

Show the loop count changing and the three resource meters responding differently.

### Speaker script

“This is a controlled study of dense decoder-only Transformers trained from scratch, from 70 million to one billion parameters. It does not prove that the same design choices transfer unchanged to mixture-of-experts models, frontier-scale systems, or post-trained assistants.

The authors also identify open questions. One future direction is combining Parallel Loop Transformers with speculative decoding. Another is developing a theory of how normalization and current-token embedding reinjection affect stability in recurrent computation.”

“The deeper lesson is that a model's capacity is not determined only by how many parameters it stores. It also depends on how those parameters are reused, how computation is scheduled, and what information is passed from one stage to the next.”

### Final statement

**The question is not only how many parameters a Transformer has. It is how much useful computation those parameters can perform.**

### Closing question

**If we can reuse the same weights, what is the most useful computation to ask them to perform next?**

---

# Optional backup slides

## Backup A — Experimental setup

- Model sizes: 70M, 100M, 200M, 300M, 500M, and 1B.
- Stored Transformer layers: 4, 6, 8, 10, 12, and 16, respectively.
- Training budgets: 10–160 tokens per parameter.
- Pretraining mixture: natural language, code, mathematics, and scientific content.
- Primary validation: approximately 41 million tokens from DCLM Baseline 1.0.
- Primary metric: bits per byte (BPB); lower is better.
- Additional evaluation: C4, WikiText-103, Dolma v1.5, RedPajama, Dolma Programming Languages, GSM8K, MATH, HumanEval, and MBPP.

## Backup B — Three loop-specialization variants

**Loop LoRA**

\[
\Delta W^{(\ell)}=B_\ell A_\ell
\]

**Loop Matrix**

\[
\Delta W^{(\ell)}
=\sum_{j=1}^{L}M_{\ell j}B_jA_j
\]

**Loop Softmax**

\[
M_{\ell j}
=\operatorname{softmax}(S_{\ell,:})_j
\]

All retain the shared base weights. The low-rank components have rank at most 8 in the reported experiments.

## Backup C — Why BPB?

Bits per byte is a language-modeling metric based on negative log-likelihood normalized by bytes rather than tokenizer-specific token counts. Lower is better. It is not equivalent to human preference, instruction-following quality, or general reasoning ability.

## Backup D — What does the study not prove?

- More loops always improve quality.
- Looping is always cheaper than adding physical layers.
- Parallel decoding is automatically lossless.
- Results transfer unchanged to every architecture or scale.
- Recurrent depth is equivalent to explicit chain-of-thought reasoning.

---

# Figure and evidence register

Use the paper's own figures wherever possible. Redraw only when the redraw preserves the exact information and is clearly attributed.

| Slide | Primary source figure |
|---|---|
| 3 | Figure 2 — looping architecture and execution order |
| 4 | Figure 2 — full-stack, per-layer, and middle-stack schedules |
| 5 | Figure 3; Appendix E — loop scaling and compute-budget comparisons |
| 6–7 | Figures 4–5 — loop-specific adapters and specialization |
| 9 | Figure 6 — cross-token shifted dependency |
| 10 | Figure 7 — normalization and controlled mixing |
| 11 | Figures 1, 3, 5, 8 — headline efficiency, looping, specialization, and PLT results |

### Quantitative-figure integrity

- Do not invent chart values or reconstruct exact curves from prose.
- If a figure is not transcribed, show the paper's original plot with attribution.
- Mark explanatory diagrams as **Conceptual illustration**.
- Preserve axes, metric direction, model size, token-to-parameter budget, loop count, and legend.
- BPB is lower-is-better; do not invert its interpretation.
- Clearly distinguish parameter efficiency from training-FLOP efficiency and inference latency.

---

# Source

Chanakya Ekbote, Artidoro Pagnoni, Devendra Singh Sachan, Shruti Bhosale, Mike Lewis, Maryam Fazel-Zarandi, Shashank Rajput, and Sujan Kumar Gonugondla.

**How to Loop Your Transformer: Loop Scaling, Specialization, and Parallel Inference.**

arXiv:2610.40325v1, 29 October 2026. Preprint.

- Abstract and metadata: https://arxiv.org/abs/2610.40325
- Full HTML paper: https://arxiv.org/html/2610.40325v1
- PDF: https://arxiv.org/pdf/2610.40325

---

# Rehearsal standard

The presenter should be able to:

1. Explain stored depth versus executed depth without using jargon.
2. Draw a conventional Transformer and a looped Transformer from memory.
3. Explain why loop placement changes the computation.
4. State why more loops eventually have diminishing returns.
5. Distinguish Loop LoRA, Loop Matrix, and Loop Softmax.
6. Explain why ordinary looping creates a sequential decoding bottleneck.
7. Draw the shifted cross-token dependency used by PLT.
8. Explain why separate normalization and controlled mixing matter.
9. State the paper's experimental scope and limitations.
10. Deliver the core narrative in 17–18 minutes, leaving room for transitions and questions.
