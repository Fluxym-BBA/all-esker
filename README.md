# all-esker

Site vitrine Esker × Fluxym : les 13 modules des suites Source-to-Pay et Order-to-Cash,
leurs interactions, et une démonstration interactive.

Publié sur GitHub Pages : https://fluxym-bba.github.io/all-esker/

## Ce que c'est

Une application à écran unique, statique : pas de build, pas de bundler, pas de dépendance
externe. Chemins relatifs uniquement, pour fonctionner sous le sous-dossier de GitHub Pages.

La navigation se fait par routeur à hash :

| Route | Écran |
|---|---|
| `#/` | Accueil, trois portes d'entrée |
| `#/enjeux` | Enjeux métier |
| `#/solution` | La roue des 13 modules |
| `#/suite/s2p/<onglet>` | Suite Source-to-Pay |
| `#/suite/o2c/<onglet>` | Suite Order-to-Cash |
| `#/m/<id>` | Fiche d'un module |
| `#/fluxym` | Fluxym |

Onglets d'une suite : `syn` (univers des synergies), `duo` (seul ou en suite), `ia`,
et `budget` pour S2P uniquement.

## Organisation

```
index.html          la seule page du site, elle liste les CSS et JS chargés
css/                app.css, syn.css, wheel.css, xp-kit.css
js/                 données (data, suites-data, module-data, o2c-data, fiches)
                    et vues (fx-*.js), plus wheel.js et xp-kit.js
assets/             captures d'écran et illustrations
demo/               sous-projet autonome : lecteur de démonstration interactive en 11 étapes
tests/              test d'ergonomie en navigateur réel
SPEC.md             les exigences du projet, à lire avant toute modification
```

`index.html` est la référence : un fichier CSS ou JS qui n'y figure pas n'est pas chargé.
`demo/` ne se mélange pas avec le site principal et a ses propres CSS et JS.

## Modifier le site

1. Lire `SPEC.md`. Les exigences d'ergonomie y sont non négociables.
2. Travailler sur une branche `claude/<sujet>`, jamais directement sur `main`.
3. Lancer le test d'ergonomie avant de proposer la fusion.
4. Changer le paramètre `?v=` des fichiers modifiés dans `index.html`, sinon les
   navigateurs servent l'ancienne version depuis leur cache.

## Lancer en local

```
python3 -m http.server 8123
```

Puis ouvrir http://127.0.0.1:8123/

## Lancer le test d'ergonomie

Dans un second terminal, le serveur ci-dessus étant démarré :

```
cd tests
npm install
node ergonomie.mjs http://127.0.0.1:8123/
```

Le test ouvre un vrai navigateur et échoue si une zone défile, si le plein écran ne couvre
pas la fenêtre, si la sélection d'un module ne se comporte pas comme prévu, ou si une
erreur JavaScript survient. Détail dans `SPEC.md`, section 7.

## Publication

GitHub Pages publie la branche `main` à la racine. Une fusion dans `main` met le site en
ligne en une à deux minutes.
