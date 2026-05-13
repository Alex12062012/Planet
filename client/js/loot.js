// ============================================================
//  LOOT SYSTEM  –  Épaves & caisses de loot
//  Spawne des épaves sur le terrain, interaction E pour looter
// ============================================================

const LootSystem = (() => {

  let _scene       = null;
  let _getHeightAt = null;
  let _gameState   = null;

  const wrecks    = [];   // { mesh, looted, loot, pos, revealed }
  const chests    = [];   // { mesh, looted, loot, pos }

  // ─── Tables de loot ───────────────────────────────────────
  const WRECK_LOOT_TABLES = [
    // Épave légère
    { weight: 40, loot: [
      { item: 'iron',       min: 3,  max: 8  },
      { item: 'aluminum',   min: 2,  max: 6  },
      { item: 'silicon',    min: 1,  max: 4  },
      { item: 'backpack_t1',min: 0,  max: 1, chance: 0.15 },
    ]},
    // Épave industrielle
    { weight: 30, loot: [
      { item: 'titanium',    min: 2, max: 5  },
      { item: 'cobalt',      min: 2, max: 5  },
      { item: 'circuit_board',min:0, max: 2, chance: 0.4 },
      { item: 'oxygen_tank_t1',min:0,max:1,  chance: 0.25 },
      { item: 'fuse_t1',    min: 1, max: 3   },
    ]},
    // Épave militaire (rare)
    { weight: 20, loot: [
      { item: 'iridium',    min: 1, max: 3   },
      { item: 'super_alloy',min: 1, max: 3   },
      { item: 'jetpack_t1', min: 0, max: 1, chance: 0.12 },
      { item: 'boots_t1',   min: 0, max: 1, chance: 0.15 },
      { item: 'fuse_t2',    min: 1, max: 2   },
    ]},
    // Épave scientifique (rare)
    { weight: 10, loot: [
      { item: 'zeolite',      min: 3, max: 8  },
      { item: 'uranium',      min: 1, max: 2, chance: 0.4 },
      { item: 'circuit_board',min: 1, max: 3  },
      { item: 'osmium',       min: 0, max: 2, chance: 0.3 },
      // Microchip ! (géré séparément)
      { item: '__microchip__',min: 0, max: 1, chance: 0.35, tier: [1,2,3] },
    ]},
  ];

  const CHEST_LOOT = [
    { item: 'iron',        min: 5,  max: 15 },
    { item: 'aluminum',    min: 3,  max: 10 },
    { item: 'cobalt',      min: 1,  max: 5  },
    { item: 'silicon',     min: 1,  max: 4  },
    { item: 'magnesium',   min: 2,  max: 6  },
    { item: 'titanium',    min: 0,  max: 3, chance: 0.5 },
    { item: 'fuse_t1',     min: 0,  max: 2, chance: 0.4 },
    { item: '__microchip__',min: 0, max: 1, chance: 0.08, tier: [1,2] },
  ];

  // ─── Init ──────────────────────────────────────────────────
  function init(scene, getHeightAt, gameState) {
    _scene       = scene;
    _getHeightAt = getHeightAt;
    _gameState   = gameState;

    _spawnWrecks();
    _spawnChests();

    console.log('✅ Loot system initialized');
  }

  // ─── Spawner les épaves ───────────────────────────────────
  function _spawnWrecks() {
    const WRECK_COUNT = 12;
    const positions = _generatePositions(WRECK_COUNT, 20, 90);

    for (let i = 0; i < positions.length; i++) {
      const pos   = positions[i];
      const y     = _getHeightAt(pos.x, pos.z);
      const table = _pickLootTable(WRECK_LOOT_TABLES);

      // Construire le loot de cette épave
      const loot  = _rollLoot(table.loot);

      // Mesh : corps principal de l'épave
      const wreck = _createWreckMesh(pos.x, y, pos.z, i);
      wrecks.push({
        mesh:     wreck.group,
        looted:   false,
        loot,
        pos:      { x: pos.x, y, z: pos.z },
        revealed: false,
        label:    `Épave #${i + 1}`,
      });
    }
  }

  function _createWreckMesh(x, y, z, seed) {
    const rng   = _seededRng(seed);
    const group = new THREE.Group();

    // Corps principal (fuselage)
    const bodyGeo = new THREE.BoxGeometry(
      3 + rng() * 4,
      0.8 + rng() * 1,
      2 + rng() * 2
    );
    const mat = new THREE.MeshLambertMaterial({ color: 0x556677 });
    const body = new THREE.Mesh(bodyGeo, mat);
    group.add(body);

    // Aile gauche
    const wingGeo = new THREE.BoxGeometry(2 + rng() * 2, 0.3, 1 + rng());
    const wMat    = new THREE.MeshLambertMaterial({ color: 0x445566 });
    const wingL   = new THREE.Mesh(wingGeo, wMat);
    wingL.position.set(-(1.5 + rng()), 0, 0);
    wingL.rotation.z = (rng() - 0.5) * 0.5;
    group.add(wingL);

    // Aile droite
    const wingR = wingL.clone();
    wingR.position.x = 1.5 + rng();
    wingR.rotation.z = (rng() - 0.5) * 0.5;
    group.add(wingR);

    // Débris supplémentaires
    for (let i = 0; i < 3; i++) {
      const dGeo = new THREE.BoxGeometry(
        0.5 + rng() * 1.5, 0.3 + rng() * 0.5, 0.5 + rng()
      );
      const d = new THREE.Mesh(dGeo, new THREE.MeshLambertMaterial({ color: 0x334455 }));
      d.position.set((rng() - 0.5) * 4, (rng() - 0.5) * 1, (rng() - 0.5) * 3);
      d.rotation.set(rng() * 0.8, rng() * Math.PI * 2, rng() * 0.6);
      group.add(d);
    }

    group.position.set(x, y + 0.4, z);
    group.rotation.y = rng() * Math.PI * 2;
    group.rotation.z = (rng() - 0.5) * 0.4; // légère inclinaison
    group.userData = { isWreck: true, wreckIndex: wrecks.length };

    if (_scene) _scene.add(group);
    return { group };
  }

  // ─── Spawner les caisses ──────────────────────────────────
  function _spawnChests() {
    const CHEST_COUNT = 20;
    const positions = _generatePositions(CHEST_COUNT, 10, 95);

    for (const pos of positions) {
      const y    = _getHeightAt(pos.x, pos.z);
      const loot = _rollLoot(CHEST_LOOT);

      const geo  = new THREE.BoxGeometry(0.7, 0.6, 0.5);
      const mat  = new THREE.MeshLambertMaterial({ color: 0x886633 });
      const mesh = new THREE.Mesh(geo, mat);

      // Couvercle
      const lidGeo = new THREE.BoxGeometry(0.72, 0.2, 0.52);
      const lidMat = new THREE.MeshLambertMaterial({ color: 0x775522 });
      const lid    = new THREE.Mesh(lidGeo, lidMat);
      lid.position.y = 0.4;

      const group = new THREE.Group();
      group.add(mesh);
      group.add(lid);
      group.position.set(pos.x, y + 0.3, pos.z);
      group.rotation.y = Math.random() * Math.PI * 2;
      group.userData = { isChest: true, chestIndex: chests.length };

      if (_scene) _scene.add(group);

      chests.push({
        mesh:   group,
        looted: false,
        loot,
        pos:    { x: pos.x, y, z: pos.z },
      });
    }
  }

  // ─── Vérifier proximité (depuis terraform.js) ─────────────
  function checkProximity(playerPos) {
    const DIST = 4;
    let nearest = null;
    let nearestDist = Infinity;
    let nearestType = null;
    let nearestIdx  = -1;

    // Vérifier épaves
    for (let i = 0; i < wrecks.length; i++) {
      const w = wrecks[i];
      if (w.looted) continue;
      const dx = w.pos.x - playerPos.x;
      const dz = w.pos.z - playerPos.z;
      const d  = Math.sqrt(dx * dx + dz * dz);
      if (d < DIST && d < nearestDist) {
        nearestDist = d;
        nearest     = w;
        nearestType = 'wreck';
        nearestIdx  = i;
      }
    }

    // Vérifier caisses
    for (let i = 0; i < chests.length; i++) {
      const c = chests[i];
      if (c.looted) continue;
      const dx = c.pos.x - playerPos.x;
      const dz = c.pos.z - playerPos.z;
      const d  = Math.sqrt(dx * dx + dz * dz);
      if (d < DIST && d < nearestDist) {
        nearestDist = d;
        nearest     = c;
        nearestType = 'chest';
        nearestIdx  = i;
      }
    }

    const hint = document.getElementById('interact-hint');
    if (nearest && hint) {
      hint.textContent = `E — ${nearestType === 'wreck' ? '🛸 Fouiller épave' : '📦 Ouvrir caisse'}`;
      hint.classList.remove('hidden');
      LootSystem._pending = { obj: nearest, type: nearestType };
    } else {
      if (hint) hint.classList.add('hidden');
      LootSystem._pending = null;
    }
  }

  // ─── Looter ───────────────────────────────────────────────
  function loot() {
    const pending = LootSystem._pending;
    if (!pending || !_gameState) return false;

    const { obj, type } = pending;
    if (obj.looted) return false;
    obj.looted = true;

    let gainedItems = [];

    for (const [itemId, qty] of Object.entries(obj.loot)) {
      if (itemId === '__microchip__') {
        // Géré séparément
        continue;
      }
      if (qty > 0) {
        _gameState.inventory[itemId] = (_gameState.inventory[itemId] || 0) + qty;
        const itm = ITEMS?.[itemId];
        gainedItems.push(`${itm?.icon || '📦'} ${itm?.name || itemId} ×${qty}`);
      }
    }

    // Microchip ?
    if (obj.loot.__microchip__) {
      const tier = obj.loot.__microchip_tier__;
      if (typeof Microchips !== 'undefined') {
        Microchips.giveChip(tier);
        gainedItems.push(`📟 Microchip T${tier}`);
      }
    }

    // Animer l'ouverture
    _animateOpen(obj.mesh);

    _showNotif(
      `${type === 'wreck' ? '🛸' : '📦'} ${gainedItems.slice(0, 3).join(', ')}${gainedItems.length > 3 ? ` +${gainedItems.length - 3}` : ''}`,
      'collect'
    );

    LootSystem._pending = null;
    _save();
    return true;
  }

  // ─── Révéler toutes les épaves sur la carte ───────────────
  function revealAll() {
    wrecks.forEach(w => { w.revealed = true; });
    if (typeof MapSystem !== 'undefined') MapSystem.renderMap();
  }

  // ─── Animation ouverture ──────────────────────────────────
  function _animateOpen(meshGroup) {
    if (!meshGroup) return;
    // Flash lumineux puis assombrir
    meshGroup.children.forEach(child => {
      if (child.material) {
        const orig = child.material.color.getHex();
        child.material.color.setHex(0xffffff);
        setTimeout(() => {
          if (child.material) child.material.color.setHex(0x333333);
        }, 200);
      }
    });
  }

  // ─── Helpers ──────────────────────────────────────────────
  function _rollLoot(table) {
    const result = {};
    for (const entry of table) {
      const roll = Math.random();
      const chance = entry.chance ?? 1.0;
      if (roll > chance) continue;

      const qty = Math.floor(entry.min + Math.random() * (entry.max - entry.min + 1));
      if (qty <= 0) continue;

      if (entry.item === '__microchip__' && entry.tier) {
        result.__microchip__ = qty;
        result.__microchip_tier__ = entry.tier[Math.floor(Math.random() * entry.tier.length)];
      } else {
        result[entry.item] = qty;
      }
    }
    return result;
  }

  function _pickLootTable(tables) {
    const total = tables.reduce((s, t) => s + t.weight, 0);
    let r = Math.random() * total;
    for (const t of tables) {
      r -= t.weight;
      if (r <= 0) return t;
    }
    return tables[tables.length - 1];
  }

  function _generatePositions(count, minDist, maxDist) {
    const positions = [];
    let attempts = 0;
    while (positions.length < count && attempts < count * 10) {
      attempts++;
      const angle = Math.random() * Math.PI * 2;
      const dist  = minDist + Math.random() * (maxDist - minDist);
      const x     = Math.cos(angle) * dist;
      const z     = Math.sin(angle) * dist;
      // Éviter les chevauchements
      if (positions.some(p => Math.hypot(p.x - x, p.z - z) < 8)) continue;
      positions.push({ x, z });
    }
    return positions;
  }

  function _seededRng(seed) {
    let s = seed + 0.1;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }

  function _save() {
    try {
      localStorage.setItem('pc_loot', JSON.stringify({
        wrecksLooted: wrecks.map(w => w.looted),
        chestsLooted: chests.map(c => c.looted),
      }));
    } catch(_) {}
  }

  function _load() {
    try {
      const d = JSON.parse(localStorage.getItem('pc_loot') || 'null');
      if (!d) return;
      d.wrecksLooted?.forEach((v, i) => { if (wrecks[i]) wrecks[i].looted = v; });
      d.chestsLooted?.forEach((v, i) => { if (chests[i]) chests[i].looted = v; });
    } catch(_) {}
  }

  function _showNotif(msg, type) {
    const notif = document.getElementById('notif');
    if (notif) {
      notif.textContent = msg;
      notif.className   = 'notif-' + type;
      notif.style.opacity = '1';
      clearTimeout(LootSystem._t);
      LootSystem._t = setTimeout(() => { notif.style.opacity = '0'; }, 4000);
    }
  }

  return {
    init,
    checkProximity,
    loot,
    revealAll,
    getWrecks: () => wrecks,
    getChests: () => chests,
  };

})();
