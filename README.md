# tpdevops — Partie 1 Docker (exercices 1 à 3)

Projet DevOps : fondations Docker, API Node.js dockerisée, volumes partagés.


## Prérequis

- Docker Desktop (ou Docker Engine)
- Node.js 18+
- Git

## Exercice 1 — Installation et premiers conteneurs

```bash
docker --version
docker compose version
docker run hello-world
```

Nginx en conteneur :

```bash
docker run -d --name tpdevops-nginx-demo -p 8080:80 nginx:alpine
curl http://localhost:8080
docker stop tpdevops-nginx-demo && docker rm tpdevops-nginx-demo
```

Script automatisé :

```bash
bash scripts/exo1-verification.sh
```

## Exercice 2 — API Node.js dockerisée

### En local (sans Docker)

```bash
npm install
npm start
curl http://localhost:3000/health
```

### Build et run Docker

```bash
docker build -t nowalityy/tpdevops-node-api:1.0 .
docker images
docker run -d --name tpdevops-api -p 3000:3000 nowalityy/tpdevops-node-api:1.0
curl http://localhost:3000/health
docker ps
docker stop tpdevops-api && docker rm tpdevops-api
```

Mapping de ports (exemple cours : hôte 5000 → conteneur 3000) :

```bash
docker run -d --name tpdevops-api -p 5000:3000 nowalityy/tpdevops-node-api:1.0
curl http://localhost:5000/health
```

## Exercice 3 — Volumes basiques

```bash
bash scripts/exo3-volumes.sh
```

Avec `docker-compose` et volume externe :

```bash
docker volume create todo-logs
docker compose up -d --build
docker compose down
```

Les logs dans `todo-logs` persistent après suppression des conteneurs.

## Structure

```
.
├── index.js
├── package.json
├── Dockerfile
├── .dockerignore
├── docker-compose.yml
├── scripts/
│   ├── exo1-verification.sh
│   └── exo3-volumes.sh
└── README.md
```

## Auteur

Nowalityy — TP DevOps IPSSI
