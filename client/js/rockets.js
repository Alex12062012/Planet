// ============================================================
//  ROCKETS  –  18 types de fusées, lancement, retour orbital
//  Raccourci : touche R = ouvrir panneau fusées
// ============================================================

const Rockets = (() => {

  // ─── Définition des 18 fusées ─────────────────────────────
  const ROCKET_DEFS = {
    gps_t1: {
      id: 'gps_t1', name: 'Satellite GPS T1', icon: '🛰️',
      cost: { iron: 5, aluminum: 5, rocket_engine: 1 },
      launchTime: 10, returnTime: 30,
      effect: 'map_reveal_25',
      description: 'Révèle 25% de la carte',
      unlockTi: 0,
    },
    gps_t2: {
      id: 'gps_t2', name: 'Satellite GPS T2', icon: '🛰️',
      cost: { super_alloy: 3, circuit_board: 2, rocket_engine: 1 },
      launchTime: 15, returnTime: 30,
      effect: 'map_reveal_50',
      description: 'Révèle 50% de la carte',
      unlockTi: 175000,
    },
    gps_t3: {
      id: 'gps_t3', name: 'Satellite GPS T3', icon: '🛰️',
      cost: { super_alloy: 5, iridium_rod: 2, rocket_engine: 2 },
      launchTime: 20, returnTime: 30,
      effect: 'map_reveal_75',
      description: 'Révèle 75% de la carte',
      unlockTi: 350000,
    },
    gps_t4: {
      id: 'gps_t4', name: 'Satellite GPS T4', icon: '🛰️',
      cost: { osmium_rod: 2, fusion_cell: 1, circuit_board: 4 },
      launchTime: 25, returnTime: 30,
      effect: 'map_reveal_100',
      description: 'Révèle toute la carte',
      unlockTi: 875000,
    },
    magnetic_field: {
      id: 'magnetic_field', name: 'Fusée Champ Magnétique', icon: '🧲',
      cost: { osmium: 5, iridium_rod: 3, circuit_board: 3, rocket_engine_t2: 1 },
      launchTime: 30, returnTime: 0,
      effect: 'boost_pressure',
      description: '+500 pression permanente',
      unlockTi: 3000000,
    },
    asteroid_attractor: {
      id: 'asteroid_attractor', name: 'Attracteur d\'Astéroïdes', icon: '☄️',
      cost: { super_alloy_rod: 3, circuit_board: 4, rocket_engine: 2 },
      launchTime: 20, returnTime: 60,
      effect: 'meteor_shower',
      description: 'Déclenche une pluie de météorites',
      unlockTi: 175000,
    },
    plant_rocket: {
      id: 'plant_rocket', name: 'Fusée Végétale', icon: '🌱',
      cost: { fertilizer_t2: 5, bioplastic: 3, rocket_engine: 1 },
      launchTime: 15, returnTime: 120,
      effect: 'boost_plants',
      description: '+biomasse plantes',
      unlockTi: 875000,
    },
    seed_spreader: {
      id: 'seed_spreader', name: 'Épandeur de Graines', icon: '🌸',
      cost: { seed_lirma: 3, fertilizer_t3: 2, rocket_engine: 1 },
      launchTime: 15, returnTime: 90,
      effect: 'spread_seeds',
      description: 'Repousse des graines sur la carte',
      unlockTi: 3000000,
    },
    insect_spreader: {
      id: 'insect_spreader', name: 'Épandeur d\'Insectes', icon: '🦋',
      cost: { animal_food_t2: 3, bioplastic: 3, rocket_engine: 1 },
      launchTime: 15, returnTime: 90,
      effect: 'spread_insects',
      description: 'Distribue des larves sur la carte',
      unlockTi: 50000000,
    },
    animals_spreader: {
      id: 'animals_spreader', name: 'Épandeur d\'Animaux', icon: '🐠',
      cost: { animal_food_t3: 3, smart_fabric: 2, rocket_engine_t2: 1 },
      launchTime: 20, returnTime: 120,
      effect: 'spread_animals',
      description: 'Distribue des animaux dans les biomes',
      unlockTi: 200000000,
    },
    map_info_t1: {
      id: 'map_info_t1', name: 'Sonde Cartographique T1', icon: '📡',
      cost: { circuit_board: 3, aluminum: 5, rocket_engine: 1 },
      launchTime: 10, returnTime: 45,
      effect: 'reveal_wrecks',
      description: 'Révèle les épaves sur la carte',
      unlockTi: 175000,
    },
    map_info_t2: {
      id: 'map_info_t2', name: 'Sonde Cartographique T2', icon: '📡',
      cost: { iridium_rod: 2, circuit_board: 4, rocket_engine: 2 },
      launchTime: 15, returnTime: 45,
      effect: 'reveal_resources',
      description: 'Révèle les ressources rares sur la carte',
      unlockTi: 875000,
    },
    space_trading: {
      id: 'space_trading', name: 'Fusée Commerce Spatial', icon: '💹',
      cost: { super_alloy: 5, circuit_board: 5, rocket_engine_t2: 1 },
      launchTime: 25, returnTime: 180,
      effect: 'trade',
      description: 'Lance une mission commerciale (retour = Terra Tokens)',
      unlockTi: 50000000,
    },
    extraction: {
      id: 'extraction', name: 'Fusée Extraction', icon: '⛏️',
      cost: { osmium_rod: 3, explosive_pwd: 5, rocket_engine_t2: 1 },
      launchTime: 30, returnTime: 240,
      effect: 'orbital_mining',
      description: 'Mine des astéroïdes (retour = ressources rares)',
      unlockTi: 700000000,
    },
    interplanetary: {
      id: 'interplanetary', name: 'Fusée Interplanétaire', icon: '🌍',
      cost: { fusion_cell: 3, osmium_rod: 5, rocket_engine_t2: 2 },
      launchTime: 60, returnTime: 600,
      effect: 'interplanetary_travel',
      description: 'Voyage interplanétaire vers Selenea ou Aqualis',
      unlockTi: 4000000000,
    },
    purification: {
      id: 'purification', name: 'Fusée Purification', icon: '💧',
      cost: { zeolite: 8, nitrogen_cart: 5, rocket_engine: 2 },
      launchTime: 20, returnTime: 120,
      effect: 'purify_atmosphere',
      description: 'Réduit la toxicité atmosphérique',
      unlockTi: 875000,
    },
    drone_viz: {
      id: 'drone_viz', name: 'Drone Reconnaissance', icon: '🚁',
      cost: { circuit_board: 4, aluminum: 5, magnesium: 3, rocket_engine: 1 },
      launchTime: 15, returnTime: 60,
      effect: 'drone_scan',
      description: 'Scan drone de la zone (révèle ressources proches)',
      unlockTi: 0,
    },
    iridium_shower: {
      id: 'iridium_shower', name: 'Pluie d\'Iridium', icon: '💜',
      cost: { iridium: 5, rocket_engine: 1 },
      launchTime: 15, returnTime: 45,
      effect: { type: 'meteor', drops: ['iridium'], qty: { min: 8, max: 15 } },
      description: 'Fait pleuvoir de l\'iridium',
      unlockTi: 345000,
    },
  };

  // ─── Lancement en cours ────────────────────────────────────
  const activeLaunches = [];

  // ─── État carte révélée ───────────────────────────────────
  const mapReveal = { pct: 0, wrecksRevealed: false, resourcesRevealed: false };

  // ─── Platform 3D ──────────────────────────────────────────
  let _scene = null;
  let _getHeightAt = null;
  let _gameState = null;
  let _platformMesh = null;
  let _platformPos = { x: 10, z: 10 };

  // ─── Init ──────────────────────────────────────────────────
  function init(scene, getHeightAt, gameState) {
    _scene       = scene;
    _getHeightAt = getHeightAt;
    _gameState   = gameState;

    _spawnPlatform();

    document.addEventListener('keydown', (e) => {
      if (e.code === 'KeyR' && !e.ctrlKey) toggleRocketPanel();
    });

    console.log('✅ Rockets system initialized');
  }

  // ─── Spawner la plateforme de lancement ───────────────────
  function _spawnPlatform() {
    if (!_scene) return;
    const px = _platformPos.x;
    const pz = _platformPos.z;
    const py = _getHeightAt ? _getHeightAt(px, pz) : 0;

    // Base de la plateforme
    const baseGeo = new THREE.BoxGeometry(6, 0.5, 6);
    const baseMat = new THREE.MeshLambertMaterial({ color: 0x444455 });
    _platformMesh = new THREE.Mesh(baseGeo, baseMat);
    _platformMesh.position.set(px, py + 0.25, pz);
    _scene.add(_platformMesh);

    // Bras de support (4 colonnes)
    const colGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 8);
    const colMat = new THREE.MeshLambertMaterial({ color: 0x666677 });
    [[-2.5, -2.5], [2.5, -2.5], [-2.5, 2.5], [2.5, 2.5]].forEach(([dx, dz]) => {
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.set(px + dx, py + 1, pz + dz);
      _scene.add(col);
    });

    // Label
    _showNotif('🚀 Plateforme de lancement construite à ' + px.toFixed(0) + ', ' + pz.toFixed(0), 'info');
  }

  // ─── Lancer une fusée ─────────────────────────────────────
  function launchRocket(rocketId) {
    const def = ROCKET_DEFS[rocketId];
    if (!def) return;

    // Vérifier Ti requis
    if (_gameState && _gameState.ti < (def.unlockTi || 0)) {
      _showNotif(`🔒 Nécessite ${formatTi(def.unlockTi)}`, 'error');
      return;
    }

    // Vérifier ressources
    for (const [item, qty] of Object.entries(def.cost)) {
      if ((_gameState?.inventory[item] || 0) < qty) {
        const itm = ITEMS?.[item];
        _showNotif(`❌ Manque ${itm?.name || item} ×${qty}`, 'error');
        return;
      }
    }

    // Déduire ressources
    for (const [item, qty] of Object.entries(def.cost)) {
      _gameState.inventory[item] -= qty;
      if (_gameState.inventory[item] <= 0) delete _gameState.inventory[item];
    }

    // Animer le lancement
    _animateLaunch(def);

    // Enregistrer le vol
    const launch = {
      rocketId,
      def,
      launchedAt: Date.now(),
      returnsAt: def.returnTime > 0 ? Date.now() + def.returnTime * 1000 : null,
    };
    activeLaunches.push(launch);

    _showNotif(`🚀 ${def.icon} ${def.name} lancée !`, 'stage');
    _renderRocketPanel();
    _save();

    // Planifier le retour
    if (def.returnTime > 0) {
      setTimeout(() => _rocketReturn(launch), def.returnTime * 1000);
    } else {
      // Effet immédiat
      _applyEffect(def.effect, def);
    }
  }

  // ─── Animation de lancement ───────────────────────────────
  function _animateLaunch(def) {
    if (!_scene) return;

    const px = _platformPos.x;
    const pz = _platformPos.z;
    const py = _getHeightAt ? _getHeightAt(px, pz) : 0;

    // Créer le mesh de la fusée
    const bodyGeo = new THREE.CylinderGeometry(0.25, 0.25, 3, 8);
    const nosGeo  = new THREE.ConeGeometry(0.25, 1, 8);
    const mat     = new THREE.MeshLambertMaterial({ color: 0xccccdd });
    const mat2    = new THREE.MeshLambertMaterial({ color: 0xff4422 });

    const body = new THREE.Mesh(bodyGeo, mat);
    const nose = new THREE.Mesh(nosGeo, mat2);
    nose.position.y = 2;

    const group = new THREE.Group();
    group.add(body);
    group.add(nose);
    group.position.set(px, py + 2, pz);
    _scene.add(group);

    // Monter la fusée
    const startY = py + 2;
    const targetY = py + 150;
    const duration = def.launchTime * 1000;
    const startTime = performance.now();

    function animateUp() {
      const t = Math.min(1, (performance.now() - startTime) / duration);
      const eased = t * t; // accélération progressive
      group.position.y = startY + (targetY - startY) * eased;
      group.rotation.y += 0.02;

      if (t < 1) {
        requestAnimationFrame(animateUp);
      } else {
        _scene.remove(group);
      }
    }
    requestAnimationFrame(animateUp);
  }

  // ─── Retour de fusée ──────────────────────────────────────
  function _rocketReturn(launch) {
    const def = launch.def;
    _applyEffect(def.effect, def);

    // Retirer de la liste
    const idx = activeLaunches.indexOf(launch);
    if (idx !== -1) activeLaunches.splice(idx, 1);

    _renderRocketPanel();
    _save();
  }

  // ─── Appliquer effet ──────────────────────────────────────
  function _applyEffect(effect, def) {
    if (!_gameState) return;

    if (typeof effect === 'string') {
      // Effets prédéfinis
      switch (effect) {
        case 'map_reveal_25':  mapReveal.pct = Math.max(mapReveal.pct, 25);  _notifyMap(); break;
        case 'map_reveal_50':  mapReveal.pct = Math.max(mapReveal.pct, 50);  _notifyMap(); break;
        case 'map_reveal_75':  mapReveal.pct = Math.max(mapReveal.pct, 75);  _notifyMap(); break;
        case 'map_reveal_100': mapReveal.pct = 100; _notifyMap(); break;
        case 'reveal_wrecks':
          mapReveal.wrecksRevealed = true;
          if (typeof LootSystem !== 'undefined') LootSystem.revealAll();
          _showNotif('📡 Toutes les épaves sont révélées sur la carte !', 'stage');
          break;
        case 'reveal_resources':
          mapReveal.resourcesRevealed = true;
          _showNotif('📡 Ressources rares révélées sur la carte !', 'stage');
          break;
        case 'trade':
          // Retour commercial : Terra Tokens
          const tokensEarned = Math.floor(200 + Math.random() * 500);
          _gameState.terraTokens = (_gameState.terraTokens || 0) + tokensEarned;
          _showNotif(`💹 Mission commerciale terminée ! +${tokensEarned} Terra Tokens`, 'stage');
          if (typeof Marketplace !== 'undefined') Marketplace.updateHUD();
          break;
        case 'orbital_mining':
          // Ressources rares
          const rareOres = ['iridium', 'osmium', 'uranium', 'tungsten'];
          rareOres.forEach(ore => {
            const qty = Math.floor(2 + Math.random() * 5);
            _gameState.inventory[ore] = (_gameState.inventory[ore] || 0) + qty;
          });
          _showNotif('⛏️ Extraction orbitale terminée ! Ressources rares récupérées.', 'stage');
          break;
        case 'boost_pressure':
          _gameState.pressure = Math.min(100, (_gameState.pressure || 0) + 10);
          _showNotif('🧲 Champ magnétique activé ! +pression atmosphérique', 'stage');
          break;
        case 'boost_plants':
          _gameState.biomassPlants = Math.min(100, (_gameState.biomassPlants || 0) + 5);
          _showNotif('🌱 Biomasse végétale boostée !', 'stage');
          break;
        case 'meteor_shower':
          if (typeof EventSystem !== 'undefined') EventSystem.triggerRocketEvent('asteroid_attractor');
          break;
        case 'interplanetary_travel':
          _showNotif('🌍 Voyage interplanétaire ! (Selenea / Aqualis — à venir)', 'stage');
          break;
        case 'purify_atmosphere':
          _showNotif('💧 Purification atmosphérique en cours...', 'info');
          break;
        case 'drone_scan':
          _showNotif('🚁 Scan drone terminé — ressources proches révélées', 'info');
          break;
        case 'spread_seeds':
          _showNotif('🌸 Graines répandues sur toute la surface !', 'collect');
          if (typeof StageTransitions !== 'undefined') StageTransitions.spawnExtraVegetation();
          break;
        case 'spread_insects':
          _gameState.biomassInsects = Math.min(100, (_gameState.biomassInsects || 0) + 8);
          _showNotif('🦋 Insectes répandus !', 'collect');
          break;
        case 'spread_animals':
          _gameState.biomassAnimals = Math.min(100, (_gameState.biomassAnimals || 0) + 8);
          _showNotif('🐠 Animaux répandus dans les biomes !', 'collect');
          break;
      }
    } else if (effect && effect.type === 'meteor') {
      // Pluie de météorites
      if (typeof _spawnMeteorDrops === 'function') {
        _spawnMeteorDrops(effect.drops, Math.floor(Math.random() * (effect.qty.max - effect.qty.min) + effect.qty.min));
      }
    }
  }

  function _notifyMap() {
    _showNotif(`🗺️ Carte révélée à ${mapReveal.pct}% !`, 'stage');
    if (typeof MapSystem !== 'undefined') MapSystem.setRevealPct(mapReveal.pct);
  }

  // ─── Panneau fusées ───────────────────────────────────────
  function toggleRocketPanel() {
    const panel = document.getElementById('rocket-panel');
    if (!panel) return;
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) _renderRocketPanel();
  }

  function _renderRocketPanel() {
    const list = document.getElementById('rocket-list');
    if (!list) return;

    const ti = _gameState?.ti || 0;
    list.innerHTML = '';

    for (const [id, def] of Object.entries(ROCKET_DEFS)) {
      const locked    = ti < (def.unlockTi || 0);
      const costStr   = Object.entries(def.cost)
        .map(([item, qty]) => {
          const have = _gameState?.inventory[item] || 0;
          const ok   = have >= qty;
          return `<span class="${ok ? 'cost-ok' : 'cost-nok'}">${ITEMS?.[item]?.icon || ''}${ITEMS?.[item]?.name || item} ×${qty}</span>`;
        }).join(' ');

      const activeItem = activeLaunches.find(l => l.rocketId === id);
      const returnIn   = activeItem && activeItem.returnsAt
        ? Math.max(0, Math.ceil((activeItem.returnsAt - Date.now()) / 1000))
        : null;

      const div = document.createElement('div');
      div.className = `rocket-item${locked ? ' rocket-locked' : ''}`;
      div.innerHTML = `
        <div class="rocket-icon">${def.icon}</div>
        <div class="rocket-info">
          <div class="rocket-name">${def.name}${locked ? ` 🔒 (${formatTi(def.unlockTi)})` : ''}</div>
          <div class="rocket-desc">${def.description}</div>
          <div class="rocket-cost">${costStr}</div>
          ${def.returnTime > 0 ? `<div class="rocket-return">⏱ Retour : ${def.returnTime}s</div>` : ''}
        </div>
        <div class="rocket-launch-col">
          ${activeItem
            ? `<div class="rocket-inflight">🚀 En vol<br><small>${returnIn !== null ? returnIn + 's' : '∞'}</small></div>`
            : `<button class="rocket-btn" onclick="Rockets.launchRocket('${id}')" ${locked ? 'disabled' : ''}>LANCER</button>`
          }
        </div>
      `;
      list.appendChild(div);
    }
  }

  // ─── Update (timer des vols actifs) ───────────────────────
  function update() {
    if (activeLaunches.length > 0) {
      _renderRocketPanel();
    }
  }

  // ─── Persistance ──────────────────────────────────────────
  function _save() {
    try {
      localStorage.setItem('pc_rockets', JSON.stringify({
        activeLaunches: activeLaunches.map(l => ({
          rocketId: l.rocketId,
          launchedAt: l.launchedAt,
          returnsAt: l.returnsAt,
        })),
        mapReveal,
      }));
    } catch(_) {}
  }

  function _load() {
    try {
      const d = JSON.parse(localStorage.getItem('pc_rockets') || 'null');
      if (!d) return;
      if (d.mapReveal) Object.assign(mapReveal, d.mapReveal);
      if (d.activeLaunches) {
        for (const l of d.activeLaunches) {
          const def = ROCKET_DEFS[l.rocketId];
          if (!def) continue;
          const remaining = l.returnsAt - Date.now();
          if (remaining > 0) {
            const launch = { rocketId: l.rocketId, def, launchedAt: l.launchedAt, returnsAt: l.returnsAt };
            activeLaunches.push(launch);
            setTimeout(() => _rocketReturn(launch), remaining);
          }
        }
      }
    } catch(_) {}
  }

  function _showNotif(msg, type) {
    const notif = document.getElementById('notif');
    if (notif) {
      notif.textContent = msg;
      notif.className = 'notif-' + type;
      notif.style.opacity = '1';
      clearTimeout(Rockets._notifTimer);
      Rockets._notifTimer = setTimeout(() => { notif.style.opacity = '0'; }, 4000);
    }
  }

  return {
    init,
    update,
    launchRocket,
    toggleRocketPanel,
    getMapReveal: () => ({ ...mapReveal }),
    getDefs: () => ROCKET_DEFS,
    load: _load,
  };

})();
