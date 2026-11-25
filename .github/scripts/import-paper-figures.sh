#!/usr/bin/env bash
set -euo pipefail
PAPER_ID="2610.40325v1"
TMP="$(mktemp -d)"
OUT="public/assets/paper-original"
mkdir -p "$OUT"
trap 'rm -rf "$TMP"' EXIT
curl --retry 4 --retry-delay 3 -fL "https://export.arxiv.org/e-print/\${PAPER_ID}" -o "$TMP/source"
if tar -tf "$TMP/source" >/dev/null 2>&1; then
  mkdir "$TMP/unpacked"
  tar -xf "$TMP/source" -C "$TMP/unpacked"
elif unzip -t "$TMP/source" >/dev/null 2>&1; then
  mkdir "$TMP/unpacked"
  unzip -q "$TMP/source" -d "$TMP/unpacked"
else
  echo "Unrecognized arXiv source archive format" >&2
  exit 1
fi
find "$TMP/unpacked" -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.svg' -o -iname '*.webp' -o -iname '*.pdf' -o -iname '*.eps' \) -print0 |
while IFS= read -r -d '' f; do
  rel="\${f#"$TMP/unpacked"/}"
  safe="$(printf '%s' "$rel" | tr '/ ' '__')"
  cp "$f" "$OUT/$safe"
done
count="$(find "$OUT" -maxdepth 1 -type f | wc -l | tr -d ' ')"
if [ "$count" -eq 0 ]; then
  echo "No source figure assets found in arXiv source archive" >&2
  exit 1
fi
{
  echo "# Original paper figure assets"
  echo
  echo "Extracted from the official arXiv source archive for arXiv:\${PAPER_ID}."
  echo "Files are preserved in their source formats; filenames are flattened to avoid collisions."
  echo
  echo "| Asset | Format |"
  echo "|---|---|"
  find "$OUT" -maxdepth 1 -type f -printf '%f\n' | sort | while read -r f; do
    ext="\${f##*.}"
    echo "| \`$f\` | \`$ext\` |"
  done
} > "$OUT/README.md"
echo "Extracted $count original graphic assets."
