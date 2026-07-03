# Task API

API REST de gestion de tâches avec authentification JWT et PostgreSQL.

## Stack

- Node.js + Express (ESM)
- PostgreSQL (`pg`)
- JWT (`jsonwebtoken`) + hash bcrypt
- Docker / docker-compose

## Endpoints

| Méthode | Route          | Auth | Description              |
|---------|----------------|------|---------------------------|
| POST    | /auth/register | non  | Créer un compte           |
| POST    | /auth/login    | non  | Se connecter (retourne un JWT) |
| GET     | /tasks         | oui  | Lister ses tâches         |
| POST    | /tasks         | oui  | Créer une tâche           |
| PATCH   | /tasks/:id     | oui  | Modifier une tâche        |
| DELETE  | /tasks/:id     | oui  | Supprimer une tâche       |

Auth via header `Authorization: Bearer <token>`.

## Lancer avec Docker

```bash
docker compose up --build
```

L'API est disponible sur `http://localhost:3000`, la table est créée automatiquement au démarrage de Postgres (`src/db/schema.sql`).

## Lancer en local (sans Docker)

```bash
cp .env.example .env
npm install
npm run dev
```

Nécessite une instance PostgreSQL locale et les tables créées via `src/db/schema.sql`.
