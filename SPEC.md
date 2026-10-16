# SPEC all-esker

Exigences non négociables du projet. Toute modification doit les respecter. Si une exigence change, on modifie ce fichier d'abord, avec l'accord de Bruno.

Dernière mesure de l'état réel : 16 octobre 2026, commit `e3ecd8f`.

## 1. Nature du projet

- Site vitrine Esker × Fluxym (Source-to-Pay et Order-to-Cash), publié sur GitHub Pages : https://fluxym-bba.github.io/all-esker/
- Statique : pas de build, pas de bundler. Chemins relatifs uniquement.
- Application à écran unique avec routeur par hash (`#/`, `#/solution`, `#/suite/<s2p|o2c>/<onglet>`, `#/m/<id>`, `#/fluxym`).
- Fichiers réellement chargés par `index.html` : `css/wheel.css`, `css/xp-kit.css`, `css/syn.css`, `css/app.css` et les scripts `js/*` listés dans `index.html`.
- `demo/` est un sous-projet autonome (lecteur de démonstration interactive). Il ne se mélange pas avec le site principal.

## 2. Ergonomie

Exprimées par Bruno :

1. Une vue tient dans la fenêtre. Pas de petite zone à ascenseur interne, pas de défilement de la page. Priorité du moment : l'ergonomie des interactions entre modules.
2. Le plein écran de l'espace Synergies fonctionne et couvre toute la fenêtre.

Déduites du code et de l'historique, à confirmer par Bruno :

3. La navigation entre modules reste possible à tout moment depuis la roue et le widget flottant.
4. Le plein écran se quitte par le bouton et par Échap (comportement actuel : si une synergie est sélectionnée, le premier appui la désélectionne).
5. Tailles de fenêtre visées : 1512x790 (référence de calibrage de la roue, commit `b21a03a`), 1440x900, 1280x720, 1920x1080.

Question ouverte à trancher : la vue « Exploration » de l'espace Synergies (liste détaillée des fiches) peut-elle défiler, puisqu'une liste longue est faite pour ça ? Tant que ce n'est pas tranché, le test ne vérifie que la vue Schéma, ouverte par défaut.

## 3. Synergies

- Le schéma d'origine est conservé : modules alignés, flux en arcs, pastilles de code, barre IA.
- La mécanique d'origine est conservée : console de filtres, sélection d'un ou plusieurs modules avec déverrouillage, typologies, périmètre majeures ou toutes, sens amont et aval, survol, tiroir de détail, studio « Seul vs En synergie », exploration, plein écran.
- La géométrie du schéma ne change pas sans accord. On change l'usage et l'affichage, pas le dessin.

## 4. Contenu et charte

- Charte Fluxym : variables de couleur de `css/app.css`, typographies Miriam Libre (titres) et Barlow (textes). Fonds clairs, pas de fonds sombres.
- Les chiffres et exemples viennent uniquement des decks et documents fournis par Bruno. Aucun chiffre inventé.
- Aucun nom de client ni de société concurrente issu des slides marquées INTERNE sur le site public.
- Aucun tiret cadratin dans les sources.

## 5. Règles de travail

- Aucune écriture directe sur `main`. Chaque intervention passe par une branche `claude/<sujet>`, que Bruno valide avant fusion.
- Aucun changement n'est déclaré validé sans exécution du test d'ergonomie en navigateur réel (section 7). Sans exécution, la mention est « non vérifié ».
- Chaque compte rendu sépare : confirmé, probable, non vérifié.
- Les dépôts de référence de Bruno restent en lecture seule. Seul `all-esker` est modifié.
- Les messages de commit disent ce qui a changé et comment ça a été vérifié.

## 6. Dette connue (mesurée le 16 octobre 2026)

Non corrigée pour l'instant, à traiter sur validation de Bruno.

- 19 fichiers CSS et JS ne sont plus chargés par `index.html` : `css/base.css`, `css/main.css`, `css/module.css`, `css/o2c-enrich.css`, `css/o2c-xp.css`, `css/s2p.css`, `css/suites.css`, `css/synergy-agent.css`, `css/xp.css`, `js/app.js`, `js/fluxym-services.js`, `js/main.js`, `js/module.js`, `js/o2c-xp.js`, `js/panel.js`, `js/s2p.js`, `js/suites.js`, `js/synergy-agent.js`, `js/xp.js`. Un envoi de fichiers par l'interface GitHub ne supprime rien : les « à supprimer » des anciens manifestes n'ont jamais été appliqués.
- À la racine du dépôt, des copies de fichiers de `demo/` ne sont chargées ni par le site ni par la démo. `step1.html` à `step11.html`, `esker-fonts.css` et `steps-data.js` sont identiques à leurs copies de `demo/`. `in-place-states.js`, `player.js`, `player.css`, `step-enhancer.js` et `step-enhancer.css` diffèrent de leurs copies de `demo/` : ne rien supprimer avant d'avoir déterminé la version de référence.
- `README.md` est périmé (il décrit l'ancienne page unique).

## 7. Lancer le test d'ergonomie

Depuis la racine du dépôt, dans un premier terminal :

```
python3 -m http.server 8123
```

Dans un second terminal :

```
cd tests
npm install
node ergonomie.mjs http://127.0.0.1:8123/
```

Le test ouvre un vrai navigateur, parcourt Accueil, La solution et Synergies (S2P et O2C) aux tailles de la section 2, et échoue (code de sortie 1) si une zone interne défile, si le plein écran ne couvre pas la fenêtre ou si une erreur JavaScript survient. Il lit `CHROME_PATH` si défini, sinon utilise le Chrome installé sur la machine.
