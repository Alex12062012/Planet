// ============================================================
//  BLUEPRINTS UI  –  Écran verrouillé / déverrouillé
//  Tab = ouvrir   Onglets par catégorie de déverrou
// ============================================================

const BlueprintsUI = (() => {

  let _gameState = null;
  let _activeTab = 'ti';

  // ─── Catégories ───────────────────────────────────────────
  const TABS = [
    { id: 'ti',       label: 'Ti',        icon: '🌡️', data: 'BLUEPRINTS_TI'       },
    { id: 'oxygen',   label: 'Oxygène',   icon: '💨', data: 'BLUEPRINTS_OXYGEN'   },
    { id: 'heat',     label: 'Chaleur',   icon: '🔥', data: 'BLUEPRINTS_HEAT'     },
    { id: 'pressure', label: 'Pression',  icon: '🌀', data: 'BLUEPRINTS_PRESSURE' },
    { id: 'biomass',  label: 'Biomasse',  icon: '🌿', data: 'BLUEPRINTS_BIOMASS'  },
    { id: 'plants',   label: 'Plantes',   icon: '🌱', data: 'BLUEPRINTS_PLANTS'   },
    { id: 'insects',  label: 'Insectes',  icon: '🦋', data: 'BLUEPRINTS_INSECTS'  },
    { id: 'animals',  label: 'Animaux',   icon: '🐠', data: 'BLUEPRINTS_ANIMALS'  },
    { id: 'systi',    label: 'SysTi',     icon: '⚡', data: 'BLUEPRINTS_SYSTI'    },
    { id: 'microchip',label: 'Microchips',icon: '📟', data: 'BLUEPRINTS_MICROCHIP'},
  ];

  // ─── Init ──────────────────────────────────────────────────
  function init(gameState) {
    _gameState = gameState;

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Tab') {
        e.preventDefault();
        toggleBlueprintPanel();
      }
    });

    console.log('✅ Blueprints UI initialized');
  }

  // ─── Toggle panneau ───────────────────────────────────────
  function toggleBlueprintPanel() {
    const panel = document.getElementById('blueprints-panel');
    if (!panel) return;
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) render();
  }

  // ─── Condition de déverrou ────────────────────────────────
  function isUnlocked(bp) {
    if (!_gameState) return false;
    if (bp.unlockTi        !== undefined && _gameState.ti              < bp.unlockTi)        return false;
    if (bp.unlockOxygen    !== undefined && _gameState.oxygen          < bp.unlockOxygen)    return false;
    if (bp.unlockHeat      !== undefined && _gameState.heat            < bp.unlockHeat)      return false;
    if (bp.unlockPressure  !== undefined && _gameState.pressure        < bp.unlockPressure)  return false;
    if (bp.unlockBiomass   !== undefined && _gameState.biomass         < bp.unlockBiomass)   return false;
    if (bp.unlockPlants    !== undefined && (_gameState.biomassPlants  || 0) < bp.unlockPlants)  return false;
    if (bp.unlockInsects   !== undefined && (_gameState.biomassInsects || 0) < bp.unlockInsects) return false;
    if (bp.unlockAnimals   !== undefined && (_gameState.biomassAnimals || 0) < bp.unlockAnimals) return false;
    return true;
  }

  // ─── Obtenir valeur actuelle pour la condition ────────────
  function _getCurrentValue(bp) {
    if (!_gameState) return 0;
    if (bp.unlockTi       !== undefined) return _gameState.ti;
    if (bp.unlockOxygen   !== undefined) return _gameState.oxygen;
    if (bp.unlockHeat     !== undefined) return _gameState.heat;
    if (bp.unlockPressure !== undefined) return _gameState.pressure;
    if (bp.unlockBiomass  !== undefined) return _gameState.biomass;
    if (bp.unlockPlants   !== undefined) return _gameState.biomassPlants || 0;
    if (bp.unlockInsects  !== undefined) return _gameState.biomassInsects || 0;
    if (bp.unlockAnimals  !== undefined) return _gameState.biomassAnimals || 0;
    return 0;
  }

  function _getRequiredValue(bp) {
    return bp.unlockTi ?? bp.unlockOxygen ?? bp.unlockHeat ??
           bp.unlockPressure ?? bp.unlockBiomass ??
           bp.unlockPlants ?? bp.unlockInsects ?? bp.unlockAnimals ?? 0;
  }

  function _getProgressPct(bp) {
    const cur = _getCurrentValue(bp);
    const req = _getRequiredValue(bp);
    if (req === 0) return 100;
    return Math.min(100, (cur / req) * 100);
  }

  // ─── Rendre le panneau ────────────────────────────────────
  function render() {
    _renderTabs();
    _renderItems();
    _renderSummary();
  }

  function _renderTabs() {
    const tabsEl = document.getElementById('bp-tabs');
    if (!tabsEl) return;

    tabsEl.innerHTML = '';
    for (const tab of TABS) {
      const btn = document.createElement('button');
      btn.className = `bp-tab${_activeTab === tab.id ? ' active' : ''}`;
      btn.innerHTML = `${tab.icon} ${tab.label}`;
      btn.onclick = () => { _activeTab = tab.id; render(); };
      tabsEl.appendChild(btn);
    }
  }

  function _renderItems() {
    const listEl = document.getElementById('bp-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    const tab  = TABS.find(t => t.id === _activeTab);
    if (!tab) return;
    const data = typeof window[tab.data] !== 'undefined' ? window[tab.data] : [];

    let unlockedCount = 0;
    for (const bp of data) {
      const unlocked = isUnlocked(bp);
      if (unlocked) unlockedCount++;
      const pct      = _getProgressPct(bp);
      const req      = _getRequiredValue(bp);

      const div = document.createElement('div');
      div.className = `bp-item${unlocked ? ' bp-unlocked' : ' bp-locked'}`;

      let reqLabel = '';
      if (bp.unlockTi       !== undefined) reqLabel = formatTi(bp.unlockTi);
      else if (bp.unlockOxygen   !== undefined) reqLabel = bp.unlockOxygen + ' ppt O₂';
      else if (bp.unlockHeat     !== undefined) reqLabel = bp.unlockHeat   + ' pK';
      else if (bp.unlockPressure !== undefined) reqLabel = bp.unlockPressure + ' nPa';
      else if (bp.unlockBiomass  !== undefined) reqLabel = _formatBio(bp.unlockBiomass);
      else if (bp.unlockPlants   !== undefined) reqLabel = _formatBio(bp.unlockPlants) + ' plantes';
      else if (bp.unlockInsects  !== undefined) reqLabel = _formatBio(bp.unlockInsects) + ' insectes';
      else if (bp.unlockAnimals  !== undefined) reqLabel = _formatBio(bp.unlockAnimals) + ' animaux';

      div.innerHTML = `
        <div class="bp-status">${unlocked ? '✅' : '🔒'}</div>
        <div class="bp-info">
          <div class="bp-name">${bp.icon || '📦'} ${bp.name}</div>
          <div class="bp-req">Nécessite : ${reqLabel}</div>
          ${!unlocked ? `
            <div class="bp-progress-wrap">
              <div class="bp-progress-bar" style="width:${pct.toFixed(1)}%"></div>
            </div>
            <div class="bp-progress-txt">${pct.toFixed(1)}%</div>
          ` : '<div class="bp-unlocked-label">Déverrouillé !</div>'}
        </div>
      `;
      listEl.appendChild(div);
    }

    // En-tête du tab
    const headerEl = document.getElementById('bp-tab-header');
    if (headerEl) {
      headerEl.textContent = `${tab.icon} ${tab.label} — ${unlockedCount}/${data.length} déverrouillés`;
    }
  }

  function _renderSummary() {
    const el = document.getElementById('bp-summary');
    if (!el || !_gameState) return;

    const totalUnlocked = TABS.reduce((sum, tab) => {
      const data = typeof window[tab.data] !== 'undefined' ? window[tab.data] : [];
      return sum + data.filter(bp => isUnlocked(bp)).length;
    }, 0);
    const totalAll = TABS.reduce((sum, tab) => {
      const data = typeof window[tab.data] !== 'undefined' ? window[tab.data] : [];
      return sum + data.length;
    }, 0);

    el.textContent = `Total : ${totalUnlocked} / ${totalAll} blueprints déverrouillés`;
  }

  // ─── Helpers ──────────────────────────────────────────────
  function _formatBio(val) {
    if (val >= 1e9) return (val / 1e9).toFixed(2) + ' Gt';
    if (val >= 1e6) return (val / 1e6).toFixed(2) + ' Mt';
    if (val >= 1e3) return (val / 1e3).toFixed(2) + ' kt';
    return val.toFixed(2) + ' t';
  }

  // ─── Nombre de blueprints déverrouillés ───────────────────
  function getUnlockedCount() {
    return TABS.reduce((sum, tab) => {
      const data = typeof window[tab.data] !== 'undefined' ? window[tab.data] : [];
      return sum + data.filter(bp => isUnlocked(bp)).length;
    }, 0);
  }

  return {
    init,
    toggleBlueprintPanel,
    isUnlocked,
    render,
    getUnlockedCount,
  };

})();
