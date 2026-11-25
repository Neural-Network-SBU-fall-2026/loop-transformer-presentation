#!/usr/bin/env bash
set -euo pipefail
PAPER_ID="2610.40325v1"
BASE="https://arxiv.org/html/\${PAPER_ID}/"
TMP="$(mktemp -d)"
OUT="public/assets/paper-original"
mkdir -p "$OUT"
trap 'rm -rf "$TMP"' EXIT
curl --retry 3 --retry-delay 2 -A "LoopTransformerPresentation/1.0" -fL "$BASE" -o "$TMP/paper.html"
python - "$TMP/paper.html" "$BASE" "$TMP/image-urls.txt" <<'PY'
from html.parser import HTMLParser
from urllib.parse import urljoin
import sys
class Images(HTMLParser):
    def __init__(self):
        super().__init__(); self.urls=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag.lower() in {"img","image"}:
            for key in ("src","data-src","href"):
                value=a.get(key)
                if value and not value.startswith("data:"):
                    self.urls.append(urljoin(sys.argv[2],value))
p=Images()
with open(sys.argv[1],encoding="utf-8") as f: p.feed(f.read())
seen=set()
with open(sys.argv[3],"w") as f:
    for u in p.urls:
        if u not in seen and any(u.lower().split("?")[0].endswith(ext) for ext in (".png",".jpg",".jpeg",".svg",".webp",".gif")):
            seen.add(u); f.write(u+"\n")
print(f"Found {len(seen)} embedded image resources.")
PY
n=0
while IFS= read -r url; do
  [ -n "$url" ] || continue
  name="$(basename "\${url%%\?*}")"
  name="$(printf '%s' "$name" | tr '/ ' '__')"
  curl --retry 3 --retry-delay 1 -A "LoopTransformerPresentation/1.0" -fL "$url" -o "$OUT/$name"
  n=$((n+1))
done < "$TMP/image-urls.txt"
if [ "$n" -eq 0 ]; then
  echo "No embedded figure images found in arXiv HTML." >&2
  exit 1
fi
{
  echo "# Original paper figure assets"
  echo
  echo "Downloaded from the official arXiv HTML rendering for arXiv:\${PAPER_ID}."
  echo "These are original embedded image resources, preserved without visual modification."
  echo
  echo "| Asset | Format |"
  echo "|---|---|"
  find "$OUT" -maxdepth 1 -type f -printf '%f\n' | sort | while read -r f; do
    ext="\${f##*.}"
    echo "| \`$f\` | \`$ext\` |"
  done
} > "$OUT/README.md"
echo "Downloaded $n original paper image assets."
