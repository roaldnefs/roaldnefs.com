#!/usr/bin/env bash
# Renders a cover SVG the three ways the site shows it and saves one PNG.
#
#   preview.sh <cover.svg> <out.png> ["Post title"]
#
# Left to right, top to bottom: a blog card, the wide featured card, and the
# top of the post page with its dark overlay and title.
set -euo pipefail

svg="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
out="$2"
title="${3:-A post title that runs onto two lines}"

# A file that is not valid XML renders as a broken-image icon, so catch it here.
if command -v xmllint >/dev/null 2>&1; then
  xmllint --noout "$svg" || { echo "preview.sh: $1 is not valid XML, fix the errors above" >&2; exit 1; }
fi

chrome=""
for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
         "/Applications/Chromium.app/Contents/MacOS/Chromium" \
         google-chrome chromium chromium-browser; do
  if [ -x "$c" ] || command -v "$c" >/dev/null 2>&1; then chrome="$c"; break; fi
done
[ -n "$chrome" ] || { echo "preview.sh: Chrome or Chromium is needed to render the preview" >&2; exit 1; }

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

cat > "$work/sheet.html" <<EOF
<!doctype html><meta charset="utf-8">
<style>
  body { margin: 0; padding: 24px; width: 1440px; background: #04090f; color: #f7f8f8; font: 500 16px/1.5 system-ui, sans-serif; }
  .row { display: flex; gap: 24px; margin-bottom: 24px; }
  .frame { position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,.12); }
  .frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .card { width: 394px; height: 221px; }
  .wide { width: 615px; height: 325px; }
  .tags { position: absolute; top: 16px; right: 0; font-size: 12px; line-height: 22px; text-align: center; }
  .tags span { display: block; padding: 0 12px; background: #7aa2ff; color: #04090f; }
  .tags span + span { background: #fff; color: #000; }
  .hero { width: 1440px; height: 820px; border: 0; }
  .hero::before { content: ""; position: absolute; inset: 0; z-index: 1; background: rgba(0,0,0,.3); }
  .hero::after { content: ""; position: absolute; inset: 50% 0 0; z-index: 1; background: linear-gradient(to top, #04090f, transparent); }
  .hero h1 { position: absolute; z-index: 2; left: 140px; bottom: 150px; max-width: 796px; margin: 0; font-size: 60px; font-weight: 350; line-height: 1.25; }
  .hero p { position: absolute; z-index: 2; left: 140px; bottom: 60px; margin: 0; font-size: 15px; }
</style>
<div class="row">
  <div class="frame card"><img src="file://$svg"><div class="tags"><span>Featured</span><span>Category</span></div></div>
  <div class="frame wide"><img src="file://$svg"></div>
</div>
<div class="frame hero"><img src="file://$svg"><h1>$title</h1><p>Author &nbsp;|&nbsp; Published &nbsp;|&nbsp; Reading time</p></div>
EOF

"$chrome" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --user-data-dir="$work/profile" --window-size=1488,1242 \
  --screenshot="$out" "file://$work/sheet.html" >/dev/null 2>&1

[ -s "$out" ] || { echo "preview.sh: no image was written" >&2; exit 1; }
echo "$out"
