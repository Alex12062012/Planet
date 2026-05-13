// ============================================================
//  MICROCHIPS  –  Découverte, décodage, unlock blueprints
//  Les chips se trouvent dans les épaves, caisses de loot
//  Décodage : prend du temps réel (30–300s selon tier)
// ============================================================

const Microchips = (() => {

  let _gameState = null;

  // ─── Définition des microchips ────────────────────────────
  const CHIP_DEFS = [
    { tier: 1,  name: 'Microchip Bleu T1',    icon: '📟', color: '#4488ff', decodeTime: 30,  unlocks: ['backpack_t1', 'boots_t1', 'oxygen_tank_t1']           },
    { tier: 2,  name: 'Microchip Bleu T2',    icon: '📟', color: '#3366ee', decodeTime: 60,  unlocks: ['backpack_t2', 'boots_t2', 'oxygen_tank_t2']           },
    { tier: 3,  name: 'Microchip Vert T1',    icon: '📟', color: '#44bb44', decodeTime: 90,  unlocks: ['jetpack_t1', 'exo_t1', 'suit_t1']                    },
    { tier: 4,  name: 'Microchip Vert T2',    icon: '📟', color: '#22aa22', decodeTime: 120, unlocks: ['jetpack_t2', 'exo_t2', 'suit_t2', 'backpack_t3']     },
    { tier: 5,  name: 'Microchip Jaune T1',   icon: '📟', color: '#ffcc00', decodeTime: 150, unlocks: ['jetpack_t3', 'suit_t3', 'boots_t3', 'backpack_t4']   },
    { tier: 6,  name: 'Microchip Jaune T2',   icon: '📟', color: '#ffaa00', decodeTime: 180, unlocks: ['fusion_cell', 'osmium_rod', 'super_alloy_rod']        },
    { tier: 7,  name: 'Microchip Orange T1',  icon: '📟', color: '#ff8800', decodeTime: 210, unlocks: ['jetpack_t4', 'rocket_engine_t2']                     },
    { tier: 8,  name: 'Microchip Orange T2',  icon: '📟', color: '#ff6600', decodeTime: 240, unlocks: ['mutagen_t3', 'mutagen_t4', 'fertilizer_t3']          },
    { tier: 9,  name: 'Microchip Rouge T1',   icon: '📟', color: '#ff3300', decodeTime: 270, unlocks: ['pulsar_quartz', 'animal_food_t3']                    },
    { tier: 10, name: 'Microchip Rouge T2',   icon: '📟', color: '#cc0000', decodeTime: 300, unlocks: ['fusion_cell', 'osmium_rod', 'smart_fabric']          },
  ];

  // ─── État ─────────────────────────────────────────────────
  const state = {
    chips:          [],    // chips dans l'inventaire { tier, name, ... }
    decoding:       [],    // chips en cours de décodage { chip, startedAt, finishAt }
    unlockedRecipes: new Set(), // IDs de recettes débloquées par microchip
  };

  // ─── Init ──────────────────────────────────────────────────
  function init(gameState) {
    _gameState = gameState;
    _load();

    document.addEventListener('keydown', (e) => {
      if (e.code === 'KeyK') toggleChipPanel();
    });

    // Reprendre les décodages en cours
    const now = Date.now();
    for (const d of state.decoding) {
      const remaining = d.finishAt - now;
      if (remaining <= 0) {
        _finishDecoding(d);
      } else {
        setTimeout(() => _finishDecoding(d), remaining);
      }
    }

    console.log('✅ Microchips initialized');
  }

  // ─── Donner un chip (depuis loot) ─────────────────────────
  function giveChip(tier) {
    const def = CHIP_DEFS.find(c => c.tier === tier);
    if (!def) return;
    state.chips.push({ ...def });
    _showNotif(`📟 Microchip trouvé : ${def.name} !`, 'collect');
    render();
    _save();
  }

  // ─── Démarrer le décodage ────────────────────────────────
  function startDecoding(chipIndex) {
    const chip = state.chips[chipIndex];
    if (!chip) return;

    // Déjà en décodage ?
    if (state.decoding.length >= 1) {
      _showNotif('❌ Un décodage est déjà en cours !', 'error');
      return;
    }

    // Retirer le chip de l'inventaire
    state.chips.splice(chipIndex, 1);

    const now      = Date.now();
    const decoding = { chip, startedAt: now, finishAt: now + chip.decodeTime * 1000 };
    state.decoding.push(decoding);

    _showNotif(`🔬 Décodage démarré : ${chip.name} (${chip.decodeTime}s)`, 'info');
    render();
    _save();

    setTimeout(() => _finishDecoding(decoding), chip.decodeTime * 1000);
  }

  // ─── Terminer le décodage ────────────────────────────────
  function _finishDecoding(decoding) {
    const idx = state.decoding.indexOf(decoding);
    if (idx !== -1) state.decoding.splice(idx, 1);

    const chip = decoding.chip;
    // Débloquer une recette aléatoire parmi les candidats
    const candidates = chip.unlocks.filter(id => !state.unlockedRecipes.has(id));
    let unlocked;
    if (candidates.length > 0) {
      unlocked = candidates[Math.floor(Math.random() * candidates.length)];
      state.unlockedRecipes.add(unlocked);
    } else {
      // Tout déjà débloqué : choisir quand même 1
      unlocked = chip.unlocks[Math.floor(Math.random() * chip.unlocks.length)];
    }

    const recipe = typeof RECIPES !== 'undefined' ? RECIPES[unlocked] : null;
    _showNotif(`✅ ${chip.name} décodé ! Blueprint débloqué : ${recipe?.name || unlocked}`, 'stage');
    render();
    _save();

    // Mettre à jour le panneau craft si ouvert
    if (typeof _renderCraftList === 'function') _renderCraftList();
  }

  // ─── Vérifier si une recette est débloquée ────────────────
  function isUnlocked(recipeId) {
    return state.unlockedRecipes.has(recipeId);
  }

  // ─── Panneau ──────────────────────────────────────────────
  function toggleChipPanel() {
    const panel = document.getElementById('chip-panel');
    if (!panel) return;
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) render();
  }

  function render() {
    const panel = document.getElementById('chip-panel');
    if (!panel || panel.classList.contains('hidden')) return;

    // Chips en cours de décodage
    const decodingEl = document.getElementById('chip-decoding');
    if (decodingEl) {
      if (state.decoding.length === 0) {
        decodingEl.innerHTML = '<div class="chip-empty">Aucun décodage en cours</div>';
      } else {
        const d   = state.decoding[0];
        const now = Date.now();
        const pct = Math.min(100, ((now - d.startedAt) / (d.finishAt - d.startedAt)) * 100);
        const rem = Math.max(0, Math.ceil((d.finishAt - now) / 1000));
        decodingEl.innerHTML = `
          <div class="chip-decoding-item">
            <div class="chip-decoding-name">🔬 ${d.chip.name}</div>
            <div class="chip-decode-bar-wrap">
              <div class="chip-decode-bar" style="width:${pct.toFixed(1)}%;background:${d.chip.color}"></div>
            </div>
            <div class="chip-decode-time">${rem}s restantes · ${pct.toFixed(0)}%</div>
          </div>
        `;
      }
    }

    // Chips disponibles
    const chipsEl = document.getElementById('chip-inventory');
    if (chipsEl) {
      if (state.chips.length === 0) {
        chipsEl.innerHTML = '<div class="chip-empty">Aucun microchip trouvé<br><small>Explorez les épaves pour en trouver</small></div>';
      } else {
        chipsEl.innerHTML = state.chips.map((chip, i) => `
          <div class="chip-item" style="border-color:${chip.color}40">
            <div class="chip-icon" style="color:${chip.color}">${chip.icon}</div>
            <div class="chip-info">
              <div class="chip-name">${chip.name}</div>
              <div class="chip-time">⏱ ${chip.decodeTime}s de décodage</div>
              <div class="chip-unlocks">Débloque : ${chip.unlocks.map(id => RECIPES?.[id]?.name || id).join(', ')}</div>
            </div>
            <button class="chip-decode-btn" onclick="Microchips.startDecoding(${i})"
              ${state.decoding.length > 0 ? 'disabled title="Un décodage en cours"' : ''}>
              Décoder
            </button>
          </div>
        `).join('');
      }
    }

    // Blueprints débloqués
    const unlockedEl = document.getElementById('chip-unlocked');
    if (unlockedEl) {
      if (state.unlockedRecipes.size === 0) {
        unlockedEl.innerHTML = '<div class="chip-empty">Aucun blueprint débloqué via microchip</div>';
      } else {
        unlockedEl.innerHTML = [...state.unlockedRecipes].map(id => {
          const r = RECIPES?.[id];
          return `<span class="chip-unlocked-tag">${r?.icon || '📦'} ${r?.name || id}</span>`;
        }).join('');
      }
    }
  }

  // ─── Mise à jour de la barre de décodage (chaque seconde) ─
  function update() {
    if (state.decoding.length > 0) {
      const panel = document.getElementById('chip-panel');
      if (panel && !panel.classList.contains('hidden')) render();
    }
  }

  // ─── Persistance ──────────────────────────────────────────
  function _save() {
    try {
      localStorage.setItem('pc_chips', JSON.stringify({
        chips:          state.chips,
        decoding:       state.decoding.map(d => ({
          chip: d.chip, startedAt: d.startedAt, finishAt: d.finishAt,
        })),
        unlockedRecipes: [...state.unlockedRecipes],
      }));
    } catch(_) {}
  }

  function _load() {
    try {
      const d = JSON.parse(localStorage.getItem('pc_chips') || 'null');
      if (!d) return;
      state.chips           = d.chips || [];
      state.decoding        = d.decoding || [];
      state.unlockedRecipes = new Set(d.unlockedRecipes || []);
    } catch(_) {}
  }

  function _showNotif(msg, type) {
    const notif = document.getElementById('notif');
    if (notif) {
      notif.textContent = msg;
      notif.className   = 'notif-' + type;
      notif.style.opacity = '1';
      clearTimeout(Microchips._t);
      Microchips._t = setTimeout(() => { notif.style.opacity = '0'; }, 4000);
    }
  }

  return {
    init,
    update,
    giveChip,
    startDecoding,
    isUnlocked,
    toggleChipPanel,
    render,
  };

})();
