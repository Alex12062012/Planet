// ============================================================
//  PLACEMENT 3D  –  Ghost preview, snap grid, rotation
//  Touche P ou clic droit = mode placement
//  R = rotation 90°   Click gauche = poser   Échap = annuler
// ============================================================

const Placement = (() => {

  let _scene       = null;
  let _camera      = null;
  let _getHeightAt = null;
  let _gameState   = null;

  // ─── État du mode placement ────────────────────────────────
  const state = {
    active:     false,
    machineType: null,
    ghostMesh:  null,
    rotation:   0,      // 0, 90, 180, 270 degrés
    gridSize:   2,      // snap tous les 2m
    valid:      false,  // emplacement valide
  };

  // ─── Matériaux ghost ──────────────────────────────────────
  const MAT_VALID   = null; // créé à l'init
  const MAT_INVALID = null;

  // ─── Raycaster ────────────────────────────────────────────
  const _raycaster  = null;
  const _screenCenter = { x: 0, y: 0 }; // centre de l'écran

  // ─── Init ──────────────────────────────────────────────────
  function init(scene, camera, getHeightAt, gameState) {
    _scene       = scene;
    _camera      = camera;
    _getHeightAt = getHeightAt;
    _gameState   = gameState;

    // Clavier
    document.addEventListener('keydown', (e) => {
      if (!state.active) return;
      if (e.code === 'KeyR')  _rotate();
      if (e.code === 'Escape') cancel();
    });

    // Clic gauche = poser si en mode placement
    document.addEventListener('click', (e) => {
      if (!state.active) return;
      if (document.pointerLockElement) {
        _confirmPlacement();
      }
    });

    console.log('✅ Placement system initialized');
  }

  // ─── Démarrer le mode placement ───────────────────────────
  function startPlacement(machineType) {
    if (!_scene || !_camera) return;

    const machineDefs = typeof MACHINES !== 'undefined' ? MACHINES : {};
    const def = machineDefs[machineType];
    if (!def) return;

    // Annuler l'ancien ghost si existant
    cancel();

    state.active      = true;
    state.machineType = machineType;
    state.rotation    = 0;

    // Créer le mesh fantôme
    const geo   = new THREE.BoxGeometry(1.8, 2.2, 1.8);
    const color = _getMachineColor(machineType);
    const mat   = new THREE.MeshLambertMaterial({
      color,
      transparent: true,
      opacity: 0.55,
    });
    state.ghostMesh = new THREE.Mesh(geo, mat);
    state.ghostMesh.userData.isGhost = true;
    _scene.add(state.ghostMesh);

    // Afficher l'indicateur de mode
    const indicator = document.getElementById('placement-indicator');
    if (indicator) {
      indicator.style.display = 'flex';
      const nameEl = document.getElementById('placement-name');
      if (nameEl) nameEl.textContent = `${def.icon} ${def.name}`;
    }

    // Libérer le pointeur pour le mode placement
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }

    _showNotif(`🔧 Mode placement : ${def.name} — Clic = Poser · R = Rotation · Échap = Annuler`, 'info');
  }

  // ─── Update (chaque frame) ────────────────────────────────
  function update() {
    if (!state.active || !state.ghostMesh || !_camera) return;

    // Position cible = devant la caméra (5m)
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(_camera.quaternion);
    forward.y = 0;
    forward.normalize();

    const targetX = _camera.position.x + forward.x * 5;
    const targetZ = _camera.position.z + forward.z * 5;

    // Snap sur la grille
    const snappedX = Math.round(targetX / state.gridSize) * state.gridSize;
    const snappedZ = Math.round(targetZ / state.gridSize) * state.gridSize;
    const groundY  = _getHeightAt ? _getHeightAt(snappedX, snappedZ) : 0;

    state.ghostMesh.position.set(snappedX, groundY + 1.1, snappedZ);
    state.ghostMesh.rotation.y = (state.rotation * Math.PI) / 180;

    // Vérifier si l'emplacement est valide (pas trop en pente, pas dans l'eau…)
    state.valid = _checkValidity(snappedX, groundY, snappedZ);

    // Changer la couleur selon validité
    const mat = state.ghostMesh.material;
    if (state.valid) {
      mat.color.setHex(_getMachineColor(state.machineType));
      mat.opacity = 0.55;
    } else {
      mat.color.setHex(0xff2200);
      mat.opacity = 0.45;
    }
  }

  // ─── Rotation ─────────────────────────────────────────────
  function _rotate() {
    state.rotation = (state.rotation + 90) % 360;
    _showNotif(`↻ Rotation : ${state.rotation}°`, 'info');
  }

  // ─── Vérifier validité de l'emplacement ───────────────────
  function _checkValidity(x, y, z) {
    if (!_getHeightAt) return true;
    // Vérifier que le terrain est assez plat (variation < 2m dans 2m)
    const neighbors = [
      _getHeightAt(x + 2, z),
      _getHeightAt(x - 2, z),
      _getHeightAt(x, z + 2),
      _getHeightAt(x, z - 2),
    ];
    const maxDiff = Math.max(...neighbors.map(h => Math.abs(h - y)));
    return maxDiff < 3;
  }

  // ─── Confirmer le placement ────────────────────────────────
  function _confirmPlacement() {
    if (!state.valid) {
      _showNotif('❌ Emplacement invalide (terrain trop pentu)', 'error');
      return;
    }

    const pos  = state.ghostMesh.position.clone();
    const rot  = state.rotation;
    const type = state.machineType;

    // Appeler buildMachine depuis terraform.js (gère le coût)
    if (typeof buildMachineAt === 'function') {
      buildMachineAt(type, pos, rot);
    } else if (typeof buildMachine === 'function') {
      buildMachine(type);
    }

    cancel();

    // Reprendre le pointer lock
    const canvas = document.getElementById('game-canvas');
    if (canvas) canvas.requestPointerLock();
  }

  // ─── Annuler le placement ──────────────────────────────────
  function cancel() {
    if (state.ghostMesh) {
      _scene?.remove(state.ghostMesh);
      state.ghostMesh.geometry.dispose();
      state.ghostMesh.material.dispose();
      state.ghostMesh = null;
    }
    state.active      = false;
    state.machineType = null;

    const indicator = document.getElementById('placement-indicator');
    if (indicator) indicator.style.display = 'none';
  }

  // ─── Couleur par type de machine ──────────────────────────
  function _getMachineColor(type) {
    const colors = {
      heater_t1: 0xff4422, heater_t2: 0xff5533, heater_t3: 0xff6644,
      heater_t4: 0xff7755, heater_t5: 0xff8866,
      drill_t1: 0x886644, drill_t2: 0x997755, drill_t3: 0xaa8866,
      drill_t4: 0xbb9977, drill_t5: 0xccaa88,
      solar_t1: 0xffcc00, solar_t2: 0xffdd22,
      wind_turbine_t1: 0x88ccff, wind_turbine_t2: 0x99ddff,
      nuclear_t1: 0x44ff44, nuclear_t2: 0x66ff66,
      fusion_generator: 0x00ffff,
      vegetube_t1: 0x44aa44, vegetube_t2: 0x55bb55, vegetube_t3: 0x66cc66,
      tree_spreader_t1: 0x228822, tree_spreader_t2: 0x33aa33, tree_spreader_t3: 0x44cc44,
      grass_spreader: 0x88dd44, flower_spreader_t1: 0xff88cc, flower_spreader_t2: 0xff44aa,
      algae_t1: 0x00ccaa, algae_t2: 0x00ddbb,
      beehive_t1: 0xffcc44, beehive_t2: 0xffdd55,
      butterfly_farm_t1: 0xff88ff, butterfly_farm_t2: 0xff66ff, butterfly_farm_t3: 0xff44ff,
      fish_farm_t1: 0x4488cc, fish_farm_t2: 0x5599dd,
      aquarium_t1: 0x2266aa, aquarium_t2: 0x3377bb,
      amphibian_farm: 0x44aa66,
    };
    return colors[type] || 0x4488ff;
  }

  function _showNotif(msg, type) {
    const notif = document.getElementById('notif');
    if (notif) {
      notif.textContent = msg;
      notif.className = 'notif-' + type;
      notif.style.opacity = '1';
      clearTimeout(Placement._notifTimer);
      Placement._notifTimer = setTimeout(() => { notif.style.opacity = '0'; }, 4000);
    }
  }

  return {
    init,
    update,
    startPlacement,
    cancel,
    isActive: () => state.active,
  };

})();
