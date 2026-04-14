// ============================================================
//  MAIN  –  initialisation Three.js + boucle de jeu
// ============================================================

(function () {

  // ---- Renderer ----
  const canvas   = document.getElementById('game-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;

  // ---- Scène ----
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a0a2e);   // ciel alien (violet nuit)
  scene.fog = new THREE.Fog(0x1a0a2e, 60, 180);

  // ---- Caméra ----
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );

  // ---- Lumières ----

  // Lumière ambiante douce
  const ambient = new THREE.AmbientLight(0x334466, 0.8);
  scene.add(ambient);

  // Soleil alien (teinte orangée)
  const sun = new THREE.DirectionalLight(0xffaa55, 1.2);
  sun.position.set(80, 120, 60);
  sun.castShadow = true;
  sun.shadow.mapSize.width  = 2048;
  sun.shadow.mapSize.height = 2048;
  sun.shadow.camera.near    = 1;
  sun.shadow.camera.far     = 400;
  sun.shadow.camera.left    = -100;
  sun.shadow.camera.right   = 100;
  sun.shadow.camera.top     = 100;
  sun.shadow.camera.bottom  = -100;
  scene.add(sun);

  // Lumière de remplissage (bleutée, côté opposé)
  const fill = new THREE.DirectionalLight(0x4488ff, 0.3);
  fill.position.set(-60, 40, -80);
  scene.add(fill);

  // ---- Étoiles (particules) ----
  (function addStars() {
    const geo = new THREE.BufferGeometry();
    const count = 1500;
    const verts = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      verts[i] = (Math.random() - 0.5) * 800;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    const mat  = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
    scene.add(new THREE.Points(geo, mat));
  })();

  // ---- Terrain ----
  const { getHeightAt } = createTerrain(scene);

  // ---- Joueur ----
  const player = createPlayer(scene, camera, getHeightAt);

  // ---- Terraform ----
  // Initialiser le système de terraformation (items, stades, ressources)
  if (typeof initTerraform === 'function') {
    initTerraform(scene, getHeightAt);
  }

  // ---- Overlay (démarrage) ----
  const overlay = document.getElementById('overlay');
  const startBtn = document.getElementById('start-btn');

  function startGame() {
    overlay.classList.remove('active');
    canvas.requestPointerLock();
  }

  if (startBtn) startBtn.addEventListener('click', startGame);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) startGame();
  });

  // Ré-afficher l'overlay si le joueur quitte le pointer lock
  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement !== canvas) {
      // Ne ré-afficher l'overlay que si les panneaux ne sont pas ouverts
      const craftOpen = !document.getElementById('craft-panel')?.classList.contains('hidden');
      const invOpen   = document.getElementById('inventory')?.classList.contains('open');
      if (!craftOpen && !invOpen) {
        overlay.classList.add('active');
      }
    }
  });

  // ---- Redimensionnement ----
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ---- Boucle de jeu ----
  let lastTime = performance.now();

  function gameLoop(now) {
    requestAnimationFrame(gameLoop);

    const delta = Math.min((now - lastTime) / 1000, 0.1); // secondes, max 100ms
    lastTime = now;

    player.update(delta);

    // Mise à jour du système de terraformation
    if (typeof updateTerraform === 'function') {
      updateTerraform(delta, player.position);
    }

    renderer.render(scene, camera);
  }

  requestAnimationFrame(gameLoop);

})();
