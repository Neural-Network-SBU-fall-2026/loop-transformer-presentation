# Prototype V2.1 review notes — neural architecture visual pass

## Purpose
This pass refines architecture-explanation slides so they read as neural-network / Transformer diagrams rather than generic infographics, while preserving the approved Scientific Editorial identity.

## Changes in this pass
- Slide 7 (Inside the Loop): now depicts a token sequence, hidden-state input/output, a shared Transformer block, normalization, multi-head self-attention with Q/K/V notation, residual connections, feed-forward network, and reused θ.
- Slide 8 (Loop Design Space): each design is shown as a vertical Transformer stack with repeated regions highlighted. The scene retains step-by-step selection and a final Compare All view.
- LoRA / Loop Matrix: shared base weight and low-rank adapter branches are visually connected.
- Parallel Looping: token-by-loop grid highlights the dependency shift.
- RMSNorm / Gate: current-token embedding and shifted hidden state are shown as separate neural streams that meet at the normalization/gating stage.
- KV / G-SWA: global cache and local-window attention are represented as separate attention contexts feeding a gated output.

## Visual consistency rules
- Graph-paper background, editorial serif headings, monospace technical labels.
- Navy/blue for data flow and neural components; yellow for active/repeated regions.
- Architecture shapes are consistent: rounded rectangular modules for learned operations, dashed boxes for residual/normalization operations, arrows for tensor flow, and explicit tensor/state labels.
- No raw paper figures are used in presentation scenes. Custom diagrams are original explanatory illustrations; empirical charts must be redrawn from source data with figure/table citations.
- 3D is used selectively for depth/stack comprehension. Detailed tensor-flow and sublayer diagrams remain 2D where that is more legible and technically precise.

## Remaining placeholders before production
- Presenter/instructor/email details are set; official SBU SVG logo is integrated and attributed.
- Source-digitized empirical chart values for final custom result plots.
- Final review of all slide transitions and full-screen layout.
