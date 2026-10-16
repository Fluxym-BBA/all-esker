// Test d'ergonomie en navigateur réel (voir SPEC.md à la racine du dépôt).
//
// Ce que le test vérifie, pour chaque taille d'écran et chaque vue :
//   1. aucune zone interne ne défile (pas de petit ascenseur, pas de défilement de page) ;
//   2. le plein écran de l'espace Synergies couvre toute la fenêtre ;
//   3. aucune erreur JavaScript au chargement.
//
// Utilisation :
//   python3 -m http.server 8123          (depuis la racine du dépôt, dans un autre terminal)
//   cd tests && npm install && node ergonomie.mjs http://127.0.0.1:8123/
//
// Navigateur : variable CHROME_PATH si définie, sinon Chrome ou Chromium installé sur la machine,
// sinon le Chromium du paquet @sparticuz/chromium s'il est présent (Linux).
// Code de sortie : 0 si tout passe, 1 sinon.

import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || 'http://127.0.0.1:8123/';

// Tailles de fenêtre visées. 1512x790 vient du calibrage de la roue (commit b21a03a), à confirmer.
const VIEWPORTS = [[1512, 790], [1440, 900], [1280, 720], [1920, 1080]];

// Vues qui doivent tenir sans aucun défilement interne.
const ROUTES = [
  { hash: '#/', nom: 'Accueil' },
  { hash: '#/solution', nom: 'La solution' },
  { hash: '#/suite/s2p/syn', nom: 'Synergies S2P', plein: true },
  { hash: '#/suite/o2c/syn', nom: 'Synergies O2C', plein: true },
];

async function trouverNavigateur() {
  if (process.env.CHROME_PATH) return { executablePath: process.env.CHROME_PATH, args: ['--no-sandbox'] };
  const candidats = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  ];
  const local = candidats.find(p => fs.existsSync(p));
  if (local) return { executablePath: local, args: ['--no-sandbox'] };
  try {
    const mod = await import('@sparticuz/chromium');
    const chromium = mod.default;
    return { executablePath: await chromium.executablePath(), args: [...chromium.args, '--no-sandbox'], headless: 'shell' };
  } catch {
    throw new Error('Aucun navigateur trouvé. Définir CHROME_PATH ou installer Chrome.');
  }
}

function mesurerDefilements() {
  const zones = [];
  document.querySelectorAll('*').forEach(e => {
    const cs = getComputedStyle(e);
    if (!/(auto|scroll)/.test(cs.overflowY + cs.overflowX)) return;
    const r = e.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    const vertical = e.scrollHeight > e.clientHeight + 1;
    const horizontal = e.scrollWidth > e.clientWidth + 1;
    if (!vertical && !horizontal) return;
    zones.push(
      e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + '.' + String(e.className).trim().split(/\s+/).slice(0, 2).join('.')
      + ' (visible ' + e.clientHeight + ' px, contenu ' + e.scrollHeight + ' px)'
    );
  });
  const d = document.documentElement;
  if (d.scrollHeight > d.clientHeight + 1) zones.push('page entière (visible ' + d.clientHeight + ' px, contenu ' + d.scrollHeight + ' px)');
  return zones;
}

function mesurerPleinEcran() {
  const bouton = document.getElementById('nvFsBtn');
  const zone = document.getElementById('nvWork');
  if (!bouton || !zone) return { absent: true };
  bouton.click();
  const r = zone.getBoundingClientRect();
  const couvre = Math.round(r.x) <= 1 && Math.round(r.y) <= 1
    && Math.round(r.width) >= innerWidth - 2 && Math.round(r.height) >= innerHeight - 2;
  const rect = [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)];
  // le schéma ne doit pas être écrasé : sa zone doit au moins contenir tout le dessin
  const schema = document.getElementById('nvSvg'), scene = document.querySelector('.nv-stage');
  const schemaRogne = !!(schema && scene && scene.getBoundingClientRect().height + 1 < schema.getBoundingClientRect().height);
  // le bandeau du haut doit être recouvert : l'élément au point (centre, 5 px) est dans la zone plein écran
  const dessus = document.elementFromPoint(Math.round(innerWidth / 2), 5);
  const bandeauRecouvert = !!(dessus && zone.contains(dessus));
  bouton.click();
  const sorti = !zone.classList.contains('nv-fs') && !document.body.classList.contains('nv-fs-lock');
  return { couvre, rect, fenetre: [innerWidth, innerHeight], schemaRogne, bandeauRecouvert, sorti };
}

const lancement = await trouverNavigateur();
const navigateur = await puppeteer.launch({ headless: true, ...lancement });
const echecs = [];
let verifications = 0;

for (const [largeur, hauteur] of VIEWPORTS) {
  const page = await navigateur.newPage();
  const erreursJs = [];
  page.on('pageerror', e => erreursJs.push(String(e.message || e)));
  await page.setViewport({ width: largeur, height: hauteur });

  for (const route of ROUTES) {
    const etiquette = `${largeur}x${hauteur} | ${route.nom}`;
    await page.goto(BASE + route.hash, { waitUntil: 'domcontentloaded' });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));

    const zones = await page.evaluate(mesurerDefilements);
    verifications++;
    if (zones.length) echecs.push(`${etiquette} : défilement interne : ${zones.join(' ; ')}`);

    if (route.plein) {
      const pe = await page.evaluate(mesurerPleinEcran);
      verifications++;
      if (pe.absent) echecs.push(`${etiquette} : bouton ou zone de plein écran introuvable`);
      else {
        if (!pe.couvre) echecs.push(`${etiquette} : plein écran ne couvre pas la fenêtre (zone ${pe.rect.join(',')} pour une fenêtre ${pe.fenetre.join('x')})`);
        if (pe.schemaRogne) echecs.push(`${etiquette} : plein écran, le schéma est rogné (zone plus basse que le dessin)`);
        if (!pe.bandeauRecouvert) echecs.push(`${etiquette} : plein écran, le bandeau du haut reste par-dessus`);
        if (!pe.sorti) echecs.push(`${etiquette} : le plein écran ne se referme pas`);
      }
    }
  }

  verifications++;
  if (erreursJs.length) echecs.push(`${largeur}x${hauteur} : erreurs JavaScript : ${erreursJs.join(' ; ')}`);
  await page.close();
}

await navigateur.close();

console.log(`${verifications} vérifications, ${echecs.length} échec(s)`);
for (const e of echecs) console.log('ÉCHEC  ' + e);
if (!echecs.length) console.log('OK');
process.exit(echecs.length ? 1 : 0);
