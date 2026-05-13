// ============================================================
//  TERRAFORM  –  Système de jeu principal
//  Gère : Terraform Index, machines, inventaire, stades,
//         power grid, biomasses séparées, crafting complet
// ============================================================

// ─── État global du jeu ────────────────────────────────────
const gameState = {
  ti:            0,
  tiRate:        0,
  oxygen:        0,
  heat:          0,
  pressure:      0,
  biomass:       0,
  biomassPlants: 0,
  biomassInsects:0,
  biomassAnimals:0,
  inventory:     {},
  machines:      [],   // { type, id, pos:{x,y,z}, rot }
  playerId:      null,
  worldName:     'default',
  ws:            null,
  currentStageNumber: 1,
  terraTokens:   0,
  purchasedBlueprints: [],
};

// ─── Références ─────────────────────────────────────────────
let _scene       = null;
let _getHeightAt = null;

// ─── Ressources spawnables ────────────────────────────────
const SPAWNABLE_ORES = [
  'iron','aluminum','cobalt','ice','magnesium','silicon',
  'titanium','phosphorus','sulfur','obsidian','selenium',
  'zeolite','iridium','osmium','uranium','tungsten',
];
let resourceNodes = [];

// ─── Machine available check ─────────────────────────────
function _getAvailableMachines() {
  if (typeof MACHINES === 'undefined') return {};
  const result = {};
  for (const [id, def] of Object.entries(MACHINES)) {
    const reqTi = def.unlockTi || 0;
    if (gameState.ti >= reqTi || (typeof STARTER_MACHINES !== 'undefined' && STARTER_MACHINES.includes(id))) {
      result[id] = def;
    }
  }
  return result;
}

// ============================================================
//  INIT
// ============================================================
function initTerraform(scene, getHeightAt) {
  _scene       = scene;
  _getHeightAt = getHeightAt;

  _loadState();
  _connectWebSocket();
  _spawnResources(scene, getHeightAt);
  _renderCraftList();
  _updateHUD();

  // Clavier
  document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyE') _handleInteract();
    if (e.code === 'KeyB') toggleCraft();
    if (e.code === 'KeyI') toggleInventory();
    if (e.code === 'KeyF') toggleRecipesPanel();
  });

  // Événements météo
  if (typeof EventSystem !== 'undefined') {
    EventSystem.init(gameState.ti, _onEventStart, _onEventEnd);
  }

  console.log('✅ Terraform system initialized');
}

// ─── Interaction E (ramasser / looter) ─────────────────────
function _handleInteract() {
  // 1. Loot (épaves / caisses) en priorité
  if (typeof LootSystem !== 'undefined' && LootSystem._pending) {
    if (LootSystem.loot()) return;
  }
  // 2. Ressources minerai
  _tryCollect();
  // 3. Consommable sélectionné ?
  // (géré depuis l'inventaire)
}

// ============================================================
//  UPDATE
// ============================================================
function updateTerraform(delta, playerPos) {
  if (!_scene) return;

  // Power grid
  if (typeof PowerGrid !== 'undefined') PowerGrid.update();

  // Accumuler Ti (machines en ligne seulement)
  let effectiveTiRate = 0;
  for (const m of gameState.machines) {
    const def = MACHINES?.[m.type];
    if (!def) continue;
    const online = typeof PowerGrid !== 'undefined'
      ? PowerGrid.getMachineEfficiency(m.id)
      : 1.0;
    effectiveTiRate += (def.tiPerSec || 0) * online;
  }
  gameState.tiRate  = effectiveTiRate;
  gameState.ti     += effectiveTiRate * delta;

  // Stats atmosphériques
  for (const m of gameState.machines) {
    const def    = MACHINES?.[m.type];
    if (!def) continue;
    const online = typeof PowerGrid !== 'undefined' ? PowerGrid.getMachineEfficiency(m.id) : 1;
    if (def.oxygenRate)   gameState.oxygen   = Math.min(100, gameState.oxygen   + def.oxygenRate   * delta * online);
    if (def.heatRate)     gameState.heat     = Math.min(100, gameState.heat     + def.heatRate     * delta * online);
    if (def.pressureRate) gameState.pressure = Math.min(100, gameState.pressure + def.pressureRate * delta * online);

    // Biomasses séparées selon le type de machine
    if (def.biomassRate && online > 0) {
      const cat = _getMachineBiomassCategory(m.type);
      if (cat === 'plants')   gameState.biomassPlants  = Math.min(100, gameState.biomassPlants  + def.biomassRate * delta);
      else if (cat === 'insects') gameState.biomassInsects = Math.min(100, gameState.biomassInsects + def.biomassRate * delta);
      else if (cat === 'animals') gameState.biomassAnimals = Math.min(100, gameState.biomassAnimals + def.biomassRate * delta);
      else                    gameState.biomass        = Math.min(100, gameState.biomass        + def.biomassRate * delta);
    }
  }

  // Biomasse totale = moyenne des 3 sous-biomasses
  if (gameState.biomassPlants + gameState.biomassInsects + gameState.biomassAnimals > 0) {
    gameState.biomass = (gameState.biomassPlants + gameState.biomassInsects + gameState.biomassAnimals) / 3;
  }

  // Stade
  _checkStageTransition();

  // Proximité ressources & loot
  if (playerPos) {
    _checkResourceProximity(playerPos);
    if (typeof LootSystem !== 'undefined') LootSystem.checkProximity(playerPos);
  }

  // Survie
  if (typeof Survival !== 'undefined') Survival.update(delta, playerPos);

  // Équipement (jetpack)
  if (typeof Equipment !== 'undefined') Equipment.update(delta);

  // Map
  if (typeof MapSystem !== 'undefined') MapSystem.update(playerPos);

  // Fusées
  if (typeof Rockets !== 'undefined') Rockets.update();

  // Microchips
  if (typeof Microchips !== 'undefined') Microchips.update();

  // DNA Lab
  if (typeof DNALab !== 'undefined') DNALab.update();

  // HUD toutes les ~100ms
  if (!updateTerraform._lastHud || performance.now() - updateTerraform._lastHud > 100) {
    _updateHUD();
    updateTerraform._lastHud = performance.now();
  }

  // Sauvegarde toutes les 15s
  if (!updateTerraform._lastSave || performance.now() - updateTerraform._lastSave > 15000) {
    _saveState();
    updateTerraform._lastSave = performance.now();
  }
}

// ─── Catégorie biomasse d'une machine ─────────────────────
function _getMachineBiomassCategory(type) {
  const plants  = ['vegetube_t1','vegetube_t2','vegetube_t3','tree_spreader_t1','tree_spreader_t2',
                   'tree_spreader_t3','grass_spreader','flower_spreader_t1','flower_spreader_t2',
                   'algae_t1','algae_t2'];
  const insects = ['beehive_t1','beehive_t2','butterfly_farm_t1','butterfly_farm_t2','butterfly_farm_t3'];
  const animals = ['fish_farm_t1','fish_farm_t2','aquarium_t1','aquarium_t2','amphibian_farm','animal_farm','biodome_t1','biodome_t2'];
  if (plants.includes(type))  return 'plants';
  if (insects.includes(type)) return 'insects';
  if (animals.includes(type)) return 'animals';
  return 'general';
}

// ============================================================
//  MACHINES
// ============================================================
function buildMachine(type) {
  const def = MACHINES?.[type];
  if (!def) return;

  // Vérifier ressources
  for (const [item, qty] of Object.entries(def.cost)) {
    if ((gameState.inventory[item] || 0) < qty) {
      _showNotif(`❌ Ressources insuffisantes pour ${def.name}`, 'error');
      return;
    }
  }

  // Déduire
  for (const [item, qty] of Object.entries(def.cost)) {
    gameState.inventory[item] -= qty;
    if (gameState.inventory[item] <= 0) delete gameState.inventory[item];
  }

  // Démarrer le mode de placement 3D si disponible
  if (typeof Placement !== 'undefined' && Placement.isActive !== undefined) {
    Placement.startPlacement(type);
  } else {
    // Placement direct (ancien comportement)
    _placeMachineImmediate(type, def);
  }

  _renderCraftList();
  _saveState();
}

// ─── Placer une machine avec position & rotation ──────────
function buildMachineAt(type, pos, rotation) {
  const def = MACHINES?.[type];
  if (!def) return;

  const machineId = 'mach_' + Date.now() + '_' + Math.random().toString(36).slice(2);
  gameState.machines.push({ type, id: machineId, pos: { x: pos.x, y: pos.y, z: pos.z }, rot: rotation });
  gameState.tiRate += def.tiPerSec || 0;

  _placeMachine3D(type, def, pos.x, pos.y, pos.z, rotation);

  _showNotif(`✅ ${def.icon} ${def.name} posée !`, 'success');
  _updateHUD();
  _renderCraftList();
  _saveState();

  // Ajouter sur la carte
  if (typeof MapSystem !== 'undefined') {
    MapSystem.addPOI(pos.x, pos.z, def.icon || '⚙️', def.name, 'machine');
  }
}

function _placeMachineImmediate(type, def) {
  const x = (Math.random() - 0.5) * 20;
  const z = (Math.random() - 0.5) * 20;
  const y = _getHeightAt ? _getHeightAt(x, z) : 0;

  const machineId = 'mach_' + Date.now() + '_' + Math.random().toString(36).slice(2);
  gameState.machines.push({ type, id: machineId, pos: { x, y, z }, rot: 0 });
  gameState.tiRate += def.tiPerSec || 0;

  _placeMachine3D(type, def, x, y, z, 0);

  _showNotif(`✅ ${def.icon} ${def.name} construite ! (+${def.tiPerSec || 0} Ti/s)`, 'success');
  _updateHUD();
}

function _placeMachine3D(type, def, x, y, z, rot) {
  if (!_scene) return;
  const colors = {
    heater_t1:0xff4422,heater_t2:0xff5533,heater_t3:0xff6644,heater_t4:0xff7755,heater_t5:0xff8866,
    drill_t1:0x886644,drill_t2:0x997755,drill_t3:0xaa8866,drill_t4:0xbb9977,drill_t5:0xccaa88,
    solar_t1:0xffcc00,solar_t2:0xffdd22,
    wind_turbine_t1:0x88ccff,wind_turbine_t2:0x99ddff,
    nuclear_t1:0x44ff44,nuclear_t2:0x66ff66,fusion_generator:0x00ffff,
    vegetube_t1:0x44aa44,vegetube_t2:0x55bb55,vegetube_t3:0x66cc66,
    tree_spreader_t1:0x228822,tree_spreader_t2:0x33aa33,tree_spreader_t3:0x44cc44,
    grass_spreader:0x88dd44,flower_spreader_t1:0xff88cc,flower_spreader_t2:0xff44aa,
    algae_t1:0x00ccaa,algae_t2:0x00ddbb,
    beehive_t1:0xffcc44,beehive_t2:0xffdd55,
    butterfly_farm_t1:0xff88ff,butterfly_farm_t2:0xff66ff,butterfly_farm_t3:0xff44ff,
    fish_farm_t1:0x4488cc,fish_farm_t2:0x5599dd,
    aquarium_t1:0x2266aa,aquarium_t2:0x3377bb,
    amphibian_farm:0x44aa66,
    ore_extractor_t1:0x885544,ore_extractor_t2:0x996655,ore_extractor_t3:0xaa7766,
  };

  const geo  = new THREE.BoxGeometry(1.5, 2, 1.5);
  const mat  = new THREE.MeshLambertMaterial({ color: colors[type] || 0x888888 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y + 1, z);
  mesh.rotation.y   = (rot || 0) * Math.PI / 180;
  mesh.castShadow   = true;
  _scene.add(mesh);
}

// ============================================================
//  CRAFTING COMPLET (recettes items)
// ============================================================
function toggleRecipesPanel() {
  const panel = document.getElementById('recipes-panel');
  if (!panel) return;
  panel.classList.toggle('hidden');
  if (!panel.classList.contains('hidden')) _renderRecipesPanel();
}

function _renderRecipesPanel() {
  const list = document.getElementById('recipes-list');
  if (!list || typeof RECIPES === 'undefined') return;
  list.innerHTML = '';

  const activeFilter = document.getElementById('recipe-filter')?.value || 'all';

  for (const [recipeId, recipe] of Object.entries(RECIPES)) {
    // Filtrer par station si nécessaire
    const station = CRAFT_STATIONS?.[recipe.station];
    if (station?.unlockTi && gameState.ti < station.unlockTi) continue;
    if (station?.unlockBiomass && gameState.biomass < station.unlockBiomass) continue;

    // Filtrer par catégorie
    if (activeFilter !== 'all' && recipe.station !== activeFilter) continue;

    const canAfford = Object.entries(recipe.ingredients).every(
      ([item, qty]) => (gameState.inventory[item] || 0) >= qty
    );

    const costStr = Object.entries(recipe.ingredients).map(([item, qty]) => {
      const have = gameState.inventory[item] || 0;
      const itm  = ITEMS?.[item];
      const ok   = have >= qty;
      return `<span class="${ok ? 'cost-ok' : 'cost-nok'}">${itm?.icon || '📦'}${itm?.name || item} ×${qty}(${have})</span>`;
    }).join(' ');

    const effectStr = recipe.effect
      ? Object.entries(recipe.effect).map(([k, v]) => `+${v} ${k}`).join(', ')
      : (recipe.slot ? `Slot : ${recipe.slot}` : '');

    const div = document.createElement('div');
    div.className = 'craft-item' + (canAfford ? '' : ' craft-unavailable');
    div.innerHTML = `
      <div class="craft-icon">${ITEMS?.[recipeId]?.icon || recipe.icon || '📦'}</div>
      <div class="craft-info">
        <div class="craft-name">${recipe.name}</div>
        <div class="craft-cost">${costStr}</div>
        ${effectStr ? `<div class="craft-effect">${effectStr}</div>` : ''}
        ${recipe.craftTime ? `<div class="craft-time">⏱ ${recipe.craftTime}s</div>` : ''}
      </div>
      <button class="craft-btn" onclick="craftItem('${recipeId}')" ${canAfford ? '' : 'disabled'}>
        Craft ×${recipe.qty || 1}
      </button>
    `;
    list.appendChild(div);
  }
}

function craftItem(recipeId) {
  const recipe = RECIPES?.[recipeId];
  if (!recipe) return;

  // Vérifier ingrédients
  for (const [item, qty] of Object.entries(recipe.ingredients)) {
    if ((gameState.inventory[item] || 0) < qty) {
      _showNotif(`❌ Ressources insuffisantes`, 'error');
      return;
    }
  }

  // Consommer
  for (const [item, qty] of Object.entries(recipe.ingredients)) {
    gameState.inventory[item] -= qty;
    if (gameState.inventory[item] <= 0) delete gameState.inventory[item];
  }

  // Obtenir
  const outputId  = recipeId;
  const outputQty = recipe.qty || 1;
  gameState.inventory[outputId] = (gameState.inventory[outputId] || 0) + outputQty;

  const item = ITEMS?.[outputId];
  _showNotif(`✅ Crafté : ${item?.icon || '📦'} ${recipe.name} ×${outputQty}`, 'success');
  _saveState();
  _renderRecipesPanel();
  _renderInventory();

  // Équiper automatiquement si slot
  if (recipe.slot && typeof Equipment !== 'undefined') {
    // Proposer d'équiper
    _showNotif(`✅ ${recipe.name} crafté ! Appuyez sur X pour équiper`, 'success');
  }
}

// ─── Utiliser un consommable depuis l'inventaire ────────────
function useConsumable(itemId) {
  if ((gameState.inventory[itemId] || 0) <= 0) return;
  if (typeof Survival !== 'undefined' && Survival.consumeItem(itemId)) {
    gameState.inventory[itemId]--;
    if (gameState.inventory[itemId] <= 0) delete gameState.inventory[itemId];
    _renderInventory();
    _saveState();
  }
}

// ============================================================
//  RESSOURCES : Spawn & Collecte
// ============================================================
function _spawnResources(scene, getHeightAt) {
  for (let i = 0; i < 100; i++) {
    const itemId = _weightedRandom(
      SPAWNABLE_ORES,
      SPAWNABLE_ORES.map(id => ITEMS?.[id]?.spawnWeight || 10)
    );
    const item = ITEMS?.[itemId];

    const x = (Math.random() - 0.5) * 180;
    const z = (Math.random() - 0.5) * 180;
    if (Math.sqrt(x*x + z*z) < 8) continue;

    const scale  = 0.4 + Math.random() * 0.6;
    const geo    = new THREE.DodecahedronGeometry(scale, 0);
    const color  = item?.color ? parseInt(item.color.replace('#','0x')) : 0x888888;
    const mat    = new THREE.MeshLambertMaterial({ color });
    const mesh   = new THREE.Mesh(geo, mat);
    const y      = getHeightAt(x, z);
    mesh.position.set(x, y + scale * 0.5, z);
    mesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
    mesh.castShadow = true;
    mesh.userData   = { isResource: true, itemId, quantity: Math.floor(1 + Math.random() * 3) };
    scene.add(mesh);
    resourceNodes.push(mesh);
  }
}

function _checkResourceProximity(playerPos) {
  const DIST = 3;
  let nearest = null, nearestDist = Infinity;

  for (const node of resourceNodes) {
    if (!node.visible) continue;
    if (typeof LootSystem !== 'undefined' && LootSystem._pending) continue; // loot prioritaire
    const dx = node.position.x - playerPos.x;
    const dz = node.position.z - playerPos.z;
    const d  = Math.sqrt(dx*dx + dz*dz);
    if (d < DIST && d < nearestDist) { nearest = node; nearestDist = d; }
  }

  const hint = document.getElementById('interact-hint');
  if (hint) {
    if (nearest && !LootSystem?._pending) {
      const item = ITEMS?.[nearest.userData.itemId];
      hint.textContent = `E — Ramasser ${item?.icon || ''} ${item?.name || nearest.userData.itemId}`;
      hint.classList.remove('hidden');
      updateTerraform._nearestResource = nearest;
    } else if (!LootSystem?._pending) {
      hint.classList.add('hidden');
      updateTerraform._nearestResource = null;
    }
  }
}

function _tryCollect() {
  const node = updateTerraform._nearestResource;
  if (!node || !node.visible) return;

  const { itemId, quantity } = node.userData;

  // Vérifier capacité d'inventaire
  const capacity = typeof Equipment !== 'undefined' ? Equipment.getEffect('inventoryCapacity') : 10;
  const currentSlots = Object.keys(gameState.inventory).length;
  if (currentSlots >= capacity && !gameState.inventory[itemId]) {
    _showNotif(`❌ Inventaire plein ! (${currentSlots}/${capacity} slots)`, 'error');
    return;
  }

  gameState.inventory[itemId] = (gameState.inventory[itemId] || 0) + quantity;
  node.visible = false;
  setTimeout(() => { node.visible = true; }, 30000);

  const item = ITEMS?.[itemId];
  _showNotif(`+${quantity} ${item?.icon || ''} ${item?.name || itemId}`, 'collect');
  _saveState();
  _renderInventory();
}

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
//  STADES  +  TRANSITIONS VISUELLES
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

  if (_scene) {
    _scene.background = new THREE.Color(stage.skyColor);
    _scene.fog.color.setHex(stage.fogColor);
  }

  // Transitions visuelles (végétation, eau)
  _applyStageVisuals(stage);

  const stageEl = document.getElementById('stage-name');
  if (stageEl) stageEl.textContent = `${stage.icon} ${stage.nameFr}`;
  const stageDesc = document.getElementById('stage-desc');
  if (stageDesc) stageDesc.textContent = stage.description;
}

function _applyStageVisuals(stage) {
  if (!_scene || !_getHeightAt) return;

  // Stade 4+ : petites plantes
  if (stage.number >= 4 && stage.number < 7) {
    _spawnVegetation(30, 'bush');
  }
  // Stade 7+ : herbe + arbustes
  if (stage.number >= 7 && stage.number < 10) {
    _spawnVegetation(60, 'grass');
  }
  // Stade 10+ : arbres
  if (stage.number >= 10) {
    _spawnVegetation(40, 'tree');
  }
  // Stade 9+ : plan d'eau (simple)
  if (stage.number >= 9) {
    _spawnWater();
  }
}

function _spawnVegetation(count, type) {
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 160;
    const z = (Math.random() - 0.5) * 160;
    const y = _getHeightAt(x, z);

    let mesh;
    if (type === 'tree') {
      const trunk = new THREE.CylinderGeometry(0.15, 0.2, 2, 6);
      const foliage = new THREE.SphereGeometry(0.8 + Math.random() * 0.5, 7, 5);
      const trunkM = new THREE.MeshLambertMaterial({ color: 0x5C3317 });
      const leafM  = new THREE.MeshLambertMaterial({ color: 0x228B22 });
      const tMesh  = new THREE.Mesh(trunk, trunkM);
      const fMesh  = new THREE.Mesh(foliage, leafM);
      fMesh.position.y = 1.8;
      const group  = new THREE.Group();
      group.add(tMesh);
      group.add(fMesh);
      group.position.set(x, y, z);
      _scene.add(group);
      continue;
    } else if (type === 'bush') {
      const geo = new THREE.SphereGeometry(0.3 + Math.random() * 0.3, 6, 5);
      const mat = new THREE.MeshLambertMaterial({ color: 0x2E7D32 });
      mesh = new THREE.Mesh(geo, mat);
    } else {
      const geo = new THREE.ConeGeometry(0.1 + Math.random() * 0.1, 0.4 + Math.random() * 0.3, 5);
      const mat = new THREE.MeshLambertMaterial({ color: 0x388E3C });
      mesh = new THREE.Mesh(geo, mat);
    }

    mesh.position.set(x, y + 0.2, z);
    mesh.rotation.y = Math.random() * Math.PI * 2;
    _scene.add(mesh);
  }
}

function _spawnWater() {
  // Plan d'eau basse altitude
  const geo = new THREE.PlaneGeometry(60, 60);
  const mat = new THREE.MeshLambertMaterial({
    color: 0x1565C0,
    transparent: true,
    opacity: 0.6,
  });
  const water = new THREE.Mesh(geo, mat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(-20, -1.5, -20);
  _scene.add(water);
}

// ============================================================
//  HUD
// ============================================================
function _updateHUD() {
  _setBar('oxygen',   gameState.oxygen);
  _setBar('heat',     gameState.heat);
  _setBar('pressure', gameState.pressure);
  _setBar('biomass',  gameState.biomass);

  // Biomasses séparées
  _setBar('plants',   gameState.biomassPlants);
  _setBar('insects',  gameState.biomassInsects);
  _setBar('animals',  gameState.biomassAnimals);

  // Ti
  const tiEl     = document.getElementById('hud-ti');
  const tiRateEl = document.getElementById('hud-ti-rate');
  if (tiEl)     tiEl.textContent     = formatTi(gameState.ti);
  if (tiRateEl) tiRateEl.textContent = formatTiRate(gameState.tiRate) + '/s';

  // Stade
  const stage   = getCurrentStage(gameState.ti);
  const stageEl = document.getElementById('stage-name');
  if (stageEl) stageEl.textContent = `${stage.icon} ${stage.nameFr}`;
  const stageDesc = document.getElementById('stage-desc');
  if (stageDesc) stageDesc.textContent = stage.description;

  // Barre de progression stade
  const progress = getStageProgress(gameState.ti);
  const progEl   = document.getElementById('stage-progress-bar');
  if (progEl) progEl.style.width = (progress * 100).toFixed(1) + '%';
  const nextStage = getNextStage(gameState.ti);
  const nextEl    = document.getElementById('stage-next');
  if (nextEl) {
    nextEl.textContent = nextStage
      ? `→ ${nextStage.icon} ${nextStage.nameFr} (${formatTi(nextStage.ti)})`
      : '🎉 Terraformation complète !';
  }

  // Machines + Power
  const machEl = document.getElementById('hud-machines');
  if (machEl) machEl.textContent = gameState.machines.length + ' machine(s)';

  // Terra Tokens
  if (typeof Marketplace !== 'undefined') Marketplace.updateHUD();

  // Blueprints déverrouillés
  const bpEl = document.getElementById('hud-blueprints');
  if (bpEl && typeof BlueprintsUI !== 'undefined') {
    bpEl.textContent = BlueprintsUI.getUnlockedCount() + ' blueprints';
  }
}

function _setBar(name, pct) {
  const bar = document.getElementById('bar-' + name);
  const val = document.getElementById('val-' + name);
  if (bar) bar.style.width = Math.min(100, Math.max(0, pct)).toFixed(1) + '%';
  if (val) val.textContent = Math.min(100, Math.max(0, pct)).toFixed(1) + '%';
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

  const capacity = typeof Equipment !== 'undefined' ? Equipment.getEffect('inventoryCapacity') : 10;
  const usedSlots = Object.keys(gameState.inventory).filter(k => (gameState.inventory[k] || 0) > 0).length;

  // Header capacité
  const capEl = document.getElementById('inv-capacity');
  if (capEl) capEl.textContent = `${usedSlots} / ${capacity} slots`;

  const entries = Object.entries(gameState.inventory).filter(([, qty]) => qty > 0);
  if (entries.length === 0) {
    grid.innerHTML = '<div class="inv-empty">Inventaire vide — explorez pour collecter</div>';
    return;
  }

  const byCategory = {};
  for (const [itemId, qty] of entries) {
    const item = ITEMS?.[itemId];
    const cat  = item?.category || 'other';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push({ item: item || { id: itemId, name: itemId, icon: '📦' }, qty, itemId });
  }

  for (const [cat, items] of Object.entries(byCategory)) {
    const catInfo = ITEM_CATEGORIES?.[cat] || { label: cat, icon: '📦' };
    const header  = document.createElement('div');
    header.className = 'inv-category-header';
    header.textContent = `${catInfo.icon} ${catInfo.label}`;
    grid.appendChild(header);

    const row = document.createElement('div');
    row.className = 'inv-row';

    for (const { item, qty, itemId } of items) {
      const recipe   = RECIPES?.[itemId];
      const hasEffect = recipe?.effect;
      const canEquip  = recipe?.slot;

      const slot = document.createElement('div');
      slot.className = 'inv-slot';
      slot.title = item.name;
      slot.innerHTML = `
        <div class="inv-icon">${item.icon}</div>
        <div class="inv-name">${item.name}</div>
        <div class="inv-qty">×${qty}</div>
        ${hasEffect ? `<button class="inv-use-btn" onclick="useConsumable('${itemId}')" title="Utiliser">▶</button>` : ''}
        ${canEquip  ? `<button class="inv-equip-btn" onclick="Equipment.equip('${itemId}')" title="Équiper">⬆</button>` : ''}
      `;
      row.appendChild(slot);
    }
    grid.appendChild(row);
  }
}

// ============================================================
//  PANNEAU CRAFT MACHINES
// ============================================================
function toggleCraft() {
  const panel = document.getElementById('craft-panel');
  if (!panel) return;
  panel.classList.toggle('hidden');
  if (!panel.classList.contains('hidden')) _renderCraftList();
}

function _renderCraftList() {
  const list = document.getElementById('craft-list');
  if (!list) return;
  list.innerHTML = '';

  const machineDefs = typeof MACHINES !== 'undefined' ? MACHINES : {};
  const starterList = typeof STARTER_MACHINES !== 'undefined' ? STARTER_MACHINES : [];

  const toShow = Object.keys(machineDefs).filter(id => {
    const def   = machineDefs[id];
    const reqTi = def.unlockTi || 0;
    return (gameState.ti >= reqTi || starterList.includes(id)) &&
           (def.tiPerSec || def.powerGen || def.biomassRate);
  });

  for (const type of toShow) {
    const def      = machineDefs[type];
    const canAfford = Object.entries(def.cost).every(
      ([item, qty]) => (gameState.inventory[item] || 0) >= qty
    );

    // Power indicator
    const hasGen = def.powerGen  ? `⚡+${def.powerGen}W ` : '';
    const hasUse = def.powerUse  ? `⚡-${def.powerUse}W ` : '';

    const costStr = Object.entries(def.cost).map(([item, qty]) => {
      const info = ITEMS?.[item];
      const have = gameState.inventory[item] || 0;
      const ok   = have >= qty;
      return `<span class="${ok ? 'cost-ok' : 'cost-nok'}">${info?.icon || '📦'}${info?.name || item} ×${qty}(${have})</span>`;
    }).join(' ');

    const div = document.createElement('div');
    div.className = 'craft-item' + (canAfford ? '' : ' craft-unavailable');
    div.innerHTML = `
      <div class="craft-icon">${def.icon}</div>
      <div class="craft-info">
        <div class="craft-name">${def.name}</div>
        <div class="craft-cost">${costStr}</div>
        <div class="craft-effect">${def.effect || ''} ${hasGen}${hasUse}</div>
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
  notif.className   = 'notif-' + type;
  notif.style.opacity = '1';
  clearTimeout(_showNotif._timer);
  _showNotif._timer = setTimeout(() => { notif.style.opacity = '0'; }, 3500);
}
// Exposer globalement pour les autres systèmes
window._showNotif = _showNotif;

// ============================================================
//  ÉVÉNEMENTS MÉTÉO
// ============================================================
function _onEventStart(event) {
  _showNotif(`${event.icon} ${event.nameFr} !`, 'stage');
  if (_scene && event.skyColor !== undefined) {
    _scene.background = new THREE.Color(event.skyColor);
    if (event.fogColor !== undefined) _scene.fog.color.setHex(event.fogColor);
  }
  if (event.type === 'meteor' && event.drops && _scene && _getHeightAt) {
    const qty = event.dropQty
      ? Math.floor(Math.random() * (event.dropQty.max - event.dropQty.min + 1)) + event.dropQty.min
      : 5;
    _spawnMeteorDrops(event.drops, qty);
  }
  const evEl = document.getElementById('hud-event');
  if (evEl) { evEl.textContent = `${event.icon} ${event.nameFr}`; evEl.style.opacity = '1'; }
}

function _onEventEnd() {
  const stage = getCurrentStage(gameState.ti);
  if (_scene) {
    _scene.background = new THREE.Color(stage.skyColor);
    _scene.fog.color.setHex(stage.fogColor);
  }
  const evEl = document.getElementById('hud-event');
  if (evEl) evEl.style.opacity = '0';
}

function _spawnMeteorDrops(drops, totalQty) {
  for (let i = 0; i < totalQty; i++) {
    const itemId = drops[Math.floor(Math.random() * drops.length)];
    const item   = ITEMS?.[itemId];
    const x = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;
    const y = _getHeightAt ? _getHeightAt(x, z) : 0;
    const scale  = 0.5 + Math.random() * 0.8;
    const color  = item?.color ? parseInt(item.color.replace('#','0x')) : 0xff6600;
    const geo    = new THREE.DodecahedronGeometry(scale, 0);
    const mat    = new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.3 });
    const mesh   = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y + scale * 0.5 + 50, z);
    mesh.userData = { isResource: true, itemId, quantity: 1 };
    _scene.add(mesh);
    resourceNodes.push(mesh);

    const startY = y + scale * 0.5 + 50;
    const targetY = y + scale * 0.5;
    const dur = 2000 + Math.random() * 1500;
    const t0  = performance.now();
    function fall() {
      const t = Math.min(1, (performance.now() - t0) / dur);
      mesh.position.y = startY + (targetY - startY) * (t * t);
      mesh.rotation.y += 0.05;
      if (t < 1) requestAnimationFrame(fall);
    }
    requestAnimationFrame(fall);
  }
  _showNotif('☄️ Des ressources météorites ont atterri !', 'collect');
}

// ============================================================
//  PERSISTANCE
// ============================================================
function _saveState() {
  try {
    localStorage.setItem('pc_inventory', JSON.stringify(gameState.inventory));
    localStorage.setItem('pc_ti',        JSON.stringify(gameState.ti));
    localStorage.setItem('pc_machines',  JSON.stringify(gameState.machines.map(m => ({ type: m.type, pos: m.pos, rot: m.rot }))));
    localStorage.setItem('pc_biomasses', JSON.stringify({
      plants: gameState.biomassPlants,
      insects: gameState.biomassInsects,
      animals: gameState.biomassAnimals,
    }));
    localStorage.setItem('pc_stage', JSON.stringify(gameState.currentStageNumber));
  } catch(_) {}
}

function _loadState() {
  try {
    const inv  = localStorage.getItem('pc_inventory');
    if (inv) gameState.inventory = JSON.parse(inv);
    const ti   = localStorage.getItem('pc_ti');
    if (ti)  gameState.ti = parseFloat(ti);
    const bio  = JSON.parse(localStorage.getItem('pc_biomasses') || 'null');
    if (bio) {
      gameState.biomassPlants  = bio.plants  || 0;
      gameState.biomassInsects = bio.insects || 0;
      gameState.biomassAnimals = bio.animals || 0;
    }
    const stage = localStorage.getItem('pc_stage');
    if (stage) gameState.currentStageNumber = parseInt(stage);
    const mach = localStorage.getItem('pc_machines');
    if (mach) {
      const saved = JSON.parse(mach);
      const machineDefs = typeof MACHINES !== 'undefined' ? MACHINES : {};
      for (const m of saved) {
        const def = machineDefs[m.type];
        if (def) {
          const machineId = 'mach_' + Date.now() + '_' + Math.random().toString(36).slice(2);
          gameState.machines.push({ type: m.type, id: machineId, pos: m.pos || {x:0,y:0,z:0}, rot: m.rot || 0 });
          gameState.tiRate += (def.tiPerSec || 0);
          if (m.pos) _placeMachine3D(m.type, def, m.pos.x, m.pos.y, m.pos.z, m.rot || 0);
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
      ws.send(JSON.stringify({ type: 'join_game', playerId: gameState.playerId, worldName: gameState.worldName }));
    };
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'game_joined' && data.world?.terraform_index > gameState.ti) {
          gameState.ti = data.world.terraform_index;
        }
      } catch(_) {}
    };
    ws.onerror = () => {};
  } catch(_) {}
}
