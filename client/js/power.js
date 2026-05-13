// ============================================================
//  POWER GRID  –  Générateurs vs consommateurs
//  Chaque machine a powerGen ou powerUse
//  Si déficit : les machines les plus gourmandes s'éteignent
// ============================================================

const PowerGrid = (() => {

  let _gameState = null;

  // ─── État du réseau ────────────────────────────────────────
  const grid = {
    generation:   0,    // W total généré
    consumption:  0,    // W total consommé
    balance:      0,    // generation - consumption
    offlineMachines: [], // IDs des machines hors ligne
  };

  // ─── Init ──────────────────────────────────────────────────
  function init(gameState) {
    _gameState = gameState;
    console.log('✅ Power Grid initialized');
  }

  // ─── Update (appelé depuis terraform.js) ──────────────────
  function update() {
    if (!_gameState) return;

    const machineDefs = typeof MACHINES !== 'undefined' ? MACHINES : {};

    let gen = 0;
    let use = 0;

    // Calculer génération et consommation totales
    for (const m of _gameState.machines) {
      const def = machineDefs[m.type];
      if (!def) continue;
      gen += def.powerGen || 0;
      use += def.powerUse || 0;
    }

    grid.generation  = gen;
    grid.consumption = use;
    grid.balance     = gen - use;

    // Déterminer quelles machines sont hors ligne
    grid.offlineMachines = [];

    if (grid.balance < 0) {
      // Trier les machines par consommation décroissante
      const consumers = _gameState.machines
        .filter(m => (machineDefs[m.type]?.powerUse || 0) > 0)
        .sort((a, b) => (machineDefs[b.type]?.powerUse || 0) - (machineDefs[a.type]?.powerUse || 0));

      let deficit = -grid.balance;
      for (const m of consumers) {
        if (deficit <= 0) break;
        const def = machineDefs[m.type];
        grid.offlineMachines.push(m.id);
        deficit -= (def?.powerUse || 0);
      }
    }

    // Mettre à jour le HUD
    _renderHUD();
  }

  // ─── Vérifier si une machine est en ligne ─────────────────
  function isMachineOnline(machineId) {
    return !grid.offlineMachines.includes(machineId);
  }

  // ─── Obtenir le multiplicateur d'efficacité ───────────────
  // Une machine hors ligne contribue 0 Ti/s
  function getMachineEfficiency(machineId) {
    return isMachineOnline(machineId) ? 1.0 : 0.0;
  }

  // ─── HUD ──────────────────────────────────────────────────
  function _renderHUD() {
    const genEl  = document.getElementById('power-gen');
    const useEl  = document.getElementById('power-use');
    const balEl  = document.getElementById('power-balance');
    const rowEl  = document.getElementById('power-row');

    if (genEl) genEl.textContent  = _formatW(grid.generation);
    if (useEl) useEl.textContent  = _formatW(grid.consumption);
    if (balEl) {
      balEl.textContent = _formatW(Math.abs(grid.balance));
      balEl.className = grid.balance >= 0 ? 'power-ok' : 'power-deficit';
    }

    // Cacher le panneau si tout est à 0 (pas encore de machines)
    if (rowEl) {
      rowEl.style.display = (grid.generation + grid.consumption > 0) ? 'flex' : 'none';
    }

    // Alertes
    const alertEl = document.getElementById('power-alert');
    if (alertEl) {
      if (grid.balance < 0) {
        alertEl.textContent = `⚡ Déficit ${_formatW(-grid.balance)} — ${grid.offlineMachines.length} machine(s) hors ligne !`;
        alertEl.style.display = 'block';
      } else {
        alertEl.style.display = 'none';
      }
    }
  }

  function _formatW(w) {
    if (w >= 1000000) return (w / 1000000).toFixed(1) + ' MW';
    if (w >= 1000)    return (w / 1000).toFixed(1)    + ' kW';
    return w.toFixed(0) + ' W';
  }

  // ─── API publique ─────────────────────────────────────────
  return {
    init,
    update,
    isMachineOnline,
    getMachineEfficiency,
    getGrid: () => ({ ...grid }),
  };

})();
