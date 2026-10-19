#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
node -e 'if (+process.versions.node.split(".")[0] < 22) throw new Error("Node.js 22+ required")'
if ! command -v pdftoppm >/dev/null || ! command -v tesseract >/dev/null || ! tesseract --list-langs 2>/dev/null | grep -qx ita; then
  if [ "$(id -u)" = 0 ]; then
    apt-get update
    apt-get install -y poppler-utils tesseract-ocr tesseract-ocr-ita
  else
    sudo apt-get update
    sudo apt-get install -y poppler-utils tesseract-ocr tesseract-ocr-ita
  fi
fi
npm --prefix backend ci
# Nessuno scrape/import nel setup: avvio manuale dall'orchestratore.
