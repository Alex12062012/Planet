// ============================================================
//  BUILDINGS DATA  –  Base Building de The Planet Crafter
//  Source : wiki officiel
// ============================================================

const BUILDINGS = {

  // ═══════════════════════════════════════════════════════════
  //  ABRI DE FORTUNE
  // ═══════════════════════════════════════════════════════════
  makeshift_shelter: {
    id: 'makeshift_shelter', name: 'Abri de fortune', icon: '🏠', category: 'shelter',
    description: 'La plus petite base possible : une pièce et une porte. Fournit de l\'oxygène.',
    cost: { iron: 3, titanium: 2, silicon: 1 },
    unlockTi: 0,
  },

  // ═══════════════════════════════════════════════════════════
  //  STRUCTURES SIMPLES
  // ═══════════════════════════════════════════════════════════
  foundation_grid: {
    id: 'foundation_grid', name: 'Grille de fondation', icon: '🟫', category: 'structure',
    description: 'Crée des sols extérieurs ou supporte d\'autres structures.',
    cost: { iron: 1 }, unlockTi: 0,
  },
  foundation_angle: {
    id: 'foundation_angle', name: 'Fondation – Angle', icon: '📐', category: 'structure',
    description: 'Fondation à 90°.',
    cost: { iron: 1 }, unlockTi: 680e3,
  },
  foundation_slope: {
    id: 'foundation_slope', name: 'Fondation – Pente', icon: '🛝', category: 'structure',
    description: 'Pente 2×1, utilisable avec le véhicule rover.',
    cost: { iron: 2 }, unlockTi: 60e6,
  },
  outside_stairs: {
    id: 'outside_stairs', name: 'Escaliers extérieurs', icon: '🪜', category: 'structure',
    description: 'Pour atteindre de nouvelles hauteurs.',
    cost: { iron: 1 }, unlockTi: 0,
  },
  living_compartment: {
    id: 'living_compartment', name: 'Module d\'habitation', icon: '🏠', category: 'structure',
    description: 'Habitat de base, fournit de l\'oxygène même sans énergie.',
    cost: { iron: 2, titanium: 1 }, unlockTi: 0,
  },
  living_compartment_corner: {
    id: 'living_compartment_corner', name: 'Module d\'habitation – Angle', icon: '🏠', category: 'structure',
    description: 'Module d\'habitation avec mur en verre courbé.',
    cost: { iron: 1, titanium: 1, cobalt: 1 }, unlockBlueprint: true,
  },
  big_compartment: {
    id: 'big_compartment', name: 'Grand module d\'habitation', icon: '🏢', category: 'structure',
    description: 'Équivalent d\'un 2×2. Pas de cloisons intérieures.',
    cost: { iron: 3, titanium: 3, super_alloy: 2 }, unlockBlueprint: true,
  },
  compartment_3x3: {
    id: 'compartment_3x3', name: 'Module 3×3', icon: '🏢', category: 'structure',
    description: 'Équivalent d\'un 3×3. Acheté pour 10 000 Terra Tokens.',
    cost: { iron: 3, titanium: 3, super_alloy: 3 }, unlockTerraToken: 10000,
  },
  rounded_compartment: {
    id: 'rounded_compartment', name: 'Module arrondi', icon: '🔵', category: 'structure',
    description: 'Module 3×3 avec coins arrondis. 15 000 Terra Tokens.',
    cost: { iron: 3, titanium: 3, super_alloy: 3 }, unlockTerraToken: 15000,
  },
  compartment_dome: {
    id: 'compartment_dome', name: 'Module avec dôme', icon: '🌐', category: 'structure',
    description: 'Module 3×3 avec dôme transparent. 25 000 Terra Tokens.',
    cost: { iron: 3, cobalt: 3, super_alloy: 3 }, unlockTerraToken: 25000,
  },
  megadome: {
    id: 'megadome', name: 'Mégadôme', icon: '🏟️', category: 'structure',
    description: 'Très grande structure avec dôme transparent. Exclusive Sélenéa.',
    cost: { blazar_quartz: 4, selenium: 3, super_alloy_rod: 2 }, unlockTi: 5e12,
  },
  interior_stairs: {
    id: 'interior_stairs', name: 'Escaliers intérieurs', icon: '🪜', category: 'structure',
    description: 'Module 2×2 avec escaliers internes.',
    cost: { iron: 2, titanium: 2, aluminum: 2 }, unlockTi: 80e6,
  },

  // ═══════════════════════════════════════════════════════════
  //  MODIFICATIONS DE STRUCTURE
  // ═══════════════════════════════════════════════════════════
  fence: {
    id: 'fence', name: 'Clôture', icon: '🚧', category: 'alteration',
    description: 'Peut être placée à l\'intérieur ou à l\'extérieur.',
    cost: { silicon: 1 }, unlockBlueprint: true,
  },
  indoor_ladder: {
    id: 'indoor_ladder', name: 'Échelle intérieure', icon: '🪜', category: 'alteration',
    description: 'Accès entre niveaux et accès au toit.',
    cost: { cobalt: 1, iron: 1 }, unlockOxygen: 1,
  },
  interior_wall: {
    id: 'interior_wall', name: 'Mur intérieur', icon: '🧱', category: 'alteration',
    description: 'Cloison pour modules d\'habitation standard.',
    cost: { iron: 2 }, unlockBlueprint: true,
  },
  compartment_door: {
    id: 'compartment_door', name: 'Porte de module', icon: '🚪', category: 'alteration',
    description: 'Accès au module d\'habitation.',
    cost: { iron: 1, silicon: 1, titanium: 1 }, unlockTi: 0,
  },
  compartment_glass: {
    id: 'compartment_glass', name: 'Verre de module', icon: '🪟', category: 'alteration',
    description: 'Sol ou plafond en verre.',
    cost: { titanium: 1, cobalt: 1 }, unlockPressure: 4e-6,
  },
  compartment_window: {
    id: 'compartment_window', name: 'Fenêtre de module', icon: '🪟', category: 'alteration',
    description: 'Mur en verre pour modules.',
    cost: { iron: 1, cobalt: 1 }, unlockPressure: 250e-9,
  },

  // ═══════════════════════════════════════════════════════════
  //  ÉCLAIRAGE
  // ═══════════════════════════════════════════════════════════
  area_lamp: {
    id: 'area_lamp', name: 'Lampe de zone', icon: '💡', category: 'lighting',
    description: 'Lampe posable partout.',
    cost: { magnesium: 1, cobalt: 1 }, powerUse: 1.2, unlockBlueprint: true,
  },
  beacon: {
    id: 'beacon', name: 'Balise', icon: '🔦', category: 'lighting',
    description: 'Aide à s\'orienter. Couleur et nom personnalisables.',
    cost: { titanium: 1, silicon: 1, aluminum: 1 }, powerUse: 0.25, unlockHeat: 5e-9,
  },
  outside_lamp: {
    id: 'outside_lamp', name: 'Lampe extérieure', icon: '🕯️', category: 'lighting',
    description: 'Éclaire les zones extérieures.',
    cost: { iron: 1, magnesium: 1 }, powerUse: 0.3, unlockTi: 0,
  },
  light_box: {
    id: 'light_box', name: 'Caisson lumineux', icon: '📦', category: 'lighting',
    description: 'Grande lampe cubique.',
    cost: { silicon: 2, solar_quartz: 1 }, unlockBlueprint: 'wreck',
  },

  // ═══════════════════════════════════════════════════════════
  //  STOCKAGE
  // ═══════════════════════════════════════════════════════════
  storage_crate:   { id: 'storage_crate',   name: 'Caisse de stockage',    icon: '📦', category: 'storage', cost: { iron: 1 } },
  countertop:      { id: 'countertop',      name: 'Plan de travail',        icon: '🗄️',  category: 'storage', cost: { iron: 1, aluminum: 1 } },
  countertop_2:    { id: 'countertop_2',    name: 'Plan de travail 2',      icon: '🗄️',  category: 'storage', cost: { iron: 1, aluminum: 1 } },
  fridge:          { id: 'fridge',          name: 'Réfrigérateur',          icon: '🧊', category: 'storage', cost: { iron: 2, cobalt: 1 } },
  locker:          { id: 'locker',          name: 'Casier de stockage',     icon: '🗃️',  category: 'storage', cost: { iron: 2, titanium: 1 }, unlockTi: 50e3 },
  locker_t2:       { id: 'locker_t2',       name: 'Casier de stockage T2',  icon: '🗃️',  category: 'storage', cost: { iron: 3, titanium: 2, aluminum: 1 }, unlockTerraToken: 5000 },
  toxic_storage:   { id: 'toxic_storage',   name: 'Stockage goo toxique',   icon: '☣️',  category: 'storage', cost: { iron: 2, zeolite: 1 }, dlc: 'toxicity' },
  safe_vault:      { id: 'safe_vault',       name: 'Coffre fort',           icon: '🔒', category: 'storage', cost: { iron: 3, titanium: 2 } },
  canister:        { id: 'canister',         name: 'Bidon',                 icon: '🧴', category: 'storage', cost: { iron: 1 } },
  golden_crate:    { id: 'golden_crate',     name: 'Caisse dorée',          icon: '🌟', category: 'storage', cost: { iron: 2, super_alloy: 1 } },
  big_safe:        { id: 'big_safe',         name: 'Grand coffre',          icon: '🔐', category: 'storage', cost: { iron: 4, titanium: 2, cobalt: 1 } },

  // ═══════════════════════════════════════════════════════════
  //  MEUBLES & DÉCORATION
  // ═══════════════════════════════════════════════════════════
  bed:             { id: 'bed',             name: 'Lit',              icon: '🛏️',  category: 'furniture', cost: { iron: 1, aluminum: 1 } },
  double_bed:      { id: 'double_bed',      name: 'Lit double',       icon: '🛏️',  category: 'furniture', cost: { iron: 2, aluminum: 2 }, unlockTi: 25e3 },
  chair:           { id: 'chair',           name: 'Chaise',           icon: '🪑', category: 'furniture', cost: { iron: 1 } },
  sofa:            { id: 'sofa',            name: 'Canapé',           icon: '🛋️',  category: 'furniture', cost: { iron: 2, aluminum: 1 } },
  big_table:       { id: 'big_table',       name: 'Grande table',     icon: '🪑', category: 'furniture', cost: { iron: 2, aluminum: 1 } },
  small_table:     { id: 'small_table',     name: 'Petite table',     icon: '🪑', category: 'furniture', cost: { iron: 1 } },
  glass_table:     { id: 'glass_table',     name: 'Table en verre',   icon: '🪑', category: 'furniture', cost: { silicon: 2, cobalt: 1 } },
  desktop:         { id: 'desktop',         name: 'Bureau',           icon: '💻', category: 'furniture', cost: { iron: 2, silicon: 1 } },
  pool_table:      { id: 'pool_table',      name: 'Table de billard', icon: '🎱', category: 'furniture', cost: { iron: 3, aluminum: 2 } },
  treadmill:       { id: 'treadmill',       name: 'Tapis de course',  icon: '🏃', category: 'furniture', cost: { iron: 2, titanium: 1 } },
  indoor_bike:     { id: 'indoor_bike',     name: 'Vélo d\'intérieur',icon: '🚲', category: 'furniture', cost: { iron: 2, cobalt: 1 } },
  faucet:          { id: 'faucet',          name: 'Robinet',          icon: '🚿', category: 'furniture', cost: { iron: 1, cobalt: 1 } },
  fireplace:       { id: 'fireplace',       name: 'Cheminée',         icon: '🔥', category: 'furniture', cost: { iron: 2, silicon: 1 }, unlockBlueprint: 'portal' },
  fountain:        { id: 'fountain',        name: 'Fontaine',         icon: '⛲', category: 'furniture', cost: { iron: 3, cobalt: 2 }, unlockTerraToken: 20000 },
  planet_viewer:   { id: 'planet_viewer',   name: 'Observatoire',     icon: '🔭', category: 'furniture', cost: { iron: 2, silicon: 2 } },

  // ═══════════════════════════════════════════════════════════
  //  AFFICHAGES & DÉCORATIONS
  // ═══════════════════════════════════════════════════════════
  flower_pot:         { id: 'flower_pot',         name: 'Pot de fleurs',           icon: '🪴', category: 'display_deco', cost: { iron: 1, silicon: 1 } },
  big_flower_pot:     { id: 'big_flower_pot',     name: 'Grand pot de fleurs',     icon: '🪴', category: 'display_deco', cost: { iron: 2, silicon: 1 } },
  hanging_flower_pot: { id: 'hanging_flower_pot', name: 'Pot suspendu',            icon: '🌺', category: 'display_deco', cost: { iron: 1, cobalt: 1 } },
  bonsai_pot:         { id: 'bonsai_pot',         name: 'Pot bonsaï',              icon: '🎋', category: 'display_deco', cost: { iron: 1, silicon: 1 } },
  tree_pot:           { id: 'tree_pot',           name: 'Pot d\'arbre',            icon: '🌳', category: 'display_deco', cost: { iron: 2, silicon: 1 }, unlockBlueprint: 'portal' },
  display_case:       { id: 'display_case',       name: 'Vitrine',                 icon: '🗃️',  category: 'display_deco', cost: { iron: 2, silicon: 1, cobalt: 1 } },
  butterfly_box:      { id: 'butterfly_box',      name: 'Boîte d\'exposition papillons', icon: '🦋', category: 'display_deco', cost: { iron: 2, silicon: 2 }, unlockInsects: 2500 },
  fish_display:       { id: 'fish_display',       name: 'Exposition de poissons',  icon: '🐠', category: 'display_deco', cost: { iron: 2, silicon: 2, cobalt: 1 }, unlockAnimals: 2500 },
  frog_display:       { id: 'frog_display',       name: 'Exposition de grenouilles',icon: '🐸', category: 'display_deco', cost: { iron: 2, silicon: 2 }, unlockAnimals: 67000 },
  spacesuit_display:  { id: 'spacesuit_display',  name: 'Présentoir combinaison',  icon: '👔', category: 'display_deco', cost: { iron: 2, titanium: 1 } },
  hologram_projector: { id: 'hologram_projector', name: 'Projecteur hologramme',   icon: '🔮', category: 'display_deco', cost: { silicon: 2, iridium: 1 }, unlockTerraToken: 15000 },
  library_shelves:    { id: 'library_shelves',    name: 'Rayons bibliothèque',      icon: '📚', category: 'display_deco', cost: { iron: 2, aluminum: 1 } },

  // ═══════════════════════════════════════════════════════════
  //  STRUCTURES FONCTIONNELLES
  // ═══════════════════════════════════════════════════════════
  launch_platform: {
    id: 'launch_platform', name: 'Plateforme de lancement', icon: '🚀', category: 'functional',
    description: 'Permet de lancer des fusées pour accélérer la terraformation.',
    cost: { super_alloy: 3, titanium: 3, iron: 3 },
    powerUse: 55, unlockTi: 345e3,
  },
};

// ─── Catégories de bâtiments ─────────────────────────────────
const BUILDING_CATEGORIES = {
  shelter:      { label: 'Abri',                  icon: '🏠' },
  structure:    { label: 'Structures simples',     icon: '🧱' },
  alteration:   { label: 'Modifications',          icon: '🪟' },
  lighting:     { label: 'Éclairage',              icon: '💡' },
  storage:      { label: 'Stockage',               icon: '📦' },
  furniture:    { label: 'Mobilier',               icon: '🛋️'  },
  display_deco: { label: 'Décoration',             icon: '🪴' },
  functional:   { label: 'Structures fonctionnelles', icon: '🚀' },
};

// ─── Fusées (liées à la plateforme de lancement) ─────────────
const ROCKETS = {
  magnetic_field:     { id: 'magnetic_field',     name: 'Fusée Champ magnétique',     icon: '🚀', cost: { iron: 3, titanium: 2, iridium: 1 }, effect: 'Déclenche une pluie d\'Iridium' },
  asteroid_attraction:{ id: 'asteroid_attraction', name: 'Fusée Attraction d\'astéroïdes', icon: '🚀', cost: { iron: 3, titanium: 2, cobalt: 1 }, effect: 'Déclenche une pluie d\'Uranium' },
  plant_rocket:       { id: 'plant_rocket',       name: 'Fusée Plantes',              icon: '🚀', cost: { iron: 2, titanium: 1, seed_lirma: 2 }, unlockBiomass: 175000, effect: 'Déclenche une tempête verte' },
  seed_spreader:      { id: 'seed_spreader',       name: 'Fusée Graines',              icon: '🚀', cost: { iron: 2, titanium: 1, seed_shanga: 2 }, unlockTi: 650e6, effect: 'Répand des graines → tempête verte' },
  insect_spreader:    { id: 'insect_spreader',     name: 'Fusée Insectes',             icon: '🚀', cost: { iron: 2, titanium: 2, common_larva: 2 }, unlockBiomass: 17700, effect: 'Répand des insectes' },
  animals_spreader:   { id: 'animals_spreader',    name: 'Fusée Animaux',              icon: '🚀', cost: { iron: 3, titanium: 2, fish_provios: 1 }, unlockBiomass: 70000, effect: 'Répand des animaux' },
  gps_t1:             { id: 'gps_t1',              name: 'Satellite GPS T1',           icon: '🛸', cost: { iron: 2, silicon: 2 }, effect: 'Améliore la cartographie' },
  gps_t2:             { id: 'gps_t2',              name: 'Satellite GPS T2',           icon: '🛸', cost: { iron: 2, silicon: 2, circuit_board: 1 }, effect: 'Suit les météorites en temps réel' },
  gps_t3:             { id: 'gps_t3',              name: 'Satellite GPS T3',           icon: '🛸', cost: { iron: 3, silicon: 2, circuit_board: 2 }, effect: 'Cartographie avancée' },
  gps_t4:             { id: 'gps_t4',              name: 'Satellite GPS T4',           icon: '🛸', cost: { iron: 3, silicon: 3, iridium: 1 }, effect: 'Cartographie ultra-précise' },
  map_info:           { id: 'map_info',            name: 'Fusée Informations carte',   icon: '🚀', cost: { iron: 2, titanium: 1, silicon: 1 }, effect: 'Affiche les zones d\'intérêt' },
  map_info_t2:        { id: 'map_info_t2',         name: 'Fusée Informations carte T2',icon: '🚀', cost: { iron: 3, titanium: 2, circuit_board: 1 }, effect: 'Affiche les emplacements robots' },
  drone_viz:          { id: 'drone_viz',           name: 'Fusée Visualisation drones', icon: '🚀', cost: { iron: 2, silicon: 1 }, effect: 'Visualise les drones' },
  space_trading:      { id: 'space_trading',       name: 'Fusée Commerce spatial',     icon: '🚀', cost: { iron: 3, titanium: 2, iridium: 1 }, effect: 'Commerce de Terra Tokens' },
  extraction:         { id: 'extraction',          name: 'Fusée Extraction',           icon: '🚀', cost: { iron: 3, titanium: 2 }, unlockTi: 4e12, effect: 'Extraction de ressources spatiales' },
  interplanetary:     { id: 'interplanetary',      name: 'Fusée Voyage interplanétaire',icon: '🚀', cost: { iron: 4, titanium: 3, iridium: 2 }, unlockTi: 4.15e12, effect: 'Voyage entre planètes' },
  purification_rocket:{ id: 'purification_rocket', name: 'Fusée Purification',         icon: '🚀', cost: { iron: 3, titanium: 2, zeolite: 2 }, dlc: 'toxicity', effect: 'Purification rapide de la planète' },
};
