# tpdevops — Todo API Dockerisée

Projet DevOps IPSSI : API REST de gestion de tâches avec Node.js, PostgreSQL, Redis et Docker Compose.

Repository : [github.com/Nowalityy/tpdevops](https://github.com/Nowalityy/tpdevops)

## Objectifs

- API REST CRUD pour les tâches (`/api/tasks`)
- Dockerisation complète (`Dockerfile`, `docker-compose.yml`, `.dockerignore`)
- Persistance PostgreSQL et volumes Docker
- Préparation CI/CD (tests automatisés)

## Gestion de projet (Agile / Kanban solo)

| Colonne | Tâches |
|---------|--------|
| **À faire** | CI/CD GitHub Actions, monitoring |
| **En cours** | — |
| **Terminé** | Partie 1 (exos 1–4), Partie 2 (networks, .env, healthchecks, optimisation) |
| **À faire** | CI/CD GitHub Actions |

Suivi recommandé : [GitHub Projects](https://github.com/Nowalityy/tpdevops/projects) (tableau Kanban).

## Structure du projet

```
.
├── src/
│   ├── routes/tasks.js
│   ├── models/task.js
│   ├── middleware/errorHandler.js
│   ├── db.js
│   └── app.js
├── tests/
│   ├── unit/task.test.js
│   └── integration/api.test.js
├── scripts/
│   ├── exo1-verification.sh
│   ├── exo3-volumes.sh
│   └── partie2/
├── exercises/debug/
├── server.js
├── Dockerfile
├── Dockerfile.unoptimized
├── docker-compose.yml
├── .env.example
└── package.json
```

## Modèle Task

```json
{
  "id": "uuid",
  "title": "string (optionnel)",
  "description": "string",
  "status": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## API — Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/health` | Santé de l'API |
| GET | `/config` | Variables d'environnement (Partie 2) |
| GET | `/db-test` | Test connexion PostgreSQL (Partie 2) |
| POST | `/api/tasks` | Créer une tâche |
| GET | `/api/tasks` | Lister toutes les tâches |
| GET | `/api/tasks/:id` | Voir une tâche |
| PUT | `/api/tasks/:id` | Modifier une tâche |
| DELETE | `/api/tasks/:id` | Supprimer une tâche |

## Prérequis

- Docker Desktop (Docker + Compose)
- Node.js 18+ (développement local optionnel)

## Lancer le projet (Docker Compose)

```bash
cp .env.example .env   # puis adapter les valeurs
docker compose build
docker compose up -d
```

Vérifier :

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/tasks
```

Créer une tâche :

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Tâche persistante","description":"Test persistance","status":"todo"}'
```

## Test de persistance (Exercice pratique 2)

```bash
# Créer une tâche
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Tâche persistante","status":"todo","description":"Survit au restart"}'

# Arrêter TOUT
docker compose down

# Relancer
docker compose up -d

# Les données sont toujours là
curl http://localhost:3000/api/tasks
```

> `docker compose down -v` supprime aussi les volumes nommés → **perte des données**.

## Commandes Docker Compose

```bash
docker compose build    # Construire les images
docker compose up -d    # Démarrer en arrière-plan
docker compose down     # Arrêter les services
docker compose logs api # Voir les logs
```

## Exercices 1 à 3 (scripts)

```bash
bash scripts/exo1-verification.sh   # hello-world, nginx
bash scripts/exo3-volumes.sh        # volume todo-logs
```

Build manuel de l'image :

```bash
docker build -t nowalityy/tpdevops-todo-api:1.0 .
docker run -p 3000:3000 --env-file .env.example nowalityy/tpdevops-todo-api:1.0
```

## Tests

Avec la stack Docker démarrée :

```bash
npm install
npm test
```

Sans base de données (tests unitaires uniquement) :

```bash
SKIP_DB_TESTS=1 npm test
```

> PostgreSQL est exposé sur le port **5433** de l'hôte (`5433:5432`) pour éviter les conflits avec d'autres projets. Redis reste sur le réseau Docker interne uniquement.

## Variables d'environnement

| Variable | Défaut | Description |
|----------|--------|-------------|
| `PORT` | `3000` | Port de l'API |
| `DB_HOST` | `localhost` | Hôte PostgreSQL |
| `POSTGRES_DB` | `todo_db` | Nom de la base |
| `POSTGRES_USER` | `todo_user` | Utilisateur |
| `POSTGRES_PASSWORD` | `todo_pass` | Mot de passe |

## Questions cours — Volumes

**Que se passe-t-il si on supprime le volume ?**  
Les données stockées dedans sont perdues définitivement.

**Différence `-v` vs `--mount` ?**  
`-v` est un raccourci ; `--mount` offre plus d'options (type, options de lecture seule, etc.).

**Pourquoi `./src:/app/src` n'est pas dans `volumes:` en bas ?**  
C'est un bind mount (chemin hôte → conteneur), pas un volume nommé géré par Docker.

## Partie 2 — Approfondissement Docker

### Exercice guidé 1 — Network custom

```bash
bash scripts/partie2/exo1-network-custom.sh
```

### Exercice guidé 2 — Networks dans compose

```bash
bash scripts/partie2/exo2-network-compose.sh
docker compose -f docker-compose.networks-demo.yml down
```

La stack principale utilise `frontend` + `backend` : l'API est sur les deux, PostgreSQL uniquement sur `backend` (non exposé à l'hôte).

### Exercices guidés — Variables d'environnement

```bash
cp .env.example .env
docker compose up -d
curl http://localhost:3000/config
```

### Exercice guidé — Expose vs ports

- API : `ports: "3000:3000"` (accessible depuis l'hôte)
- PostgreSQL : **pas de `ports`** (accessible uniquement via le réseau Docker)
- Test : `curl http://localhost:3000/db-test` OK, `psql -h localhost` échoue (normal)

Pour exposer la BDD en debug : voir `docker-compose.debug-db.yml`.

### Exercices pratiques 3–5 — Debug et optimisation

```bash
# Dockerfiles cassés (exercice 3)
docker build -f exercises/debug/Dockerfile.3-broken -t debug-3 .

# Compose cassé (exercice 4) — corriger DB_HOST=db dans le fichier principal
docker compose -f exercises/debug/docker-compose-broken.yml config

# Challenge optimisation (exercice 5)
bash scripts/partie2/compare-image-sizes.sh
```

## Auteur

Nowalityy — TP DevOps IPSSI
