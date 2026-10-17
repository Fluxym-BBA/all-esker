// Test d'ergonomie en navigateur réel (voir SPEC.md à la racine du dépôt).
//
// Ce que le test vérifie, pour chaque taille d'écran et chaque vue :
//   1. aucune zone interne ne défile (pas de petit ascenseur, pas de défilement de page) ;
//   2. l'univers des synergies remplit son cadre et affiche toutes les synergies par défaut ;
//   3. un clic sur un module le sélectionne, ouvre sa fiche et n'introduit aucun défilement ;
//   4. le plein écran de l'espace Synergies couvre toute la fenêtre et se referme ;
//   5. aucune erreur JavaScript au chargement.
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
  { hash: '#/suite/s2p/syn', nom: 'Synergies S2P', univers: true },
  { hash: '#/suite/o2c/syn', nom: 'Synergies O2C', univers: true },
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

// L'univers doit remplir son cadre, montrer le schéma et afficher toutes les synergies par défaut.
function mesurerUnivers() {
  const work = document.getElementById('nvWork');
  const svg = document.getElementById('nvSvg');
  if (!work || !svg) return { absent: true };
  const wr = work.getBoundingClientRect(), sr = svg.getBoundingClientRect();
  const noeud = document.querySelector('.nv-node');
  const nr = noeud ? noeud.getBoundingClientRect() : null;
  return {
    total: document.querySelectorAll('.nv-syn').length,
    visibles: document.querySelectorAll('.nv-syn:not(.off)').length,
    canevasPlein: Math.abs(sr.width - wr.width) <= 2 && Math.abs(sr.height - wr.height) <= 2,
    cadre: [Math.round(wr.width), Math.round(wr.height)],
    schemaVisible: !!(nr && nr.width > 8 && nr.right > wr.left + 1 && nr.left < wr.right - 1 && nr.bottom > wr.top + 1 && nr.top < wr.bottom - 1),
  };
}

// Clic sur un module : il passe par les événements pointer, comme un vrai clic.
function cliquerModule(rang) {
  const noeuds = document.querySelectorAll('.nv-node');
  if (!noeuds.length) return { absent: true };
  const cible = noeuds[Math.min(rang, noeuds.length - 1)];
  const r = cible.getBoundingClientRect();
  const o = {
    bubbles: true, cancelable: true, composed: true,
    clientX: r.left + r.width / 2, clientY: r.top + r.height / 2,
    pointerId: 101, pointerType: 'mouse', button: 0, buttons: 1, isPrimary: true,
  };
  cible.dispatchEvent(new PointerEvent('pointerdown', o));
  cible.dispatchEvent(new PointerEvent('pointerup', Object.assign({}, o, { buttons: 0 })));
  return { id: cible.dataset.id };
}

function mesurerSelection(id) {
  const sel = document.querySelector('.nv-node.sel');
  const flot = document.getElementById('nvFloat');
  const work = document.getElementById('nvWork');
  const fr = flot && !flot.hidden ? flot.getBoundingClientRect() : null;
  const wr = work ? work.getBoundingClientRect() : null;
  return {
    selectionne: sel ? sel.dataset.id : null,
    attendu: id,
    ficheOuverte: !!(fr && fr.width > 40 && fr.height > 40),
    ficheDansLeCadre: !!(fr && wr && fr.right <= wr.right + 1 && fr.bottom <= wr.bottom + 1 && fr.top >= wr.top - 1),
    // toutes les interactions du module sélectionné doivent être allumées
    allumes: document.querySelectorAll('.nv-syn.lit').length,
    liens: Array.prototype.filter.call(document.querySelectorAll('.nv-syn'),
      g => g.dataset.from === id || g.dataset.to === id).length,
    // le clic ne doit plus ouvrir la page du module
    route: location.hash,
  };
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
  // le canevas doit remplir la zone plein écran
  const svg = document.getElementById('nvSvg');
  const sr = svg ? svg.getBoundingClientRect() : null;
  const canevasPlein = !!(sr && Math.abs(sr.width - r.width) <= 2 && Math.abs(sr.height - r.height) <= 2);
  // le bandeau du haut doit être recouvert : l'élément au point (centre, 5 px) est dans la zone plein écran
  const dessus = document.elementFromPoint(Math.round(innerWidth / 2), 5);
  const bandeauRecouvert = !!(dessus && zone.contains(dessus));
  bouton.click();
  const sorti = !zone.classList.contains('nv-fs') && !document.body.classList.contains('nv-fs-lock');
  return { couvre, rect, fenetre: [innerWidth, innerHeight], canevasPlein, bandeauRecouvert, sorti };
}

const lancement = await trouverNavigateur();
const navigateur = await puppeteer.launch({ headless: true, ...lancement });
const echecs = [];
let verifications = 0;
const pause = ms => new Promise(r => setTimeout(r, ms));

for (const [largeur, hauteur] of VIEWPORTS) {
  const page = await navigateur.newPage();
  const erreursJs = [];
  page.on('pageerror', e => erreursJs.push(String(e.message || e)));
  await page.setViewport({ width: largeur, height: hauteur });

  for (const route of ROUTES) {
    const etiquette = `${largeur}x${hauteur} | ${route.nom}`;
    await page.goto(BASE + route.hash, { waitUntil: 'domcontentloaded' });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await pause(1500);

    const zones = await page.evaluate(mesurerDefilements);
    verifications++;
    if (zones.length) echecs.push(`${etiquette} : défilement interne : ${zones.join(' ; ')}`);

    if (!route.univers) continue;

    const u = await page.evaluate(mesurerUnivers);
    verifications++;
    if (u.absent) { echecs.push(`${etiquette} : univers des synergies introuvable`); continue; }
    if (!u.canevasPlein) echecs.push(`${etiquette} : le canevas ne remplit pas son cadre (cadre ${u.cadre.join('x')})`);
    if (!u.schemaVisible) echecs.push(`${etiquette} : le schéma n'est pas visible dans le cadre`);
    if (u.visibles !== u.total) echecs.push(`${etiquette} : ${u.visibles} synergies affichées par défaut au lieu de ${u.total}`);

    // sélection d'un module
    const clic = await page.evaluate(cliquerModule, 2);
    await pause(900);
    const s = await page.evaluate(mesurerSelection, clic.id);
    verifications++;
    if (s.selectionne !== clic.id) echecs.push(`${etiquette} : le clic sur un module ne le sélectionne pas (attendu ${clic.id}, obtenu ${s.selectionne})`);
    if (!s.route.endsWith('/syn')) echecs.push(`${etiquette} : le clic sur un module a quitté l'espace Synergies (${s.route})`);
    if (!s.ficheOuverte) echecs.push(`${etiquette} : la fiche flottante du module ne s'ouvre pas`);
    if (!s.ficheDansLeCadre) echecs.push(`${etiquette} : la fiche flottante déborde du cadre`);
    if (s.allumes < s.liens) echecs.push(`${etiquette} : ${s.allumes} interactions allumées sur ${s.liens} pour le module sélectionné`);

    const zones2 = await page.evaluate(mesurerDefilements);
    verifications++;
    if (zones2.length) echecs.push(`${etiquette} : défilement interne après sélection : ${zones2.join(' ; ')}`);

    await page.keyboard.press('Escape');
    await pause(700);

    const pe = await page.evaluate(mesurerPleinEcran);
    verifications++;
    if (pe.absent) echecs.push(`${etiquette} : bouton ou zone de plein écran introuvable`);
    else {
      if (!pe.couvre) echecs.push(`${etiquette} : plein écran ne couvre pas la fenêtre (zone ${pe.rect.join(',')} pour une fenêtre ${pe.fenetre.join('x')})`);
      if (!pe.canevasPlein) echecs.push(`${etiquette} : plein écran, le canevas ne remplit pas la zone`);
      if (!pe.bandeauRecouvert) echecs.push(`${etiquette} : plein écran, le bandeau du haut reste par-dessus`);
      if (!pe.sorti) echecs.push(`${etiquette} : le plein écran ne se referme pas`);
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
