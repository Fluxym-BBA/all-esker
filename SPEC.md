# SPEC all-esker

Exigences non négociables du projet. Toute modification doit les respecter. Si une exigence change, on modifie ce fichier d'abord, avec l'accord de Bruno.

Dernière mesure de l'état réel : 17 octobre 2026, branche `claude/synergies-ux`.

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
3. Dans l'espace Synergies, un clic sur un module le sélectionne et montre l'ensemble de ses interactions avec les autres modules. Il n'ouvre plus la page du module (comportement actuel à corriger : `navGoModule` dans `js/fx-syn.js`).
4. Par défaut, toutes les synergies sont affichées (22). Les synergies majeures (10) restent un filtre optionnel (aujourd'hui le défaut est « majeures », `NAV.scope = "core"`).
5. L'ergonomie de l'espace Synergies est à repenser du point de vue de l'expérience utilisateur : une refonte, pas une rustine. Exprimé le 16 octobre 2026.
6. L'espace Synergies est un univers plein cadre. Le canevas occupe tout le cadre disponible, et toute la fenêtre en plein écran. Les filtres et les commandes flottent dans cet univers : il n'y a plus de console ni de sections empilées autour du schéma. Exprimé le 17 octobre 2026.
7. On se déplace et on zoome librement dans cet univers (molette, glisser, pincement). Les zooms sont fluides et on ne doit jamais se sentir bridé ni voir de barre de défilement. En contrepartie, on ne doit jamais s'y perdre : mini-carte et bouton de recentrage sont toujours accessibles. Exprimé le 17 octobre 2026.

Déduites du code et de l'historique, à confirmer par Bruno :

8. La navigation entre modules reste possible à tout moment depuis la roue et le widget flottant. L'en-tête de la page suite est réduit au fil d'Ariane sur l'onglet Synergies pour laisser la place à l'univers : le titre et la rangée de pastilles de modules y sont masqués.
9. Échap referme d'abord ce qui est ouvert dans l'univers (surimpression, puis sélection, puis plein écran) et ne remonte d'un niveau de navigation que si rien n'est ouvert.
10. Tailles de fenêtre visées : 1512x790 (référence de calibrage de la roue, commit `b21a03a`), 1440x900, 1280x720, 1920x1080.
11. L'accès à la fiche d'un module se fait par un bouton explicite de la fiche flottante, puisque le clic sur le module ne navigue plus.

Question tranchée le 17 octobre 2026 : la liste « Exploration détaillée » n'existe plus. Chaque synergie se lit en la sélectionnant dans l'univers, sa fiche s'affiche en carte flottante. Il n'y a donc plus de liste longue à faire défiler.

## 3. Synergies

- Le dessin d'origine est conservé au pixel près : modules alignés, flux en arcs, pastilles de code, barre IA. La géométrie ne change pas sans accord (`navGeom` dans `js/fx-syn.js`).
- Modèle d'interaction retenu le 17 octobre 2026 : le schéma d'origine dans un univers zoomable, avec un mode focus sur le module sélectionné. Écartés : vue en étoile, matrice, roue d'accords, placement par forces (un placement physique déplacerait les modules à chaque ouverture, alors qu'on doit retrouver le même schéma).
- Ce que fait l'espace :
  - tout est affiché par défaut, les 22 synergies ;
  - clic sur un module : la caméra cadre son voisinage, toutes ses interactions s'allument avec des comètes animées, le reste s'estompe, sa fiche s'ouvre en carte flottante ;
  - un module sélectionné montre l'ensemble de ses interactions, y compris celles hors périmètre « majeures » ;
  - clic sur un flux ou sa pastille : la caméra cadre le flux et ses deux modules, sa fiche complète s'affiche ;
  - clic dans le vide, bouton de recentrage ou Échap : retour à la vue d'ensemble ;
  - commandes flottantes : périmètre (toutes ou majeures), typologies, recherche, réinitialisation, zoom, recentrage, plein écran, mini-carte ;
  - « Seul vs En synergie » (le studio) devient une surimpression, ouverte depuis la fiche d'un module.
- Supprimés par la refonte : la console de filtres en trois lignes, les onglets Schéma / Seul vs synergie / Exploration, la barre de pastilles rapides, le tiroir de détail, la liste d'exploration, le filtre par modules multiples avec déverrouillage (on sélectionne un module en cliquant dessus).
- La surimpression « Seul vs En synergie » peut défiler quand son contenu est long : c'est une fenêtre ouverte à la demande, pas la vue par défaut. Le test ne la couvre pas.

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

## 6. Dette connue

Le ménage du 17 octobre 2026 a supprimé 39 fichiers morts, soit environ 17 Mo : les
19 fichiers de `css/` et `js/` que `index.html` ne chargeait plus, et les 20 copies de
fichiers de `demo/` restées à la racine. Ces copies étaient cassées par construction :
`step1.html` à `step11.html` appellent `../css/esker-fonts.css`, chemin qui ne pointe
nulle part depuis la racine. Un envoi de fichiers par l'interface GitHub ne supprime rien,
c'est ainsi qu'elles s'étaient accumulées.

Vérifications faites avant suppression, à refaire si de nouveaux fichiers sont ajoutés :

- aucun `@import` dans les CSS chargés ;
- aucun chargement dynamique de script, de feuille de style ou de `fetch` dans les JS chargés ;
- les étapes de `demo/steps/` sont chargées dynamiquement par `demo/js/player.js` depuis la
  liste de `demo/js/steps-data.js` : elles sont utilisées et ne doivent pas être supprimées ;
- `demo/data/factures_fournisseurs_filtres.json` est conservé comme source de référence,
  cité en commentaire dans `demo/js/step-enhancer.js`.

Après ce ménage, `index.html` charge exactement les 4 fichiers de `css/` et les 20 fichiers
de `js/` présents dans le dépôt. Un fichier de `css/` ou `js/` qui n'est pas dans
`index.html` est donc une anomalie.

Reste à traiter :

- La trame de fond suit la caméra au moyen des variables CSS `--gs`, `--gx` et `--gy` posées
  par le script. Si l'effet pose problème sur une machine lente, il se désactive en retirant
  `.nv-work::before` dans `css/syn.css`.
- Les fiches produits des modules ne sont pas encore alignées sur les fiches solution
  officielles d'Esker (gabarit : promesse, quatre bénéfices, cinq étapes, fonctionnalités).

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

Le test ouvre un vrai navigateur, parcourt Accueil, La solution et Synergies (S2P et O2C) aux tailles de la section 2, et échoue (code de sortie 1) si l'un de ces points lâche :

- une zone interne défile, ou la page défile ;
- le canevas ne remplit pas son cadre, ou le schéma n'y est pas visible ;
- toutes les synergies ne sont pas affichées par défaut ;
- un clic sur un module ne le sélectionne pas, quitte l'espace Synergies, n'ouvre pas sa fiche, laisse la fiche déborder du cadre, ou n'allume pas toutes ses interactions ;
- la sélection fait apparaître un défilement ;
- le plein écran ne couvre pas la fenêtre, laisse le bandeau par-dessus, ne remplit pas la zone, ou ne se referme pas ;
- une erreur JavaScript survient.

Il lit `CHROME_PATH` si défini, sinon utilise le Chrome installé sur la machine. Dernière exécution : 17 octobre 2026, 52 vérifications, 0 échec.
