#!/bin/bash
# Exercice 3 — Volumes basiques (todo-logs partagé)

set -e

VOLUME_NAME="todo-logs"
WRITER="todo-writer"
READER="todo-reader"

echo "=== Création du volume $VOLUME_NAME ==="
docker volume create "$VOLUME_NAME"

echo ""
echo "=== Conteneur écrivain ==="
docker rm -f "$WRITER" "$READER" 2>/dev/null || true
docker run --rm --name "$WRITER" -v "$VOLUME_NAME:/data" node:22-alpine sh -c '
  echo "mon premier log" > /data/first_log.log
  echo "mon second log: $(date)" > /data/second_log.log
  ls -la /data
'

echo ""
echo "=== Conteneur lecteur ==="
docker run --rm --name "$READER" -v "$VOLUME_NAME:/data" node:22-alpine sh -c '
  echo "--- first_log.log ---"
  cat /data/first_log.log
  echo "--- second_log.log ---"
  cat /data/second_log.log
'

echo ""
echo "=== Nouveau conteneur après suppression (persistance du volume) ==="
docker run --rm -v "$VOLUME_NAME:/data" node:22-alpine cat /data/first_log.log

echo ""
echo "Volume $VOLUME_NAME conservé. Pour supprimer : docker volume rm $VOLUME_NAME"
