// ============================================================
//  STAGES DATA  –  Stades de Terraformation
//  Source : wiki officiel – Planète Prime
// ============================================================

// Valeurs en Ti brut (ex: 175 kTi = 175 000)
const STAGES = [
  {
    number: 1,
    nameEn: 'Barren',
    nameFr: 'Planète morte',
    ti: 0,
    skyColor: 0x1a0a2e,   // violet nuit
    fogColor: 0x1a0a2e,
    terrainColor: 0x8B6914,
    description: 'La planète est totalement stérile. Pas d\'atmosphère, pas de vie.',
    icon: '💀',
  },
  {
    number: 2,
    nameEn: 'Blue Sky',
    nameFr: 'Ciel bleu',
    ti: 175_000,            // 175 kTi
    skyColor: 0x1a3a6e,
    fogColor: 0x1a3a6e,
    terrainColor: 0x8B6914,
    description: 'L\'atmosphère commence à se former. Le ciel prend une teinte bleutée.',
    icon: '🌌',
  },
  {
    number: 3,
    nameEn: 'Clouds',
    nameFr: 'Nuages',
    ti: 350_000,            // 350 kTi
    skyColor: 0x2255aa,
    fogColor: 0x334466,
    terrainColor: 0x9B7614,
    description: 'Des nuages apparaissent, signe que l\'atmosphère s\'épaissit.',
    icon: '☁️',
  },
  {
    number: 4,
    nameEn: 'Rain',
    nameFr: 'Pluie',
    ti: 875_000,            // 875 kTi
    skyColor: 0x334466,
    fogColor: 0x445577,
    terrainColor: 0xAB7624,
    description: 'Les premières pluies tombent sur la surface.',
    icon: '🌧️',
  },
  {
    number: 5,
    nameEn: 'Liquid Water',
    nameFr: 'Eau liquide',
    ti: 3_000_000,          // 3 MTi
    skyColor: 0x224488,
    fogColor: 0x335577,
    terrainColor: 0x7B8B5A,
    description: 'De l\'eau liquide apparaît à la surface de la planète.',
    icon: '💧',
  },
  {
    number: 6,
    nameEn: 'Lakes',
    nameFr: 'Lacs',
    ti: 50_000_000,         // 50 MTi
    skyColor: 0x225599,
    fogColor: 0x336688,
    terrainColor: 0x6B8B4A,
    description: 'Des lacs se forment dans les dépressions du terrain.',
    icon: '🌊',
  },
  {
    number: 7,
    nameEn: 'Moss',
    nameFr: 'Mousse',
    ti: 200_000_000,        // 200 MTi
    skyColor: 0x335533,
    fogColor: 0x446644,
    terrainColor: 0x5B7B3A,
    description: 'Les premières traces de vie végétale : de la mousse couvre les rochers.',
    icon: '🌿',
  },
  {
    number: 8,
    nameEn: 'Flora',
    nameFr: 'Flore',
    ti: 700_000_000,        // 700 MTi
    skyColor: 0x336644,
    fogColor: 0x447755,
    terrainColor: 0x4B6B2A,
    description: 'Des plantes et des fleurs colonisent la surface.',
    icon: '🌺',
  },
  {
    number: 9,
    nameEn: 'Trees',
    nameFr: 'Arbres',
    ti: 2_000_000_000,      // 2 GTi
    skyColor: 0x2d6b3a,
    fogColor: 0x3d7b4a,
    terrainColor: 0x3B5B1A,
    description: 'Les premiers arbres poussent, transformant le paysage.',
    icon: '🌲',
  },
  {
    number: 10,
    nameEn: 'Insects',
    nameFr: 'Insectes',
    ti: 8_000_000_000,      // 8 GTi
    skyColor: 0x3d7b4a,
    fogColor: 0x4d8b5a,
    terrainColor: 0x2B4B0A,
    description: 'Des insectes apparaissent, commençant à polliniser les plantes.',
    icon: '🦋',
  },
  {
    number: 11,
    nameEn: 'Breathable Atmosphere',
    nameFr: 'Atmosphère respirable',
    ti: 32_000_000_000,     // 32 GTi
    skyColor: 0x4488bb,
    fogColor: 0x5599cc,
    terrainColor: 0x1B3B0A,
    description: 'L\'atmosphère est désormais respirable sans équipement spécial !',
    icon: '💨',
  },
  {
    number: 12,
    nameEn: 'Fish',
    nameFr: 'Poissons',
    ti: 120_000_000_000,    // 120 GTi
    skyColor: 0x5599cc,
    fogColor: 0x66aadd,
    terrainColor: 0x0B2B0A,
    description: 'Les océans et lacs se peuplent de poissons.',
    icon: '🐠',
  },
  {
    number: 13,
    nameEn: 'Amphibians',
    nameFr: 'Amphibiens',
    ti: 425_000_000_000,    // 425 GTi
    skyColor: 0x4488bb,
    fogColor: 0x5599cc,
    terrainColor: 0x0A2A0A,
    description: 'Des grenouilles et amphibiens colonisent les zones humides.',
    icon: '🐸',
  },
  {
    number: 14,
    nameEn: 'Mammals',
    nameFr: 'Mammifères',
    ti: 1_250_000_000_000,  // 1.25 TTi
    skyColor: 0x44aadd,
    fogColor: 0x55bbee,
    terrainColor: 0x0A200A,
    description: 'Les premiers mammifères apparaissent sur la planète.',
    icon: '🦊',
  },
  {
    number: 15,
    nameEn: 'Complete Terraformation',
    nameFr: 'Terraformation complète',
    ti: 4_000_000_000_000,  // 4 TTi
    skyColor: 0x88ccff,
    fogColor: 0x99ddff,
    terrainColor: 0x0A1A0A,
    description: 'La planète est entièrement terraformée ! Mission accomplie.',
    icon: '🌍',
  },
];

// ─── Helper : obtenir le stade actuel selon le Ti ──────────
function getCurrentStage(ti) {
  let current = STAGES[0];
  for (const stage of STAGES) {
    if (ti >= stage.ti) current = stage;
    else break;
  }
  return current;
}

// ─── Helper : obtenir le prochain stade ────────────────────
function getNextStage(ti) {
  for (const stage of STAGES) {
    if (ti < stage.ti) return stage;
  }
  return null; // terraformation complète
}

// ─── Helper : progression vers le prochain stade (0–1) ────
function getStageProgress(ti) {
  const current = getCurrentStage(ti);
  const next    = getNextStage(ti);
  if (!next) return 1;
  return (ti - current.ti) / (next.ti - current.ti);
}

// ─── Formater le Ti en notation lisible ───────────────────
function formatTi(ti) {
  if (ti >= 1e12)  return (ti / 1e12).toFixed(2)  + ' TTi';
  if (ti >= 1e9)   return (ti / 1e9).toFixed(2)   + ' GTi';
  if (ti >= 1e6)   return (ti / 1e6).toFixed(2)   + ' MTi';
  if (ti >= 1e3)   return (ti / 1e3).toFixed(1)   + ' kTi';
  return Math.floor(ti) + ' Ti';
}

// ─── Formater le Ti/s ─────────────────────────────────────
function formatTiRate(tiPerSec) {
  if (tiPerSec >= 1e9)  return (tiPerSec / 1e9).toFixed(2)  + ' GTi/s';
  if (tiPerSec >= 1e6)  return (tiPerSec / 1e6).toFixed(2)  + ' MTi/s';
  if (tiPerSec >= 1e3)  return (tiPerSec / 1e3).toFixed(1)  + ' kTi/s';
  return tiPerSec.toFixed(1) + ' Ti/s';
}
