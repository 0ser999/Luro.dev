# luro.lol — commandes

Portfolio React + Vite. Le formulaire bilingue se trouve dans la section `#contact`.
Sur Vercel, `api/order.js` expose la fonction Node `/api/order`. En local, Vite branche
le même gestionnaire serveur pour que `npm run dev` serve aussi l'API.

## Configuration

Dans Vercel → projet → Settings → Environment Variables, ajouter :

| Variable | Valeur attendue |
| --- | --- |
| `VITE_TURNSTILE_SITE_KEY` | Site key publique du widget Cloudflare Turnstile |
| `TURNSTILE_SECRET` | Secret du même widget, uniquement côté serveur |
| `DISCORD_WEBHOOK_URL` | URL du webhook du salon de réception |
| `UPSTASH_REDIS_REST_URL` | URL REST d'une base Upstash Redis |
| `UPSTASH_REDIS_REST_TOKEN` | Jeton REST en lecture/écriture de cette base |

Configurer Production et, si nécessaire, Preview/Development. Redéployer après
modification, car Vite intègre la clé publique au build. Ne jamais préfixer les
secrets par `VITE_`. Aucun secret n'est fourni dans les fichiers suivis.

Dans Cloudflare Turnstile, autoriser `luro.lol` ainsi que les autres noms de domaine
réellement utilisés, et `localhost` pour tester avec un vrai widget. Les clés de
test officielles Cloudflare peuvent aussi être utilisées dans `.env.local`
uniquement : https://developers.cloudflare.com/turnstile/troubleshooting/testing/

Vercel : framework **Vite**, build `npm run build`, dossier de sortie `dist`,
Node.js 22 ou 24. Ne pas ajouter de réécriture globale qui masquerait `/api/order`.

## Tester en local

```powershell
npm install
if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
# Renseigner les cinq valeurs dans .env.local, puis :
npm run dev
```

Si `.env.local` existe déjà, le compléter sans le remplacer. Les deux valeurs
Turnstile fournies ont été enregistrées dans ce fichier local ignoré ; il reste
à ajouter le webhook Discord et les deux valeurs Upstash.

Ouvrir http://localhost:5173/#contact. Redémarrer le serveur après modification des
variables. `.env*` est ignoré, avec une exception pour `.env.example` sans valeurs.
`npm run preview` sert uniquement le build statique, sans API ; utiliser `npm run dev`
pour tester le formulaire complet, ou `npx vercel dev` pour l'émulation Vercel.

```powershell
npm test
npm run build
```

Les tests automatisés simulent Cloudflare, Upstash et Discord : ils ne publient
aucun message et n'utilisent aucun secret réel. Un test de réception réel nécessite
de renseigner le webhook et les accès Upstash, puis d'envoyer le formulaire.

### Captcha manquant → 403

Avec le serveur local lancé, exécuter dans un autre terminal :

```powershell
$payload = @{
  name = "Test"
  contact = "@test"
  service = "pc"
  message = "Je souhaite optimiser mon ordinateur."
  website = ""
} | ConvertTo-Json
Invoke-WebRequest -Uri http://localhost:5173/api/order -Method POST -ContentType 'application/json' -Body $payload -SkipHttpErrorCheck
```

Résultat attendu : HTTP **403**, code `CAPTCHA_FAILED`. Aucune variable n'est
nécessaire pour ce test. `-SkipHttpErrorCheck` nécessite PowerShell 7 ; sur
Windows PowerShell 5, l'omettre et constater l'erreur HTTP 403.

Autres vérifications : GET → 405 ; `website` rempli → 200 silencieux ; message de
moins de 20 caractères ou plus de 2 liens avec un jeton présent → 400 ; quatrième
demande avec un captcha frais à chaque fois → 429 et en-tête `Retry-After`.

## Protection et limites

- Nom : 80 caractères ; contact : 200 ; budget : 100 ; message : 20–1 000.
  Le service doit appartenir aux choix autorisés. Taille JSON limitée à 16 Kio.
- Captcha vérifié côté serveur avec le jeton, le secret et l'IP. Un jeton absent,
  expiré, réutilisé ou refusé ne déclenche aucun envoi Discord. Le widget est
  réinitialisé après chaque envoi ; les champs sont conservés en cas d'erreur.
- Upstash Ratelimit applique `slidingWindow(3, "1 h")` à l'empreinte de l'IP.
  Le quota est partagé entre les instances Vercel, sans repli en mémoire.
  L'algorithme utilise une fenêtre glissante approximative. Les personnes derrière
  une même IP partagent le quota. Une tentative vérifiée consomme un créneau,
  même si Discord échoue ensuite. Une panne ou un délai dépassé Upstash bloque
  l'envoi avec une erreur générique 503.
- Embed Discord avec cinq champs, couleur `0x5865F2`, horodatage et mentions
  désactivées. Valeurs plafonnées à 1 024 caractères ; les limites du formulaire
  évitent normalement toute coupure. Aucun jeton ou IP n'est envoyé dans l'embed.
- Les réponses ne contiennent ni secrets ni erreurs internes des prestataires.

Références : [Turnstile serveur](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/),
[Upstash Ratelimit](https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted),
[fonctions Node Vercel](https://vercel.com/docs/functions/runtimes/node-js).

## Fichiers créés ou modifiés

Créés :
- `api/order.js` : point d'entrée Vercel.
- `server/order-handler.js` : validations, Turnstile, quota Upstash et embed Discord.
- `src/components/OrderForm.jsx` : formulaire et cycle de vie du widget.
- `src/order-config.js` : services et limites communs au client et au serveur.
- `tests/order.test.js` : 13 tests serveur, prestataires simulés.
- `.gitignore`, `.env.example`, `.env.local` : configuration et exclusion des secrets.
- `README.md` : configuration, tests et limites.

Modifiés :
- `src/components/Cta.jsx` : insertion du formulaire dans la section contact.
- `src/components/Hero.jsx`, `src/App.jsx` : accès au formulaire depuis les boutons de contact.
- `src/i18n.jsx`, `src/styles.css` : textes français/anglais et styles du formulaire.
- `vite.config.js` : API locale utilisant le même gestionnaire que Vercel.
- `package.json`, `package-lock.json` : dépendances Upstash et commande de test.
