# Asset provenance and extraction status

## Original paper assets

Primary source: Ekbote et al., arXiv:2610.40325v1.
- HTML: https://arxiv.org/html/2610.40325v1
- PDF: https://arxiv.org/pdf/2610.40325

The official Figure 2 is imported by the GitHub Actions workflow from the arXiv HTML asset:
- \`public/assets/paper-original/figure-02-looping-designs.png\`

This is an original figure image, not a redraw. It is used on the looping-design slide.

**Full extraction is not yet complete.** The paper has additional original empirical plots and diagrams (Figures 1, 3–8 and appendix figures). The automated runner previously received HTTP 404 from the arXiv HTML/source archive endpoints. The extraction workflow currently imports the directly accessible Figure 2 asset only. We do not claim that every original figure has been extracted.

To complete full-resolution extraction of every figure, upload the PDF or source archive. Then extract each figure/table with its original caption, page, and figure number, and add a manifest. This is necessary to avoid inventing figure URLs or presenting reconstructions as original assets.

## Reconstructed teaching diagrams

These are original vector reconstructions authored for this presentation. They are **not** the paper's original figures:

- \`public/assets/figures/01-looping-design-space.svg\` — method reconstruction based on Figure 2.
- \`public/assets/figures/02-loop-matrix.svg\` — shared base weights and low-rank adapter mixing, based on Figures 4–5.
- \`public/assets/figures/03-plt-dependency-grid.svg\` — sequential versus shifted cross-token dependency, based on Figure 6.
- \`public/assets/figures/04-kv-cache-gswa.svg\` — shared global cache, local window, and G-SWA, based on Appendix B.3.
- \`public/assets/figures/05-normalized-gated-interface.svg\` — separate RMS normalization and controlled mixing, based on Figure 7 and Appendix G.

These are teaching diagrams, not experimental plots. No measured curve or numeric data is fabricated in them.

## Empirical plots

Figures 1, 3, 5, 7, 8 and appendix plots must be embedded from the original paper or faithfully digitized from the PDF. Until the source PDF is available as a local artifact, those empirical plots remain source-referenced placeholders in the web presentation.
