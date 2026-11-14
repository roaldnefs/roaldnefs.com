#!/usr/bin/env bash
# Builds the site into a temporary directory and checks the SEO, GEO and
# analytics output. Usage: scripts/check-seo.sh
set -euo pipefail

cd "$(dirname "$0")/.."
out="$(mktemp -d)"
trap 'rm -rf "$out"' EXIT

hugo --quiet --destination "$out"

python3 - "$out" <<'EOF'
import glob, html, json, os, re, sys

out = sys.argv[1]
failures = []

def check(ok, message):
    if not ok:
        failures.append(message)

def read(path):
    with open(os.path.join(out, path), encoding="utf-8") as f:
        return f.read()

def meta(page, attr, name):
    m = re.search(r'<meta %s="%s" content="([^"]*)"' % (attr, re.escape(name)), page)
    return html.unescape(m.group(1)) if m else None

def json_ld(page):
    blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', page, re.S)
    return [json.loads(b) for b in blocks]

def types(page):
    return [b.get("@type") for b in json_ld(page)]

site_default = meta(read("404.html"), "name", "description")

posts = sorted(glob.glob(os.path.join(out, "posts", "*", "*", "*", "index.html")))
check(len(posts) >= 14, "expected at least 14 posts, found %d" % len(posts))

seen = {}
for path in posts:
    rel = os.path.relpath(path, out)
    page = read(rel)
    desc = meta(page, "name", "description")
    check(desc, "%s: no meta description" % rel)
    check(desc != site_default, "%s: meta description is the site default" % rel)
    check(desc not in seen, "%s: same meta description as %s" % (rel, seen.get(desc)))
    seen[desc] = rel
    check(desc and len(desc) <= 165, "%s: meta description longer than 165 characters" % rel)
    check(meta(page, "property", "og:description") == desc, "%s: og:description differs from meta description" % rel)
    check(meta(page, "property", "og:image"), "%s: no og:image" % rel)
    check(meta(page, "property", "article:published_time"), "%s: no article:published_time" % rel)
    try:
        found = types(page)
        check("BlogPosting" in found, "%s: no BlogPosting JSON-LD" % rel)
        check("BreadcrumbList" in found, "%s: no BreadcrumbList JSON-LD" % rel)
    except ValueError as e:
        check(False, "%s: JSON-LD does not parse: %s" % (rel, e))
    check(os.path.exists(os.path.join(os.path.dirname(path), "index.md")), "%s: no Markdown version" % rel)
    check('type="text/markdown"' in page, "%s: no link to the Markdown version" % rel)

home = read("index.html")
try:
    found = types(home)
    check("WebSite" in found and "Person" in found, "home: WebSite and Person JSON-LD expected, found %s" % found)
except ValueError as e:
    check(False, "home: JSON-LD does not parse: %s" % e)
check(meta(home, "property", "og:description") == meta(home, "name", "description"), "home: og:description differs from meta description")

robots = read("robots.txt")
check("Sitemap: https://roaldnefs.com/sitemap.xml" in robots, "robots.txt: no Sitemap line")
for bot in ("GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"):
    check("User-agent: %s" % bot in robots, "robots.txt: no group for %s" % bot)
check("Disallow: /" not in robots, "robots.txt: blocks crawling")

check(os.path.exists(os.path.join(out, "llms.txt")), "llms.txt missing")
if os.path.exists(os.path.join(out, "llms.txt")):
    check("/index.md" in read("llms.txt"), "llms.txt: posts do not link to their Markdown versions")

term = read("categories/hardware-hacking/index.html")
h1 = re.search(r"<h1[^>]*>(.*?)</h1>", term, re.S).group(1).strip()
check(h1 != "Blog", "category page h1 is still 'Blog'")
check(meta(term, "name", "description") != site_default, "category page uses the site default description")

for kind in ("tags", "categories"):
    check(not os.path.exists(os.path.join(out, kind, "index.html")), "/%s/ index page still built" % kind)

not_found = read("404.html")
check(meta(not_found, "name", "robots") == "noindex", "404: no noindex")
check('rel="canonical"' not in not_found, "404: has a canonical link")

for path in glob.glob(os.path.join(out, "**", "*.html"), recursive=True):
    page = read(os.path.relpath(path, out))
    check("googletagmanager.com" not in page, "%s: loads Google Analytics without consent" % os.path.relpath(path, out))
check("data-consent" in home, "home: no consent banner")
check("G-H1NMFLLZ06" in home, "home: GA4 measurement ID not passed to the page")

for f in failures:
    print("FAIL " + f)
print("%d check(s) failed" % len(failures) if failures else "all checks passed")
sys.exit(1 if failures else 0)
EOF
