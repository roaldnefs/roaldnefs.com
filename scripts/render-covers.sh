#!/usr/bin/env bash
# Renders the generated cover SVGs of a built site to 1200x630 PNG files next
# to them, for link previews: social platforms do not show SVG images.
# Usage: scripts/render-covers.sh <site directory>
set -euo pipefail

site="$(cd "$1" && pwd)"

chrome="${CHROME:-$(command -v google-chrome || true)}"
chrome="${chrome:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
if [ ! -x "$chrome" ]; then
    echo "render-covers: Chrome not found, set CHROME to its path" >&2
    exit 1
fi

for svg in "$site"/covers/*.svg; do
    png="${svg%.svg}.png"
    "$chrome" --headless --no-sandbox --hide-scrollbars --window-size=1200,630 \
        --screenshot="$png" "file://$svg" >/dev/null 2>&1
    if [ ! -s "$png" ]; then
        echo "render-covers: could not render $svg" >&2
        exit 1
    fi
done
