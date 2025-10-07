# Honey API

Backend API pour la boutique Honey Shop, développée avec [NestJS](https://nestjs.com/) et [Prisma](https://www.prisma.io/) sur PostgreSQL.

## Fonctionnalités

- Authentification JWT (utilisateur, admin)
- Gestion des utilisateurs (CRUD)
- Gestion des produits (CRUD + upload d'image)
- Gestion des commandes (CRUD)
- Rôles et permissions (admin/client)
- Seed et migration de la base de données

## Structure du projet

```
.env
src/
  app.module.ts
  main.ts
  auth/
  users/
  products/
  orders/
  prisma/
prisma/
  schema.prisma
  migrations/
uploads/
```

## Installation

1. **Cloner le repo**
   ```sh
   git clone https://github.com/Safidy-Michael/honey-api
   cd honey-api
   ```

2. **Installer les dépendances**
   ```sh
   npm install
   ```

3. **Configurer la base de données**
   - Modifier `.env` avec tes identifiants PostgreSQL.

4. **Lancer les migrations**
   ```sh
   npx prisma migrate deploy
   ```

5. **Générer le client Prisma**
   ```sh
   npx prisma generate
   ```

6. **Seeder un admin**
   ```sh
   npm run seed
   ```

## Démarrage

- **Développement**
  ```sh
  npm run start:dev
  ```
- **Production**
  ```sh
  npm run build
  npm run start:prod
  ```

## Endpoints principaux

- `POST /auth/register` : Inscription
- `POST /auth/login` : Connexion
- `GET /auth/profile` : Profil utilisateur (JWT requis)
- `GET /products` : Liste des produits
- `POST /products/upload` : Ajouter un produit avec image
- `GET /orders` : Liste des commandes (admin)
- etc.

## Tests Prisma

Pour tester la connexion à la base :
```sh
ts-node src/test-prisma.ts
```

## Licence

MIT

---

Pour plus d'infos, voir la documentation des fichiers :
- [src/app.module.ts](src/app.module.ts)
- [prisma/schema.prisma](prisma/schema.prisma)