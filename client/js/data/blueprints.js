// ============================================================
//  BLUEPRINTS DATA  –  Tous les déblocages de The Planet Crafter
//  Source : wiki officiel
// ============================================================

// ─── Blueprints débloqués par le Terraform Index ─────────────
const BLUEPRINTS_TI = [
  { rank: 1,  item: 'backpack_t2',          nameFr: 'Sac à dos T2',                   ti: 300        },
  { rank: 2,  item: 'solar_t1',             nameFr: 'Panneau solaire T1',              ti: 1000       },
  { rank: 3,  item: 'backpack_t3',          nameFr: 'Sac à dos T3',                   ti: 2500       },
  { rank: 4,  item: 'solar_t2',             nameFr: 'Panneau solaire T2',              ti: 17500      },
  { rank: 5,  item: 'double_bed',           nameFr: 'Lit double',                      ti: 25000      },
  { rank: 6,  item: 'locker',               nameFr: 'Casier de stockage',             ti: 50000      },
  { rank: 7,  item: 'craft_advanced',       nameFr: 'Station de craft Avancée',       ti: 175000     },
  { rank: 8,  item: 'launch_platform',      nameFr: 'Plateforme de lancement',        ti: 345000     },
  { rank: 9,  item: 'microchip_pinning_t1', nameFr: 'Microchip - Épinglage blueprints T1', ti: 550000 },
  { rank: 10, item: 'foundation_angle',     nameFr: 'Fondation – Angle',              ti: 680000     },
  { rank: 11, item: 'water_collector_atmo', nameFr: 'Collecteur d\'eau atmosphérique',ti: 875000     },
  { rank: 12, item: 'backpack_t5',          nameFr: 'Sac à dos T5',                   ti: 5e6        },
  { rank: 13, item: 'vehicle_station',      nameFr: 'Station véhicule',               ti: 6.5e6      },
  { rank: 14, item: 'vehicle_inv_t1',       nameFr: 'Véhicule – Inventaire T1',       ti: 17.5e6     },
  { rank: 15, item: 'water_collector_lake', nameFr: 'Collecteur d\'eau de lac',       ti: 50e6       },
  { rank: 16, item: 'foundation_slope',     nameFr: 'Fondation – Pente',              ti: 60e6       },
  { rank: 17, item: 'machine_optimizer_t1', nameFr: 'Optimiseur de machine T1',       ti: 70e6       },
  { rank: 18, item: 'interior_stairs',      nameFr: 'Escaliers intérieurs',           ti: 80e6       },
  { rank: 19, item: 'screen_biomass',       nameFr: 'Écran – Biomasse',               ti: 200e6      },
  { rank: 20, item: 'screen_orbital',       nameFr: 'Écran – Informations orbitales', ti: 550e6      },
  { rank: 21, item: 'seed_spreader',        nameFr: 'Fusée Graines',                  ti: 650e6      },
  { rank: 22, item: 'dna_manipulator',      nameFr: 'Manipulateur ADN',               ti: 700e6      },
  { rank: 23, item: 'super_alloy_rod',      nameFr: 'Barreau Super Alliage',          ti: 750e6      },
  { rank: 24, item: 'exo_t3',               nameFr: 'Exosquelette T3',                ti: 1e9        },
  { rank: 25, item: 'air_filter',           nameFr: 'Filtre air',                     ti: 2e9        },
  { rank: 26, item: 'auto_crafter',         nameFr: 'Auto-Crafter',                   ti: 2.5e9      },
  { rank: 27, item: 'incubator',            nameFr: 'Incubateur',                     ti: 5e9        },
  { rank: 28, item: 'water_filter',         nameFr: 'Filtre eau',                     ti: 7e9        },
  { rank: 29, item: 'teleporter',           nameFr: 'Téléporteur',                    ti: 25e9       },
  { rank: 30, item: 'tree_spreader_t3',     nameFr: 'Épandeur d\'arbres T3',          ti: 32e9       },
  { rank: 31, item: 'osmium_rod',           nameFr: 'Barreau Osmium',                 ti: 36e9       },
  { rank: 32, item: 'fusion_cell',          nameFr: 'Cellule Fusion',                 ti: 40e9       },
  { rank: 33, item: 'drone_station',        nameFr: 'Station Drone',                  ti: 45e9       },
  { rank: 34, item: 'exo_t4',               nameFr: 'Exosquelette T4',                ti: 86.5e9     },
  { rank: 35, item: 'aquarium_t1',          nameFr: 'Aquarium T1',                    ti: 120e9      },
  { rank: 36, item: 'mutagen_t3',           nameFr: 'Mutagène T3',                    ti: 122e9      },
  { rank: 37, item: 'circuit_board',        nameFr: 'Circuit électronique',           ti: 160e9      },
  { rank: 38, item: 'pulsar_quartz',        nameFr: 'Quartz Pulsar',                  ti: 175e9      },
  { rank: 39, item: 'portal_generator',     nameFr: 'Générateur de portail',          ti: 250e9      },
  { rank: 40, item: 'backpack_t6',          nameFr: 'Sac à dos T6',                   ti: 350e9      },
  { rank: 41, item: 'fuse_purification',    nameFr: 'Fusible Purification',           ti: 350e9      },
  { rank: 42, item: 'pristine_mushroom',    nameFr: 'Champignon parfait',             ti: 350e9      },
  { rank: 43, item: 'mutagen_t4',           nameFr: 'Mutagène T4',                    ti: 425e9      },
  { rank: 44, item: 'amphibian_farm',       nameFr: 'Ferme d\'amphibiens',            ti: 425e9      },
  { rank: 45, item: 'frog_huli',            nameFr: 'Oeufs Huli',                     ti: 450e9      },
  { rank: 46, item: 'animal_shelter',       nameFr: 'Abri pour animaux',              ti: 1.25e12    },
  { rank: 47, item: 'animal_feeder',        nameFr: 'Distributeur pour animaux',      ti: 1.25e12    },
  { rank: 48, item: 'animal_food_t2',       nameFr: 'Nourriture animale T2',          ti: 2.25e12    },
  { rank: 49, item: 'extraction_platform',  nameFr: 'Plateforme d\'extraction',       ti: 4e12       },
  { rank: 50, item: 'screen_solar_system',  nameFr: 'Écran Système Solaire',          ti: 4.15e12    },
  { rank: 51, item: 'interplanetary_rocket',nameFr: 'Fusée Voyage interplanétaire',   ti: 4.15e12    },
];

// ─── Blueprints débloqués par l'Oxygène ──────────────────────
const BLUEPRINTS_OXYGEN = [
  { rank: 1,  item: 'indoor_ladder',        nameFr: 'Échelle intérieure',             oxygen: '1 ppt'   },
  { rank: 2,  item: 'heater_t2',            nameFr: 'Chauffe-sol T2',                 oxygen: '1.85 ppt'},
  { rank: 3,  item: 'oxygen_t3',            nameFr: 'Réservoir O2 T3',                oxygen: '5 ppt'   },
  { rank: 4,  item: 'food_grower_t1',       nameFr: 'Producteur de nourriture T1',    oxygen: '12 ppt'  },
  { rank: 5,  item: 'vegetube_t3',          nameFr: 'Végétube T3',                    oxygen: '30 ppt'  },
  { rank: 6,  item: 'heater_t3',            nameFr: 'Chauffe-sol T3',                 oxygen: '80 ppt'  },
  { rank: 7,  item: 'grass_spreader',       nameFr: 'Épandeur d\'herbe',              oxygen: '150 ppt' },
  { rank: 8,  item: 'flower_pot',           nameFr: 'Pot de fleurs',                  oxygen: '420 ppt' },
  { rank: 9,  item: 'heater_t4',            nameFr: 'Chauffe-sol T4',                 oxygen: '63 ppb'  },
  { rank: 10, item: 'tree_spreader_t2',     nameFr: 'Épandeur d\'arbres T2',          oxygen: '6 ppm'   },
  { rank: 11, item: 'water_life_collector', nameFr: 'Collecteur de vie aquatique',    oxygen: '87 ppm'  },
];

// ─── Blueprints débloqués par la Chaleur ─────────────────────
const BLUEPRINTS_HEAT = [
  { rank: 1,  item: 'vegetube_t2',          nameFr: 'Végétube T2',                    heat: '500 pK'   },
  { rank: 2,  item: 'screen_progress',      nameFr: 'Écran – Progrès',                heat: '2 nK'     },
  { rank: 3,  item: 'beacon',               nameFr: 'Balise',                         heat: '5 nK'     },
  { rank: 4,  item: 'exo_t2',               nameFr: 'Exosquelette T2',                heat: '10 nK'    },
  { rank: 5,  item: 'drill_t3',             nameFr: 'Foreuse T3',                     heat: '21 nK'    },
  { rank: 6,  item: 'biodome_t1',           nameFr: 'Biodôme T1',                     heat: '100 nK'   },
  { rank: 7,  item: 'sign',                 nameFr: 'Panneau',                        heat: '500 nK'   },
  { rank: 8,  item: 'algae_t1',             nameFr: 'Générateur d\'algues T1',        heat: '2 µK'     },
  { rank: 9,  item: 'biodome_t2',           nameFr: 'Biodôme T2',                     heat: '12 µK'    },
  { rank: 10, item: 'drill_t4',             nameFr: 'Foreuse T4',                     heat: '41 µK'    },
  { rank: 11, item: 'fusion_generator',     nameFr: 'Générateur à fusion',            heat: '750 µK'   },
  { rank: 12, item: 'machine_optimizer_t2', nameFr: 'Optimiseur de machine T2',       heat: '1.85 mK'  },
];

// ─── Blueprints débloqués par la Pression ────────────────────
const BLUEPRINTS_PRESSURE = [
  { rank: 1,  item: 'oxygen_t2',            nameFr: 'Réservoir O2 T2',                pressure: '70 nPa'    },
  { rank: 2,  item: 'compartment_window',   nameFr: 'Fenêtre de module',              pressure: '250 nPa'   },
  { rank: 3,  item: 'drill_t2',             nameFr: 'Foreuse T2',                     pressure: '1.2 µPa'   },
  { rank: 4,  item: 'compartment_glass',    nameFr: 'Verre de module',                pressure: '4 µPa'     },
  { rank: 5,  item: 'screen_transmissions', nameFr: 'Écran – Transmissions',          pressure: '4 µPa'     },
  { rank: 6,  item: 'communication_antenna',nameFr: 'Antenne de communication',       pressure: '4 µPa'     },
  { rank: 7,  item: 'nuclear_t1',           nameFr: 'Réacteur nucléaire T1',          pressure: '60 µPa'    },
  { rank: 8,  item: 'ore_extractor_t1',     nameFr: 'Extracteur de minerai T1',       pressure: '155 µPa'   },
  { rank: 9,  item: 'nuclear_t2',           nameFr: 'Réacteur nucléaire T2',          pressure: '1.5 mPa'   },
  { rank: 10, item: 'flower_spreader_t1',   nameFr: 'Épandeur de fleurs T1',          pressure: '2.5 mPa'   },
  { rank: 11, item: 'gas_extractor_t1',     nameFr: 'Extracteur de gaz T1',           pressure: '100 mPa'   },
  { rank: 12, item: 'ore_extractor_t2',     nameFr: 'Extracteur de minerai T2',       pressure: '364.5 mPa' },
  { rank: 13, item: 'ore_extractor_t3',     nameFr: 'Extracteur de minerai T3',       pressure: '13.33 Pa'  },
];

// ─── Blueprints débloqués par la Biomasse totale ─────────────
const BLUEPRINTS_BIOMASS = [
  { rank: 1,  item: 'biolab',               nameFr: 'Bio Lab',                        biomass: '865 g'  },
  { rank: 2,  item: 'algae_t2',             nameFr: 'Générateur d\'algues T2',        biomass: '25 kg'  },
  { rank: 3,  item: 'plant_rocket',         nameFr: 'Fusée Plantes',                  biomass: '175 kg' },
  { rank: 4,  item: 'flower_spreader_t2',   nameFr: 'Épandeur de fleurs T2',          biomass: '500 kg' },
  { rank: 5,  item: 'food_grower_t2',       nameFr: 'Producteur de nourriture T2',    biomass: '35 t'   },
  { rank: 6,  item: 'tree_spreader_t1',     nameFr: 'Épandeur d\'arbres T1',          biomass: '45 t'   },
  { rank: 7,  item: 'heater_t5',            nameFr: 'Chauffe-sol T5',                 biomass: '8.3 kt' },
  { rank: 8,  item: 'insect_spreader',      nameFr: 'Fusée Insectes',                 biomass: '17.7 kt'},
  { rank: 9,  item: 'drill_t5',             nameFr: 'Foreuse T5',                     biomass: '23 kt'  },
  { rank: 10, item: 'fish_provios',         nameFr: 'Oeufs Provios',                  biomass: '30 kt'  },
  { rank: 11, item: 'fish_gerrero',         nameFr: 'Oeufs Gerrero',                  biomass: '35 kt'  },
  { rank: 12, item: 'aquarium_t2',          nameFr: 'Aquarium T2',                    biomass: '42 kt'  },
  { rank: 13, item: 'genetic_synthesizer',  nameFr: 'Synthétiseur génétique',         biomass: '52 kt'  },
  { rank: 14, item: 'animals_spreader',     nameFr: 'Fusée Animaux',                  biomass: '70 kt'  },
  { rank: 15, item: 'harvesting_robot',     nameFr: 'Robot de récolte',               biomass: '75 kt'  },
  { rank: 16, item: 'frog_strabo',          nameFr: 'Oeufs Strabo',                   biomass: '80 kt'  },
  { rank: 17, item: 'animal_food_t1',       nameFr: 'Nourriture animale T1',          biomass: '85 kt'  },
  { rank: 18, item: 'frog_toxifia',         nameFr: 'Oeufs Toxifia',                  biomass: '100 kt' },
];

// ─── Blueprints débloqués par la Biomasse Plantes ────────────
const BLUEPRINTS_PLANTS = [
  { rank: 1,  item: 'beehive_t1',           nameFr: 'Ruche T1',                       plants: '80 t'    },
  { rank: 2,  item: 'butterfly_dome',       nameFr: 'Dôme à papillons',               plants: '140 t'   },
  { rank: 3,  item: 'bfly_chevrone',        nameFr: 'Papillon Chevrone',               plants: '550 t'   },
  { rank: 4,  item: 'bfly_aemel',           nameFr: 'Papillon Aemel',                  plants: '870 t'   },
  { rank: 5,  item: 'bfly_liux',            nameFr: 'Papillon Liux',                   plants: '2 kt'    },
  { rank: 6,  item: 'butterfly_farm_t1',    nameFr: 'Ferme à papillons T1',            plants: '3.25 kt' },
  { rank: 7,  item: 'tree_shreox',          nameFr: 'Arbre Shreox',                   plants: '5.7 kt'  },
  { rank: 8,  item: 'bfly_imeo',            nameFr: 'Papillon Imeo',                   plants: '8.4 kt'  },
  { rank: 9,  item: 'gas_extractor_t2',     nameFr: 'Extracteur de gaz T2',           plants: '15.5 kt' },
  { rank: 10, item: 'bfly_serena',          nameFr: 'Papillon Serena',                 plants: '22.1 kt' },
];

// ─── Blueprints débloqués par la Biomasse Insectes ───────────
const BLUEPRINTS_INSECTS = [
  { rank: 1,  item: 'tree_cernea',          nameFr: 'Arbre Cernea',                   insects: '500 g'  },
  { rank: 2,  item: 'high_quality_food',    nameFr: 'Nourriture premium',              insects: '15 kg'  },
  { rank: 3,  item: 'tree_elegea',          nameFr: 'Arbre Elegea',                   insects: '100 kg' },
  { rank: 4,  item: 'tree_humelora',        nameFr: 'Arbre Humelora',                 insects: '500 kg' },
  { rank: 5,  item: 'silk_generator',       nameFr: 'Générateur de soie',             insects: '800 kg' },
  { rank: 6,  item: 'fabric',               nameFr: 'Tissu',                          insects: '950 kg' },
  { rank: 7,  item: 'tree_aemora',          nameFr: 'Arbre Aemora',                   insects: '1.1 t'  },
  { rank: 8,  item: 'outdoor_farm',         nameFr: 'Ferme extérieure',               insects: '1.5 t'  },
  { rank: 9,  item: 'butterfly_box',        nameFr: 'Boîte d\'exposition papillons',  insects: '2.5 t'  },
  { rank: 10, item: 'mutagen_t2',           nameFr: 'Mutagène T2',                    insects: '50 t'   },
  { rank: 11, item: 'ecosystem',            nameFr: 'Écosystème',                     insects: '64.25 t'},
  { rank: 12, item: 'beehive_t2',           nameFr: 'Ruche T2',                       insects: '145 t'  },
  { rank: 13, item: 'genetic_extractor',    nameFr: 'Extracteur génétique',           insects: '350 t'  },
  { rank: 14, item: 'butterfly_farm_t2',    nameFr: 'Ferme à papillons T2',           insects: '925 t'  },
  { rank: 15, item: 'frog_trajuu',          nameFr: 'Oeufs Trajuu',                   insects: '12 kt'  },
];

// ─── Blueprints débloqués par la Biomasse Animaux ────────────
const BLUEPRINTS_ANIMALS = [
  { rank: 1,  item: 'fish_ulani',           nameFr: 'Oeufs Ulani',                    animals: '50 kg'  },
  { rank: 2,  item: 'fish_aelera',          nameFr: 'Oeufs Aelera',                   animals: '250 kg' },
  { rank: 3,  item: 'fish_display',         nameFr: 'Exposition de poissons',         animals: '2.5 t'  },
  { rank: 4,  item: 'fish_farm_t1',         nameFr: 'Pisciculture T1',                animals: '5.5 t'  },
  { rank: 5,  item: 'vehicle_logistics',    nameFr: 'Véhicule – Logistique',          animals: '6.7 t'  },
  { rank: 6,  item: 'seed_lirma',           nameFr: 'Graine Lirma',                   animals: '7.8 t'  },
  { rank: 7,  item: 'common_larva',         nameFr: 'Larve commune',                  animals: '22 t'   },
  { rank: 8,  item: 'frog_afae',            nameFr: 'Oeufs Afae',                     animals: '35 t'   },
  { rank: 9,  item: 'frog_display',         nameFr: 'Exposition de grenouilles',      animals: '67 t'   },
  { rank: 10, item: 'rare_larva',           nameFr: 'Larve rare',                     animals: '92 t'   },
  { rank: 11, item: 'purified_water',       nameFr: 'Eau purifiée',                   animals: '120 t'  },
  { rank: 12, item: 'frog_generic',         nameFr: 'Oeufs Grenouille générique',     animals: '165 t'  },
  { rank: 13, item: 'frog_amedo',           nameFr: 'Oeufs Amedo',                    animals: '600 t'  },
  { rank: 14, item: 'jetpack_t4',           nameFr: 'Jetpack T4',                     animals: '1 kt'   },
];

// ─── Blueprints Microchip (par tiers) ────────────────────────
const BLUEPRINTS_MICROCHIP = [
  { tier: 1, items: ['boots_t1', 'microchip_mining_t1'] },
  { tier: 2, items: ['microchip_compass', 'boots_t2', 'microchip_mining_t2'] },
  { tier: 3, items: ['living_compartment_corner', 'recycling_t1', 'microchip_mining_t3'] },
  { tier: 4, items: ['gps_t1', 'screen_mapping', 'shredder', 'area_lamp', 'microchip_torch_t2', 'big_compartment'] },
  { tier: 5, items: ['boots_t3', 'microchip_mining_t4', 'jetpack_t2', 'gps_t2', 'fence', 'map_info', 'microchip_pinning_t2'] },
  { tier: 6, items: ['display_case', 'microchip_map', 'vehicle_unlimited_o2', 'vehicle_equip_t2', 'vehicle_inv_t2', 'vehicle_speed_t2'] },
  { tier: 7, items: ['gps_t3', 'microchip_deconstruct_t2', 'jetpack_t3', 'vehicle_lights_t2', 'spacesuit_display'] },
  { tier: 8, items: ['microchip_construction_filter', 'interior_wall', 'vehicle_inv_t3'] },
  { tier: 9, items: ['gps_t4', 'flare', 'explosive', 'drone_viz'] },
  { tier: 10, items: ['microchip_deconstruct_t3', 'microchip_pinning_t3', 'microchip_torch_t3', 'vehicle_speed_t3', 'map_info_t2'] },
];

// ─── Blueprints achetés avec Terra Tokens ────────────────────
const BLUEPRINTS_TERRA_TOKENS = [
  { item: 'cooking_station',      nameFr: 'Station de cuisine',              price: 400   },
  { item: 'smart_fabric',         nameFr: 'Tissu intelligent',               price: 500   },
  { item: 'customizable_sofa',    nameFr: 'Canapé personnalisable',          price: 800   },
  { item: 'customizable_bed',     nameFr: 'Lit personnalisable',             price: 1000  },
  { item: 'locker_t2',            nameFr: 'Casier de stockage T2',           price: 5000  },
  { item: 'compartment_3x3',      nameFr: 'Module 3×3',                      price: 10000 },
  { item: 'drone_t2',             nameFr: 'Drone T2',                        price: 12000 },
  { item: 'rounded_compartment',  nameFr: 'Module arrondi',                  price: 15000 },
  { item: 'hologram_projector',   nameFr: 'Projecteur hologramme',           price: 15000 },
  { item: 'fountain',             nameFr: 'Fontaine',                        price: 20000 },
  { item: 'compartment_dome',     nameFr: 'Module avec dôme',                price: 25000 },
];

// ─── Blueprints Système Solaire (SysTi) ──────────────────────
const BLUEPRINTS_SYSTI = [
  { rank: 1,  item: 'interplanetary_shuttle', nameFr: 'Navette interplanétaire',       systi: '1 Qi'   },
  { rank: 2,  item: 'backpack_t7',            nameFr: 'Sac à dos T7',                  systi: '10 Qi'  },
  { rank: 3,  item: 'quartz_craft',           nameFr: 'Station quartz',                systi: '100 Qi' },
  { rank: 4,  item: 'oxygen_t5',              nameFr: 'Réservoir O2 T5',               systi: '600 Sx' },
  { rank: 5,  item: 'planetary_depot',        nameFr: 'Dépôt planétaire',              systi: '10 Sp'  },
  { rank: 6,  item: 'plant_rocket_t2',        nameFr: 'Fusée Plantes T2',              systi: '5 Oc'   },
  { rank: 7,  item: 'fuse_trade',             nameFr: 'Fusible Commerce',              systi: '2.5 No' },
  { rank: 8,  item: 'jetpack_t5',             nameFr: 'Jetpack T5',                    systi: '15 No'  },
  { rank: 9,  item: 'insect_spreader_t2',     nameFr: 'Fusée Insectes T2',             systi: '70 No'  },
  { rank: 10, item: 'magnetic_field_t2',      nameFr: 'Fusée Champ magnétique T2',     systi: '500 No' },
  { rank: 11, item: 'rocket_engine_t2',       nameFr: 'Moteur fusée T2',               systi: '10 Dc'  },
  { rank: 12, item: 'fuse_energy',            nameFr: 'Fusible Énergie',               systi: '500 Dc' },
  { rank: 13, item: 'cosmic_quartz',          nameFr: 'Quartz cosmique',               systi: '5 Ud'   },
];

// ─── Helper : vérifier si un blueprint est débloqué ──────────
function isBlueprintUnlocked(blueprintItem, gameStats) {
  // Vérifier dans les blueprints Ti
  const tiBlueprint = BLUEPRINTS_TI.find(b => b.item === blueprintItem);
  if (tiBlueprint) return gameStats.ti >= tiBlueprint.ti;
  // Vérifier dans les blueprints Biomasse
  const biomassBlueprint = BLUEPRINTS_BIOMASS.find(b => b.item === blueprintItem);
  if (biomassBlueprint) return true; // simplifié
  return false;
}
