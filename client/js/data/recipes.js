// ============================================================
//  RECIPES  –  Toutes les recettes de craft du Planet Crafter
//  Format : { id, ingredients: {itemId: qty}, qty, craftTime(s), station, unlock }
// ============================================================

const RECIPES = {

  // ═══════════════════════════════════════════════════════════
  //  COMPOSANTS INDUSTRIELS (Craft Station de base)
  // ═══════════════════════════════════════════════════════════

  // Barreaux
  iridium_rod: {
    id: 'iridium_rod', name: 'Barreau Iridium', icon: '🔧',
    ingredients: { iridium: 2 }, qty: 1, craftTime: 2, station: 'basic',
  },
  uranium_rod: {
    id: 'uranium_rod', name: 'Barreau Uranium', icon: '🔧',
    ingredients: { uranium: 2 }, qty: 1, craftTime: 2, station: 'basic',
  },
  super_alloy_rod: {
    id: 'super_alloy_rod', name: 'Barreau Super Alliage', icon: '🔧',
    ingredients: { super_alloy: 2 }, qty: 1, craftTime: 2, station: 'basic',
  },
  osmium_rod: {
    id: 'osmium_rod', name: 'Barreau Osmium', icon: '🔧',
    ingredients: { osmium: 2 }, qty: 1, craftTime: 2, station: 'basic',
  },

  // Circuit et composants avancés
  circuit_board: {
    id: 'circuit_board', name: 'Circuit électronique', icon: '📟',
    ingredients: { silicon: 2, cobalt: 1, aluminum: 2 }, qty: 1, craftTime: 3, station: 'basic',
  },
  rocket_engine: {
    id: 'rocket_engine', name: 'Moteur fusée', icon: '🚀',
    ingredients: { iron: 5, titanium: 3, aluminum: 3, sulfur: 2 }, qty: 1, craftTime: 5, station: 'basic',
  },
  rocket_engine_t2: {
    id: 'rocket_engine_t2', name: 'Moteur fusée T2', icon: '🚀',
    ingredients: { rocket_engine: 1, super_alloy: 3, iridium: 2 }, qty: 1, craftTime: 8, station: 'advanced',
  },
  fusion_cell: {
    id: 'fusion_cell', name: 'Cellule Fusion', icon: '⚡',
    ingredients: { uranium_rod: 2, osmium_rod: 1, circuit_board: 3 }, qty: 1, craftTime: 10, station: 'advanced',
  },
  super_alloy: {
    id: 'super_alloy', name: 'Super Alliage', icon: '✨',
    ingredients: { aluminum: 3, titanium: 2, magnesium: 2 }, qty: 2, craftTime: 4, station: 'basic',
  },

  // ═══════════════════════════════════════════════════════════
  //  BIO LAB (nécessite le BioLab)
  // ═══════════════════════════════════════════════════════════
  fertilizer: {
    id: 'fertilizer', name: 'Engrais T1', icon: '🌱',
    ingredients: { bacteria: 2, sulfur: 1 }, qty: 1, craftTime: 5, station: 'biolab',
  },
  fertilizer_t2: {
    id: 'fertilizer_t2', name: 'Engrais T2', icon: '🌱',
    ingredients: { fertilizer: 2, phosphorus: 2, bacteria: 3 }, qty: 1, craftTime: 8, station: 'biolab',
  },
  fertilizer_t3: {
    id: 'fertilizer_t3', name: 'Engrais T3', icon: '🌱',
    ingredients: { fertilizer_t2: 2, zeolite: 2, selenium: 2 }, qty: 1, craftTime: 12, station: 'biolab',
  },
  fabric: {
    id: 'fabric', name: 'Tissu', icon: '🧵',
    ingredients: { silk: 2, bacteria: 1 }, qty: 2, craftTime: 4, station: 'biolab',
  },
  smart_fabric: {
    id: 'smart_fabric', name: 'Tissu intelligent', icon: '🧶',
    ingredients: { fabric: 3, circuit_board: 1, zeolite: 2 }, qty: 1, craftTime: 8, station: 'biolab',
  },
  bioplastic: {
    id: 'bioplastic', name: 'Bioplastique', icon: '🟩',
    ingredients: { bacteria: 3, algae: 2 }, qty: 2, craftTime: 3, station: 'biolab',
  },
  explosive_pwd: {
    id: 'explosive_pwd', name: 'Poudre explosive', icon: '💥',
    ingredients: { sulfur: 4, phosphorus: 2 }, qty: 1, craftTime: 3, station: 'biolab',
  },
  methane_cart: {
    id: 'methane_cart', name: 'Cartouche méthane', icon: '🔴',
    ingredients: { bacteria: 4, sulfur: 2 }, qty: 1, craftTime: 5, station: 'biolab',
  },
  nitrogen_cart: {
    id: 'nitrogen_cart', name: 'Cartouche azote', icon: '🔵',
    ingredients: { ice: 3, bacteria: 2, zeolite: 1 }, qty: 1, craftTime: 5, station: 'biolab',
  },
  mutagen: {
    id: 'mutagen', name: 'Mutagène T1', icon: '🧬',
    ingredients: { bacteria: 5, phyto_a: 2 }, qty: 1, craftTime: 10, station: 'biolab',
  },
  mutagen_t2: {
    id: 'mutagen_t2', name: 'Mutagène T2', icon: '🧬',
    ingredients: { mutagen: 2, fertilizer_t2: 1, phyto_b: 2 }, qty: 1, craftTime: 15, station: 'biolab',
  },
  mutagen_t3: {
    id: 'mutagen_t3', name: 'Mutagène T3', icon: '🧬',
    ingredients: { mutagen_t2: 2, fertilizer_t3: 1, phyto_c: 2 }, qty: 1, craftTime: 20, station: 'biolab',
  },
  mutagen_t4: {
    id: 'mutagen_t4', name: 'Mutagène T4', icon: '🧬',
    ingredients: { mutagen_t3: 2, osmium: 2, pulsar_quartz: 1 }, qty: 1, craftTime: 30, station: 'biolab',
  },
  phyto_a: {
    id: 'phyto_a', name: 'Phytoplancton A', icon: '🔬',
    ingredients: { algae: 3, bacteria: 2 }, qty: 2, craftTime: 5, station: 'biolab',
  },
  phyto_b: {
    id: 'phyto_b', name: 'Phytoplancton B', icon: '🔬',
    ingredients: { phyto_a: 2, fertilizer_t2: 1 }, qty: 2, craftTime: 8, station: 'biolab',
  },
  phyto_c: {
    id: 'phyto_c', name: 'Phytoplancton C', icon: '🔬',
    ingredients: { phyto_b: 2, mutagen_t2: 1 }, qty: 2, craftTime: 12, station: 'biolab',
  },
  animal_food_t1: {
    id: 'animal_food_t1', name: 'Nourriture animale T1', icon: '🍖',
    ingredients: { bacteria: 3, fertilizer: 1 }, qty: 3, craftTime: 4, station: 'biolab',
  },
  animal_food_t2: {
    id: 'animal_food_t2', name: 'Nourriture animale T2', icon: '🍖',
    ingredients: { animal_food_t1: 2, honey: 1, fertilizer_t2: 1 }, qty: 3, craftTime: 6, station: 'biolab',
  },
  animal_food_t3: {
    id: 'animal_food_t3', name: 'Nourriture animale T3', icon: '🍖',
    ingredients: { animal_food_t2: 2, mutagen_t2: 1, phyto_c: 2 }, qty: 3, craftTime: 10, station: 'biolab',
  },
  algae: {
    id: 'algae', name: 'Algues', icon: '🌿',
    ingredients: { bacteria: 2, ice: 1 }, qty: 3, craftTime: 5, station: 'biolab',
  },
  bacteria: {
    id: 'bacteria', name: 'Bactéries', icon: '🦠',
    ingredients: { sulfur: 1 }, qty: 5, craftTime: 3, station: 'biolab',
  },
  honey: {
    id: 'honey', name: 'Miel', icon: '🍯',
    ingredients: { bacteria: 3, algae: 1 }, qty: 1, craftTime: 8, station: 'biolab',
    note: 'Nécessite Ruche active',
  },
  silk: {
    id: 'silk', name: 'Soie', icon: '🕸️',
    ingredients: { bacteria: 2 }, qty: 2, craftTime: 5, station: 'biolab',
    note: 'Nécessite Générateur de soie actif',
  },

  // ═══════════════════════════════════════════════════════════
  //  CONSOMMABLES (Craft de base)
  // ═══════════════════════════════════════════════════════════
  water_bottle: {
    id: 'water_bottle', name: 'Bouteille d\'eau', icon: '💧',
    ingredients: { ice: 2 }, qty: 1, craftTime: 1, station: 'basic',
    effect: { hydration: 30 },
  },
  water_bottle_t2: {
    id: 'water_bottle_t2', name: 'Bouteille d\'eau purifiée', icon: '🫗',
    ingredients: { ice: 3, zeolite: 1 }, qty: 1, craftTime: 2, station: 'basic',
    effect: { hydration: 60 },
  },
  nutrient_bar: {
    id: 'nutrient_bar', name: 'Barre nutritive', icon: '🥕',
    ingredients: { bacteria: 3, fertilizer: 1 }, qty: 2, craftTime: 3, station: 'biolab',
    effect: { hydration: 15, health: 10 },
  },
  nutrient_bar_t2: {
    id: 'nutrient_bar_t2', name: 'Barre nutritive T2', icon: '🍱',
    ingredients: { nutrient_bar: 2, honey: 1 }, qty: 2, craftTime: 5, station: 'biolab',
    effect: { hydration: 30, health: 25 },
  },
  medkit: {
    id: 'medkit', name: 'Trousse médicale', icon: '💊',
    ingredients: { bacteria: 4, zeolite: 2, silk: 1 }, qty: 1, craftTime: 5, station: 'biolab',
    effect: { health: 50 },
  },
  medkit_t2: {
    id: 'medkit_t2', name: 'Trousse médicale T2', icon: '💉',
    ingredients: { medkit: 2, mutagen: 1, smart_fabric: 1 }, qty: 1, craftTime: 10, station: 'biolab',
    effect: { health: 100 },
  },
  oxygen_capsule: {
    id: 'oxygen_capsule', name: 'Capsule O2', icon: '🫁',
    ingredients: { ice: 3, zeolite: 2 }, qty: 2, craftTime: 2, station: 'basic',
    effect: { oxygen: 40 },
  },
  heat_shield: {
    id: 'heat_shield', name: 'Bouclier thermique', icon: '🛡️',
    ingredients: { titanium: 3, smart_fabric: 1 }, qty: 1, craftTime: 6, station: 'basic',
    effect: { temperature: 30 },
  },

  // ═══════════════════════════════════════════════════════════
  //  ÉQUIPEMENTS (Wearables)
  // ═══════════════════════════════════════════════════════════

  // Sac à dos (augmente la capacité d'inventaire)
  backpack_t1: {
    id: 'backpack_t1', name: 'Sac à dos T1', icon: '🎒', slot: 'backpack',
    ingredients: { iron: 4, aluminum: 4, fabric: 2 }, qty: 1, craftTime: 8, station: 'basic',
    effect: { inventorySlots: 4 }, unlock: 'blueprints_ti',
  },
  backpack_t2: {
    id: 'backpack_t2', name: 'Sac à dos T2', icon: '🎒', slot: 'backpack',
    ingredients: { backpack_t1: 1, super_alloy: 3, circuit_board: 2 }, qty: 1, craftTime: 12, station: 'advanced',
    effect: { inventorySlots: 8 }, unlock: 'blueprints_ti',
  },
  backpack_t3: {
    id: 'backpack_t3', name: 'Sac à dos T3', icon: '🎒', slot: 'backpack',
    ingredients: { backpack_t2: 1, osmium_rod: 2, smart_fabric: 3 }, qty: 1, craftTime: 18, station: 'advanced',
    effect: { inventorySlots: 16 }, unlock: 'blueprints_ti',
  },
  backpack_t4: {
    id: 'backpack_t4', name: 'Sac à dos T4', icon: '🎒', slot: 'backpack',
    ingredients: { backpack_t3: 1, fusion_cell: 2, osmium: 4 }, qty: 1, craftTime: 25, station: 'advanced',
    effect: { inventorySlots: 32 }, unlock: 'blueprints_ti',
  },

  // Réservoir O2
  oxygen_tank_t1: {
    id: 'oxygen_tank_t1', name: 'Réservoir O2 T1', icon: '🫁', slot: 'suit',
    ingredients: { iron: 3, aluminum: 2, ice: 5 }, qty: 1, craftTime: 6, station: 'basic',
    effect: { oxygenCapacity: 2 }, unlock: 'blueprints_ti',
  },
  oxygen_tank_t2: {
    id: 'oxygen_tank_t2', name: 'Réservoir O2 T2', icon: '🫁', slot: 'suit',
    ingredients: { oxygen_tank_t1: 1, titanium: 4, zeolite: 3 }, qty: 1, craftTime: 10, station: 'basic',
    effect: { oxygenCapacity: 4 }, unlock: 'blueprints_oxygen',
  },
  oxygen_tank_t3: {
    id: 'oxygen_tank_t3', name: 'Réservoir O2 T3', icon: '🫁', slot: 'suit',
    ingredients: { oxygen_tank_t2: 1, super_alloy: 4, osmium: 2 }, qty: 1, craftTime: 15, station: 'advanced',
    effect: { oxygenCapacity: 8 }, unlock: 'blueprints_oxygen',
  },

  // Jetpack
  jetpack_t1: {
    id: 'jetpack_t1', name: 'Jetpack T1', icon: '🚀', slot: 'jetpack',
    ingredients: { aluminum: 5, magnesium: 5, iron: 4, circuit_board: 1 }, qty: 1, craftTime: 15, station: 'basic',
    effect: { flight: true, fuelCapacity: 30 }, unlock: 'blueprints_pressure',
  },
  jetpack_t2: {
    id: 'jetpack_t2', name: 'Jetpack T2', icon: '🚀', slot: 'jetpack',
    ingredients: { jetpack_t1: 1, iridium: 3, super_alloy: 3, circuit_board: 2 }, qty: 1, craftTime: 20, station: 'advanced',
    effect: { flight: true, fuelCapacity: 60 }, unlock: 'blueprints_pressure',
  },
  jetpack_t3: {
    id: 'jetpack_t3', name: 'Jetpack T3', icon: '🚀', slot: 'jetpack',
    ingredients: { jetpack_t2: 1, osmium_rod: 3, fusion_cell: 1, circuit_board: 3 }, qty: 1, craftTime: 28, station: 'advanced',
    effect: { flight: true, fuelCapacity: 120 }, unlock: 'blueprints_animals',
  },
  jetpack_t4: {
    id: 'jetpack_t4', name: 'Jetpack T4', icon: '🚀', slot: 'jetpack',
    ingredients: { jetpack_t3: 1, fusion_cell: 3, pulsar_quartz: 2 }, qty: 1, craftTime: 40, station: 'advanced',
    effect: { flight: true, fuelCapacity: -1 }, unlock: 'blueprints_animals',
  },

  // Boots
  boots_t1: {
    id: 'boots_t1', name: 'Bottes T1', icon: '👢', slot: 'boots',
    ingredients: { aluminum: 4, fabric: 3, silicon: 2 }, qty: 1, craftTime: 8, station: 'basic',
    effect: { speedMultiplier: 1.3 }, unlock: 'blueprints_ti',
  },
  boots_t2: {
    id: 'boots_t2', name: 'Bottes T2', icon: '👢', slot: 'boots',
    ingredients: { boots_t1: 1, super_alloy: 3, smart_fabric: 2 }, qty: 1, craftTime: 14, station: 'advanced',
    effect: { speedMultiplier: 1.6 }, unlock: 'blueprints_pressure',
  },
  boots_t3: {
    id: 'boots_t3', name: 'Bottes T3', icon: '👢', slot: 'boots',
    ingredients: { boots_t2: 1, osmium: 3, circuit_board: 2 }, qty: 1, craftTime: 20, station: 'advanced',
    effect: { speedMultiplier: 2.0 }, unlock: 'blueprints_insects',
  },

  // Exosquelette
  exo_t1: {
    id: 'exo_t1', name: 'Exosquelette T1', icon: '🦾', slot: 'suit',
    ingredients: { iron: 6, titanium: 4, circuit_board: 2 }, qty: 1, craftTime: 15, station: 'advanced',
    effect: { carryWeight: 2 }, unlock: 'blueprints_heat',
  },
  exo_t2: {
    id: 'exo_t2', name: 'Exosquelette T2', icon: '🦾', slot: 'suit',
    ingredients: { exo_t1: 1, super_alloy: 4, smart_fabric: 3, circuit_board: 3 }, qty: 1, craftTime: 22, station: 'advanced',
    effect: { carryWeight: 5 }, unlock: 'blueprints_biomass',
  },

  // Combinaisons
  suit_t1: {
    id: 'suit_t1', name: 'Combinaison T1', icon: '👔', slot: 'head',
    ingredients: { fabric: 5, aluminum: 3, zeolite: 2 }, qty: 1, craftTime: 10, station: 'basic',
    effect: { oxygenCapacity: 1.5, radiationProtect: 10 },
  },
  suit_t2: {
    id: 'suit_t2', name: 'Combinaison T2', icon: '🥼', slot: 'head',
    ingredients: { suit_t1: 1, smart_fabric: 4, titanium: 3 }, qty: 1, craftTime: 16, station: 'advanced',
    effect: { oxygenCapacity: 2.5, radiationProtect: 25 }, unlock: 'blueprints_heat',
  },
  suit_t3: {
    id: 'suit_t3', name: 'Combinaison T3', icon: '🥼', slot: 'head',
    ingredients: { suit_t2: 1, super_alloy: 4, osmium: 2, circuit_board: 3 }, qty: 1, craftTime: 24, station: 'advanced',
    effect: { oxygenCapacity: 4, radiationProtect: 50 }, unlock: 'blueprints_pressure',
  },

  // ═══════════════════════════════════════════════════════════
  //  FUSIBLES (Fuses)
  // ═══════════════════════════════════════════════════════════
  fuse_t1: {
    id: 'fuse_t1', name: 'Fusible T1', icon: '🔌',
    ingredients: { iron: 2, silicon: 1 }, qty: 2, craftTime: 2, station: 'basic',
    effect: { powerBonus: 25 },
  },
  fuse_t2: {
    id: 'fuse_t2', name: 'Fusible T2', icon: '🔌',
    ingredients: { cobalt: 2, silicon: 2, circuit_board: 1 }, qty: 2, craftTime: 3, station: 'basic',
    effect: { powerBonus: 50 },
  },
  fuse_t3: {
    id: 'fuse_t3', name: 'Fusible T3', icon: '🔌',
    ingredients: { titanium: 3, circuit_board: 2 }, qty: 2, craftTime: 5, station: 'advanced',
    effect: { powerBonus: 100 },
  },
  fuse_t4: {
    id: 'fuse_t4', name: 'Fusible T4', icon: '🔌',
    ingredients: { super_alloy: 3, circuit_board: 3, osmium: 1 }, qty: 2, craftTime: 8, station: 'advanced',
    effect: { powerBonus: 200 },
  },

  // ═══════════════════════════════════════════════════════════
  //  PORTAIL (Portal items)
  // ═══════════════════════════════════════════════════════════
  yellow_quartz: {
    id: 'yellow_quartz', name: 'Quartz Jaune', icon: '🟡',
    ingredients: { silicon: 5, sulfur: 3, magnesium: 2 }, qty: 1, craftTime: 8, station: 'basic',
  },
  blue_quartz: {
    id: 'blue_quartz', name: 'Quartz Bleu', icon: '🔵',
    ingredients: { silicon: 5, cobalt: 3, ice: 2 }, qty: 1, craftTime: 8, station: 'basic',
  },
  red_quartz: {
    id: 'red_quartz', name: 'Quartz Rouge', icon: '🔴',
    ingredients: { silicon: 5, sulfur: 3, iron: 2 }, qty: 1, craftTime: 8, station: 'basic',
  },
  osmium_quartz: {
    id: 'osmium_quartz', name: 'Quartz Osmium', icon: '🟣',
    ingredients: { osmium: 3, silicon: 5, circuit_board: 2 }, qty: 1, craftTime: 12, station: 'advanced',
  },
  pulsar_quartz: {
    id: 'pulsar_quartz', name: 'Quartz Pulsar', icon: '💫',
    ingredients: { osmium_quartz: 2, uranium: 2, fusion_cell: 1 }, qty: 1, craftTime: 20, station: 'advanced',
  },
};

// ─── Catégories de recettes ─────────────────────────────────
const RECIPE_CATEGORIES = {
  industrial:  { label: 'Composants industriels', icon: '⚙️'  },
  biolab:      { label: 'Bio Lab',                icon: '🧪'  },
  consumable:  { label: 'Consommables',           icon: '🍶'  },
  equipment:   { label: 'Équipement',             icon: '🥼'  },
  fuse:        { label: 'Fusibles',               icon: '🔌'  },
  portal:      { label: 'Portail',                icon: '🌀'  },
};

// ─── Stations requises ─────────────────────────────────────
const CRAFT_STATIONS = {
  basic:    { label: 'Craft simple (mains)', icon: '✋', unlockTi: 0         },
  advanced: { label: 'Craft Station',        icon: '🏭', unlockTi: 300       },
  biolab:   { label: 'BioLab',               icon: '🧪', unlockBiomass: 865  },
};
