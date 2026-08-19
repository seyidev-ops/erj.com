#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────
#  Rebuild every static article page from the seeds in blog.html.
#
#  RUN THIS AFTER ADDING OR EDITING ANY POST IN blog.html.
#  An article whose static page does not exist publishes to an address
#  that returns 404, and Google never sees it.
#
#      ./rebuild-blog.sh
#
#  Then commit and push. Nothing here touches the publish schedule —
#  each article still appears on the site on its own date.
# ─────────────────────────────────────────────────────────────────────
set -e
cd "$(dirname "$0")"
echo "── reading seeds from blog.html"
node gen-blog.js
echo "── building article pages"
node build-posts.js
echo "── building the /blog/ archive"
node build-archive.js
echo "── syncing blog.html link map and sitemap"
python3 sync-blog-index.py
echo "── folding product.css into the pages that use it"
python3 inline-css.py > /dev/null
echo "── validating"
python3 validate.py
