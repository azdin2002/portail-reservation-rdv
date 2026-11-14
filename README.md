# Portail de réservation de rendez-vous

**Projet DevOps II — Groupe 1**

Faculté Polydisciplinaire de Larache  
Université Abdelmalek Essaâdi

## 1. Présentation du projet

Le Portail de réservation de rendez-vous est une application web permettant aux utilisateurs de consulter les services disponibles, de choisir un créneau et de réserver un rendez-vous sans créer de compte.

Un espace administrateur sécurisé permet de gérer les services et les créneaux de réservation.

## 2. Objectifs du projet

- Consulter les services disponibles.
- Afficher les créneaux de réservation.
- Réserver un rendez-vous sans inscription.
- Retrouver ou annuler une réservation avec un code de confirmation.
- Gérer les services et les créneaux depuis un espace administrateur.
- Automatiser les tests, la construction et le déploiement.
- Déployer et superviser l'application avec Kubernetes et Nagios.

## 3. Architecture technique

| Couche | Technologies |
|---|---|
| Frontend | React, Vite, TypeScript |
| Serveur Web | Nginx |
| Backend | Java 17, Spring Boot 3 |
| API | REST, OpenAPI |
| Base de données | PostgreSQL 16 |
| ORM | Spring Data JPA, Hibernate |
| Migrations | Flyway |
| Tests Backend | JUnit 5, Mockito, Testcontainers |
| Tests Frontend | Vitest, React Testing Library |
| Tests E2E | Playwright |
| Tests de charge | k6 |
| Conteneurisation | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Orchestration | Kubernetes, Minikube |
| Monitoring | Nagios Core |

## 4. Structure du repository

```text
portail-reservation-rdv/
│
├── frontend/                  # Application React
│
├── backend/                   # API Spring Boot
│
├── database/
│   └── migrations/            # Référence des migrations SQL
│
├── devops/
│   ├── docker/                # Docker Compose et configurations
│   ├── nginx/                 # Configuration Nginx
│   ├── kubernetes/            # Manifests Kubernetes
│   └── nagios/                # Configuration Nagios
│
├── docs/
│   ├── architecture/          # Diagrammes et documentation
│   ├── screenshots/           # Captures d'écran
│   └── reports/               # Rapports du projet
│
├── .github/
│   └── workflows/             # Pipelines GitHub Actions
│
├── openapi.yaml               # Contrat API partagé
├── .gitignore
└── README.md
```

## 5. Fonctionnalités principales

### Espace public

- Consultation des services.
- Consultation des créneaux disponibles.
- Réservation sans création de compte.
- Affichage du code de confirmation.
- Consultation d'une réservation avec son code.
- Annulation d'une réservation avec son code.

### Espace administrateur

- Authentification sécurisée.
- Consultation des services.
- Création et modification des services.
- Consultation des créneaux.
- Création et modification des créneaux.

## 6. Contrat API

Le fichier `openapi.yaml`, situé à la racine du repository, constitue le contrat API partagé entre les développeurs Frontend, Backend et les responsables des tests.

Il documente :

- Les endpoints et les méthodes HTTP.
- Les paramètres des requêtes.
- Les DTO (Request et Response).
- Les réponses HTTP et les erreurs.
- Les mécanismes d'authentification.

Toute modification de l'API doit être discutée par l'équipe et répercutée dans `openapi.yaml` avant son intégration via Pull Request.

## 7. Sécurité et cohérence des réservations

- Spring Security pour protéger l'espace administrateur.
- Sessions partagées entre les instances Backend via Spring Session JDBC.
- Protection CSRF pour les opérations authentifiées.
- Génération des codes de confirmation avec `SecureRandom`.
- Stockage uniquement du hash SHA-256 du code en base de données.
- Transactions et verrouillage PostgreSQL pour éviter les doubles réservations.
- Index unique partiel pour garantir l'unicité des réservations confirmées.
- Limitation des requêtes sensibles via Nginx (login, lookup et cancel).

## 8. DevOps et déploiement

Le projet adopte une chaîne DevOps basée sur les outils suivants :

1. **Git et GitHub** : gestion du code source et collaboration.
2. **GitHub Actions** : automatisation des tests et de l'intégration continue.
3. **Docker** : construction et exécution des conteneurs.
4. **Docker Hub** : stockage des images Docker.
5. **Kubernetes / Minikube** : déploiement et orchestration.
6. **HPA** : adaptation automatique du nombre de pods.
7. **Nagios Core** : supervision de l'application et des services.

## 9. Organisation de l'équipe

| Membre | Responsabilité principale |
|---|---|
| Membre 1 | Backend et PostgreSQL |
| Membre 2 | Frontend |
| Membre 3 | Git, Docker et CI/CD |
| Membre 4 | Kubernetes et Nagios |

L'intégration, les tests et la validation finale sont réalisés collectivement.

## 10. Workflow Git

Le projet utilise un workflow Git basé sur les branches :

- `main` : branche stable et protégée.
- `develop` : branche d'intégration, si adoptée par l'équipe.
- `feature/*` : branches dédiées aux fonctionnalités.
- Pull Requests : revue du code et validation avant intégration.

Exemple :

```text
main
 ├── feature/backend-api
 ├── feature/frontend-ui
 ├── feature/docker-cicd
 └── feature/kubernetes-monitoring
```

Chaque membre développe sur sa branche, puis soumet une Pull Request pour intégrer ses modifications.

## 11. Démarrage du projet

Les instructions d'installation et d'exécution seront ajoutées après la mise en place du Frontend, du Backend et de Docker.

Les procédures comprendront notamment :

- Prérequis et installation des dépendances.
- Configuration des variables d'environnement.
- Démarrage de la base de données.
- Exécution du Backend et du Frontend.
- Lancement de l'application avec Docker Compose.

## 12. Documentation

| Ressource | Emplacement |
|---|---|
| Architecture technique | `docs/architecture/` |
| Captures d'écran | `docs/screenshots/` |
| Rapports | `docs/reports/` |
| Contrat API | `openapi.yaml` |
| Documentation générale | `README.md` |

---

**Projet DevOps II — Groupe 1**  
Faculté Polydisciplinaire de Larache  
Université Abdelmalek Essaâdi