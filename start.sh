#!/usr/bin/env bash
# ==============================================================================
# One-Command Launcher for Regulatory OS (Linux, macOS, GitHub Codespaces)
# ==============================================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

echo "=========================================================="
echo " 🏛️  Starting Maharashtra Jurisdiction Intelligence OS"
echo "=========================================================="

node scripts/run.js dev
