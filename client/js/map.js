// ============================================================
//  MAP SYSTEM  –  Minimap + GPS / révélation carte
//  Minimap : coin bas droite   Touche M = plein écran
// ============================================================

const MapSystem = (() => {

  let _gameState  = null;
  let _playerPos  = null;
  let _canvas     = null;
  let _ctx        = null;
  let _fullCanvas = null;
  let _fullCtx    = null;

  const MAP_WORLD_SIZE = 200; // taille du monde en unités world
  const MINI_SIZE      = 160; // taille de la minimap en pixels
  const FULL_SIZE      = 600; // taille de la grande carte

  let _revealPct    = 0;
  let _revealRadius = 20; // rayon visible autour du joueur en unités

  // ─── Points d'intérêt ────────────────────────────────────
  const POI = []; // { x, z, icon, label, type }

  // ─── Init ─────────────────────────────────────────────────
  function init(gameState, playerPos) {
    _gameState = gameState;
    _playerPos = playerPos;

    // Minimap canvas
    _canvas = document.getElementById('minimap-canvas');
    if (_canvas) {
      _canvas.width  = MINI_SIZE;
      _canvas.height = MINI_SIZE;
      _ctx = _canvas.getContext('2d');
    }

    // Grande carte canvas
    _fullCanvas = document.getElementById('fullmap-canvas');
    if (_fullCanvas) {
      _fullCanvas.width  = FULL_SIZE;
      _fullCanvas.height = FULL_SIZE;
      _fullCtx = _fullCanvas.getContext('2d');
    }

    // Ajouter le shelter comme POI
    POI.push({ x: 0, z: 0, icon: '🏠', label: 'Shelter', type: 'shelter' });

    document.addEventListener('keydown', (e) => {
      if (e.code === 'KeyM') toggleFullMap();
    });

    console.log('✅ Map system initialized');
  }

  // ─── Ajouter un POI ───────────────────────────────────────
  function addPOI(x, z, icon, label, type) {
    // Éviter les doublons
    if (!POI.find(p => p.x === x && p.z === z)) {
      POI.push({ x, z, icon, label, type });
    }
  }

  // ─── Régler le pourcentage de révélation ──────────────────
  function setRevealPct(pct) {
    _revealPct = pct;
    _revealRadius = 20 + (pct / 100) * 80; // 20 → 100 unités selon révélation
    renderMap();
  }

  // ─── Update (toutes les frames) ──────────────────────────
  function update(playerPos) {
    _playerPos = playerPos;
  }

  // ─── Rendu minimap ────────────────────────────────────────
  function renderMinimap() {
    if (!_ctx || !_canvas) return;
    const ctx  = _ctx;
    const size = MINI_SIZE;

    ctx.clearRect(0, 0, size, size);

    // Fond
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
    ctx.fill();

    // Bordure
    ctx.strokeStyle = 'rgba(100,200,255,0.4)';
    ctx.lineWidth   = 2;
    ctx.stroke();

    // Clip circulaire
    ctx.save();
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 2, 0, Math.PI * 2);
    ctx.clip();

    // Brouillard de guerre (sauf zone visible)
    const px = _playerPos?.x || 0;
    const pz = _playerPos?.z || 0;

    // Dessiner le terrain (simplifié)
    _drawTerrain(ctx, px, pz, size, size / MAP_WORLD_SIZE);

    // Épaves révélées
    if (typeof LootSystem !== 'undefined') {
      for (const wreck of LootSystem.getWrecks()) {
        if (!wreck.revealed) continue;
        const mx = _worldToMap(wreck.pos.x, px, size);
        const mz = _worldToMap(wreck.pos.z, pz, size);
        _drawMapIcon(ctx, mx, mz, '🛸', 8);
      }
    }

    // Machines placées
    if (_gameState?.machines) {
      for (const m of _gameState.machines) {
        if (!m.pos) continue;
        const mx = _worldToMap(m.pos.x, px, size);
        const mz = _worldToMap(m.pos.z, pz, size);
        ctx.fillStyle = '#88aaff';
        ctx.fillRect(mx - 2, mz - 2, 4, 4);
      }
    }

    // POI
    for (const poi of POI) {
      const mx = _worldToMap(poi.x, px, size);
      const mz = _worldToMap(poi.z, pz, size);
      _drawMapIcon(ctx, mx, mz, poi.icon, 9);
    }

    // Brouillard
    if (_revealPct < 100) {
      const visRadius = (_revealRadius / MAP_WORLD_SIZE) * size;
      const gradient  = ctx.createRadialGradient(
        size/2, size/2, visRadius * 0.7,
        size/2, size/2, size * 0.7
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }

    // Joueur (centre de la minimap)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 3, 0, Math.PI * 2);
    ctx.fill();

    // Flèche de direction
    ctx.restore();
  }

  // ─── Grande carte ─────────────────────────────────────────
  function renderMap() {
    if (!_fullCtx || !_fullCanvas) return;
    const ctx  = _fullCtx;
    const size = FULL_SIZE;
    const scale = size / MAP_WORLD_SIZE;

    ctx.clearRect(0, 0, size, size);

    // Fond
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, size, size);

    // Terrain en couleur (zones de couleur selon biome)
    _drawTerrainFull(ctx, size, scale);

    // Grille
    ctx.strokeStyle = 'rgba(100,200,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const v = (i / 10) * size;
      ctx.beginPath(); ctx.moveTo(v, 0); ctx.lineTo(v, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, v); ctx.lineTo(size, v); ctx.stroke();
    }

    // Brouillard de guerre
    if (_revealPct < 100 && _playerPos) {
      const px   = _playerPos.x;
      const pz   = _playerPos.z;
      const mx   = (px + MAP_WORLD_SIZE / 2) * scale;
      const mz   = (pz + MAP_WORLD_SIZE / 2) * scale;
      const visR = (_revealRadius / MAP_WORLD_SIZE) * size;

      // Zone visible
      const gradient = ctx.createRadialGradient(mx, mz, visR * 0.5, mx, mz, visR * 1.5);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.9)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }

    // Caisses / épaves
    if (typeof LootSystem !== 'undefined') {
      for (const wreck of LootSystem.getWrecks()) {
        const mx = (wreck.pos.x + MAP_WORLD_SIZE / 2) * scale;
        const mz = (wreck.pos.z + MAP_WORLD_SIZE / 2) * scale;
        const opacity = wreck.revealed ? 1.0 : (wreck.looted ? 0.4 : 0);
        if (opacity === 0) continue;
        ctx.globalAlpha = opacity;
        _drawMapIcon(ctx, mx, mz, wreck.looted ? '⬜' : '🛸', 12);
        ctx.globalAlpha = 1;
      }
    }

    // Machines
    if (_gameState?.machines) {
      for (const m of _gameState.machines) {
        if (!m.pos) continue;
        const mx = (m.pos.x + MAP_WORLD_SIZE / 2) * scale;
        const mz = (m.pos.z + MAP_WORLD_SIZE / 2) * scale;
        ctx.fillStyle = '#6699ff';
        ctx.fillRect(mx - 3, mz - 3, 6, 6);
      }
    }

    // POI
    for (const poi of POI) {
      const mx = (poi.x + MAP_WORLD_SIZE / 2) * scale;
      const mz = (poi.z + MAP_WORLD_SIZE / 2) * scale;
      _drawMapIcon(ctx, mx, mz, poi.icon, 14);
      ctx.fillStyle = '#ccc';
      ctx.font = '9px system-ui';
      ctx.fillText(poi.label, mx + 8, mz + 4);
    }

    // Joueur
    if (_playerPos) {
      const mx = (_playerPos.x + MAP_WORLD_SIZE / 2) * scale;
      const mz = (_playerPos.z + MAP_WORLD_SIZE / 2) * scale;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(mx, mz, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#88ddff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Coordonnées
      const coordEl = document.getElementById('map-coords');
      if (coordEl) {
        coordEl.textContent = `X: ${_playerPos.x.toFixed(0)} Z: ${_playerPos.z.toFixed(0)}`;
      }
    }

    // Légende
    const revealEl = document.getElementById('map-reveal-pct');
    if (revealEl) {
      revealEl.textContent = `Carte révélée : ${_revealPct}%`;
    }
  }

  // ─── Terrain simple (couleur selon Ti) ───────────────────
  function _drawTerrain(ctx, px, pz, size, scale) {
    const stage = typeof getCurrentStage === 'function' && _gameState
      ? getCurrentStage(_gameState.ti)
      : null;
    const baseColor = stage?.terrainColor ? '#' + stage.terrainColor.toString(16).padStart(6,'0') : '#2a1a3a';
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, size, size);
  }

  function _drawTerrainFull(ctx, size, scale) {
    const stage = typeof getCurrentStage === 'function' && _gameState
      ? getCurrentStage(_gameState.ti)
      : null;
    const baseColor = stage?.terrainColor ? '#' + stage.terrainColor.toString(16).padStart(6,'0') : '#1a0a2e';
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, size, size);
  }

  // ─── Helpers ──────────────────────────────────────────────
  function _worldToMap(worldCoord, playerCoord, mapSize) {
    // Centré sur le joueur
    const relative = worldCoord - playerCoord;
    return mapSize / 2 + (relative / MAP_WORLD_SIZE) * mapSize;
  }

  function _drawMapIcon(ctx, x, y, icon, size) {
    ctx.font = `${size}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, x, y);
  }

  // ─── Ouvrir/fermer la grande carte ────────────────────────
  function toggleFullMap() {
    const panel = document.getElementById('fullmap-panel');
    if (!panel) return;
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) renderMap();
  }

  // ─── Update (chaque frame) ────────────────────────────────
  function updateFrame(playerPos) {
    _playerPos = playerPos;
    if (!MapSystem._lastRender || performance.now() - MapSystem._lastRender > 200) {
      renderMinimap();
      MapSystem._lastRender = performance.now();
    }

    // Grande carte si ouverte
    const full = document.getElementById('fullmap-panel');
    if (full && !full.classList.contains('hidden')) {
      if (!MapSystem._lastFull || performance.now() - MapSystem._lastFull > 500) {
        renderMap();
        MapSystem._lastFull = performance.now();
      }
    }
  }

  return {
    init,
    addPOI,
    setRevealPct,
    update: updateFrame,
    renderMap,
    renderMinimap,
    toggleFullMap,
  };

})();
