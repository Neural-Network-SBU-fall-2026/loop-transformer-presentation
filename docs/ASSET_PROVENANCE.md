# Asset provenance and extraction status

## Original paper assets

The primary source is arXiv:2610.40325v1:
- HTML: https://arxiv.org/html/2610.40325v1
- PDF: https://arxiv.org/pdf/2610.40325

The repository includes a reproducible extraction script at `.github/scripts/import-paper-figures.sh`. It attempts to download the official arXiv HTML rendering and copy every embedded image resource into `public/assets/paper-original/`.

**Current limitation:** GitHub Actions receives HTTP 404 from the arXiv HTML/source download endpoints for this version, even though the paper's HTML is readable through the research browser. Therefore the workflow cannot currently populate `paper-original/`. We do not claim that original paper figures have been extracted.

To complete exact original-figure extraction, provide the paper PDF or the arXiv source archive as a repository/upload attachment. Then extract all PDF figures at publication resolution, preserve original filenames/captions, and add a source-page/figure manifest.

## Reconstructed teaching diagrams

The following files are original vector reconstructions authored for this presentation. They are **not** the paper's original figures and are labelled accordingly in the web deck:

- `public/assets/figures/01-looping-design-space.svg` — looping components and stack schedules, based on the method described around Figure 2.
- `public/assets/figures/02-loop-matrix.svg` — shared base weights and low-rank adapter mixing, based on Figures 4–5.
- `public/assets/figures/03-plt-dependency-grid.svg` — sequential versus shifted cross-token dependency, based on Figure 6.
- `public/assets/figures/04-kv-cache-gswa.svg` — shared global cache, local window, and G-SWA, based on Appendix B.3.
- `public/assets/figures/05-normalized-gated-interface.svg` — separate RMS normalization and controlled mixing, based on Figure 7 and Appendix G.

These are teaching diagrams, not experimental plots. No measured curve or numeric data is fabricated in them.

## Empirical plots

Figures 1, 3, 5, 7, and 8 and appendix plots must be embedded from the original paper or faithfully digitized from the PDF. Until the source PDF is available locally, the presentation uses explicit figure placeholders rather than fabricated quantitative charts.
