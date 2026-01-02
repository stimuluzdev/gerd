#!/bin/bash
set -e

REPO="stimuluzdev/gerd"
REPO_URL="https://github.com/${REPO}.git"
INSTALL_NAME="gerd"
INSTALL_DIR="${INSTALL_DIR:-$HOME/.local/bin}"

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

echo "🔧 Compiling gerd..."
cd "$TEMP_DIR/cli"

# Cache dependencies
deno cache deps.ts

# Compile to binary (includes import map at compile time)
mkdir -p "$INSTALL_DIR"
deno compile --output "${INSTALL_DIR}/${INSTALL_NAME}" --include . --no-check -A src/main.ts

echo ""
echo "🧹 Cleaning up..."
if [ -d "$TEMP_DIR" ]; then
  rm -rf "$TEMP_DIR"
fi

echo ""
echo "✅ gerd installed successfully!"
echo ""
echo "Installed to: ${INSTALL_DIR}/${INSTALL_NAME}"
echo ""

# Check if INSTALL_DIR is in PATH
if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
  echo "⚠️  Add ${INSTALL_DIR} to your PATH:"
  echo "   export PATH=\"\$PATH:${INSTALL_DIR}\""
  echo ""
  echo "Add this line to ~/.bashrc or ~/.zshrc to make it permanent."
else
  echo "Run 'gerd --help' to get started."
fi
