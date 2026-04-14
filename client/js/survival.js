// ============================================================
//  SURVIVAL  –  Gestion survie joueur
//  O2 respiré, santé, hydratation, radiation, mort/respawn
// ============================================================

const Survival = (() => {

  // ─── Stats du joueur ───────────────────────────────────────
  const stats = {
    health:    100,   // 0–100 (mort à 0)
    hydration: 100,   // 0–100 (pénalité à 0)
    playerO2:  100,   // 0–100 (réserve O2 personnelle du joueur)
    radiation: 0,     // 0–100 (0 = aucun danger)
    alive:     true,
    deathTimer: 0,    // temps de respawn en s
    shelter:   { x: 0, y: 0, z: 0 }, // position du shelter
  };

  // ─── Références ────────────────────────────────────────────
  let _gameState = null;  // référence à gameState de terraform.js
  let _playerPos = null;  // référence à la position du joueur
  let _getHeightAt = null;

  // ─── Taux de consommation (par seconde) ────────────────────
  const RATES = {
    // Consommation d'O2 selon niveau atmosphérique
    // Si le monde a 0% O2, le joueur perd son O2 personnel plus vite
    o2Consume:      1.5,   // %/s O2 personnel consommé si atmo < 20%
    o2ConsumeBase:  0.3,   // %/s O2 consommé de base (même avec bonne atmo)
    hydraLoss:      0.08,  // %/s perte d'hydratation
    healthLossO2:   3.0,   // %/s perte de santé si O2 = 0
    healthLossHyd:  1.0,   // %/s perte de santé si hydratation = 0
    healthRegen:    0.5,   // %/s régénération si O2 & hydratation > 20%
    radExpose:      0.2,   // %/s exposition à la radiation (près uranium)
    radDecay:       0.1,   // %/s déclin radiation loin des sources
    radDamage:      0.8,   // %/s dégâts santé si radiation > 80%
  };

  const RESPAWN_TIME = 5; // secondes avant respawn

  // ─── Init ──────────────────────────────────────────────────
  function init(gameState, getHeightAt) {
    _gameState = gameState;
    _getHeightAt = getHeightAt;

    // Charger sauvegarde
    _load();

    // Événements clavier pour les consommables
    document.addEventListener('keydown', (e) => {
      // Pas de raccourcis survival directs — les items se prennent depuis l'inventaire
    });

    _renderHUD();
    console.log('✅ Survival system initialized');
  }

  // ─── Update (appelé chaque frame) ─────────────────────────
  function update(delta, playerPos) {
    _playerPos = playerPos;
    if (!stats.alive) {
      _updateDeath(delta);
      return;
    }

    // Niveau O2 atmosphérique du monde (0-100%)
    const worldO2 = _gameState ? _gameState.oxygen : 0;

    // Consommation O2 personnel
    if (worldO2 < 20) {
      // Atmosphère trop pauvre : consommer O2 du réservoir
      const consume = (RATES.o2Consume * (1 - worldO2 / 20)) * delta;
      stats.playerO2 = Math.max(0, stats.playerO2 - consume);
    } else {
      // Atmosphère respirable : recharger légèrement le réservoir
      const oxygenBonus = Equipment ? Equipment.getEffect('oxygenCapacity') : 1;
      const recharge = Math.min(1.5, worldO2 / 20) * oxygenBonus * delta * 2;
      stats.playerO2 = Math.min(100 * oxygenBonus, stats.playerO2 + recharge);
    }

    // Perte d'hydratation
    stats.hydration = Math.max(0, stats.hydration - RATES.hydraLoss * delta);

    // Santé : dégâts ou régénération
    if (stats.playerO2 <= 0) {
      stats.health = Math.max(0, stats.health - RATES.healthLossO2 * delta);
    }
    if (stats.hydration <= 0) {
      stats.health = Math.max(0, stats.health - RATES.healthLossHyd * delta);
    }
    if (stats.playerO2 > 10 && stats.hydration > 20 && stats.health < 100) {
      stats.health = Math.min(100, stats.health + RATES.healthRegen * delta);
    }

    // Radiation (si uranium dans l'inventaire ou près de dépôts)
    _updateRadiation(delta, playerPos);

    // Dégâts radiation élevée
    if (stats.radiation > 80) {
      stats.health = Math.max(0, stats.health - RATES.radDamage * delta);
    }

    // Mort
    if (stats.health <= 0) {
      _die();
      return;
    }

    // HUD ~100ms
    if (!update._lastHud || performance.now() - update._lastHud > 100) {
      _renderHUD();
      update._lastHud = performance.now();
    }

    // Sauvegarde ~10s
    if (!update._lastSave || performance.now() - update._lastSave > 10000) {
      _save();
      update._lastSave = performance.now();
    }
  }

  // ─── Radiation ────────────────────────────────────────────
  function _updateRadiation(delta, playerPos) {
    if (!playerPos) return;
    // Zone proche d'uranium (dans items.js les noeuds uranium)
    // SimplifiE : vérifier si l'inventaire contient de l'uranium
    const hasUranium = _gameState && (_gameState.inventory['uranium'] || 0) > 0;
    if (hasUranium) {
      stats.radiation = Math.min(100, stats.radiation + RATES.radExpose * delta);
    } else {
      stats.radiation = Math.max(0, stats.radiation - RATES.radDecay * delta);
    }
  }

  // ─── Mort ─────────────────────────────────────────────────
  function _die() {
    if (!stats.alive) return;
    stats.alive = false;
    stats.deathTimer = RESPAWN_TIME;

    // Perdre une partie de l'inventaire (50% de tout)
    if (_gameState) {
      for (const key of Object.keys(_gameState.inventory)) {
        _gameState.inventory[key] = Math.floor((_gameState.inventory[key] || 0) * 0.5);
        if (_gameState.inventory[key] <= 0) delete _gameState.inventory[key];
      }
    }

    // Overlay de mort
    const deathEl = document.getElementById('death-screen');
    if (deathEl) {
      deathEl.classList.remove('hidden');
      const msgEl = document.getElementById('death-message');
      if (msgEl) {
        if (stats.playerO2 <= 0) msgEl.textContent = '💨 Asphyxie...';
        else if (stats.hydration <= 0) msgEl.textContent = '💧 Déshydratation...';
        else if (stats.radiation > 80) msgEl.textContent = '☢️ Surexposition aux radiations...';
        else msgEl.textContent = '💀 Vous êtes mort...';
      }
    }

    _showNotif('💀 Mort ! Respawn dans ' + RESPAWN_TIME + 's', 'error');
    console.log('💀 Player died');
  }

  function _updateDeath(delta) {
    stats.deathTimer -= delta;
    const timer = document.getElementById('death-timer');
    if (timer) timer.textContent = Math.ceil(stats.deathTimer) + 's';

    if (stats.deathTimer <= 0) {
      _respawn();
    }
  }

  function _respawn() {
    stats.alive = true;
    stats.health = 50;
    stats.playerO2 = 100;
    stats.hydration = 50;
    stats.radiation = 0;

    // Retour au shelter
    if (_playerPos && _getHeightAt) {
      const sx = stats.shelter.x;
      const sz = stats.shelter.z;
      _playerPos.x = sx;
      _playerPos.z = sz;
      _playerPos.y = _getHeightAt(sx, sz) + 1.7;
    }

    const deathEl = document.getElementById('death-screen');
    if (deathEl) deathEl.classList.add('hidden');

    _showNotif('🔄 Respawn au shelter...', 'info');
    _renderHUD();
  }

  // ─── Manger / Boire un consommable ────────────────────────
  function consumeItem(itemId) {
    if (!stats.alive) return false;

    const recipe = RECIPES ? RECIPES[itemId] : null;
    const effect = recipe?.effect;
    if (!effect) return false;

    if (effect.health)    stats.health    = Math.min(100, stats.health    + effect.health);
    if (effect.hydration) stats.hydration = Math.min(100, stats.hydration + effect.hydration);
    if (effect.oxygen)    stats.playerO2  = Math.min(100, stats.playerO2  + effect.oxygen);

    _renderHUD();
    const item = ITEMS ? ITEMS[itemId] : null;
    _showNotif(`${item?.icon || '🍶'} ${item?.name || itemId} consommé`, 'collect');
    return true;
  }

  // ─── Définir position du shelter ──────────────────────────
  function setShelterPosition(x, y, z) {
    stats.shelter = { x, y, z };
  }

  // ─── HUD ──────────────────────────────────────────────────
  function _renderHUD() {
    _setSurvBar('health',    stats.health);
    _setSurvBar('hydration', stats.hydration);
    _setSurvBar('player-o2', stats.playerO2);
    _setSurvBar('radiation', stats.radiation);

    // Alertes visuelles
    const hudSurv = document.getElementById('survival-hud');
    if (hudSurv) {
      hudSurv.classList.toggle('danger-o2',    stats.playerO2 < 20);
      hudSurv.classList.toggle('danger-health', stats.health   < 25);
    }

    // Indicateurs danger
    _setDanger('danger-o2-warn',    stats.playerO2 < 20);
    _setDanger('danger-hydra-warn', stats.hydration < 15);
    _setDanger('danger-rad-warn',   stats.radiation > 70);
  }

  function _setSurvBar(name, pct) {
    const bar = document.getElementById('surv-bar-' + name);
    const val = document.getElementById('surv-val-' + name);
    const clamped = Math.min(100, Math.max(0, pct));
    if (bar) bar.style.width = clamped.toFixed(1) + '%';
    if (val) val.textContent = clamped.toFixed(0) + '%';
  }

  function _setDanger(id, active) {
    const el = document.getElementById(id);
    if (el) el.style.display = active ? 'flex' : 'none';
  }

  // ─── Persistance ──────────────────────────────────────────
  function _save() {
    try {
      localStorage.setItem('pc_survival', JSON.stringify({
        health: stats.health,
        hydration: stats.hydration,
        playerO2: stats.playerO2,
        radiation: stats.radiation,
        shelter: stats.shelter,
      }));
    } catch(_) {}
  }

  function _load() {
    try {
      const d = JSON.parse(localStorage.getItem('pc_survival') || 'null');
      if (d) {
        stats.health    = d.health    ?? 100;
        stats.hydration = d.hydration ?? 100;
        stats.playerO2  = d.playerO2  ?? 100;
        stats.radiation = d.radiation ?? 0;
        if (d.shelter) stats.shelter = d.shelter;
      }
    } catch(_) {}
  }

  function _showNotif(msg, type) {
    if (typeof window._showNotif === 'function') {
      window._showNotif(msg, type);
    } else {
      // Fallback vers la fonction terraform.js
      const notif = document.getElementById('notif');
      if (notif) {
        notif.textContent = msg;
        notif.className = 'notif-' + type;
        notif.style.opacity = '1';
        setTimeout(() => { notif.style.opacity = '0'; }, 3000);
      }
    }
  }

  // ─── API publique ─────────────────────────────────────────
  return {
    init,
    update,
    consumeItem,
    setShelterPosition,
    getStats: () => ({ ...stats }),
    isAlive: () => stats.alive,
    setHealth: (v) => { stats.health = Math.max(0, Math.min(100, v)); _renderHUD(); },
  };

})();
