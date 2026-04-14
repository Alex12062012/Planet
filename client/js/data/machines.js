// ============================================================
//  MACHINES DATA  –  Toutes les machines de The Planet Crafter
//  Source : wiki officiel
// ============================================================

// ─── Effets par machine ──────────────────────────────────────
// tiPerSec     : contribution directe au Terraform Index
// oxygenRate   : % O2 par seconde
// heatRate     : % Chaleur par seconde
// pressureRate : % Pression par seconde
// biomassRate  : % Biomasse par seconde
// powerGen     : énergie générée (kW)
// powerUse     : énergie consommée (kW)
// produces     : { itemId: qty } par cycle (si machine productive)
// cost         : { itemId: qty } pour construire
// unlockTi     : Ti minimum pour débloquer (0 = dès le départ)
// unlockOxygen / unlockHeat / unlockPressure / unlockBiomass : valeurs de déverrouillage alternative

const MACHINES = {

  // ═══════════════════════════════════════════════════════════
  //  ÉCRANS D'AFFICHAGE
  // ═══════════════════════════════════════════════════════════
  screen_blueprints:     { id: 'screen_blueprints',     name: 'Écran - Blueprints',         icon: '🖥️',  category: 'display', cost: { iron: 2, silicon: 1 }, powerUse: 0.5 },
  screen_biomass:        { id: 'screen_biomass',         name: 'Écran - Biomasse',           icon: '🖥️',  category: 'display', cost: { iron: 2, silicon: 1 }, powerUse: 0.5, unlockTi: 200e6 },
  screen_energy:         { id: 'screen_energy',          name: 'Écran - Niveaux énergie',    icon: '🖥️',  category: 'display', cost: { iron: 2, silicon: 1 }, powerUse: 0.5 },
  screen_mapping:        { id: 'screen_mapping',         name: 'Écran - Carte',              icon: '🖥️',  category: 'display', cost: { iron: 2, silicon: 1 }, powerUse: 0.5 },
  screen_orbital:        { id: 'screen_orbital',         name: 'Écran - Informations orbitales', icon: '🖥️', category: 'display', cost: { iron: 2, silicon: 1 }, powerUse: 0.5, unlockTi: 550e6 },
  screen_progress:       { id: 'screen_progress',        name: 'Écran - Progrès',            icon: '🖥️',  category: 'display', cost: { iron: 2, silicon: 1 }, powerUse: 0.5, unlockHeat: 2e-9 },
  screen_terraformation: { id: 'screen_terraformation',  name: 'Écran - Terraformation',     icon: '🖥️',  category: 'display', cost: { iron: 2, silicon: 1 }, powerUse: 0.5 },
  screen_transmissions:  { id: 'screen_transmissions',   name: 'Écran - Transmissions',      icon: '🖥️',  category: 'display', cost: { iron: 2, silicon: 1 }, powerUse: 0.5, unlockPressure: 4e-6 },
  screen_solar_system:   { id: 'screen_solar_system',    name: 'Écran Système Solaire',      icon: '🖥️',  category: 'display', cost: { iron: 3, silicon: 2, iridium: 1 }, powerUse: 0.5, unlockTi: 4.15e12 },
  screen_toxicity:       { id: 'screen_toxicity',        name: 'Écran - Toxicité',           icon: '🖥️',  category: 'display', cost: { iron: 2, silicon: 1 }, powerUse: 0.5, dlc: 'toxicity' },
  sign:                  { id: 'sign',                   name: 'Panneau (Sign)',              icon: '🪧', category: 'display', cost: { iron: 1, silicon: 1 }, powerUse: 0, unlockHeat: 500e-9 },

  // ═══════════════════════════════════════════════════════════
  //  STATIONS DE CRAFT
  // ═══════════════════════════════════════════════════════════
  craft_t1:          { id: 'craft_t1',          name: 'Station de craft T1',       icon: '🔨', category: 'craft', cost: { iron: 1, silicon: 1 }, powerUse: 0 },
  craft_t2:          { id: 'craft_t2',          name: 'Station de craft T2',       icon: '🔨', category: 'craft', cost: { iron: 2, titanium: 1, silicon: 1 }, powerUse: 0 },
  craft_advanced:    { id: 'craft_advanced',    name: 'Station de craft Avancée',  icon: '⚗️',  category: 'craft', cost: { iron: 2, titanium: 2, silicon: 2 }, powerUse: 0, unlockTi: 175e3 },
  auto_crafter:      { id: 'auto_crafter',      name: 'Auto-Crafter',             icon: '🤖', category: 'craft', cost: { circuit_board: 2, titanium: 2, silicon: 1 }, powerUse: 10, unlockTi: 2.5e9 },
  biolab:            { id: 'biolab',            name: 'Bio Lab',                  icon: '🧪', category: 'craft', cost: { iron: 3, titanium: 2, silicon: 2 }, powerUse: 5, unlockBiomass: 865 },
  cooking_station:   { id: 'cooking_station',   name: 'Station de cuisine',       icon: '🍳', category: 'craft', cost: { iron: 2, aluminum: 1 }, powerUse: 2 },
  recycling_t1:      { id: 'recycling_t1',      name: 'Machine de recyclage',     icon: '♻️',  category: 'craft', cost: { iron: 2, cobalt: 1 }, powerUse: 3 },
  recycling_t2:      { id: 'recycling_t2',      name: 'Machine de recyclage T2',  icon: '♻️',  category: 'craft', cost: { iron: 2, titanium: 1, silicon: 1 }, powerUse: 5 },
  trash_can:         { id: 'trash_can',          name: 'Poubelle',                icon: '🗑️',  category: 'craft', cost: { iron: 1 }, powerUse: 0 },
  shredder:          { id: 'shredder',           name: 'Déchiqueteuse',           icon: '⚙️',  category: 'craft', cost: { iron: 2, titanium: 1 }, powerUse: 5 },
  dna_manipulator:   { id: 'dna_manipulator',   name: 'Manipulateur ADN',         icon: '🧬', category: 'craft', cost: { circuit_board: 1, silicon: 2, iridium: 1 }, powerUse: 8, unlockTi: 700e6 },
  incubator:         { id: 'incubator',          name: 'Incubateur',              icon: '🥚', category: 'craft', cost: { silicon: 2, titanium: 2, cobalt: 1 }, powerUse: 6, unlockTi: 5e9 },
  genetic_extractor: { id: 'genetic_extractor',  name: 'Extracteur génétique',    icon: '🔬', category: 'craft', cost: { circuit_board: 1, iridium: 2, osmium: 1 }, powerUse: 10 },
  genetic_synthesizer:{ id: 'genetic_synthesizer',name: 'Synthétiseur génétique', icon: '🔬', category: 'craft', cost: { circuit_board: 2, osmium: 2, pulsar_quartz: 1 }, powerUse: 15 },
  quartz_craft:      { id: 'quartz_craft',       name: 'Station quartz',          icon: '💎', category: 'craft', cost: { silicon: 3, iridium: 2 }, powerUse: 5 },
  craft_refinement:  { id: 'craft_refinement',   name: 'Station de raffinement',  icon: '⚗️',  category: 'craft', cost: { iron: 3, titanium: 2, cobalt: 1 }, powerUse: 8, dlc: 'toxicity' },

  // ═══════════════════════════════════════════════════════════
  //  GÉNÉRATEURS D'ÉNERGIE
  // ═══════════════════════════════════════════════════════════
  wind_turbine_t1: {
    id: 'wind_turbine_t1', name: 'Éolienne', icon: '💨', category: 'energy',
    tiPerSec: 20, powerGen: 120,
    cost: { iron: 3, titanium: 1 },
    effect: 'Génère 120 kW d\'énergie',
  },
  wind_turbine_t2: {
    id: 'wind_turbine_t2', name: 'Éolienne T2', icon: '💨', category: 'energy',
    tiPerSec: 30, powerGen: 350,
    cost: { iron: 4, titanium: 2, cobalt: 1 },
    effect: 'Génère 350 kW d\'énergie',
  },
  solar_t1: {
    id: 'solar_t1', name: 'Panneau solaire T1', icon: '☀️', category: 'energy',
    tiPerSec: 40, powerGen: 80,
    cost: { silicon: 2, aluminum: 1 },
    unlockTi: 1000,
    effect: 'Génère 80 kW d\'énergie',
  },
  solar_t2: {
    id: 'solar_t2', name: 'Panneau solaire T2', icon: '☀️', category: 'energy',
    tiPerSec: 60, powerGen: 220,
    cost: { silicon: 3, aluminum: 2, cobalt: 1 },
    unlockTi: 17.5e3,
    effect: 'Génère 220 kW d\'énergie',
  },
  nuclear_t1: {
    id: 'nuclear_t1', name: 'Réacteur nucléaire T1', icon: '☢️', category: 'energy',
    tiPerSec: 500, powerGen: 7000,
    cost: { uranium: 2, iron: 4, titanium: 2 },
    unlockPressure: 60e-6,
    effect: 'Génère 7 000 kW d\'énergie',
  },
  nuclear_t2: {
    id: 'nuclear_t2', name: 'Réacteur nucléaire T2', icon: '☢️', category: 'energy',
    tiPerSec: 1000, powerGen: 30000,
    cost: { uranium_rod: 2, iron: 6, titanium: 4, iridium: 1 },
    unlockPressure: 1.5e-3,
    effect: 'Génère 30 000 kW d\'énergie',
  },
  fusion_generator: {
    id: 'fusion_generator', name: 'Générateur à fusion', icon: '⚡', category: 'energy',
    tiPerSec: 2000, powerGen: 90000,
    cost: { fusion_cell: 1, osmium_rod: 2, iridium_rod: 2 },
    unlockHeat: 750e-6,
    effect: 'Génère 90 000 kW d\'énergie (intérieur uniquement)',
  },

  // ═══════════════════════════════════════════════════════════
  //  CHAUFFE-SOLS (HEATERS)
  // ═══════════════════════════════════════════════════════════
  heater_t1: {
    id: 'heater_t1', name: 'Chauffe-sol T1', icon: '🌡️', category: 'heater',
    tiPerSec: 80, heatRate: 0.015,
    cost: { iron: 3, silicon: 1 },
    effect: '+Chaleur → +80 Ti/s',
  },
  heater_t2: {
    id: 'heater_t2', name: 'Chauffe-sol T2', icon: '🌡️', category: 'heater',
    tiPerSec: 200, heatRate: 0.035,
    cost: { iron: 4, titanium: 2, cobalt: 1 },
    unlockOxygen: 1.85,
    effect: '+Chaleur → +200 Ti/s',
  },
  heater_t3: {
    id: 'heater_t3', name: 'Chauffe-sol T3', icon: '🌡️', category: 'heater',
    tiPerSec: 500, heatRate: 0.07, pressureRate: 0.01,
    cost: { iron: 5, titanium: 3, cobalt: 2, iridium: 1 },
    unlockOxygen: 80,
    effect: '+Chaleur +Pression → +500 Ti/s',
  },
  heater_t4: {
    id: 'heater_t4', name: 'Chauffe-sol T4', icon: '🔥', category: 'heater',
    tiPerSec: 1200, heatRate: 0.15, pressureRate: 0.02,
    cost: { iron: 6, titanium: 4, iridium: 2, osmium: 1 },
    unlockOxygen: 63e-3,
    effect: '+Chaleur +Pression → +1 200 Ti/s',
  },
  heater_t5: {
    id: 'heater_t5', name: 'Chauffe-sol T5', icon: '🔥', category: 'heater',
    tiPerSec: 3000, heatRate: 0.3, pressureRate: 0.05,
    cost: { iron: 8, titanium: 5, osmium: 2, iridium_rod: 1 },
    unlockBiomass: 8300,
    effect: '+Chaleur +Pression → +3 000 Ti/s',
  },

  // ═══════════════════════════════════════════════════════════
  //  FOREUSES (DRILLS)
  // ═══════════════════════════════════════════════════════════
  drill_t1: {
    id: 'drill_t1', name: 'Foreuse T1', icon: '⛏️', category: 'drill',
    tiPerSec: 80, pressureRate: 0.015,
    cost: { iron: 3, titanium: 1 },
    effect: '+Pression → +80 Ti/s',
  },
  drill_t2: {
    id: 'drill_t2', name: 'Foreuse T2', icon: '⛏️', category: 'drill',
    tiPerSec: 200, pressureRate: 0.035, heatRate: 0.005,
    cost: { iron: 4, titanium: 2, cobalt: 1 },
    unlockPressure: 1.2e-6,
    effect: '+Pression +Chaleur → +200 Ti/s',
  },
  drill_t3: {
    id: 'drill_t3', name: 'Foreuse T3', icon: '⛏️', category: 'drill',
    tiPerSec: 500, pressureRate: 0.07, heatRate: 0.01,
    cost: { iron: 5, titanium: 3, cobalt: 2, iridium: 1 },
    unlockHeat: 21e-9,
    effect: '+Pression +Chaleur → +500 Ti/s',
  },
  drill_t4: {
    id: 'drill_t4', name: 'Foreuse T4', icon: '⛏️', category: 'drill',
    tiPerSec: 1200, pressureRate: 0.15, heatRate: 0.02,
    cost: { iron: 6, titanium: 4, iridium: 2, osmium: 1 },
    unlockHeat: 41e-9,
    effect: '+Pression +Chaleur → +1 200 Ti/s',
  },
  drill_t5: {
    id: 'drill_t5', name: 'Foreuse T5', icon: '⛏️', category: 'drill',
    tiPerSec: 3000, pressureRate: 0.3, heatRate: 0.05,
    cost: { iron: 8, titanium: 5, osmium: 2, iridium_rod: 1 },
    unlockBiomass: 23000,
    effect: '+Pression +Chaleur → +3 000 Ti/s',
  },

  // ═══════════════════════════════════════════════════════════
  //  PURIFICATEURS ATMOSPHÉRIQUES (DLC Toxicity)
  // ═══════════════════════════════════════════════════════════
  atmo_purifier_t1: {
    id: 'atmo_purifier_t1', name: 'Purificateur atmosphérique T1', icon: '🌫️', category: 'purifier',
    tiPerSec: 200, purificationRate: 0.05,
    cost: { iron: 3, titanium: 2, zeolite: 1 },
    powerUse: 5, dlc: 'toxicity',
    effect: '+Purification → +200 Ti/s',
  },
  atmo_purifier_t2: {
    id: 'atmo_purifier_t2', name: 'Purificateur atmosphérique T2', icon: '🌫️', category: 'purifier',
    tiPerSec: 500, purificationRate: 0.12,
    cost: { iron: 4, titanium: 3, zeolite: 2, cobalt: 1 },
    powerUse: 10, dlc: 'toxicity',
    effect: '+Purification → +500 Ti/s',
  },
  atmo_purifier_t3: {
    id: 'atmo_purifier_t3', name: 'Purificateur atmosphérique T3', icon: '🌫️', category: 'purifier',
    tiPerSec: 1200, purificationRate: 0.28,
    cost: { iron: 5, titanium: 4, zeolite: 3, iridium: 1 },
    powerUse: 20, dlc: 'toxicity',
    effect: '+Purification → +1 200 Ti/s',
  },
  atmo_purifier_t4: {
    id: 'atmo_purifier_t4', name: 'Purificateur atmosphérique T4', icon: '🌫️', category: 'purifier',
    tiPerSec: 3000, purificationRate: 0.6,
    cost: { iron: 6, titanium: 5, osmium: 2, iridium_rod: 1 },
    powerUse: 40, dlc: 'toxicity',
    effect: '+Purification → +3 000 Ti/s',
  },

  // ═══════════════════════════════════════════════════════════
  //  PRODUCTEURS DE PLANTES (VEGELUBES)
  // ═══════════════════════════════════════════════════════════
  vegetube_t1: {
    id: 'vegetube_t1', name: 'Végétube T1', icon: '🌱', category: 'plant_grower',
    tiPerSec: 100, oxygenRate: 0.02, biomassRate: 0.005,
    cost: { iron: 2, silicon: 1 },
    powerUse: 3, indoor: true,
    effect: '+O2 +Biomasse → +100 Ti/s (intérieur)',
  },
  vegetube_t2: {
    id: 'vegetube_t2', name: 'Végétube T2', icon: '🌱', category: 'plant_grower',
    tiPerSec: 250, oxygenRate: 0.05, biomassRate: 0.01,
    cost: { iron: 3, titanium: 1, silicon: 1 },
    powerUse: 5, indoor: true, unlockHeat: 500e-12,
    effect: '+O2 +Biomasse → +250 Ti/s (intérieur)',
  },
  vegetube_t3: {
    id: 'vegetube_t3', name: 'Végétube T3', icon: '🌿', category: 'plant_grower',
    tiPerSec: 700, oxygenRate: 0.12, biomassRate: 0.025,
    cost: { iron: 4, titanium: 2, cobalt: 1, silicon: 2 },
    powerUse: 8, unlockOxygen: 30,
    effect: '+O2 +Biomasse → +700 Ti/s (extérieur)',
  },

  // ═══════════════════════════════════════════════════════════
  //  PRODUCTEURS DE NOURRITURE
  // ═══════════════════════════════════════════════════════════
  food_grower_t1: {
    id: 'food_grower_t1', name: 'Producteur de nourriture', icon: '🌾', category: 'food_grower',
    tiPerSec: 50, produces: { space_food: 1 },
    cost: { iron: 2, titanium: 1 }, powerUse: 3,
    unlockOxygen: 12,
    effect: 'Produit de la nourriture',
  },
  food_grower_t2: {
    id: 'food_grower_t2', name: 'Producteur de nourriture T2', icon: '🌾', category: 'food_grower',
    tiPerSec: 100, produces: { high_quality_food: 1 },
    cost: { iron: 3, titanium: 2, cobalt: 1 }, powerUse: 5,
    unlockBiomass: 35000,
    effect: 'Produit de la nourriture de qualité',
  },
  outdoor_farm: {
    id: 'outdoor_farm', name: 'Ferme extérieure', icon: '🌾', category: 'food_grower',
    tiPerSec: 200, biomassRate: 0.01, produces: { space_food: 1 },
    cost: { iron: 3, titanium: 2, silicon: 1 }, powerUse: 4,
    unlockInsects: 1500,
    effect: '+Biomasse → produit de la nourriture',
  },
  outdoor_farm_t2: {
    id: 'outdoor_farm_t2', name: 'Ferme extérieure T2', icon: '🌾', category: 'food_grower',
    tiPerSec: 400, biomassRate: 0.02, produces: { high_quality_food: 1 },
    cost: { iron: 4, titanium: 3, cobalt: 2 }, powerUse: 6,
    effect: '+Biomasse → produit de la nourriture premium',
  },

  // ═══════════════════════════════════════════════════════════
  //  COLLECTEURS D'EAU
  // ═══════════════════════════════════════════════════════════
  water_collector_atmo: {
    id: 'water_collector_atmo', name: 'Collecteur d\'eau atmosphérique', icon: '💧', category: 'water',
    tiPerSec: 30, produces: { water_bottle: 1 },
    cost: { iron: 2, titanium: 1 }, powerUse: 2,
    unlockTi: 875e3,
    effect: 'Collecte l\'eau de l\'air → Bouteilles d\'eau',
  },
  water_collector_lake: {
    id: 'water_collector_lake', name: 'Collecteur d\'eau de lac', icon: '🌊', category: 'water',
    tiPerSec: 80, produces: { water_bottle: 2 },
    cost: { iron: 3, titanium: 2, cobalt: 1 }, powerUse: 3,
    unlockTi: 50e6,
    effect: 'Collecte l\'eau des lacs → Bouteilles d\'eau',
  },
  toxic_water_t1: {
    id: 'toxic_water_t1', name: 'Collecteur d\'eau toxique T1', icon: '☣️', category: 'water',
    tiPerSec: 100, purificationRate: 0.01,
    cost: { iron: 3, titanium: 2, zeolite: 1 }, powerUse: 4,
    dlc: 'toxicity',
    effect: '+Purification → collecte eau toxique',
  },
  toxic_water_t2: {
    id: 'toxic_water_t2', name: 'Collecteur d\'eau toxique T2', icon: '☣️', category: 'water',
    tiPerSec: 250, purificationRate: 0.025,
    cost: { iron: 4, titanium: 3, zeolite: 2 }, powerUse: 6,
    dlc: 'toxicity',
    effect: '+Purification → collecte eau toxique',
  },
  toxic_water_t3: {
    id: 'toxic_water_t3', name: 'Collecteur d\'eau toxique T3', icon: '☣️', category: 'water',
    tiPerSec: 600, purificationRate: 0.06,
    cost: { iron: 5, titanium: 4, zeolite: 3, cobalt: 1 }, powerUse: 10,
    dlc: 'toxicity',
    effect: '+Purification → collecte eau toxique',
  },

  // ═══════════════════════════════════════════════════════════
  //  MACHINES DE DÉTOXIFICATION (DLC Toxicity)
  // ═══════════════════════════════════════════════════════════
  detox_t1: {
    id: 'detox_t1', name: 'Machine de détoxification T1', icon: '🧹', category: 'detox',
    tiPerSec: 150, purificationRate: 0.03,
    cost: { iron: 3, titanium: 2, zeolite: 1 }, powerUse: 6,
    dlc: 'toxicity',
    effect: '+Purification → nettoie la toxicité',
  },
  detox_t2: {
    id: 'detox_t2', name: 'Machine de détoxification T2', icon: '🧹', category: 'detox',
    tiPerSec: 400, purificationRate: 0.08,
    cost: { iron: 4, titanium: 3, zeolite: 2, cobalt: 1 }, powerUse: 10,
    dlc: 'toxicity',
    effect: '+Purification → nettoie la toxicité',
  },
  detox_t3: {
    id: 'detox_t3', name: 'Machine de détoxification T3', icon: '🧹', category: 'detox',
    tiPerSec: 1000, purificationRate: 0.2,
    cost: { iron: 5, titanium: 4, zeolite: 3, iridium: 1 }, powerUse: 18,
    dlc: 'toxicity',
    effect: '+Purification → nettoie la toxicité',
  },

  // ═══════════════════════════════════════════════════════════
  //  ÉPANDEURS HERBE / FLEURS / ALGUES / ARBRES
  // ═══════════════════════════════════════════════════════════
  grass_spreader: {
    id: 'grass_spreader', name: 'Épandeur d\'herbe', icon: '🌿', category: 'spreader',
    tiPerSec: 150, biomassRate: 0.02, oxygenRate: 0.01,
    cost: { iron: 2, silicon: 1, seed_lirma: 1 },
    unlockOxygen: 150,
    effect: '+Biomasse +O2 → +150 Ti/s',
  },
  flower_spreader_t1: {
    id: 'flower_spreader_t1', name: 'Épandeur de fleurs', icon: '🌸', category: 'spreader',
    tiPerSec: 300, biomassRate: 0.04, oxygenRate: 0.02,
    cost: { iron: 2, silicon: 1, seed_brelea: 1 },
    unlockPressure: 2.5e-3,
    effect: '+Biomasse +O2 → +300 Ti/s',
  },
  flower_spreader_t2: {
    id: 'flower_spreader_t2', name: 'Épandeur de fleurs T2', icon: '🌺', category: 'spreader',
    tiPerSec: 700, biomassRate: 0.08, oxygenRate: 0.04,
    cost: { iron: 3, silicon: 2, cobalt: 1, seed_nulna: 2 },
    unlockBiomass: 500000,
    effect: '+Biomasse +O2 → +700 Ti/s',
  },
  algae_t1: {
    id: 'algae_t1', name: 'Générateur d\'algues T1', icon: '🌊', category: 'spreader',
    tiPerSec: 200, biomassRate: 0.03, produces: { algae: 1 },
    cost: { iron: 2, titanium: 1, silicon: 1 },
    powerUse: 3, unlockHeat: 2e-6,
    effect: '+Biomasse → produit des algues',
  },
  algae_t2: {
    id: 'algae_t2', name: 'Générateur d\'algues T2', icon: '🌊', category: 'spreader',
    tiPerSec: 500, biomassRate: 0.07, produces: { algae: 2 },
    cost: { iron: 3, titanium: 2, silicon: 2, cobalt: 1 },
    powerUse: 6, unlockBiomass: 25000,
    effect: '+Biomasse → produit des algues',
  },
  tree_spreader_t1: {
    id: 'tree_spreader_t1', name: 'Épandeur d\'arbres T1', icon: '🌲', category: 'spreader',
    tiPerSec: 400, biomassRate: 0.06, oxygenRate: 0.03,
    cost: { iron: 2, silicon: 1, tree_iterra: 1 },
    unlockBiomass: 45000,
    effect: '+Biomasse +O2 → +400 Ti/s (au bord de l\'eau)',
  },
  tree_spreader_t2: {
    id: 'tree_spreader_t2', name: 'Épandeur d\'arbres T2', icon: '🌲', category: 'spreader',
    tiPerSec: 900, biomassRate: 0.12, oxygenRate: 0.06,
    cost: { iron: 3, titanium: 1, silicon: 2, tree_cernea: 1 },
    unlockOxygen: 6e-3,
    effect: '+Biomasse +O2 → +900 Ti/s',
  },
  tree_spreader_t3: {
    id: 'tree_spreader_t3', name: 'Épandeur d\'arbres T3', icon: '🌳', category: 'spreader',
    tiPerSec: 2000, biomassRate: 0.25, oxygenRate: 0.12,
    cost: { iron: 4, titanium: 2, silicon: 2, cobalt: 1, tree_elegea: 1 },
    unlockTi: 32e9,
    effect: '+Biomasse +O2 → +2 000 Ti/s',
  },

  // ═══════════════════════════════════════════════════════════
  //  FERMES ANIMALES
  // ═══════════════════════════════════════════════════════════
  beehive_t1: {
    id: 'beehive_t1', name: 'Ruche T1', icon: '🐝', category: 'animal_farm',
    tiPerSec: 300, biomassRate: 0.05,
    produces: { honey: 1 },
    cost: { iron: 2, silicon: 1 },
    powerUse: 2, unlockPlants: 80000,
    effect: '+Biomasse insectes/plantes → produit du miel',
  },
  beehive_t2: {
    id: 'beehive_t2', name: 'Ruche T2', icon: '🐝', category: 'animal_farm',
    tiPerSec: 700, biomassRate: 0.1,
    produces: { honey: 1, bee_larva: 1 },
    cost: { iron: 3, titanium: 1, silicon: 2, cobalt: 1 },
    powerUse: 4, unlockInsects: 145000,
    effect: '+Biomasse → produit miel + larves abeilles',
  },
  butterfly_dome: {
    id: 'butterfly_dome', name: 'Dôme à papillons', icon: '🦋', category: 'animal_farm',
    tiPerSec: 600, biomassRate: 0.08,
    cost: { iron: 3, titanium: 2, cobalt: 1, silicon: 2 },
    powerUse: 5, unlockPlants: 140000,
    effect: '+Biomasse insectes → fait pousser des papillons',
  },
  butterfly_farm_t1: {
    id: 'butterfly_farm_t1', name: 'Ferme à papillons T1', icon: '🦋', category: 'animal_farm',
    tiPerSec: 800, biomassRate: 0.12,
    cost: { iron: 3, titanium: 2, silicon: 2 },
    powerUse: 5, unlockPlants: 3250000,
    effect: '+Biomasse insectes → fait pousser des papillons',
  },
  butterfly_farm_t2: {
    id: 'butterfly_farm_t2', name: 'Ferme à papillons T2', icon: '🦋', category: 'animal_farm',
    tiPerSec: 2000, biomassRate: 0.25,
    cost: { iron: 4, titanium: 3, cobalt: 2, silicon: 2 },
    powerUse: 8, unlockInsects: 925000,
    effect: '+Biomasse insectes → fait pousser des papillons',
  },
  butterfly_farm_t3: {
    id: 'butterfly_farm_t3', name: 'Ferme à papillons T3', icon: '🦋', category: 'animal_farm',
    tiPerSec: 5000, biomassRate: 0.5,
    cost: { iron: 5, titanium: 4, iridium: 1, cobalt: 2 },
    powerUse: 12,
    effect: '+Biomasse insectes → fait pousser des papillons',
  },
  aquarium_t1: {
    id: 'aquarium_t1', name: 'Aquarium T1', icon: '🐠', category: 'animal_farm',
    tiPerSec: 400, biomassRate: 0.06,
    cost: { iron: 3, titanium: 2, silicon: 2 },
    powerUse: 4, unlockTi: 120e9,
    effect: '+Biomasse animale → fait grandir des poissons',
  },
  aquarium_t2: {
    id: 'aquarium_t2', name: 'Aquarium T2', icon: '🐟', category: 'animal_farm',
    tiPerSec: 900, biomassRate: 0.12,
    cost: { iron: 4, titanium: 3, cobalt: 2, silicon: 2 },
    powerUse: 7, unlockBiomass: 42000,
    effect: '+Biomasse animale → fait grandir des poissons',
  },
  fish_farm_t1: {
    id: 'fish_farm_t1', name: 'Pisciculture T1', icon: '🐟', category: 'animal_farm',
    tiPerSec: 1200, biomassRate: 0.15, oxygenRate: 0.01, pressureRate: 0.01, heatRate: 0.005,
    cost: { iron: 4, titanium: 3, cobalt: 2 },
    powerUse: 8, unlockAnimals: 5500,
    effect: '+Biomasse animale/O2/Pression/Chaleur → +1 200 Ti/s',
  },
  fish_farm_t2: {
    id: 'fish_farm_t2', name: 'Pisciculture T2', icon: '🐟', category: 'animal_farm',
    tiPerSec: 3000, biomassRate: 0.35, oxygenRate: 0.02, pressureRate: 0.02, heatRate: 0.01,
    cost: { iron: 5, titanium: 4, iridium: 1, cobalt: 3 },
    powerUse: 14,
    effect: '+Biomasse animale → +3 000 Ti/s',
  },
  amphibian_farm: {
    id: 'amphibian_farm', name: 'Ferme d\'amphibiens', icon: '🐸', category: 'animal_farm',
    tiPerSec: 2500, biomassRate: 0.3, heatRate: 0.01, pressureRate: 0.015,
    cost: { iron: 4, titanium: 3, cobalt: 2, silicon: 2 },
    powerUse: 10, unlockTi: 425e9,
    effect: '+Biomasse animale +Chaleur +Pression → +2 500 Ti/s',
  },

  // ═══════════════════════════════════════════════════════════
  //  BIODÔMES
  // ═══════════════════════════════════════════════════════════
  biodome_t1: {
    id: 'biodome_t1', name: 'Biodôme T1', icon: '🌐', category: 'biodome',
    tiPerSec: 500, oxygenRate: 0.08, biomassRate: 0.06,
    cost: { iron: 4, titanium: 3, cobalt: 2, silicon: 2 },
    powerUse: 8, unlockHeat: 100e-9,
    effect: '+O2 +Biomasse → +500 Ti/s',
  },
  biodome_t2: {
    id: 'biodome_t2', name: 'Biodôme T2', icon: '🌐', category: 'biodome',
    tiPerSec: 1200, oxygenRate: 0.15, biomassRate: 0.12,
    cost: { iron: 5, titanium: 4, cobalt: 3, iridium: 1 },
    powerUse: 15, unlockHeat: 12e-6,
    effect: '+O2 +Biomasse → +1 200 Ti/s',
  },

  // ═══════════════════════════════════════════════════════════
  //  EXTRACTEURS DE MINERAIS
  // ═══════════════════════════════════════════════════════════
  ore_extractor_t1: {
    id: 'ore_extractor_t1', name: 'Extracteur de minerai T1', icon: '⛏️', category: 'extractor',
    tiPerSec: 50, heatRate: 0.003, pressureRate: 0.005,
    produces: { iron: 1, cobalt: 1 },
    cost: { iron: 3, titanium: 2 },
    powerUse: 5, unlockPressure: 155e-6,
    effect: 'Extrait des minerais du sol',
  },
  ore_extractor_t2: {
    id: 'ore_extractor_t2', name: 'Extracteur de minerai T2', icon: '⛏️', category: 'extractor',
    tiPerSec: 120, heatRate: 0.006, pressureRate: 0.01,
    produces: { iron: 1, titanium: 1, silicon: 1 },
    cost: { iron: 4, titanium: 3, cobalt: 1 },
    powerUse: 8, unlockPressure: 364.5e-3,
    effect: 'Extrait des minerais variés',
  },
  ore_extractor_t3: {
    id: 'ore_extractor_t3', name: 'Extracteur de minerai T3', icon: '⛏️', category: 'extractor',
    tiPerSec: 300, heatRate: 0.01, pressureRate: 0.02,
    produces: { iridium: 1, osmium: 1, uranium: 1 },
    cost: { iron: 5, titanium: 4, iridium: 1, cobalt: 2 },
    powerUse: 12, unlockPressure: 13.33,
    effect: 'Extrait des minerais rares',
  },
  harvesting_robot: {
    id: 'harvesting_robot', name: 'Robot de récolte', icon: '🤖', category: 'extractor',
    tiPerSec: 80, produces: { algae: 1, seed_lirma: 1 },
    cost: { iron: 3, titanium: 2, circuit_board: 1 },
    powerUse: 6, unlockBiomass: 75000,
    effect: 'Récolte des items organiques environnants',
  },

  // ═══════════════════════════════════════════════════════════
  //  EXTRACTEURS DE GAZ
  // ═══════════════════════════════════════════════════════════
  gas_extractor_t1: {
    id: 'gas_extractor_t1', name: 'Extracteur de gaz T1', icon: '🌫️', category: 'extractor',
    tiPerSec: 200, pressureRate: 0.04,
    produces: { methane_cart: 1, nitrogen_cart: 1 },
    cost: { iron: 3, titanium: 2, cobalt: 1 },
    powerUse: 6, unlockPressure: 100e-3,
    effect: '+Pression → produit gaz méthane/azote',
  },
  gas_extractor_t2: {
    id: 'gas_extractor_t2', name: 'Extracteur de gaz T2', icon: '🌫️', category: 'extractor',
    tiPerSec: 500, pressureRate: 0.08,
    produces: { methane_cart: 2, nitrogen_cart: 2 },
    cost: { iron: 4, titanium: 3, iridium: 1, cobalt: 2 },
    powerUse: 10, unlockPlants: 15500,
    effect: '+Pression → produit plus de gaz',
  },

  // ═══════════════════════════════════════════════════════════
  //  CONCASSEURS (DLC Humble)
  // ═══════════════════════════════════════════════════════════
  ore_crusher_t1: { id: 'ore_crusher_t1', name: 'Concasseur T1', icon: '🪨', category: 'crusher', cost: { iron: 3, titanium: 2 }, powerUse: 8, dlc: 'humble', effect: 'Traite Dolomite/Bauxite/Uraninite' },
  ore_crusher_t2: { id: 'ore_crusher_t2', name: 'Concasseur T2', icon: '🪨', category: 'crusher', cost: { iron: 4, titanium: 3, cobalt: 1 }, powerUse: 12, dlc: 'humble', effect: 'Traite plus efficacement' },
  ore_crusher_t3: { id: 'ore_crusher_t3', name: 'Concasseur T3', icon: '🪨', category: 'crusher', cost: { iron: 5, titanium: 4, iridium: 1 }, powerUse: 18, dlc: 'humble', effect: 'Traite en grande quantité' },

  // ═══════════════════════════════════════════════════════════
  //  DIVERS
  // ═══════════════════════════════════════════════════════════
  communication_antenna: {
    id: 'communication_antenna', name: 'Antenne de communication', icon: '📡', category: 'misc',
    cost: { iron: 3, titanium: 2, silicon: 1 }, powerUse: 5, unlockPressure: 4e-6,
    effect: 'Améliore les communications',
  },
  silk_generator: {
    id: 'silk_generator', name: 'Générateur de soie', icon: '🕸️', category: 'misc',
    tiPerSec: 100, produces: { silk: 1 },
    cost: { iron: 2, titanium: 1, cobalt: 1 }, powerUse: 4, unlockInsects: 800000,
    effect: 'Produit de la soie → +100 Ti/s',
  },
  teleporter: {
    id: 'teleporter', name: 'Téléporteur', icon: '🌀', category: 'misc',
    cost: { iridium: 2, osmium: 1, circuit_board: 1 }, powerUse: 15, unlockTi: 25e9,
    effect: 'Téléportation rapide entre deux points',
  },
  machine_optimizer_t1: {
    id: 'machine_optimizer_t1', name: 'Optimiseur de machine T1', icon: '⚙️', category: 'misc',
    cost: { iron: 3, titanium: 2, circuit_board: 1 }, powerUse: 8, unlockTi: 70e6,
    effect: 'Accélère les machines environnantes (fuses)',
  },
  machine_optimizer_t2: {
    id: 'machine_optimizer_t2', name: 'Optimiseur de machine T2', icon: '⚙️', category: 'misc',
    cost: { iron: 4, titanium: 3, iridium: 1, circuit_board: 2 }, powerUse: 15, unlockHeat: 1.85e-3,
    effect: 'Accélère les machines environnantes (fuses, puissant)',
  },
  animal_feeder: {
    id: 'animal_feeder', name: 'Distributeur pour animaux', icon: '🍖', category: 'misc',
    cost: { iron: 2, titanium: 1 }, powerUse: 2, unlockTi: 1.25e12,
    effect: 'Nourrit automatiquement les animaux proches',
  },
  animal_shelter: {
    id: 'animal_shelter', name: 'Abri pour animaux', icon: '🏠', category: 'misc',
    tiPerSec: 200, biomassRate: 0.03,
    cost: { iron: 3, titanium: 2, cobalt: 1 }, powerUse: 3, unlockTi: 1.25e12,
    effect: '+Biomasse animale → protège les animaux',
  },
  water_life_collector: {
    id: 'water_life_collector', name: 'Collecteur de vie aquatique', icon: '🐠', category: 'misc',
    tiPerSec: 300, biomassRate: 0.04,
    cost: { iron: 3, titanium: 2, silicon: 1 }, powerUse: 5, unlockOxygen: 87e-3,
    effect: '+Biomasse animale → collecte la vie aquatique',
  },
  ecosystem: {
    id: 'ecosystem', name: 'Écosystème', icon: '🌍', category: 'misc',
    tiPerSec: 1000, biomassRate: 0.1,
    cost: { iron: 4, titanium: 3, iridium: 1, circuit_board: 1 }, powerUse: 10, unlockInsects: 64250,
    effect: '+Biomasse toutes catégories → +1 000 Ti/s',
  },
};

// ─── Catégories de machines ──────────────────────────────────
const MACHINE_CATEGORIES = {
  display:      { label: 'Écrans d\'affichage',   icon: '🖥️'  },
  craft:        { label: 'Stations de craft',     icon: '🔨' },
  energy:       { label: 'Générateurs d\'énergie',icon: '⚡' },
  heater:       { label: 'Chauffe-sols',          icon: '🌡️'  },
  drill:        { label: 'Foreuses',              icon: '⛏️'  },
  purifier:     { label: 'Purificateurs',         icon: '🌫️'  },
  plant_grower: { label: 'Producteurs de plantes',icon: '🌱' },
  food_grower:  { label: 'Producteurs de nourriture', icon: '🌾' },
  water:        { label: 'Collecteurs d\'eau',    icon: '💧' },
  detox:        { label: 'Détoxification',        icon: '🧹' },
  spreader:     { label: 'Épandeurs',             icon: '🌿' },
  animal_farm:  { label: 'Fermes animales',       icon: '🐾' },
  biodome:      { label: 'Biodômes',              icon: '🌐' },
  extractor:    { label: 'Extracteurs',           icon: '⛏️'  },
  crusher:      { label: 'Concasseurs',           icon: '🪨' },
  misc:         { label: 'Divers',                icon: '⚙️'  },
};

// ─── Machines disponibles dès le début (pour le panneau craft) ─
const STARTER_MACHINES = [
  'heater_t1', 'drill_t1', 'solar_t1', 'wind_turbine_t1',
  'vegetube_t1', 'grass_spreader', 'ore_extractor_t1',
  'water_collector_atmo', 'food_grower_t1', 'beehive_t1',
  'craft_t1', 'algae_t1',
];
