#!/bin/bash
set -Eeuo pipefail

cd "$(dirname "$0")/.."

echo "Starting backend server on port 3001..."
node server.js
