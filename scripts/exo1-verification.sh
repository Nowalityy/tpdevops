#!/bin/bash
# Exercice 1 — Vérification Docker + hello-world + nginx

set -e

echo "=== docker --version ==="
docker --version

echo ""
echo "=== docker compose version ==="
docker compose version

echo ""
echo "=== docker run hello-world ==="
docker run --rm hello-world

echo ""
echo "=== docker run nginx (port 8080) ==="
docker rm -f tpdevops-nginx-demo 2>/dev/null || true
docker run -d --name tpdevops-nginx-demo -p 8080:80 nginx:alpine
sleep 2
echo "Test curl :"
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:8080/ || true
curl -s http://localhost:8080/ | head -3

echo ""
echo "Pour arrêter nginx : docker stop tpdevops-nginx-demo && docker rm tpdevops-nginx-demo"
