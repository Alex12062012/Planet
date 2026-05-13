// ============================================================
//  BASE BUILDING  –  Living Compartments placeable + walkable
//  B key = toggle build mode
//  Supports: compartment, corridor, dome, airlock
// ============================================================

const BaseBuilding = (() => {

  // ── Constants ─────────────────────────────────────────────
  const COMPARTMENT_DEFS = {
    compartment: {
      name: 'Living Compartment',
      icon: '🏠',
      w: 6, h: 3.5, d: 6,
      color: 0x5577aa,
      cost: { iron: 8, aluminium: 6, glass: 4 },
      oxygenBonus: 0.5,
      capacity: 2,   // colonist capacity
    },
    corridor: {
      name: 'Corridor',
      icon: '🔗',
      w: 2, h: 3, d: 6,
      color: 0x446688,
      cost: { iron: 4, aluminium: 3 },
      oxygenBonus: 0,
      capacity: 0,
    },
    dome: {
      name: 'Habitat Dome',
      icon: '🔮',
      w: 8, h: 5, d: 8,
      color: 0x4499cc,
      cost: { iron: 12, aluminium: 8, glass: 10, titanium: 4 },
      oxygenBonus: 2,
      capacity: 4,
    },
    airlock: {
      name: 'Airlock',
      icon: '🚪',
      w: 2.5, h: 3, d: 2.5,
      color: 0x557799,
      cost: { iron: 5, aluminium: 4 },
      oxygenBonus: 0,
      capacity: 0,
    },
  };

  const SNAP_SIZE = 2;
  const INTERACT_DIST = 3.5;

  // ── State ─────────────────────────────────────────────────
  let _scene         = null;
  let _camera        = null;
  let _getHeightAt   = null;
  let _gameState     = null;
  let _active        = false;
  let _selectedType  = 'compartment';
  let _ghostMesh     = null;
  let _ghostValid    = false;
  let _rotation      = 0;
  let _buildings     = [];   // { type, mesh, pos, id, insideBox }
  let _insideBuilding = null;
  let _buildMenuOpen = false;

  // ── Raycaster for placement ────────────────────────────────
  const _raycaster = new THREE.Raycaster();
  const _forward   = new THREE.Vector3();

  // ── Ghost Mesh ────────────────────────────────────────────
  function _createGhost(type) {
    if (_ghostMesh) { _scene.remove(_ghostMesh); _ghostMesh = null; }
    const def = COMPARTMENT_DEFS[type];
    const geo = new THREE.BoxGeometry(def.w, def.h, def.d);
    const mat = new THREE.MeshLambertMaterial({
      color: 0x44aaff,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
    _ghostMesh = new THREE.Mesh(geo, mat);
    _ghostMesh.name = 'building_ghost';
    _scene.add(_ghostMesh);
  }

  function _updateGhost() {
    if (!_ghostMesh || !_active) return;
    const def = COMPARTMENT_DEFS[_selectedType];

    // Place ghost 8m in front of camera
    _camera.getWorldDirection(_forward);
    _forward.y = 0;
    _forward.normalize();

    const basePos = _camera.position.clone().addScaledVector(_forward, 8);
    // Snap to grid
    basePos.x = Math.round(basePos.x / SNAP_SIZE) * SNAP_SIZE;
    basePos.z = Math.round(basePos.z / SNAP_SIZE) * SNAP_SIZE;
    basePos.y = _getHeightAt(basePos.x, basePos.z) + def.h / 2;

    _ghostMesh.position.copy(basePos);
    _ghostMesh.rotation.y = _rotation;

    // Validity: flat enough
    const h0 = _getHeightAt(basePos.x - def.w / 2, basePos.z - def.d / 2);
    const h1 = _getHeightAt(basePos.x + def.w / 2, basePos.z - def.d / 2);
    const h2 = _getHeightAt(basePos.x - def.w / 2, basePos.z + def.d / 2);
    const h3 = _getHeightAt(basePos.x + def.w / 2, basePos.z + def.d / 2);
    const hmin = Math.min(h0, h1, h2, h3);
    const hmax = Math.max(h0, h1, h2, h3);
    _ghostValid = (hmax - hmin) < 2;

    _ghostMesh.material.color.set(_ghostValid ? 0x44aaff : 0xff3333);
    _ghostMesh.material.opacity = _ghostValid ? 0.4 : 0.3;
  }

  // ── Build ─────────────────────────────────────────────────
  function _build() {
    if (!_active || !_ghostValid) return;
    const def = COMPARTMENT_DEFS[_selectedType];

    // Cost check
    for (const [item, qty] of Object.entries(def.cost)) {
      const inv = _gameState.inventory[item] || 0;
      if (inv < qty) {
        _showNotif(`❌ Need ${qty}x ${item}`);
        return;
      }
    }
    // Consume resources
    for (const [item, qty] of Object.entries(def.cost)) {
      _gameState.inventory[item] -= qty;
    }

    const pos = _ghostMesh.position.clone();
    const rot = _rotation;

    // Create solid mesh
    const mesh = _buildMesh(_selectedType, pos, rot);
    _scene.add(mesh);

    // Bounding box for interior detection
    const insideBox = new THREE.Box3().setFromObject(mesh);
    // Shrink slightly so walls aren't interior
    insideBox.min.add(new THREE.Vector3(0.3, 0, 0.3));
    insideBox.max.sub(new THREE.Vector3(0.3, 0, 0.3));

    const id = 'bld_' + Date.now();
    _buildings.push({ type: _selectedType, mesh, pos, rot, id, insideBox });

    // Oxygen bonus
    if (def.oxygenBonus > 0) {
      _gameState.oxygen = Math.min((_gameState.oxygen || 0) + def.oxygenBonus, 100);
    }

    _saveBuildings();
    _showNotif(`🏠 ${def.name} built!`);
    _cancel();
  }

  function _buildMesh(type, pos, rot) {
    const def = COMPARTMENT_DEFS[type];
    const group = new THREE.Group();
    group.position.copy(pos);
    group.rotation.y = rot;

    // Outer shell
    const outerGeo = new THREE.BoxGeometry(def.w, def.h, def.d);
    const outerMat = new THREE.MeshLambertMaterial({ color: def.color, transparent: true, opacity: 0.85 });
    const outer    = new THREE.Mesh(outerGeo, outerMat);
    outer.castShadow = true;
    outer.receiveShadow = true;
    group.add(outer);

    // Inner floor
    const floorGeo = new THREE.BoxGeometry(def.w - 0.2, 0.1, def.d - 0.2);
    const floorMat = new THREE.MeshLambertMaterial({ color: 0x334455 });
    const floor    = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -def.h / 2 + 0.05;
    floor.receiveShadow = true;
    group.add(floor);

    // Window strips (only for compartment and dome)
    if (type === 'compartment' || type === 'dome') {
      const winMat = new THREE.MeshLambertMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.5,
        emissive: 0x224466,
        emissiveIntensity: 0.3,
      });
      // Front window
      const winGeo = new THREE.BoxGeometry(def.w * 0.5, def.h * 0.35, 0.05);
      const winFront = new THREE.Mesh(winGeo, winMat);
      winFront.position.set(0, def.h * 0.05, def.d / 2 + 0.01);
      group.add(winFront);
      const winBack = new THREE.Mesh(winGeo, winMat);
      winBack.position.set(0, def.h * 0.05, -def.d / 2 - 0.01);
      group.add(winBack);
    }

    // Door marker (front side)
    const doorGeo = new THREE.BoxGeometry(1.2, 2.2, 0.05);
    const doorMat = new THREE.MeshLambertMaterial({ color: 0x223344 });
    const door    = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, -def.h / 2 + 1.1, def.d / 2 + 0.02);
    group.add(door);

    // Interior light (point light)
    const light = new THREE.PointLight(0x88bbff, 0.6, def.w * 1.5);
    light.position.set(0, def.h / 2 - 0.5, 0);
    group.add(light);

    group.userData.buildingType = type;
    return group;
  }

  // ── Interior detection ────────────────────────────────────
  function _updateInsideCheck(playerPos) {
    const wasInside = _insideBuilding !== null;
    _insideBuilding = null;

    for (const bld of _buildings) {
      if (bld.insideBox.containsPoint(playerPos)) {
        _insideBuilding = bld;
        break;
      }
    }

    const isInside = _insideBuilding !== null;

    // Update atmo indicator
    const atmoEl = document.getElementById('bld-inside-indicator');
    if (atmoEl) {
      atmoEl.style.display = isInside ? 'flex' : 'none';
      if (isInside) {
        atmoEl.textContent = `🏠 Inside: ${COMPARTMENT_DEFS[_insideBuilding.type].name}`;
        // While inside, O2 doesn't deplete (handled in survival.js via isInsideBuilding())
      }
    }

    return isInside;
  }

  // ── Build Menu ────────────────────────────────────────────
  function _openBuildMenu() {
    _buildMenuOpen = true;
    let panel = document.getElementById('build-menu');
    if (!panel) return;
    panel.classList.remove('hidden');

    const list = document.getElementById('build-menu-list');
    if (!list) return;
    list.innerHTML = '';

    for (const [typeId, def] of Object.entries(COMPARTMENT_DEFS)) {
      const btn = document.createElement('button');
      btn.className = 'build-item-btn' + (_selectedType === typeId ? ' selected' : '');
      const costStr = Object.entries(def.cost).map(([k, v]) => `${v}×${k}`).join(', ');
      btn.innerHTML = `
        <span class="build-icon">${def.icon}</span>
        <span class="build-name">${def.name}</span>
        <span class="build-cost">${costStr}</span>
      `;
      btn.addEventListener('click', () => {
        _selectedType = typeId;
        _closeBuildMenu();
        _startPlacement();
      });
      list.appendChild(btn);
    }
  }

  function _closeBuildMenu() {
    _buildMenuOpen = false;
    const panel = document.getElementById('build-menu');
    if (panel) panel.classList.add('hidden');
  }

  function toggleBuildMenu() {
    if (_buildMenuOpen) {
      _closeBuildMenu();
    } else {
      _openBuildMenu();
    }
  }

  // ── Placement mode ────────────────────────────────────────
  function _startPlacement() {
    _active = true;
    _rotation = 0;
    _createGhost(_selectedType);

    const ind = document.getElementById('build-indicator');
    if (ind) {
      ind.textContent = `Placing: ${COMPARTMENT_DEFS[_selectedType].name} | R=Rotate | Click=Place | Esc=Cancel`;
      ind.style.display = 'block';
    }

    // Exit pointer lock so mouse is free
    if (document.exitPointerLock) document.exitPointerLock();
  }

  function _cancel() {
    _active = false;
    if (_ghostMesh) { _scene.remove(_ghostMesh); _ghostMesh = null; }
    const ind = document.getElementById('build-indicator');
    if (ind) ind.style.display = 'none';
  }

  // ── Persistence ───────────────────────────────────────────
  function _saveBuildings() {
    const data = _buildings.map(b => ({
      type: b.type,
      pos:  { x: b.pos.x, y: b.pos.y, z: b.pos.z },
      rot:  b.rot,
      id:   b.id,
    }));
    localStorage.setItem('pc_buildings', JSON.stringify(data));
  }

  function _loadBuildings() {
    try {
      const raw = localStorage.getItem('pc_buildings');
      if (!raw) return;
      const data = JSON.parse(raw);
      for (const d of data) {
        const pos  = new THREE.Vector3(d.pos.x, d.pos.y, d.pos.z);
        const mesh = _buildMesh(d.type, pos, d.rot);
        _scene.add(mesh);
        const insideBox = new THREE.Box3().setFromObject(mesh);
        insideBox.min.add(new THREE.Vector3(0.3, 0, 0.3));
        insideBox.max.sub(new THREE.Vector3(0.3, 0, 0.3));
        _buildings.push({ type: d.type, mesh, pos, rot: d.rot, id: d.id, insideBox });
      }
    } catch (e) { console.warn('BaseBuilding load error:', e); }
  }

  // ── Keyboard handler ──────────────────────────────────────
  function _onKey(e) {
    if (e.code === 'KeyB') {
      e.preventDefault();
      if (_active) {
        _cancel();
      } else {
        toggleBuildMenu();
      }
    }
    if (_active) {
      if (e.code === 'KeyR') { _rotation += Math.PI / 2; }
      if (e.code === 'Escape') { _cancel(); }
    }
    if (_buildMenuOpen && e.code === 'Escape') { _closeBuildMenu(); }
  }

  function _onClick(e) {
    if (!_active || e.button !== 0) return;
    _build();
  }

  // ── Public API ────────────────────────────────────────────
  function init(scene, camera, getHeightAt, gameState) {
    _scene       = scene;
    _camera      = camera;
    _getHeightAt = getHeightAt;
    _gameState   = gameState;

    document.addEventListener('keydown', _onKey);
    document.addEventListener('click',   _onClick);

    _loadBuildings();
    _showNotif('🏠 B = Base Building');
  }

  function update(playerPos) {
    _updateGhost();
    _updateInsideCheck(playerPos);
  }

  function isInsideBuilding() { return _insideBuilding !== null; }
  function isPlacing()        { return _active; }
  function getBuildings()     { return _buildings; }

  function _showNotif(msg) {
    if (typeof window._showNotif === 'function') window._showNotif(msg);
  }

  return { init, update, isInsideBuilding, isPlacing, getBuildings, toggleBuildMenu };

})();
