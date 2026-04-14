// ============================================================
//  TERRAFORM  –  Système de jeu principal
//  Gère : Terraform Index, machines, inventaire, stades
// ============================================================

// ─── État global du jeu ────────────────────────────────────
const gameState = {
  ti:        0,          // Terraform Index total
  tiRate:    0,          // Ti/s actuel
  oxygen:    0,          // 0–100 %
  heat:      0,          // 0–100 %
  pressure:  0,          // 0–100 %
  biomass:   0,          // 0–100 %
  inventory: {},         // { itemId: quantity }
  machines:  [],         // machines placées
  playerId:  null,
  worldName: 'default',
  ws:        null,
  currentStageNumber: 1,
};

// ─── Types de machines & leurs effets ──────────────────────
const MACHINE_DEFS = {
  'oxygen-pump': {
    name:        'Pompe à O2',
    icon:        '💨',
    tiPerSec:    80,
    oxygenRate:  0.02,   // % par seconde
    cost:        { iron: 2, titanium: 1 },
    effect:      'Produit de l\'oxygène → +80 Ti/s',
  },
  'heater': {
    name:        'Chauffe-sol',
    icon:        '🌡️',
    tiPerSec:    80,
    heatRate:    0.02,
    cost:        { iron: 3, silicon: 1 },
    effect:      'Réchauffe la surface → +80 Ti/s',
  },
  'atmospheric-press': {
    name:        'Compresseur',
    icon:        '🌀',
    tiPerSec:    80,
    pressureRate:0.02,
    cost:        { titanium: 2, silicon: 1 },
    effect:      'Augmente la pression → +80 Ti/s',
  },
  'tree-spreader': {
    name:        'Semeur de vie',
    icon:        '🌿',
    tiPerSec:    120,
    biomassRate: 0.03,
    cost:        { iron: 1, silicon: 1, seed_lirma: 2 },
    effect:      'Répand la végétation → +120 Ti/s',
  },
  'solar-panel': {
    name:        'Panneau solaire',
    icon:        '⚡',
    tiPerSec:    40,
    energyRate:  0.01,
    cost:        { silicon: 2, aluminum: 1 },
    effect:      'Génère de l\'énergie → +40 Ti/s',
  },
  'biolab-station': {
    name:        'Station Bio',
    icon:        '🧪',
    tiPerSec:    200,
    biomassRate: 0.05,
    cost:        { silicon: 2, iron: 2, circuit_board: 1 },
    effect:      'Cultivre des organismes → +200 Ti/s',
  },
  'nuclear-reactor': {
    name:        'Réacteur nucléaire',
    icon:        '☢️',
    tiPerSec:    500,
    oxygenRate:  0.05,
    heatRate:    0.05,
    cost:        { uranium: 2, iron: 4, titanium: 2 },
    effect:      'Énergie massive → +500 Ti/s',
  },
  'atmospheric-condenser': {
    name:        'Condenseur atmosphérique',
    icon:        '🌧️',
    tiPerSec:    300,
    pressureRate:0.06,
    oxygenRate:  0.03,
    cost:        { titanium: 3, cobalt: 2, circuit_board: 1 },
    effect:      'Condense l\'atmosphère → +300 Ti/s',
  },
};

// ─── Ressources qui peuvent "spawner" sur le terrain ───────
const SPAWNABLE_ORES = [
  'iron', 'aluminum', 'cobalt', 'ice', 'magnesium',
  'silicon', 'titanium', 'phosphorus', 'sulfur', 'obsidian',
  'selenium', 'zeolite', 'iridium', 'osmium', 'uranium', 'tungsten',
];

// ─── Nœuds de ressources dans la scène (Three.js meshes) ──
let resourceNodes = [];

// ─── Référence à la scène Three.js (injectée depuis main) ─
let _scene = null;
let _getHeightAt = null;

// ============================================================
//  INIT
// ============================================================
function initTerraform(scene, getHeightAt) {
  _scene = scene;
  _getHeightAt = getHeightAt;

  // Charger l'inventaire depuis localStorage (persistance locale)
  _loadInventory();

  // Connexion WebSocket au serveur
  _connectWebSocket();

  // Spawner les ressources sur la carte
  _spawnResources(scene, getHeightAt);

  // Rendre le panneau de craft
  _renderCraftList();

  // Mise à jour initiale du HUD
  _updateHUD();

  // Interaction clavier E (ramasser)
  document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyE') _tryCollect();
    if (e.code === 'KeyB') toggleCraft();
    if (e.code === 'KeyI') toggleInventory();
  });

  console.log('✅ Terraform system initialized');
}

// ============================================================
//  UPDATE (appelé depuis main.js à chaque frame)
// ============================================================
function updateTerraform(delta, playerPos) {
  if (!_scene) return;

  // Accumuler le Ti
  gameState.ti += gameState.tiRate * delta;

  // Mettre à jour les stats à partir des machines
  for (const m of gameState.machines) {
    const def = MACHINE_DEFS[m.type];
    if (!def) continue;
    if (def.oxygenRate)   gameState.oxygen   = Math.min(100, gameState.oxygen   + def.oxygenRate   * delta);
    if (def.heatRate)     gameState.heat     = Math.min(100, gameState.heat     + def.heatRate     * delta);
    if (def.pressureRate) gameState.pressure = Math.min(100, gameState.pressure + def.pressureRate * delta);
    if (def.biomassRate)  gameState.biomass  = Math.min(100, gameState.biomass  + def.biomassRate  * delta);
  }

  // Détecter changement de stade
  _checkStageTransition();

  // Vérifier proximité ressources
  if (playerPos) _checkResourceProximity(playerPos);

  // Mettre à jour le HUD toutes les ~100ms (éviter perf)
  if (!updateTerraform._lastHud || performance.now() - updateTerraform._lastHud > 100) {
    _updateHUD();
    updateTerraform._lastHud = performance.now();
  }
}

// ============================================================
//  MACHINES
// ============================================================
function buildMachine(type) {
  const def = MACHINE_DEFS[type];
  if (!def) return;

  // Vérifier les ressources
  for (const [item, qty] of Object.entries(def.cost)) {
    if ((gameState.inventory[item] || 0) < qty) {
      _showNotif(`❌ Ressources insuffisantes pour ${def.name}`, 'error');
      return;
    }
  }

  // Consommer les ressources
  for (const [item, qty] of Object.entries(def.cost)) {
    gameState.inventory[item] -= qty;
    if (gameState.inventory[item] <= 0) delete gameState.inventory[item];
  }

  // Ajouter la machine
  gameState.machines.push({ type, id: Date.now() });
  gameState.tiRate += def.tiPerSec;

  // Afficher objet 3D de la machine
  _placeMachine3D(type, def);

  _showNotif(`✅ ${def.icon} ${def.name} construite ! (+${def.tiPerSec} Ti/s)`, 'success');
  _saveInventory();
  _updateHUD();
  _renderCraftList();

  // Envoyer au serveur
  if (gameState.ws && gameState.ws.readyState === WebSocket.OPEN) {
    gameState.ws.send(JSON.stringify({
      type: 'craft',
      playerId: gameState.playerId,
      item: type,
      quantity: 1,
    }));
  }
}

function _placeMachine3D(type, def) {
  if (!_scene || !_getHeightAt) return;
  // Placer devant le joueur (position approximative)
  const x = (Math.random() - 0.5) * 10;
  const z = (Math.random() - 0.5) * 10;
  const y = _getHeightAt(x, z);

  const geo = new THREE.BoxGeometry(1.5, 2, 1.5);
  const colors = {
    'oxygen-pump':          0x4488ff,
    'heater':               0xff4422,
    'atmospheric-press':    0x8844ff,
    'tree-spreader':        0x44bb44,
    'solar-panel':          0xffcc00,
    'biolab-station':       0x00ccaa,
    'nuclear-reactor':      0x44ff44,
    'atmospheric-condenser':0x0088ff,
  };
  const mat  = new THREE.MeshLambertMaterial({ color: colors[type] || 0x888888 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y + 1, z);
  mesh.castShadow = true;
  _scene.add(mesh);
}

// ============================================================
//  RESSOURCES : Spawn & Collecte
// ============================================================
function _spawnResources(scene, getHeightAt) {
  const mat = new THREE.MeshLambertMaterial({ color: 0x888888 });

  for (let i = 0; i < 80; i++) {
    const itemId = _weightedRandom(SPAWNABLE_ORES, SPAWNABLE_ORES.map(id => ITEMS[id]?.spawnWeight || 10));
    const item   = ITEMS[itemId];

    const x = (Math.random() - 0.5) * 180;
    const z = (Math.random() - 0.5) * 180;
    if (Math.sqrt(x * x + z * z) < 8) continue; // éviter spawn

    const scale = 0.4 + Math.random() * 0.6;
    const geo   = new THREE.DodecahedronGeometry(scale, 0);
    const color = item?.color ? parseInt(item.color.replace('#', '0x')) : 0x888888;
    const nodeMat = new THREE.MeshLambertMaterial({ color });
    const mesh  = new THREE.Mesh(geo, nodeMat);

    const y = getHeightAt(x, z);
    mesh.position.set(x, y + scale * 0.5, z);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    mesh.castShadow = true;

    mesh.userData = { isResource: true, itemId, quantity: 1 };
    scene.add(mesh);
    resourceNodes.push(mesh);
  }
}

function _checkResourceProximity(playerPos) {
  const COLLECT_DIST = 3;
  let nearest = null;
  let nearestDist = Infinity;

  for (const node of resourceNodes) {
    if (!node.visible) continue;
    const dx = node.position.x - playerPos.x;
    const dz = node.position.z - playerPos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < COLLECT_DIST && dist < nearestDist) {
      nearest = node;
      nearestDist = dist;
    }
  }

  const hint = document.getElementById('interact-hint');
  if (hint) {
    if (nearest) {
      const item = ITEMS[nearest.userData.itemId];
      hint.textContent = `E — Ramasser ${item?.icon || ''}  ${item?.name || nearest.userData.itemId}`;
      hint.classList.remove('hidden');
      updateTerraform._nearestResource = nearest;
    } else {
      hint.classList.add('hidden');
      updateTerraform._nearestResource = null;
    }
  }
}

function _tryCollect() {
  const node = updateTerraform._nearestResource;
  if (!node || !node.visible) return;

  const { itemId, quantity } = node.userData;
  gameState.inventory[itemId] = (gameState.inventory[itemId] || 0) + quantity;

  // Cacher le nœud (il a été ramassé)
  node.visible = false;

  // Respawn after 30s
  setTimeout(() => { node.visible = true; }, 30000);

  const item = ITEMS[itemId];
  _showNotif(`+${quantity} ${item?.icon || ''} ${item?.name || itemId}`, 'collect');
  _saveInventory();
  _renderInventory();
}

// ─── Sélection pondérée ────────────────────────────────────
function _weightedRandom(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

// ============================================================
//  STADES
// ============================================================
function _checkStageTransition() {
  const stage = getCurrentStage(gameState.ti);
  if (stage.number !== gameState.currentStageNumber) {
    gameState.currentStageNumber = stage.number;
    _onStageChange(stage);
  }
}

function _onStageChange(stage) {
  _showNotif(`🌍 Nouveau stade : ${stage.icon} ${stage.nameFr}`, 'stage');

  // Changer la couleur du ciel
  if (_scene) {
    _scene.background = new THREE.Color(stage.skyColor);
    _scene.fog.color.setHex(stage.fogColor);
  }

  // Annoncer dans le HUD
  const stageEl = document.getElementById('stage-name');
  if (stageEl) stageEl.textContent = `${stage.icon} ${stage.nameFr}`;

  const stageDesc = document.getElementById('stage-desc');
  if (stageDesc) stageDesc.textContent = stage.description;
}

// ============================================================
//  HUD
// ============================================================
function _updateHUD() {
  // Barres
  _setBar('oxygen',   gameState.oxygen);
  _setBar('heat',     gameState.heat);
  _setBar('pressure', gameState.pressure);
  _setBar('biomass',  gameState.biomass);

  // Ti total
  const tiEl = document.getElementById('hud-ti');
  if (tiEl) tiEl.textContent = formatTi(gameState.ti);

  const tiRateEl = document.getElementById('hud-ti-rate');
  if (tiRateEl) tiRateEl.textContent = formatTiRate(gameState.tiRate) + '/s';

  // Stade actuel
  const stage    = getCurrentStage(gameState.ti);
  const stageEl  = document.getElementById('stage-name');
  if (stageEl) stageEl.textContent = `${stage.icon} ${stage.nameFr}`;

  // Progrès vers le prochain stade
  const progress  = getStageProgress(gameState.ti);
  const nextStage = getNextStage(gameState.ti);
  const progEl    = document.getElementById('stage-progress-bar');
  if (progEl) progEl.style.width = (progress * 100).toFixed(1) + '%';

  const nextEl    = document.getElementById('stage-next');
  if (nextEl) {
    nextEl.textContent = nextStage
      ? `→ ${nextStage.icon} ${nextStage.nameFr} (${formatTi(nextStage.ti)})`
      : '🎉 Terraformation complète !';
  }

  // Machines actives
  const machEl = document.getElementById('hud-machines');
  if (machEl) machEl.textContent = gameState.machines.length + ' machine(s)';
}

function _setBar(name, pct) {
  const bar = document.getElementById('bar-' + name);
  const val = document.getElementById('val-' + name);
  if (bar) bar.style.width = Math.min(100, pct).toFixed(1) + '%';
  if (val) val.textContent = Math.min(100, pct).toFixed(1) + '%';
}

// ============================================================
//  INVENTAIRE
// ============================================================
function toggleInventory() {
  const panel = document.getElementById('inventory');
  if (!panel) return;
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) _renderInventory();
}

function _renderInventory() {
  const grid = document.getElementById('inv-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const entries = Object.entries(gameState.inventory).filter(([, qty]) => qty > 0);
  if (entries.length === 0) {
    grid.innerHTML = '<div class="inv-empty">Inventaire vide — explorez pour collecter des ressources</div>';
    return;
  }

  // Regrouper par catégorie
  const byCategory = {};
  for (const [itemId, qty] of entries) {
    const item = ITEMS[itemId];
    if (!item) continue;
    const cat = item.category || 'other';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push({ item, qty });
  }

  for (const [cat, items] of Object.entries(byCategory)) {
    const catInfo = ITEM_CATEGORIES[cat] || { label: cat, icon: '📦' };

    const header = document.createElement('div');
    header.className = 'inv-category-header';
    header.textContent = `${catInfo.icon} ${catInfo.label}`;
    grid.appendChild(header);

    const row = document.createElement('div');
    row.className = 'inv-row';

    for (const { item, qty } of items) {
      const slot = document.createElement('div');
      slot.className = 'inv-slot';
      slot.title = item.name;
      slot.innerHTML = `
        <div class="inv-icon">${item.icon}</div>
        <div class="inv-name">${item.name}</div>
        <div class="inv-qty">×${qty}</div>
      `;
      row.appendChild(slot);
    }

    grid.appendChild(row);
  }
}

// ============================================================
//  PANNEAU CRAFT
// ============================================================
function toggleCraft() {
  const panel = document.getElementById('craft-panel');
  if (!panel) return;
  panel.classList.toggle('hidden');
}

function _renderCraftList() {
  const list = document.getElementById('craft-list');
  if (!list) return;

  list.innerHTML = '';

  for (const [type, def] of Object.entries(MACHINE_DEFS)) {
    const canAfford = Object.entries(def.cost).every(
      ([item, qty]) => (gameState.inventory[item] || 0) >= qty
    );

    const costStr = Object.entries(def.cost)
      .map(([item, qty]) => {
        const info = ITEMS[item];
        const have = gameState.inventory[item] || 0;
        const ok   = have >= qty;
        return `<span class="${ok ? 'cost-ok' : 'cost-nok'}">${info?.icon || ''}${info?.name || item} ×${qty} (${have})</span>`;
      }).join(' ');

    const div = document.createElement('div');
    div.className = 'craft-item' + (canAfford ? '' : ' craft-unavailable');
    div.innerHTML = `
      <div class="craft-icon">${def.icon}</div>
      <div class="craft-info">
        <div class="craft-name">${def.name}</div>
        <div class="craft-cost">${costStr}</div>
        <div class="craft-effect">${def.effect}</div>
      </div>
      <button class="craft-btn" onclick="buildMachine('${type}')" ${canAfford ? '' : 'disabled'}>POSER</button>
    `;
    list.appendChild(div);
  }
}

// ============================================================
//  NOTIFICATIONS
// ============================================================
function _showNotif(msg, type = 'info') {
  const notif = document.getElementById('notif');
  if (!notif) return;
  notif.textContent = msg;
  notif.className = 'notif-' + type;
  notif.style.opacity = '1';
  clearTimeout(_showNotif._timer);
  _showNotif._timer = setTimeout(() => { notif.style.opacity = '0'; }, 3000);
}

// ============================================================
//  PERSISTANCE (localStorage)
// ============================================================
function _saveInventory() {
  try {
    localStorage.setItem('pc_inventory', JSON.stringify(gameState.inventory));
    localStorage.setItem('pc_ti',        JSON.stringify(gameState.ti));
    localStorage.setItem('pc_machines',  JSON.stringify(gameState.machines.map(m => m.type)));
  } catch(_) {}
}

function _loadInventory() {
  try {
    const inv = localStorage.getItem('pc_inventory');
    if (inv) gameState.inventory = JSON.parse(inv);
    const ti  = localStorage.getItem('pc_ti');
    if (ti)  gameState.ti = parseFloat(ti);
    const mach = localStorage.getItem('pc_machines');
    if (mach) {
      const types = JSON.parse(mach);
      for (const t of types) {
        const def = MACHINE_DEFS[t];
        if (def) {
          gameState.machines.push({ type: t, id: Date.now() + Math.random() });
          gameState.tiRate += def.tiPerSec;
        }
      }
    }
  } catch(_) {}
}

// ============================================================
//  WEBSOCKET
// ============================================================
function _connectWebSocket() {
  try {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
      gameState.ws = ws;
      gameState.playerId = 'player_' + Date.now();
      ws.send(JSON.stringify({
        type:       'join_game',
        playerId:   gameState.playerId,
        worldName:  gameState.worldName,
      }));
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'game_joined' && data.world) {
          // Synchroniser avec le serveur (on garde le plus grand Ti)
          if (data.world.terraform_index > gameState.ti) {
            gameState.ti = data.world.terraform_index;
          }
        }
      } catch (_) {}
    };

    ws.onerror = () => {};  // serveur optionnel
  } catch (_) {}
}
