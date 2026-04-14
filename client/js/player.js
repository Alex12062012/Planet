// ============================================================
//  PLAYER  –  déplacement FPS + souris (Pointer Lock)
// ============================================================

function createPlayer(scene, camera, getHeightAt) {

  const SPEED       = 8;    // unités / seconde
  const PLAYER_H    = 1.7;  // hauteur des yeux au-dessus du sol
  const MOUSE_SENS  = 0.002;

  // Position de départ
  const position = new THREE.Vector3(0, getHeightAt(0, 0) + PLAYER_H, 0);

  // Angles de vue
  let yaw   = 0;  // rotation horizontale
  let pitch = 0;  // inclinaison verticale

  // Touches actives
  const keys = {};

  // ---- Pointer Lock ----
  const canvas = document.getElementById('game-canvas');

  canvas.addEventListener('click', () => {
    if (document.pointerLockElement !== canvas) {
      canvas.requestPointerLock();
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement !== canvas) return;
    yaw   -= e.movementX * MOUSE_SENS;
    pitch -= e.movementY * MOUSE_SENS;
    pitch  = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, pitch));
  });

  // ---- Clavier ----
  document.addEventListener('keydown', (e) => { keys[e.code] = true;  });
  document.addEventListener('keyup',   (e) => { keys[e.code] = false; });

  // ---- Vecteurs de travail ----
  const direction = new THREE.Vector3();
  const right     = new THREE.Vector3();
  const forward   = new THREE.Vector3();

  // ---- Update (appelé chaque frame) ----
  function update(delta) {
    // Direction "avant" selon le yaw uniquement (on reste au sol)
    forward.set(Math.sin(yaw), 0, Math.cos(yaw));
    right.set(Math.cos(yaw), 0, -Math.sin(yaw));

    direction.set(0, 0, 0);

    if (keys['KeyW'] || keys['ArrowUp'])    direction.addScaledVector(forward, -1);
    if (keys['KeyS'] || keys['ArrowDown'])  direction.addScaledVector(forward,  1);
    if (keys['KeyA'] || keys['ArrowLeft'])  direction.addScaledVector(right,   -1);
    if (keys['KeyD'] || keys['ArrowRight']) direction.addScaledVector(right,    1);

    if (direction.lengthSq() > 0) {
      direction.normalize();
      position.addScaledVector(direction, SPEED * delta);

      // Limiter au terrain
      position.x = Math.max(-98, Math.min(98, position.x));
      position.z = Math.max(-98, Math.min(98, position.z));
    }

    // Coller le joueur au sol
    const groundY = getHeightAt(position.x, position.z);
    position.y = groundY + PLAYER_H;

    // Appliquer à la caméra
    camera.position.copy(position);

    // Rotation caméra
    const euler = new THREE.Euler(pitch, yaw, 0, 'YXZ');
    camera.quaternion.setFromEuler(euler);
  }

  return { update, position };
}
