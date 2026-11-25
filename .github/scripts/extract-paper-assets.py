from pathlib import Path
import fitz, json, re, sys

pdf = Path(sys.argv[1])
out = Path("public/assets/paper-original")
figdir, tabdir = out / "figures", out / "tables"
figdir.mkdir(parents=True, exist_ok=True)
tabdir.mkdir(parents=True, exist_ok=True)
doc = fitz.open(pdf)
manifest = []

for page_index, page in enumerate(doc):
    blocks = sorted(page.get_text("blocks"), key=lambda b: (b[1], b[0]))
    captions = []
    for b in blocks:
        x0, y0, x1, y1, text, *_ = b
        clean = " ".join(text.strip().split())
        m = re.match(r"^(Figure|Table)\s+(\d+)\b", clean)
        if not m or (x1 - x0) < page.rect.width * 0.65:
            continue
        captions.append({"kind": m.group(1).lower(), "number": int(m.group(2)),
                         "bbox": (x0, y0, x1, y1), "caption": clean})

    for i, cap in enumerate(captions):
        x0, y0, x1, y1 = cap["bbox"]
        if cap["kind"] == "figure":
            top = 40 if i == 0 else max(35, captions[i-1]["bbox"][3] - 10)
            bottom = min(page.rect.height - 18, y1 + 5)
        else:
            top = max(35, y0 - 4)
            following = [b[1] for b in blocks if b[1] > y1 + 20]
            bottom = min(page.rect.height - 18, min(following) - 5 if following else y1 + 300)

        clip = fitz.Rect(22, top, page.rect.width - 22, bottom)
        if clip.height < 75:
            clip = fitz.Rect(22, max(35, y0 - 280), page.rect.width - 22,
                             min(page.rect.height - 18, y1 + 5))
        pix = page.get_pixmap(matrix=fitz.Matrix(2.4, 2.4), clip=clip, alpha=False)
        stem = f'{cap["kind"]}-{cap["number"]:03d}-page-{page_index+1:03d}.png'
        target_dir = figdir if cap["kind"] == "figure" else tabdir
        target = target_dir / stem
        pix.save(target)
        manifest.append({"kind": cap["kind"], "number": cap["number"],
                         "page": page_index + 1, "file": str(target),
                         "caption": cap["caption"], "source_pdf": "arXiv:2610.40325v1",
                         "crop": [clip.x0, clip.y0, clip.x1, clip.y1]})

manifest.sort(key=lambda x: (x["kind"], x["number"], x["page"]))
(out / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
lines = ["# Original paper figures and tables", "",
         "Extracted from the complete PDF of arXiv:2610.40325v1 at 2.4x render scale.",
         "Each PNG is a page crop containing the original figure and its caption.", "",
         f'Total assets: {len(manifest)}',
         f'Figures: {sum(x["kind"] == "figure" for x in manifest)}',
         f'Tables: {sum(x["kind"] == "table" for x in manifest)}', "",
         "| Kind | Number | PDF page | Asset |", "|---|---:|---:|---|"]
for x in manifest:
    lines.append(f'| {x["kind"]} | {x["number"]} | {x["page"]} | {Path(x["file"]).name} |')
(out / "README.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
figures = [x for x in manifest if x["kind"] == "figure"]
tables = [x for x in manifest if x["kind"] == "table"]
if len(figures) < 100 or not tables:
    raise SystemExit(f"Extraction incomplete: {len(figures)} figures, {len(tables)} tables")
print(f"Extracted {len(figures)} original figures and {len(tables)} original tables.")
