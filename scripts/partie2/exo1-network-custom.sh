#!/bin/bash
# Partie 2 — Exercice guidé 1 : network custom

set -e

NETWORK="app-network"

echo "=== Création du network $NETWORK ==="
docker network create "$NETWORK" 2>/dev/null || echo "Network déjà existant"

echo "=== Conteneur serveur ==="
docker rm -f serveur client isole 2>/dev/null || true
docker run -dit --name serveur --network "$NETWORK" alpine sh
docker exec serveur apk add --no-cache curl iputils

echo "=== Conteneur client ==="
docker run -dit --name client --network "$NETWORK" alpine sh
docker exec client apk add --no-cache curl iputils

echo "=== Test communication (ping serveur depuis client) ==="
docker exec client ping -c 3 serveur

echo "=== Inspection du network ==="
docker network inspect "$NETWORK" --format '{{range .Containers}}{{.Name}} {{end}}'

echo "=== Test isolation (autre network) ==="
docker network create other-network 2>/dev/null || true
docker run -dit --name isole --network other-network alpine sh
docker exec client ping -c 1 isole 2>&1 || echo "Isolation OK : isole inaccessible depuis client"

echo ""
echo "Nettoyage : docker stop serveur client isole && docker rm serveur client isole"
echo "            docker network rm $NETWORK other-network"
