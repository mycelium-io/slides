#!/bin/sh
# SPDX-License-Identifier: Apache-2.0
# Copyright 2026 Mycelium Contributors
#
# Print the workshop cheat sheet (index.html, beside this script) to
# workshop-cheat-sheet.pdf, with a headless Chrome or Chromium.
#
#   sh workshop/cheat-sheet/build.sh
#
# Set CHROME to a browser binary to choose one. Otherwise it uses Google
# Chrome, then the newest Chromium Playwright downloaded.
set -eu
here=$(cd "$(dirname "$0")" && pwd)

if [ -z "${CHROME:-}" ]; then
  for candidate in \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "$(ls -d "$HOME"/Library/Caches/ms-playwright/chromium-*/chrome-mac*/"Google Chrome for Testing.app"/Contents/MacOS/"Google Chrome for Testing" 2>/dev/null | tail -1)" \
    "$(command -v chromium || true)" \
    "$(command -v google-chrome || true)"; do
    if [ -n "$candidate" ] && [ -x "$candidate" ]; then CHROME=$candidate; break; fi
  done
fi
[ -n "${CHROME:-}" ] || { echo "No Chrome or Chromium found; set CHROME to one." >&2; exit 1; }

# The mock keychain keeps the browser out of the system keychain.
"$CHROME" --headless=new --use-mock-keychain --password-store=basic --disable-gpu \
  --no-pdf-header-footer --print-to-pdf="$here/workshop-cheat-sheet.pdf" \
  "file://$here/index.html" >/dev/null 2>&1
echo "Wrote $here/workshop-cheat-sheet.pdf"
