# CFT — Cameroon Football Talents

Plateforme de scouting professionnel dédiée aux footballeurs camerounais. Vitrine
premium permettant aux recruteurs, clubs, agents et académies du monde entier
d'identifier, comparer et recruter les meilleurs talents du football camerounais.

## Stack technique

- **Next.js 15** (App Router, Server Components, Server Actions)
- **React 19** + **TypeScript**
- **TailwindCSS v4** + composants **shadcn/ui** (Radix UI, écrits à la main)
- **Prisma ORM** + **PostgreSQL**
- **NextAuth v5** (Credentials, sessions JWT, rôles)
- **Recharts** (statistiques, radar de fiche technique, comparateur)
- **Framer Motion** (animations)
- **@react-pdf/renderer** (génération du CV sportif en PDF)
- **Cloudinary** (upload vidéo / photo — intégration prête, clés à renseigner)

## Architecture du projet

```
prisma/
  schema.prisma          Modèle de données complet (23 modèles, PostgreSQL)
  seed.ts                Script de seed (clubs, joueurs, championnats, actualités…)
  seed/                  Données et helpers de seed (noms, clubs, médias placeholder)

src/
  app/
    (site)/              Pages publiques (layout avec Navbar + Footer)
      page.tsx            Landing page
      joueurs/            Répertoire des joueurs + recherche instantanée
      joueurs/[slug]/      Profil joueur (aperçu, stats, fiche technique, vidéos, photos)
      clubs/               Annuaire clubs + fiche club
      championnats/        Championnats (classement, calendrier, statistiques)
      actualites/          Blog / actualités
      comparateur/         Comparateur de joueurs
      recherche/           Recherche avancée multi-critères
      connexion/           Connexion
      inscription/         Inscription (joueur / club / recruteur)
    (dashboard)/          Espace connecté (layout avec sidebar)
      dashboard/           Tableau de bord adaptatif par rôle
      dashboard/profil/    Éditeur de profil joueur / gestion d'effectif club
      messages/            Messagerie interne
      favoris/             Favoris recruteur
      parametres/          Paramètres du compte
    admin/                Back-office administrateur (joueurs, clubs, championnats,
                            actualités, utilisateurs)
    api/
      auth/[...nextauth]/  Route NextAuth
      joueurs/[slug]/cv/   Génération du CV sportif PDF
    sitemap.ts / robots.ts SEO

  components/
    ui/                   Primitives shadcn/ui (button, card, dialog, table…)
    layout/               Navbar, Footer, ThemeProvider, notifications…
    shared/               Composants réutilisables (PlayerCard, Gauge, charts…)

  server/
    queries/              Fonctions de lecture Prisma centralisées par domaine
    actions/               Server Actions (auth, favoris, messages, admin/*…)

  lib/                   utils, validations zod, labels FR, filtres joueurs
  auth.ts / auth.config.ts  Configuration NextAuth (config edge-safe séparée)
  middleware.ts          Protection des routes par rôle
```

### Choix d'architecture notables

- **`auth.config.ts` vs `auth.ts`** : la configuration est scindée pour que le
  `middleware.ts` (exécuté en Edge Runtime sur Vercel) n'importe jamais Prisma
  ni bcrypt, qui ne sont pas compatibles Edge.
- **`server/queries`** centralise toutes les lectures Prisma réutilisées par les
  pages (players, clubs, leagues, news, messages, stats) afin d'éviter toute
  duplication de requêtes.
- **`server/actions`** contient les Server Actions (mutations), organisées par
  domaine, avec un garde `requireAdmin()` dédié pour le back-office.
- **Médias placeholder** : les photos/logos de seed utilisent des services
  publics (DiceBear pour les avatars/logos stylisés, Picsum pour les photos
  d'illustration, échantillons vidéo publics Google) — à remplacer par de vrais
  uploads Cloudinary en production.

## Prise en main

### Prérequis

- Node.js 20+
- PostgreSQL 14+ (local ou hébergé)

### Installation

```bash
npm install
cp .env.example .env   # renseigner DATABASE_URL, AUTH_SECRET, etc.
npm run db:push        # crée le schéma en base
npm run db:seed        # peuple la base avec des données de démonstration
npm run dev
```

L'application est disponible sur http://localhost:3000.

### Comptes de démonstration

Après `npm run db:seed`, le mot de passe de tous les comptes de démo est
`Password123!` :

| Rôle       | Email              |
| ---------- | ------------------- |
| Admin      | admin@cft.cm        |
| Recruteur  | recruteur@cft.cm     |
| Club       | club@cft.cm          |
| Joueur     | joueur@cft.cm        |

### Scripts disponibles

| Commande            | Description                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`        | Serveur de développement                        |
| `npm run build`       | Build de production                             |
| `npm run start`       | Démarre le build de production                 |
| `npm run lint`        | Lint ESLint                                    |
| `npm run db:push`     | Synchronise le schéma Prisma avec la base       |
| `npm run db:migrate`  | Crée une migration Prisma versionnée            |
| `npm run db:seed`     | Peuple la base de données                       |
| `npm run db:studio`   | Ouvre Prisma Studio                             |

## Variables d'environnement

Voir `.env.example`. Les principales :

- `DATABASE_URL` — chaîne de connexion PostgreSQL
- `AUTH_SECRET` — secret NextAuth (`openssl rand -base64 32`)
- `NEXTAUTH_URL` — URL publique de l'application
- `CLOUDINARY_*` / `NEXT_PUBLIC_CLOUDINARY_*` — upload vidéo/photo (optionnel
  en développement ; les formulaires acceptent des URLs directes en attendant)

## Déploiement sur Vercel

1. Créer une base PostgreSQL managée (Vercel Postgres, Neon, Supabase…).
2. Importer le dépôt dans Vercel.
3. Renseigner les variables d'environnement (`DATABASE_URL`, `AUTH_SECRET`,
   `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`, Cloudinary si utilisé).
4. Le script `postinstall` exécute automatiquement `prisma generate`.
5. Après le premier déploiement, exécuter `npx prisma db push` (ou
   `migrate deploy`) puis `npm run db:seed` si besoin, en pointant vers la
   base de production.

## Modèle de données

Le schéma Prisma (`prisma/schema.prisma`) couvre : `User`, `Player`, `Club`,
`League`, `Season`, `Match`, `LeagueStanding`, `PlayerStatistics`,
`TechnicalProfile`, `PlayerVideo`, `PlayerPhoto`, `CareerHistory`, `Transfer`,
`Honor`, `NationalTeam`, `NationalTeamCall`, `Injury`, `Suspension`, `Agent`,
`Academy`, `ScoutReport`, `News`, `Notification`, `Message`, `Favorite`,
`Subscription`, ainsi que les modèles NextAuth (`Account`, `Session`,
`VerificationToken`).

Les rôles (`UserRole`) sont gérés par enum plutôt que par une table `Role`
séparée : plus simple, type-sûr, et suffisant pour les 6 rôles fixes du
cahier des charges (`ADMIN`, `PLAYER`, `CLUB`, `RECRUITER`, `AGENT`,
`ACADEMY`).

## Fonctionnalités

- **Landing page** premium avec statistiques animées, joueurs vedettes,
  meilleurs buteurs/passeurs, dernières vidéos, clubs partenaires,
  témoignages.
- **Répertoire des joueurs** avec recherche et filtres instantanés (nom,
  club, championnat, poste, âge, taille, poids, pied fort, nationalité,
  disponibilité, valeur estimée).
- **Profil joueur** complet : informations générales, biographie, historique
  de carrière, palmarès, sélections nationales, blessures/suspensions,
  transferts, statistiques par saison (graphiques Recharts), fiche technique
  (radar + jauges sur 100), galerie vidéo, galerie photo, téléchargement du
  CV sportif en PDF.
- **Comparateur** de deux joueurs (profil, statistiques, radar technique
  superposé).
- **Recherche avancée** multi-critères professionnelle (poste, âge,
  championnat, matchs joués, pied fort, précision de passes, taille…).
- **Clubs** : annuaire, fiche club (effectif, classement, calendrier,
  palmarès, photos).
- **Championnats** : Elite One, Elite Two, Coupe du Cameroun — classement,
  calendrier, meilleurs buteurs/passeurs.
- **Actualités** : blog avec catégories (transferts, performances,
  sélections, blessures, académies, interviews).
- **Comptes & rôles** : Admin, Joueur, Club, Recruteur (+ Agent, Académie en
  tant qu'entités de données), avec tableau de bord adapté à chaque rôle.
- **Espace joueur** : édition du profil, ajout de vidéos/photos.
- **Espace club** : gestion de l'effectif, informations du club.
- **Espace recruteur** : favoris, recherche avancée, comparateur.
- **Back-office admin** : gestion des joueurs (approbation/rejet/édition),
  clubs (CRUD), championnats, actualités (CRUD + publication), utilisateurs
  (rôles, rattachement club).
- **Messagerie interne** entre recruteurs, clubs, joueurs et administrateurs.
- **Notifications** en base de données avec cloche dans la barre de
  navigation.
- **SEO** : métadonnées par page, sitemap et robots dynamiques, Open Graph.
- **Accessibilité** : navigation clavier, lien d'évitement, labels de
  formulaire, contrastes vérifiés en mode clair/sombre.
- **Dark mode** natif (next-themes) sur l'ensemble de l'application.

## Limites connues / pistes d'évolution

- Les médias de démonstration (photos, logos, vidéos) sont des placeholders
  publics : à remplacer par de vrais uploads Cloudinary/S3 en production
  (les points d'intégration sont prêts dans les formulaires de profil).
- La messagerie est un simple fil de discussion (pas de temps réel/websocket) ;
  une intégration Pusher/Ably serait l'étape suivante pour du live.
- Les paiements/abonnements (`Subscription`) sont modélisés en base mais ne
  sont pas connectés à un fournisseur de paiement (Stripe à intégrer).
