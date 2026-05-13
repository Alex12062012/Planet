// ============================================================
//  PLAYER  –  Déplacement FPS + Pointer Lock + Jetpack
//  Lit Equipment.getEffect('speedMultiplier') pour la vitesse
// ============================================================

function createPlayer(scene, camera, getHeightAt) {

  const BASE_SPEED  = 8;
  const PLAYER_H    = 1.7;
  const MOUSE_SENS  = 0.002;

  const position = new THREE.Vector3(0, getHeightAt(0, 0) + PLAYER_H, 0);

  let yaw   = 0;
  let pitch = 0;

  // Touches actives (partagé avec equipment.js via référence)
  const keys = {};

  // ── Pointer Lock ─────────────────────────────────────────
  const canvas = document.getElementById('game-canvas');

  canvas.addEventListener('click', () => {
    // Ne pas lock si un panneau UI est ouvert
    const panels = ['craft-panel','inventory','recipes-panel','blueprints-panel',
                    'rocket-panel','market-panel','equipment-panel','dna-panel',
                    'chip-panel','fullmap-panel'];
    const anyOpen = panels.some(id => {
      const el = document.getElementById(id);
      return el && !el.classList.contains('hidden') && !el.classList.contains('open') === false
               || (el && el.classList.contains('open'));
    });

    const craftOpen = document.getElementById('craft-panel') &&
                      !document.getElementById('craft-panel').classList.contains('hidden');
    const recOpen   = document.getElementById('recipes-panel') &&
                      !document.getElementById('recipes-panel').classList.contains('hidden');
    if (craftOpen || recOpen) return;

    if (document.pointerLockElement !== canvas) {
      canvas.requestPointerLock();
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement !== canvas) return;
    yaw   -= e.movementX * MOUSE_SENS;
    pitch -= e.movementY * MOUSE_SENS;
    pitch  = Math.max(-Math.PI/2 + 0.05, Math.min(Math.PI/2 - 0.05, pitch));
  });

  document.addEventListener('keydown', (e) => { keys[e.code] = true;  });
  document.addEventListener('keyup',   (e) => { keys[e.code] = false; });

  // ── Vecteurs de déplacement ───────────────────────────────
  const direction = new THREE.Vector3();
  const right     = new THREE.Vector3();
  const forward   = new THREE.Vector3();

  // ── Update ────────────────────────────────────────────────
  function update(delta) {
    // Vitesse dynamique selon équipement
    const speedMult = typeof Equipment !== 'undefined'
      ? Equipment.getEffect('speedMultiplier')
      : 1.0;
    const speed = BASE_SPEED * speedMult;

    // Direction
    forward.set(Math.sin(yaw), 0, Math.cos(yaw));
    right.set(Math.cos(yaw), 0, -Math.sin(yaw));
    direction.set(0, 0, 0);

    if (keys['KeyW'] || keys['ArrowUp'])    direction.addScaledVector(forward, -1);
    if (keys['KeyS'] || keys['ArrowDown'])  direction.addScaledVector(forward,  1);
    if (keys['KeyA'] || keys['ArrowLeft'])  direction.addScaledVector(right,   -1);
    if (keys['KeyD'] || keys['ArrowRight']) direction.addScaledVector(right,    1);

    // Survie : si mort, ne pas bouger
    if (typeof Survival !== 'undefined' && !Survival.isAlive()) {
      camera.position.copy(position);
      return;
    }

    if (direction.lengthSq() > 0) {
      direction.normalize();
      position.addScaledVector(direction, speed * delta);
      position.x = Math.max(-98, Math.min(98, position.x));
      position.z = Math.max(-98, Math.min(98, position.z));
    }

    // Jetpack gère la physique verticale séparément
    const isFlying = typeof Equipment !== 'undefined' && Equipment.isFlying();
    if (!isFlying) {
      // Gravité / sol
      const groundY = getHeightAt(position.x, position.z);
      position.y = groundY + PLAYER_H;
    }
    // Si en vol, position.y est gérée par equipment.js

    camera.position.copy(position);
    const euler = new THREE.Euler(pitch, yaw, 0, 'YXZ');
    camera.quaternion.setFromEuler(euler);
  }

  // Exposer les touches pour equipment.js
  return { update, position, keys };
}
