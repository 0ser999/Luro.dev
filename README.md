# luro.lol — commandes payées avec Stripe

Portfolio React + Vite, formulaire français/anglais dans `#contact`.

## Parcours

1. Le client choisit une prestation, fournit son nom, son **email obligatoire**, son message et, éventuellement, son pseudo Discord.
2. `POST /api/order` valide les champs, le honeypot, Turnstile et le quota Upstash (3 ouvertures de paiement par heure/IP).
3. Le serveur prend le tarif dans `src/order-config.js`, sauvegarde le brief dans Redis et crée une session **Stripe Checkout hébergée**. Il n'envoie encore aucun message Discord.
4. Le client paie sur Stripe. Le site ne collecte aucune donnée de carte bancaire.
5. `POST /api/stripe-webhook` vérifie la signature sur le corps brut, récupère la session chez Stripe et vérifie le paiement, le montant, la devise et la référence de commande avant d'envoyer l'embed Discord.
6. Le retour du client consulte `GET /api/order-status`. Un simple `?payment=success` n'est jamais une preuve de paiement. L'envoi fonctionne même si le client ferme l'onglet après paiement.

Aucun Payment Link ni produit Stripe à créer à la main : le serveur construit les lignes de paiement. Aucune clé publique Stripe n'est nécessaire pour cette redirection.

## Tarifs proposés en EUR

| Prestation | Prix |
| --- | ---: |
| Optimisation complète Windows + BIOS | 90 € |
| Optimisation Windows | 50 € |
| Réglages BIOS | 40 € |
| Miniature | 20 € |
| Bannière | 25 € |
| Affiche / visuel | 35 € |
| Retouche photo | 25 € |
| Maquette Figma, un écran | 60 € |
| Identité visuelle, kit avatar + bannière + palette | 75 € |

Windows 50 € + BIOS 40 € = pack complet 90 €. Les autres tarifs sont une proposition modifiable. Toutes les valeurs sont en centimes dans `src/order-config.js`, utilisées par le formulaire et le serveur. Une commande correspond à une prestation. Pas de coupon, conversion automatique, abonnement ou taxe supplémentaire configuré dans cette intégration.

## Configuration Vercel

Framework **Vite**, build `npm run build`, dossier `dist`, Node.js 22 ou 24.
Ajouter ces variables dans Settings → Environment Variables, puis redéployer :

| Variable | Valeur |
| --- | --- |
| `VITE_TURNSTILE_SITE_KEY` | Site key publique Turnstile |
| `TURNSTILE_SECRET` | Secret du même widget |
| `DISCORD_WEBHOOK_URL` | Webhook du salon de commandes |
| `UPSTASH_REDIS_REST_URL` | URL REST Upstash Redis |
| `UPSTASH_REDIS_REST_TOKEN` | Token REST en lecture/écriture |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe du mode utilisé : test ou production |
| `STRIPE_WEBHOOK_SECRET` | Secret de signature de la destination webhook correspondante |
| `SITE_URL` | `https://luro.lol` en production, adresse locale exacte en développement |

Ne jamais préfixer les secrets par `VITE_`. `.env*` est ignoré, sauf `.env.example` qui ne contient aucune valeur. `.env.local` contient déjà les deux valeurs Turnstile fournies ; compléter les champs restants sans écraser ce fichier.

Dans Stripe Workbench → Webhooks, créer une destination :

- URL : `https://luro.lol/api/stripe-webhook`
- Événements : `checkout.session.completed` et `checkout.session.async_payment_succeeded`
- Reporter son secret `whsec_…` dans `STRIPE_WEBHOOK_SECRET`.

Ne pas mélanger les clés et destinations des modes test et production. Autoriser la destination Stripe à atteindre `/api/stripe-webhook` si la protection des déploiements Vercel est activée. Ne pas ajouter de réécriture globale qui masque les routes `/api/…`.

Dans Cloudflare, autoriser `luro.lol` et les hôtes de développement utilisés. Pour les tests locaux, utiliser si nécessaire les [clés de test officielles Turnstile](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) uniquement dans l'environnement local.

## Test local

```powershell
npm install
if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
# Compléter .env.local ; SITE_URL doit correspondre au port réellement lancé.
npm run dev
```

Dans un autre terminal, avec le [Stripe CLI officiel](https://docs.stripe.com/stripe-cli) installé et connecté en mode test :

```powershell
stripe listen --events checkout.session.completed,checkout.session.async_payment_succeeded --forward-to http://localhost:5173/api/stripe-webhook
```

Copier le secret de signature affiché par le CLI dans `.env.local`, puis redémarrer Vite. Utiliser la clé secrète Stripe de test. Ouvrir le formulaire, remplir un brief et suivre Stripe Checkout avec les données de carte de test officielles de Stripe. Une confirmation du webhook doit envoyer un embed dans le salon Discord configuré : utiliser un salon de test.

Si Vite choisit 5174 car 5173 est occupé, adapter `SITE_URL` et `--forward-to` à 5174. `npm run preview` sert uniquement les fichiers statiques, sans les API ; utiliser `npm run dev` ou `npx vercel dev` pour le parcours complet.

```powershell
npm test
npm run build
```

Les 24 tests automatisés simulent les prestataires et ne créent aucun paiement ou message réel. Ils couvrent notamment : email requis, captcha absent/refusé, validation, limite de débit, prix calculé côté serveur, paiement impayé, signature Stripe invalide, mauvais montant/devise, événements concurrents et répétés, reprise après erreur Discord et statut sans données personnelles.

### Captcha manquant → HTTP 403

```powershell
curl.exe -i -X POST http://localhost:5173/api/order -H "Content-Type: application/json" --data "{}"
```

Résultat attendu : HTTP **403**, `CAPTCHA_FAILED`. Sans appel Stripe ou Discord.

## Persistance et limites

- Nom : 80 caractères ; email : 254 avec validation de format ; Discord facultatif : 100 ; message : 20–1 000 caractères et au maximum deux liens. JSON plafonné à 16 Kio.
- Le serveur ignore tout montant/devise envoyé par le navigateur et prend le prix du catalogue. Le montant payé doit correspondre à l'instantané enregistré lors de la création du paiement, même si les prix du catalogue changent ensuite.
- Les commandes et le statut d'envoi sont conservés 30 jours dans Upstash, avec expiration automatique. Les métadonnées Stripe ne contiennent que l'identifiant de commande. Les coordonnées et le brief restent dans Redis et le salon Discord après paiement.
- Le brouillon est conservé dans le `sessionStorage` de l'onglet pendant au plus une heure, puis effacé après confirmation. Une annulation restitue les champs si le stockage du navigateur est disponible.
- La session de paiement expire après une heure. Une tentative validée consomme le quota même si elle est abandonnée. Upstash Ratelimit utilise une fenêtre glissante approximative partagée entre instances ; aucun repli en mémoire et refus 503 si le quota ne peut pas être vérifié.
- Un verrou Redis et le statut persistant empêchent les doublons pour les relectures normales et les appels concurrents. Stripe reçoit une erreur 500 si Discord ou Redis échoue pour permettre ses nouvelles tentatives. Surveiller les échecs dans Workbench et renvoyer l'événement après réparation.
- Discord ne propose pas d'envoi de webhook transactionnel avec Redis. Si le processus s'arrête juste après l'envoi Discord, avant l'enregistrement du succès, un nouvel essai peut créer un doublon. La référence de commande dans l'embed permet de le repérer ; ne pas traiter deux fois une même référence.
- Une confirmation en attente ne doit jamais inviter à repayer. Le paiement confirmé reste affiché comme reçu même si la transmission Discord doit être réessayée.

## Fichiers de cette évolution

Créés : `server/payments.js`, `server/stripe-handlers.js`, `api/stripe-webhook.js`, `api/order-status.js`, `src/components/ServicePicker.jsx`, `src/components/PaymentReturn.jsx`, `tests/payments.test.js`.

Modifiés : `src/order-config.js`, `src/components/OrderForm.jsx`, `src/i18n.jsx`, `src/styles.css`, `server/order-handler.js`, `tests/order.test.js`, `vite.config.js`, `package.json`, `package-lock.json`, `.env.example`, `.env.local`, `README.md`.

Références : [Stripe Checkout](https://docs.stripe.com/payments/checkout/how-checkout-works?payment-ui=stripe-hosted), [confirmation de commande](https://docs.stripe.com/checkout/fulfillment?payment-ui=stripe-hosted), [signature des webhooks](https://docs.stripe.com/webhooks/signature), [Vercel Node.js](https://vercel.com/docs/functions/runtimes/node-js).
