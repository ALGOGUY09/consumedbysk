#!/usr/bin/env bash
set -euo pipefail
# Build step for Cloudflare Pages. Ensures data index and copies JSON under public/.
ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
DATA_SRC_DIR="$ROOT_DIR/data"
ENTRIES_DIR="$DATA_SRC_DIR/entries"
PUBLIC_DIR="$ROOT_DIR/public"
PUBLIC_DATA_DIR="$PUBLIC_DIR/data"

mkdir -p "$PUBLIC_DIR" "$PUBLIC_DATA_DIR/entries"

# Generate data/index.json listing all entry files sorted descending by date
INDEX_FILE="$DATA_SRC_DIR/index.json"
# If there are no entries, produce an empty array
if ls "$ENTRIES_DIR"/*.json >/dev/null 2>&1; then
  printf '[' > "$INDEX_FILE.tmp"
  first=1
  for f in $(ls "$ENTRIES_DIR"/*.json | sort -r); do
    if [ $first -eq 0 ]; then printf ',\n' >> "$INDEX_FILE.tmp"; fi
    printf '"%s"' "$(basename "$f")" >> "$INDEX_FILE.tmp"
    first=0
  done
  printf ']\n' >> "$INDEX_FILE.tmp"
  mv "$INDEX_FILE.tmp" "$INDEX_FILE"
else
  echo '[]' > "$INDEX_FILE"
fi

# Copy data (index + entries) under public/ so Pages serves them
cp -f "$DATA_SRC_DIR/index.json" "$PUBLIC_DATA_DIR/index.json"
cp -f "$ENTRIES_DIR"/*.json "$PUBLIC_DATA_DIR/entries/" 2>/dev/null || true

# Keep a basic robots.txt and sitemap
cat > "$PUBLIC_DIR/robots.txt" <<EOR
User-agent: *
Allow: /
Sitemap: /sitemap.xml
EOR

# Simple sitemap with index page
cat > "$PUBLIC_DIR/sitemap.xml" <<EOS
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>/</loc></url>
</urlset>
EOS

echo "Build complete"
