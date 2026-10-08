# Esker en vidéo — Fluxym

Page vitrine publique présentant en vidéo chaque module de la suite Esker
(Source-to-Pay et Order-to-Cash), destinée aux prospects et clients Fluxym.

**Démo :** https://fluxym-bba.github.io/all-esker/

## Mise en ligne (GitHub Pages)

1. Déposer `index.html` à la racine du dépôt `Fluxym-BBA/all-esker`.
2. `Settings` → `Pages` → **Source : Deploy from a branch** → branche `main`, dossier `/ (root)`.
3. La page est publiée sous 1 à 2 minutes sur `https://fluxym-bba.github.io/all-esker/`.

## Contenu

- **Une roue unique** reprenant la représentation de la page *Videos-Esker-Consensus*,
  avec les 13 modules Esker répartis sur les deux suites, le socle plateforme
  (AI Agents, B2B Payments, Connectivity Suite, Unified UX, Datalake, ISO 27001)
  et la pastille Synergy AI.
- **10 vidéos** hébergées sur le CDN HubSpot de Fluxym, lues en lecteur HTML5 natif.
- **4 modules O2C** sans vidéo (Credit Management, Customer Inquiry Management,
  Order Management, Claims & Deductions) : visuel dédié + descriptif + badge
  « Vidéo disponible très bientôt ».
- **Formulaire de contact HubSpot** strictement identique à celui de
  `fluxym.com/nous-contacter` (portal `26096000`, form `b3d5e891-…`).

## Personnaliser

Tout est dans `index.html`, sans dépendance à builder.

### Ajouter une vidéo à un module

Dans le tableau `M` (début du `<script>`), repérer le module et compléter `videos` :

```js
{id:"om", suite:"O2C", label:"Order Management", icon:"📦", c:"#F5A623",
 desc:"…",
 videos:[{t:"Présentation globale du module Order Management", sz:"310 Mo",
          u:F_O2C+"Pr%C3%A9sentation%20globale%20du%20module%20Order%20Management.mp4"}]},
```

- `F_O2C` / `F_S2P` sont les deux dossiers du CDN HubSpot.
- Le nom de fichier doit être **URL-encodé** (espaces → `%20`, `é` → `%C3%A9`).
- Un module bascule automatiquement de « Bientôt » à « vidéo disponible »
  dès que `videos` n'est plus vide. Les compteurs de la roue et du bandeau
  se recalculent seuls.

### Remplacer l'image d'attente des 4 modules O2C

Le visuel d'attente est généré en CSS dans le bloc `.soonbox`. Pour utiliser
une vraie image, remplacer le contenu de `soonbox` par :

```html
<div class="soonbox"><img src="assets/order-management.jpg" alt="Order Management"></div>
```

### Image de couverture des vidéos

Les posters sont générés à la volée par `posterFor()` (SVG en data-URI,
dégradé bleu Fluxym + nom du module). Pour un visuel sur mesure, remplacer
l'attribut `poster` du `<video>` par une image du dépôt.

## Lien profond

On peut pointer directement vers un module : `index.html#m=ap`
(`ap`, `pr`, `so`, `sm`, `ctm`, `em`, `id`, `ca`, `com`, `crm`, `cim`, `om`, `cd`).

## Point d'attention

Les fichiers MP4 pèsent entre **264 Mo et 742 Mo** (≈ 4,4 Go au total).
La page utilise `preload="none"` : rien n'est téléchargé avant un clic sur
« Lire ». Une recompression (H.264 CRF 24, 1080p) permettrait de descendre
sous 50 Mo par vidéo sans perte visible et améliorerait nettement l'expérience,
notamment en mobile.

## Charte

Couleurs et typographies extraites du thème officiel `fluxym.com` :
`#163467` (dark blue), `#13b4e2` (blue), `#6b51ed` (purple rain),
`#f0f6f8` (light blue), `#ffcf63` (sunlight) — Miriam Libre + Barlow.
