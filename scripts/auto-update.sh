#!/bin/bash
# Harrow Games Auto-Update Script
# Fetches latest match data from Google Sheets and auto-commits if changed.

set -euo pipefail

REPO_DIR="/Users/ryantang/Harrow-Nanning-After-School-Platform"
SCRIPT="$REPO_DIR/scripts/harrow-games-scraper.py"
DATA_FILE="$REPO_DIR/data/harrow-games-data.json"

cd "$REPO_DIR"

# Run the scraper
echo "=== $(date '+%Y-%m-%d %H:%M:%S') Running scraper ==="
/usr/bin/python3 "$SCRIPT" 2>&1

# Check if data changed
if git diff --quiet "$DATA_FILE"; then
    echo "No changes to data. Skipping commit."
    exit 0
fi

# Get match counts for commit message
MATCH_COUNTS=$(/usr/bin/python3 -c "
import json
with open('$DATA_FILE') as f:
    d = json.load(f)
# New scraper output: top-level key = data source name
for k in sorted(d.keys()):
    if isinstance(d[k], dict) and 'matches' in d[k]:
        print(f'{k}:{len(d[k][\"matches\"])} ', end='')
")

echo "Data changed! Committing..."
git add "$DATA_FILE"
git commit -m "auto: update match data [$MATCH_COUNTS]"

# Push to GitHub
git push origin main 2>&1
echo "=== Done ==="