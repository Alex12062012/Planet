// ============================================================
//  ITEMS DATA  –  Tous les objets de The Planet Crafter
//  Source : wiki officiel
// ============================================================

const ITEMS = {

  // ═══════════════════════════════════════════════════════════
  //  MINERAIS
  // ═══════════════════════════════════════════════════════════
  iron:        { id: 'iron',        name: 'Fer',           icon: '🪨', category: 'ore', color: '#8B4513', rarity: 'common',   spawnWeight: 30 },
  aluminum:    { id: 'aluminum',    name: 'Aluminium',     icon: '⬜', category: 'ore', color: '#C0C0C0', rarity: 'common',   spawnWeight: 25 },
  cobalt:      { id: 'cobalt',      name: 'Cobalt',        icon: '🔵', category: 'ore', color: '#0047AB', rarity: 'uncommon', spawnWeight: 15 },
  ice:         { id: 'ice',         name: 'Glace',         icon: '🧊', category: 'ore', color: '#ADD8E6', rarity: 'common',   spawnWeight: 20 },
  iridium:     { id: 'iridium',     name: 'Iridium',       icon: '💜', category: 'ore', color: '#7F00FF', rarity: 'rare',     spawnWeight: 5  },
  magnesium:   { id: 'magnesium',   name: 'Magnésium',     icon: '⚪', category: 'ore', color: '#B0C4DE', rarity: 'common',   spawnWeight: 20 },
  obsidian:    { id: 'obsidian',    name: 'Obsidienne',    icon: '⬛', category: 'ore', color: '#1C1C1C', rarity: 'uncommon', spawnWeight: 10 },
  osmium:      { id: 'osmium',      name: 'Osmium',        icon: '🟣', category: 'ore', color: '#6A0DAD', rarity: 'rare',     spawnWeight: 5  },
  phosphorus:  { id: 'phosphorus',  name: 'Phosphore',     icon: '🟡', category: 'ore', color: '#FFFF00', rarity: 'uncommon', spawnWeight: 12 },
  selenium:    { id: 'selenium',    name: 'Sélénium',      icon: '🟠', category: 'ore', color: '#FF8C00', rarity: 'uncommon', spawnWeight: 12 },
  silicon:     { id: 'silicon',     name: 'Silicium',      icon: '💎', category: 'ore', color: '#4169E1', rarity: 'uncommon', spawnWeight: 15 },
  sulfur:      { id: 'sulfur',      name: 'Soufre',        icon: '🟤', category: 'ore', color: '#FFD700', rarity: 'common',   spawnWeight: 18 },
  super_alloy: { id: 'super_alloy', name: 'Super Alliage', icon: '✨', category: 'ore', color: '#FFD700', rarity: 'rare',     spawnWeight: 4  },
  titanium:    { id: 'titanium',    name: 'Titane',        icon: '⚙️',  category: 'ore', color: '#708090', rarity: 'uncommon', spawnWeight: 14 },
  tungsten:    { id: 'tungsten',    name: 'Tungstène',     icon: '🔩', category: 'ore', color: '#696969', rarity: 'rare',     spawnWeight: 6  },
  uranium:     { id: 'uranium',     name: 'Uranium',       icon: '☢️',  category: 'ore', color: '#7FFF00', rarity: 'rare',     spawnWeight: 4  },
  zeolite:     { id: 'zeolite',     name: 'Zéolite',       icon: '🔮', category: 'ore', color: '#9370DB', rarity: 'uncommon', spawnWeight: 10 },

  // ═══════════════════════════════════════════════════════════
  //  INDUSTRIELS (Advanced Craft Station)
  // ═══════════════════════════════════════════════════════════
  iridium_rod:      { id: 'iridium_rod',      name: 'Barreau Iridium',       icon: '🔧', category: 'industrial', color: '#7F00FF' },
  uranium_rod:      { id: 'uranium_rod',      name: 'Barreau Uranium',       icon: '🔧', category: 'industrial', color: '#7FFF00' },
  super_alloy_rod:  { id: 'super_alloy_rod',  name: 'Barreau Super Alliage', icon: '🔧', category: 'industrial', color: '#FFD700' },
  osmium_rod:       { id: 'osmium_rod',       name: 'Barreau Osmium',        icon: '🔧', category: 'industrial', color: '#6A0DAD' },
  circuit_board:    { id: 'circuit_board',    name: 'Circuit électronique',  icon: '📟', category: 'industrial', color: '#00FF00' },
  rocket_engine:    { id: 'rocket_engine',    name: 'Moteur fusée',          icon: '🚀', category: 'industrial', color: '#FF4500' },
  rocket_engine_t2: { id: 'rocket_engine_t2', name: 'Moteur fusée T2',       icon: '🚀', category: 'industrial', color: '#FF6500' },
  fusion_cell:      { id: 'fusion_cell',      name: 'Cellule Fusion',        icon: '⚡', category: 'industrial', color: '#00BFFF' },

  // ═══════════════════════════════════════════════════════════
  //  BIO LAB
  // ═══════════════════════════════════════════════════════════
  algae:          { id: 'algae',          name: 'Algues',             icon: '🌿', category: 'biolab', color: '#228B22' },
  bacteria:       { id: 'bacteria',       name: 'Bactéries',          icon: '🦠', category: 'biolab', color: '#90EE90' },
  bioplastic:     { id: 'bioplastic',     name: 'Bioplastique',       icon: '🟩', category: 'biolab', color: '#32CD32' },
  explosive_pwd:  { id: 'explosive_pwd',  name: 'Poudre explosive',   icon: '💥', category: 'biolab', color: '#FF4500' },
  fabric:         { id: 'fabric',         name: 'Tissu',              icon: '🧵', category: 'biolab', color: '#DEB887' },
  smart_fabric:   { id: 'smart_fabric',   name: 'Tissu intelligent',  icon: '🧶', category: 'biolab', color: '#DAA520' },
  fertilizer:     { id: 'fertilizer',     name: 'Engrais T1',         icon: '🌱', category: 'biolab', color: '#8B4513' },
  fertilizer_t2:  { id: 'fertilizer_t2',  name: 'Engrais T2',         icon: '🌱', category: 'biolab', color: '#6B8E23' },
  fertilizer_t3:  { id: 'fertilizer_t3',  name: 'Engrais T3',         icon: '🌱', category: 'biolab', color: '#556B2F' },
  honey:          { id: 'honey',          name: 'Miel',               icon: '🍯', category: 'biolab', color: '#FFA500' },
  methane_cart:   { id: 'methane_cart',   name: 'Cartouche méthane',  icon: '🔴', category: 'biolab', color: '#DC143C' },
  nitrogen_cart:  { id: 'nitrogen_cart',  name: 'Cartouche azote',    icon: '🔵', category: 'biolab', color: '#1E90FF' },
  mutagen:        { id: 'mutagen',        name: 'Mutagène T1',        icon: '🧬', category: 'biolab', color: '#FF00FF' },
  mutagen_t2:     { id: 'mutagen_t2',     name: 'Mutagène T2',        icon: '🧬', category: 'biolab', color: '#FF69B4' },
  mutagen_t3:     { id: 'mutagen_t3',     name: 'Mutagène T3',        icon: '🧬', category: 'biolab', color: '#FF1493' },
  mutagen_t4:     { id: 'mutagen_t4',     name: 'Mutagène T4',        icon: '🧬', category: 'biolab', color: '#C71585' },
  phyto_a:        { id: 'phyto_a',        name: 'Phytoplancton A',    icon: '🔬', category: 'biolab', color: '#00CED1' },
  phyto_b:        { id: 'phyto_b',        name: 'Phytoplancton B',    icon: '🔬', category: 'biolab', color: '#20B2AA' },
  phyto_c:        { id: 'phyto_c',        name: 'Phytoplancton C',    icon: '🔬', category: 'biolab', color: '#008B8B' },
  pulsar_quartz:  { id: 'pulsar_quartz',  name: 'Quartz Pulsar',      icon: '💫', category: 'biolab', color: '#FF1493' },
  silk:           { id: 'silk',           name: 'Soie',               icon: '🕸️',  category: 'biolab', color: '#F5F5DC' },
  animal_food_t1: { id: 'animal_food_t1', name: 'Nourriture animale T1', icon: '🍖', category: 'biolab', color: '#8B4513' },
  animal_food_t2: { id: 'animal_food_t2', name: 'Nourriture animale T2', icon: '🍖', category: 'biolab', color: '#A0522D' },
  animal_food_t3: { id: 'animal_food_t3', name: 'Nourriture animale T3', icon: '🍖', category: 'biolab', color: '#CD853F' },

  // ═══════════════════════════════════════════════════════════
  //  GRAINES – FLEURS
  // ═══════════════════════════════════════════════════════════
  seed_lirma:   { id: 'seed_lirma',   name: 'Graine Lirma',   icon: '🌸', category: 'seed_flower', bonus: 100,  color: '#FFB6C1' },
  seed_shanga:  { id: 'seed_shanga',  name: 'Graine Shanga',  icon: '🌸', category: 'seed_flower', bonus: 150,  color: '#FF69B4' },
  seed_pestera: { id: 'seed_pestera', name: 'Graine Pestera', icon: '🌸', category: 'seed_flower', bonus: 200,  color: '#FF1493' },
  seed_snepea:  { id: 'seed_snepea',  name: 'Graine Snepea',  icon: '🌸', category: 'seed_flower', bonus: 200,  color: '#DB7093' },
  seed_brelea:  { id: 'seed_brelea',  name: 'Graine Brelea',  icon: '🌸', category: 'seed_flower', bonus: 250,  color: '#C71585' },
  seed_nulna:   { id: 'seed_nulna',   name: 'Graine Nulna',   icon: '🌸', category: 'seed_flower', bonus: 300,  color: '#9932CC' },
  seed_seleus:  { id: 'seed_seleus',  name: 'Graine Seleus',  icon: '🌸', category: 'seed_flower', bonus: 300,  color: '#8B008B' },
  seed_furteo:  { id: 'seed_furteo',  name: 'Graine Furteo',  icon: '🌺', category: 'seed_flower', bonus: 350,  color: '#FF6347' },
  seed_tuska:   { id: 'seed_tuska',   name: 'Graine Tuska',   icon: '🌺', category: 'seed_flower', bonus: 400,  color: '#FF4500' },
  plant_orema:  { id: 'plant_orema',  name: 'Plante Orema',   icon: '🌺', category: 'seed_flower', bonus: 450,  color: '#FF8C00' },
  plant_volnus: { id: 'plant_volnus', name: 'Plante Volnus',  icon: '🌺', category: 'seed_flower', bonus: 500,  color: '#FFA500' },
  golden_seed:  { id: 'golden_seed',  name: 'Graine Dorée',   icon: '🌟', category: 'seed_flower', bonus: 600,  color: '#FFD700' },
  seed_humblea: { id: 'seed_humblea', name: 'Graine Humblea', icon: '🌸', category: 'seed_flower', bonus: 600,  color: '#FFDEAD' },

  // ═══════════════════════════════════════════════════════════
  //  GRAINES – ARBRES
  // ═══════════════════════════════════════════════════════════
  tree_bark:      { id: 'tree_bark',      name: 'Écorce',                icon: '🪵', category: 'seed_tree', bonus: 0,    color: '#8B4513' },
  tree_iterra:    { id: 'tree_iterra',    name: 'Arbre Iterra',          icon: '🌲', category: 'seed_tree', bonus: 125,  color: '#228B22' },
  tree_linifolia: { id: 'tree_linifolia', name: 'Arbre Linifolia',       icon: '🌲', category: 'seed_tree', bonus: 125,  color: '#2E8B57' },
  tree_aleatus:   { id: 'tree_aleatus',   name: 'Arbre Aleatus',         icon: '🌲', category: 'seed_tree', bonus: 125,  color: '#006400' },
  tree_soleus:    { id: 'tree_soleus',    name: 'Arbre Soleus',          icon: '🌲', category: 'seed_tree', bonus: 125,  color: '#008000' },
  tree_cernea:    { id: 'tree_cernea',    name: 'Arbre Cernea',          icon: '🌲', category: 'seed_tree', bonus: 150,  color: '#32CD32' },
  tree_elegea:    { id: 'tree_elegea',    name: 'Arbre Elegea',          icon: '🌲', category: 'seed_tree', bonus: 175,  color: '#90EE90' },
  tree_humelora:  { id: 'tree_humelora',  name: 'Arbre Humelora',        icon: '🌳', category: 'seed_tree', bonus: 250,  color: '#3CB371' },
  tree_aemora:    { id: 'tree_aemora',    name: 'Arbre Aemora',          icon: '🌳', category: 'seed_tree', bonus: 400,  color: '#20B2AA' },
  tree_pleom:     { id: 'tree_pleom',     name: 'Arbre Pleom',           icon: '🌳', category: 'seed_tree', bonus: 350,  color: '#66CDAA' },
  tree_shreox:    { id: 'tree_shreox',    name: 'Arbre Shreox',          icon: '🌳', category: 'seed_tree', bonus: 450,  color: '#00FA9A' },
  tree_rosea:     { id: 'tree_rosea',     name: 'Arbre Rosea',           icon: '🌳', category: 'seed_tree', bonus: 600,  color: '#FF6347' },
  tree_malissea:  { id: 'tree_malissea',  name: 'Arbre Malissea',        icon: '🌳', category: 'seed_tree', bonus: 800,  color: '#DC143C' },
  tree_prunea:    { id: 'tree_prunea',    name: 'Arbre Prunea',          icon: '🌳', category: 'seed_tree', bonus: 1200, color: '#B22222' },
  tree_lillia:    { id: 'tree_lillia',    name: 'Arbre Lillia',          icon: '🌳', category: 'seed_tree', bonus: 1200, color: '#FF00FF' },
  tree_ruberu:    { id: 'tree_ruberu',    name: 'Arbre Ruberu',          icon: '🌳', category: 'seed_tree', bonus: 1200, color: '#8B0000' },
  tree_redwo:     { id: 'tree_redwo',     name: 'Arbre Redwo',           icon: '🌳', category: 'seed_tree', bonus: 1300, color: '#800000' },
  tree_pamelia:   { id: 'tree_pamelia',   name: 'Arbre Pamelia',         icon: '🌳', category: 'seed_tree', bonus: 1300, color: '#A52A2A' },
  tree_detoxo:    { id: 'tree_detoxo',    name: 'Arbre Detoxo',          icon: '🌳', category: 'seed_tree', bonus: 1350, color: '#556B2F' },

  // ═══════════════════════════════════════════════════════════
  //  GRAINES – CULTURES
  // ═══════════════════════════════════════════════════════════
  bean_seeds:     { id: 'bean_seeds',     name: 'Graines haricot',   icon: '🫘', category: 'seed_crop', color: '#8FBC8F' },
  cocoa_seed:     { id: 'cocoa_seed',     name: 'Graine cacao',      icon: '🍫', category: 'seed_crop', color: '#7B3F00' },
  eggplant_seeds: { id: 'eggplant_seeds', name: 'Graines aubergine', icon: '🍆', category: 'seed_crop', color: '#614051' },
  mushroom_seeds: { id: 'mushroom_seeds', name: 'Graines champignon',icon: '🍄', category: 'seed_crop', color: '#CC5500' },
  squash_seeds:   { id: 'squash_seeds',   name: 'Graines courge',    icon: '🎃', category: 'seed_crop', color: '#FF7518' },
  wheat_seeds:    { id: 'wheat_seeds',    name: 'Graines blé',       icon: '🌾', category: 'seed_crop', color: '#F5DEB3' },

  // ═══════════════════════════════════════════════════════════
  //  LARVES – BASIQUES
  // ═══════════════════════════════════════════════════════════
  common_larva:   { id: 'common_larva',   name: 'Larve commune',      icon: '🐛', category: 'larva_basic', bonus: 100, color: '#9ACD32' },
  uncommon_larva: { id: 'uncommon_larva', name: 'Larve peu commune',  icon: '🐛', category: 'larva_basic', bonus: 150, color: '#32CD32' },
  rare_larva:     { id: 'rare_larva',     name: 'Larve rare',         icon: '🐛', category: 'larva_basic', bonus: 200, color: '#00FF7F' },
  bee_larva:      { id: 'bee_larva',      name: 'Larve abeille',      icon: '🐝', category: 'larva_basic', bonus: 250, color: '#FFD700' },
  silk_worm:      { id: 'silk_worm',      name: 'Ver à soie',         icon: '🪱', category: 'larva_basic', bonus: 300, color: '#F5F5DC' },

  // ═══════════════════════════════════════════════════════════
  //  LARVES – PAPILLONS
  // ═══════════════════════════════════════════════════════════
  bfly_azurae:   { id: 'bfly_azurae',   name: 'Papillon Azurae',   icon: '🦋', category: 'larva_butterfly', bonus: 120  },
  bfly_empalio:  { id: 'bfly_empalio',  name: 'Papillon Empalio',  icon: '🦋', category: 'larva_butterfly', bonus: 120  },
  bfly_abstreus: { id: 'bfly_abstreus', name: 'Papillon Abstreus', icon: '🦋', category: 'larva_butterfly', bonus: 175  },
  bfly_galaxe:   { id: 'bfly_galaxe',   name: 'Papillon Galaxe',   icon: '🦋', category: 'larva_butterfly', bonus: 175  },
  bfly_leani:    { id: 'bfly_leani',    name: 'Papillon Leani',    icon: '🦋', category: 'larva_butterfly', bonus: 175  },
  bfly_fensea:   { id: 'bfly_fensea',   name: 'Papillon Fensea',   icon: '🦋', category: 'larva_butterfly', bonus: 200  },
  bfly_penga:    { id: 'bfly_penga',    name: 'Papillon Penga',    icon: '🦋', category: 'larva_butterfly', bonus: 230  },
  bfly_chevrone: { id: 'bfly_chevrone', name: 'Papillon Chevrone', icon: '🦋', category: 'larva_butterfly', bonus: 250  },
  bfly_aemel:    { id: 'bfly_aemel',    name: 'Papillon Aemel',    icon: '🦋', category: 'larva_butterfly', bonus: 300  },
  bfly_liux:     { id: 'bfly_liux',     name: 'Papillon Liux',     icon: '🦋', category: 'larva_butterfly', bonus: 500  },
  bfly_fiorente: { id: 'bfly_fiorente', name: 'Papillon Fiorente', icon: '🦋', category: 'larva_butterfly', bonus: 600  },
  bfly_lorpen:   { id: 'bfly_lorpen',   name: 'Papillon Lorpen',   icon: '🦋', category: 'larva_butterfly', bonus: 600  },
  bfly_nere:     { id: 'bfly_nere',     name: 'Papillon Nere',     icon: '🦋', category: 'larva_butterfly', bonus: 600  },
  bfly_alben:    { id: 'bfly_alben',    name: 'Papillon Alben',    icon: '🦋', category: 'larva_butterfly', bonus: 700  },
  bfly_futura:   { id: 'bfly_futura',   name: 'Papillon Futura',   icon: '🦋', category: 'larva_butterfly', bonus: 800  },
  bfly_imeo:     { id: 'bfly_imeo',     name: 'Papillon Imeo',     icon: '🦋', category: 'larva_butterfly', bonus: 1000 },
  bfly_serena:   { id: 'bfly_serena',   name: 'Papillon Serena',   icon: '🦋', category: 'larva_butterfly', bonus: 1200 },
  bfly_faleria:  { id: 'bfly_faleria',  name: 'Papillon Faleria',  icon: '🦋', category: 'larva_butterfly', bonus: 1400 },
  bfly_golden:   { id: 'bfly_golden',   name: 'Papillon Doré',     icon: '🦋', category: 'larva_butterfly', bonus: 1500 },
  bfly_oesbe:    { id: 'bfly_oesbe',    name: 'Papillon Oesbe',    icon: '🦋', category: 'larva_butterfly', bonus: 1500 },

  // ═══════════════════════════════════════════════════════════
  //  OEUFS DE POISSONS
  // ═══════════════════════════════════════════════════════════
  fish_provios: { id: 'fish_provios', name: 'Oeufs Provios',  icon: '🐠', category: 'fish_eggs', bonus: 100  },
  fish_vilnus:  { id: 'fish_vilnus',  name: 'Oeufs Vilnus',   icon: '🐠', category: 'fish_eggs', bonus: 150  },
  fish_gerrero: { id: 'fish_gerrero', name: 'Oeufs Gerrero',  icon: '🐠', category: 'fish_eggs', bonus: 150  },
  fish_khrom:   { id: 'fish_khrom',   name: 'Oeufs Khrom',    icon: '🐟', category: 'fish_eggs', bonus: 200  },
  fish_ulani:   { id: 'fish_ulani',   name: 'Oeufs Ulani',    icon: '🐟', category: 'fish_eggs', bonus: 250  },
  fish_aelera:  { id: 'fish_aelera',  name: 'Oeufs Aelera',   icon: '🐟', category: 'fish_eggs', bonus: 300  },
  fish_tegede:  { id: 'fish_tegede',  name: 'Oeufs Tegede',   icon: '🐟', category: 'fish_eggs', bonus: 300  },
  fish_ecaru:   { id: 'fish_ecaru',   name: 'Oeufs Ecaru',    icon: '🐟', category: 'fish_eggs', bonus: 325  },
  fish_buyu:    { id: 'fish_buyu',    name: 'Oeufs Buyu',     icon: '🐟', category: 'fish_eggs', bonus: 350  },
  fish_tiloo:   { id: 'fish_tiloo',   name: 'Oeufs Tiloo',    icon: '🐡', category: 'fish_eggs', bonus: 400  },
  fish_galbea:  { id: 'fish_galbea',  name: 'Oeufs Galbea',   icon: '🐡', category: 'fish_eggs', bonus: 450  },
  fish_golden:  { id: 'fish_golden',  name: 'Oeufs Dorés',    icon: '🌟', category: 'fish_eggs', bonus: 500  },
  fish_velkia:  { id: 'fish_velkia',  name: 'Oeufs Velkia',   icon: '🐡', category: 'fish_eggs', bonus: 500  },
  fish_stabu:   { id: 'fish_stabu',   name: 'Oeufs Stabu',    icon: '🐡', category: 'fish_eggs', bonus: 1000 },
  fish_atabu:   { id: 'fish_atabu',   name: 'Oeufs Atabu',    icon: '🐡', category: 'fish_eggs', bonus: 1500 },

  // ═══════════════════════════════════════════════════════════
  //  OEUFS DE GRENOUILLES
  // ═══════════════════════════════════════════════════════════
  frog_generic:    { id: 'frog_generic',    name: 'Oeufs Grenouille', icon: '🐸', category: 'frog_eggs', bonus: 100  },
  frog_huli:       { id: 'frog_huli',       name: 'Oeufs Huli',       icon: '🐸', category: 'frog_eggs', bonus: 150  },
  frog_felicianna: { id: 'frog_felicianna', name: 'Oeufs Felicianna', icon: '🐸', category: 'frog_eggs', bonus: 200  },
  frog_strabo:     { id: 'frog_strabo',     name: 'Oeufs Strabo',     icon: '🐸', category: 'frog_eggs', bonus: 200  },
  frog_aiolus:     { id: 'frog_aiolus',     name: 'Oeufs Aiolus',     icon: '🐸', category: 'frog_eggs', bonus: 250  },
  frog_trajuu:     { id: 'frog_trajuu',     name: 'Oeufs Trajuu',     icon: '🐸', category: 'frog_eggs', bonus: 300  },
  frog_afae:       { id: 'frog_afae',       name: 'Oeufs Afae',       icon: '🐸', category: 'frog_eggs', bonus: 350  },
  frog_cillus:     { id: 'frog_cillus',     name: 'Oeufs Cillus',     icon: '🐸', category: 'frog_eggs', bonus: 350  },
  frog_amedo:      { id: 'frog_amedo',      name: 'Oeufs Amedo',      icon: '🐸', category: 'frog_eggs', bonus: 400  },
  frog_kenjoss:    { id: 'frog_kenjoss',    name: 'Oeufs Kenjoss',    icon: '🐸', category: 'frog_eggs', bonus: 500  },
  frog_lavaum:     { id: 'frog_lavaum',     name: 'Oeufs Lavaum',     icon: '🐸', category: 'frog_eggs', bonus: 500  },
  frog_jumi:       { id: 'frog_jumi',       name: 'Oeufs Jumi',       icon: '🐸', category: 'frog_eggs', bonus: 500  },
  frog_leglus:     { id: 'frog_leglus',     name: 'Oeufs Leglus',     icon: '🐸', category: 'frog_eggs', bonus: 500  },
  frog_golden:     { id: 'frog_golden',     name: 'Oeufs Dorés',      icon: '🌟', category: 'frog_eggs', bonus: 600  },
  frog_acuzzi:     { id: 'frog_acuzzi',     name: 'Oeufs Acuzzi',     icon: '🐸', category: 'frog_eggs', bonus: 1000 },
  frog_toxifia:    { id: 'frog_toxifia',    name: 'Oeufs Toxifia',    icon: '🐸', category: 'frog_eggs', bonus: 1000 },
  frog_seren:      { id: 'frog_seren',      name: 'Oeufs Seren',      icon: '🐸', category: 'frog_eggs', bonus: 1500 },

  // ═══════════════════════════════════════════════════════════
  //  CONSOMMABLES & CUISINE
  // ═══════════════════════════════════════════════════════════
  water_bottle:      { id: 'water_bottle',      name: 'Bouteille d\'eau',   icon: '💧', category: 'consumable' },
  oxygen_capsule:    { id: 'oxygen_capsule',     name: 'Capsule O2',          icon: '💨', category: 'consumable' },
  space_food:        { id: 'space_food',          name: 'Nourriture spatiale', icon: '🍱', category: 'consumable' },
  mushroom:          { id: 'mushroom',            name: 'Champignon',          icon: '🍄', category: 'consumable' },
  fish_soup:         { id: 'fish_soup',           name: 'Soupe de poisson',    icon: '🍲', category: 'consumable' },
  cookie:            { id: 'cookie',              name: 'Cookie',              icon: '🍪', category: 'consumable' },
  chocolate:         { id: 'chocolate',           name: 'Chocolat',            icon: '🍫', category: 'consumable' },
  croissant:         { id: 'croissant',           name: 'Croissant',           icon: '🥐', category: 'consumable' },
  birthday_cake:     { id: 'birthday_cake',       name: 'Gâteau anniversaire', icon: '🎂', category: 'consumable' },
  honey_beans:       { id: 'honey_beans',         name: 'Haricots au miel',    icon: '🫘', category: 'consumable' },
  high_quality_food: { id: 'high_quality_food',   name: 'Nourriture premium',  icon: '⭐', category: 'consumable' },

  // ═══════════════════════════════════════════════════════════
  //  ÉQUIPEMENTS – RÉSERVOIRS O2
  // ═══════════════════════════════════════════════════════════
  oxygen_t1: { id: 'oxygen_t1', name: 'Réservoir O2 T1', icon: '💨', category: 'wearable', subcategory: 'oxygen', tier: 1, oxygenBonus: 20  },
  oxygen_t2: { id: 'oxygen_t2', name: 'Réservoir O2 T2', icon: '💨', category: 'wearable', subcategory: 'oxygen', tier: 2, oxygenBonus: 40  },
  oxygen_t3: { id: 'oxygen_t3', name: 'Réservoir O2 T3', icon: '💨', category: 'wearable', subcategory: 'oxygen', tier: 3, oxygenBonus: 60  },
  oxygen_t4: { id: 'oxygen_t4', name: 'Réservoir O2 T4', icon: '💨', category: 'wearable', subcategory: 'oxygen', tier: 4, oxygenBonus: 80  },
  oxygen_t5: { id: 'oxygen_t5', name: 'Réservoir O2 T5', icon: '💨', category: 'wearable', subcategory: 'oxygen', tier: 5, oxygenBonus: 120 },

  // ═══════════════════════════════════════════════════════════
  //  ÉQUIPEMENTS – SACS À DOS
  // ═══════════════════════════════════════════════════════════
  backpack_t1: { id: 'backpack_t1', name: 'Sac à dos T1', icon: '🎒', category: 'wearable', subcategory: 'backpack', tier: 1, slotsBonus: 4  },
  backpack_t2: { id: 'backpack_t2', name: 'Sac à dos T2', icon: '🎒', category: 'wearable', subcategory: 'backpack', tier: 2, slotsBonus: 6  },
  backpack_t3: { id: 'backpack_t3', name: 'Sac à dos T3', icon: '🎒', category: 'wearable', subcategory: 'backpack', tier: 3, slotsBonus: 8  },
  backpack_t4: { id: 'backpack_t4', name: 'Sac à dos T4', icon: '🎒', category: 'wearable', subcategory: 'backpack', tier: 4, slotsBonus: 10 },
  backpack_t5: { id: 'backpack_t5', name: 'Sac à dos T5', icon: '🎒', category: 'wearable', subcategory: 'backpack', tier: 5, slotsBonus: 12 },
  backpack_t6: { id: 'backpack_t6', name: 'Sac à dos T6', icon: '🎒', category: 'wearable', subcategory: 'backpack', tier: 6, slotsBonus: 16 },
  backpack_t7: { id: 'backpack_t7', name: 'Sac à dos T7', icon: '🎒', category: 'wearable', subcategory: 'backpack', tier: 7, slotsBonus: 20 },

  // ═══════════════════════════════════════════════════════════
  //  ÉQUIPEMENTS – EXOSQUELETTES
  // ═══════════════════════════════════════════════════════════
  exo_t1: { id: 'exo_t1', name: 'Exosquelette T1', icon: '🦾', category: 'wearable', subcategory: 'exo', tier: 1, strengthBonus: 20 },
  exo_t2: { id: 'exo_t2', name: 'Exosquelette T2', icon: '🦾', category: 'wearable', subcategory: 'exo', tier: 2, strengthBonus: 40 },
  exo_t3: { id: 'exo_t3', name: 'Exosquelette T3', icon: '🦾', category: 'wearable', subcategory: 'exo', tier: 3, strengthBonus: 60 },
  exo_t4: { id: 'exo_t4', name: 'Exosquelette T4', icon: '🦾', category: 'wearable', subcategory: 'exo', tier: 4, strengthBonus: 80 },
  exo_t5: { id: 'exo_t5', name: 'Exosquelette T5', icon: '🦾', category: 'wearable', subcategory: 'exo', tier: 5, strengthBonus: 100},

  // ═══════════════════════════════════════════════════════════
  //  ÉQUIPEMENTS – BOTTES
  // ═══════════════════════════════════════════════════════════
  boots_t1: { id: 'boots_t1', name: 'Bottes Agilité T1', icon: '👟', category: 'wearable', subcategory: 'boots', tier: 1, speedBonus: 1.2 },
  boots_t2: { id: 'boots_t2', name: 'Bottes Agilité T2', icon: '👟', category: 'wearable', subcategory: 'boots', tier: 2, speedBonus: 1.5 },
  boots_t3: { id: 'boots_t3', name: 'Bottes Agilité T3', icon: '👟', category: 'wearable', subcategory: 'boots', tier: 3, speedBonus: 2.0 },

  // ═══════════════════════════════════════════════════════════
  //  ÉQUIPEMENTS – JETPACKS
  // ═══════════════════════════════════════════════════════════
  jetpack_t1: { id: 'jetpack_t1', name: 'Jetpack T1', icon: '🚁', category: 'wearable', subcategory: 'jetpack', tier: 1 },
  jetpack_t2: { id: 'jetpack_t2', name: 'Jetpack T2', icon: '🚁', category: 'wearable', subcategory: 'jetpack', tier: 2 },
  jetpack_t3: { id: 'jetpack_t3', name: 'Jetpack T3', icon: '🚁', category: 'wearable', subcategory: 'jetpack', tier: 3 },
  jetpack_t4: { id: 'jetpack_t4', name: 'Jetpack T4', icon: '🚁', category: 'wearable', subcategory: 'jetpack', tier: 4 },
  jetpack_t5: { id: 'jetpack_t5', name: 'Jetpack T5', icon: '🚁', category: 'wearable', subcategory: 'jetpack', tier: 5 },

  // ═══════════════════════════════════════════════════════════
  //  ÉQUIPEMENTS – FILTRES
  // ═══════════════════════════════════════════════════════════
  water_filter: { id: 'water_filter', name: 'Filtre eau',         icon: '💧', category: 'wearable', subcategory: 'filter' },
  air_filter:   { id: 'air_filter',   name: 'Filtre air',         icon: '💨', category: 'wearable', subcategory: 'filter' },
  toxin_flt_t1: { id: 'toxin_flt_t1', name: 'Filtre Toxines T1', icon: '☣️',  category: 'wearable', subcategory: 'filter' },
  toxin_flt_t2: { id: 'toxin_flt_t2', name: 'Filtre Toxines T2', icon: '☣️',  category: 'wearable', subcategory: 'filter' },
  toxin_flt_t3: { id: 'toxin_flt_t3', name: 'Filtre Toxines T3', icon: '☣️',  category: 'wearable', subcategory: 'filter' },

  // ═══════════════════════════════════════════════════════════
  //  FUSIBLES
  // ═══════════════════════════════════════════════════════════
  fuse_cartridge:  { id: 'fuse_cartridge',  name: 'Cartouche fusible',    icon: '🔋', category: 'fuse' },
  fuse_animals:    { id: 'fuse_animals',    name: 'Fusible Animaux',      icon: '🐾', category: 'fuse' },
  fuse_energy:     { id: 'fuse_energy',     name: 'Fusible Énergie',      icon: '⚡', category: 'fuse' },
  fuse_growth:     { id: 'fuse_growth',     name: 'Fusible Croissance',   icon: '🌱', category: 'fuse' },
  fuse_heat:       { id: 'fuse_heat',       name: 'Fusible Chaleur',      icon: '🔥', category: 'fuse' },
  fuse_insects:    { id: 'fuse_insects',    name: 'Fusible Insectes',     icon: '🐛', category: 'fuse' },
  fuse_oxygen:     { id: 'fuse_oxygen',     name: 'Fusible Oxygène',      icon: '💨', category: 'fuse' },
  fuse_plant:      { id: 'fuse_plant',      name: 'Fusible Plantes',      icon: '🌿', category: 'fuse' },
  fuse_pressure:   { id: 'fuse_pressure',   name: 'Fusible Pression',     icon: '🌀', category: 'fuse' },
  fuse_production: { id: 'fuse_production', name: 'Fusible Production',   icon: '⚙️',  category: 'fuse' },
  fuse_trade:      { id: 'fuse_trade',      name: 'Fusible Commerce',     icon: '📦', category: 'fuse' },

  // ═══════════════════════════════════════════════════════════
  //  PORTAIL
  // ═══════════════════════════════════════════════════════════
  access_card:    { id: 'access_card',    name: 'Carte d\'accès',  icon: '🪪', category: 'portal' },
  flare:          { id: 'flare',          name: 'Fusée éclairante',icon: '🔦', category: 'portal' },
  blazar_quartz:  { id: 'blazar_quartz',  name: 'Quartz Blazar',   icon: '🌠', category: 'portal' },
  magnetar_quartz:{ id: 'magnetar_quartz',name: 'Quartz Magnétar', icon: '🧲', category: 'portal' },
  quasar_quartz:  { id: 'quasar_quartz',  name: 'Quartz Quasar',   icon: '🌌', category: 'portal' },
  solar_quartz:   { id: 'solar_quartz',   name: 'Quartz Solaire',  icon: '☀️',  category: 'portal' },

};

// ── Catégories (pour l'affichage) ───────────────────────────
const ITEM_CATEGORIES = {
  ore:            { label: 'Minerais',          icon: '⛏️'  },
  industrial:     { label: 'Industriels',        icon: '🏭' },
  biolab:         { label: 'Bio Lab',            icon: '🧪' },
  seed_flower:    { label: 'Graines – Fleurs',   icon: '🌸' },
  seed_tree:      { label: 'Graines – Arbres',   icon: '🌲' },
  seed_crop:      { label: 'Graines – Cultures', icon: '🌾' },
  larva_basic:    { label: 'Larves basiques',    icon: '🐛' },
  larva_butterfly:{ label: 'Papillons',          icon: '🦋' },
  fish_eggs:      { label: 'Oeufs de poissons',  icon: '🐟' },
  frog_eggs:      { label: 'Oeufs de grenouilles',icon: '🐸' },
  consumable:     { label: 'Consommables',       icon: '🍱' },
  wearable:       { label: 'Équipements',        icon: '🎒' },
  fuse:           { label: 'Fusibles',           icon: '🔋' },
  portal:         { label: 'Portail',            icon: '🚪' },
};
