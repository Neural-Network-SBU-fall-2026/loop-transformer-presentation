# Research Notes

## Primary source

Ekbote et al., **How to Loop Your Transformer: Loop Scaling, Specialization, and Parallel Inference**. arXiv:2610.40325, submitted 29 October 2026. https://arxiv.org/abs/2610.40325

Status: preprint, not a peer-reviewed Q1 journal article.

## Verified abstract-level findings

- Dense decoder-only Transformers trained from scratch.
- Up to 1B parameters, 155B tokens, 32 loops, and 1.07×10^21 FLOPs.
- Full-transformer looping generally gives strongest quality at fixed parameter budget.
- Middle-block looping gives better return when training FLOPs are constrained.
- More loops are not monotonically beneficial; gains can saturate, reverse, or become unstable.
- Loop-specific low-rank adapters improve quality, with larger gains as loop count increases.
- Ordinary looping slows autoregressive decoding in proportion to loop count.
- Parallel Loop Transformers pass hidden states across adjacent token positions. The original formulation does not consistently retain quality gains.
- Preserving the current-token embedding and separately normalizing it and the previous-token hidden state before gated combination recovers strong performance across tested scales and budgets.

## Research cautions

Exact chart values must be transcribed from the paper PDF figures/tables before use. The web slide's scaling curve is conceptual, not measured data. Do not generalize results to MoE, frontier-scale, or post-trained models.

## Links

- Paper: https://arxiv.org/abs/2610.40325
- PDF: https://arxiv.org/pdf/2610.40325
- DOI: https://doi.org/10.48550/arXiv.2610.40325
