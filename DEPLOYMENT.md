# Procédure de déploiement - Todo API

## 1. Prérequis
- Accès au cluster K3S (fichier kubeconfig dans `~/.kube/config`)
- Variables CI/CD configurées dans GitLab : `DOCKERHUB_USER`, `DOCKERHUB_TOKEN`, `KUBE_CONFIG`
- Branche `main` à jour et tests verts en local

## 2. Déploiement (nominal)
1. Merger la branche de feature dans `main` via merge request (après review)
2. Le merge déclenche la pipeline automatiquement
3. Suivre la pipeline : GitLab > CI/CD > Pipelines
4. Stages attendus : test > build > deploy, tous verts

## 3. Vérification
- `kubectl get pods` : tous les pods en Running
- `kubectl rollout status deployment/todo-api` : rollout complete
- `curl http://<adresse>/health` : doit répondre `{"status":"ok"}`
- Dashboard Grafana : pas de pic d'erreurs

## 4. Rollback (si le déploiement casse)
- `kubectl rollout undo deployment/todo-api` : revient à la version précédente
- Vérifier à nouveau avec `kubectl get pods` et le endpoint `/health`
- Prévenir l'équipe sur le canal #incidents

## 5. Contacts
- Responsable déploiement : Nikola Milosavljevic (@Nowalityy)
- Astreinte : Nikola Milosavljevic (@Nowalityy)
