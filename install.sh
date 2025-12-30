#!/bin/bash
set -e

REPO="stimuluz/gerd"
REPO_URL="https://github.com/${REPO}.git"
INSTALL_NAME="gerd"

echo "📦 Installing gerd CLI..."
echo ""

# Check if Deno is installed
if ! command -v deno &> /dev/null; then
  echo "❌ Deno is not installed."
  echo ""
  echo "Install Deno first:"
  echo "  curl -fsSL https://deno.land/install.sh | sh"
  echo ""
  echo "Or visit: https://deno.land/#installation"
  exit 1
fi

echo "✓ Deno found: $(deno --version | head -n 1)"

# Create temp directory
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

echo "📥 Downloading gerd source..."
git clone --depth 1 "$REPO_URL" "$TEMP_DIR" 2>/dev/null || {
  echo "Falling back to archive download..."
  curl -sL "https://github.com/${REPO}/archive/refs/heads/main.tar.gz" | tar -xz -C "$TEMP_DIR" --strip-components=1
}

echo "🔧 Installing gerd..."
cd "$TEMP_DIR/cli"
deno install -A -f -g --name "$INSTALL_NAME" --import-map import_map.json src/main.ts

echo ""
echo "✅ gerd installed successfully!"
echo ""
echo "Run 'gerd --help' to get started."
