#!/bin/bash
# Partie 2 — Exercice guidé 2 : networks dans docker-compose

set -e

COMPOSE_FILE="docker-compose.networks-demo.yml"

docker compose -f "$COMPOSE_FILE" up -d
sleep 3

echo "=== Networks créés ==="
docker network ls | grep tpdocker || docker network ls | grep frontend

echo "=== nginx peut joindre api ==="
docker compose -f "$COMPOSE_FILE" exec nginx ping -c 2 api

echo "=== nginx ne peut PAS joindre database (isolation attendue) ==="
docker compose -f "$COMPOSE_FILE" exec nginx ping -c 2 database 2>&1 || echo "Isolation OK"

echo "=== api peut joindre database ==="
docker compose -f "$COMPOSE_FILE" exec api ping -c 2 database

echo ""
echo "Nettoyage : docker compose -f $COMPOSE_FILE down"
