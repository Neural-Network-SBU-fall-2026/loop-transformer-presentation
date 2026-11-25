#!/usr/bin/env bash
set -euo pipefail
OUT="public/assets/paper-original"
mkdir -p "$OUT"
BASE="https://arxiv.org/html/2610.40325v1"
curl --retry 3 --retry-delay 2 -A "LoopTransformerPresentation/1.0" -fL "$BASE/combined_recurrence_architecture.png" -o "$OUT/figure-02-looping-designs.png"
file "$OUT/figure-02-looping-designs.png"
test -s "$OUT/figure-02-looping-designs.png"
cat > "$OUT/README.md" <<'EOF'
# Original paper figure assets

Original Figure 2 downloaded from the official arXiv HTML rendering:
- figure-02-looping-designs.png — Figure 2, looping design space.

The paper contains additional empirical plots and diagrams. Their full-resolution source assets are not yet available through the arXiv endpoints accessible to the automated runner. Do not treat reconstructed SVGs in public/assets/figures/ as original paper figures. Upload the paper PDF/source archive to complete the full extraction.
EOF
