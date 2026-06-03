# Partie 2 — Exercices debug

## Exercice pratique 3 — Dockerfiles

| Fichier | Problème | Correction |
|---------|----------|------------|
| `Dockerfile.1-broken` | `CMD npm start` (forme shell, signaux mal gérés) | `CMD ["node", "server.js"]` |
| `Dockerfile.2-broken` | `COPY . .` avant `npm install` | Copier `package*.json` d'abord |
| `Dockerfile.3-broken` | Image `node:18` complète (~900 Mo) | `node:18-alpine` + multi-stage |

```bash
docker build -f exercises/debug/Dockerfile.1-broken -t debug-1 .
docker build -f exercises/debug/Dockerfile.3-broken -t debug-3 .
docker images debug-3
```

## Exercice pratique 4 — docker-compose

```bash
# Cassé (DB_HOST incorrect)
docker compose -f exercises/debug/docker-compose-broken.yml up

# Corrigé : utiliser docker-compose.yml à la racine
docker compose up -d
```

**Erreur :** `DB_HOST=postgres` alors que le service s'appelle `db`. Docker DNS utilise le **nom du service**.

## Exercice pratique 5 — Optimisation

```bash
bash scripts/partie2/compare-image-sizes.sh
```
