#!/bin/bash
# Partie 2 — Exercice pratique 5 : comparer tailles d'images

set -e

cd "$(dirname "$0")/../.."

echo "=== Build version non optimisée (node:18) ==="
docker build -f Dockerfile.unoptimized -t todo-v1-unoptimized .

echo "=== Build version optimisée (multi-stage alpine) ==="
docker build -f Dockerfile -t todo-v2-optimized .

echo ""
echo "=== Comparaison des tailles ==="
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | grep -E "REPOSITORY|todo-v"

echo ""
echo "Gain attendu : ~80-90% de réduction avec Alpine + multi-stage + npm ci"
