// ============================================================
//  MAIN  –  Initialisation Three.js + boucle de jeu
//  Intègre tous les nouveaux systèmes
// ============================================================

(function () {

  // ── Renderer ──────────────────────────────────────────────
  const canvas   = document.getElementById('game-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;

  // ── Scène ─────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a0a2e);
  scene.fog = new THREE.Fog(0x1a0a2e, 60, 180);

  // ── Caméra ────────────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);

  // ── Lumières ──────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x334466, 0.8));

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
  scene.add(new THREE.DirectionalLight(0x4488ff, 0.3).position.set(-60, 40, -80) && new THREE.DirectionalLight(0x4488ff, 0.3));

  // ── Étoiles ───────────────────────────────────────────────
  (function addStars() {
    const geo   = new THREE.BufferGeometry();
    const count = 1500;
    const verts = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) verts[i] = (Math.random() - 0.5) * 800;
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 })));
  })();

  // ── Terrain ───────────────────────────────────────────────
  const { getHeightAt } = createTerrain(scene);

  // ── Joueur ────────────────────────────────────────────────
  const player = createPlayer(scene, camera, getHeightAt);

  // ── Terraform (core) ──────────────────────────────────────
  if (typeof initTerraform === 'function') {
    initTerraform(scene, getHeightAt);
  }

  // ── Systèmes supplémentaires ──────────────────────────────
  if (typeof Survival !== 'undefined') {
    Survival.init(gameState, getHeightAt);
  }

  if (typeof Equipment !== 'undefined') {
    Equipment.init(player.position, getHeightAt, player.keys);
  }

  if (typeof PowerGrid !== 'undefined') {
    PowerGrid.init(gameState);
  }

  if (typeof Placement !== 'undefined') {
    Placement.init(scene, camera, getHeightAt, gameState);
  }

  if (typeof Rockets !== 'undefined') {
    Rockets.init(scene, getHeightAt, gameState);
    Rockets.load(); // Reprendre les vols en cours
  }

  if (typeof BlueprintsUI !== 'undefined') {
    BlueprintsUI.init(gameState);
  }

  if (typeof Marketplace !== 'undefined') {
    Marketplace.init(gameState);
  }

  if (typeof Microchips !== 'undefined') {
    Microchips.init(gameState);
  }

  if (typeof LootSystem !== 'undefined') {
    LootSystem.init(scene, getHeightAt, gameState);
  }

  if (typeof DNALab !== 'undefined') {
    DNALab.init(gameState);
  }

  if (typeof MapSystem !== 'undefined') {
    MapSystem.init(gameState, player.position);
    // Shelter au spawn
    MapSystem.addPOI(0, 0, '🏠', 'Shelter', 'shelter');
    MapSystem.addPOI(10, 10, '🚀', 'Plateforme', 'rocket');
  }

  // ── Overlay démarrage ─────────────────────────────────────
  const overlay = document.getElementById('overlay');
  const startBtn = document.getElementById('start-btn');

  function startGame() {
    overlay.classList.remove('active');
    canvas.requestPointerLock();
  }

  if (startBtn) startBtn.addEventListener('click', startGame);
  overlay?.addEventListener('click', (e) => { if (e.target === overlay) startGame(); });

  // Ré-afficher l'overlay si pointer lock perdu (et pas de panneau ouvert)
  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement !== canvas) {
      const panelsOpen = [
        'craft-panel','recipes-panel','blueprints-panel','rocket-panel',
        'market-panel','equipment-panel','dna-panel','chip-panel','fullmap-panel'
      ].some(id => {
        const el = document.getElementById(id);
        return el && !el.classList.contains('hidden');
      });
      const invOpen = document.getElementById('inventory')?.classList.contains('open');
      const placing = typeof Placement !== 'undefined' && Placement.isActive();

      if (!panelsOpen && !invOpen && !placing) {
        overlay?.classList.add('active');
      }
    }
  });

  // ── Redimensionnement ─────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Boucle de jeu ─────────────────────────────────────────
  let lastTime = performance.now();

  function gameLoop(now) {
    requestAnimationFrame(gameLoop);
    const delta = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    // Mise à jour placement 3D (ghost mesh)
    if (typeof Placement !== 'undefined') Placement.update();

    // Joueur
    player.update(delta);

    // Terraform + tous les systèmes intégrés
    if (typeof updateTerraform === 'function') {
      updateTerraform(delta, player.position);
    }

    // Rendu
    renderer.render(scene, camera);
  }

  requestAnimationFrame(gameLoop);

})();
