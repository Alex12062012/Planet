// ============================================================
//  DNA / INCUBATION  –  Élevage papillons, poissons, grenouilles
//  Touche G = ouvrir le panneau DNA
// ============================================================

const DNALab = (() => {

  let _gameState = null;

  // ─── Recettes d'incubation ────────────────────────────────
  const INCUBATION_RECIPES = {
    // ── Papillons ──
    butterfly_larvae_common: {
      name: 'Larve de Papillon commune', icon: '🦋',
      category: 'butterfly',
      ingredients: { bacteria: 5, animal_food_t1: 2 },
      incubationTime: 60,
      output: { item: 'butterfly_larvae_common', qty: 2 },
      unlockBiomass: 0,
    },
    butterfly_clema: {
      name: 'Papillon Clema', icon: '🦋',
      category: 'butterfly',
      ingredients: { mutagen_t1: 1, phyto_a: 2, animal_food_t1: 3 },
      incubationTime: 120,
      output: { item: 'butterfly_clema', qty: 1 },
      unlockBiomass: 865,
    },
    butterfly_serena: {
      name: 'Papillon Serena', icon: '🦋',
      category: 'butterfly',
      ingredients: { mutagen_t2: 1, phyto_b: 2, animal_food_t2: 2 },
      incubationTime: 180,
      output: { item: 'butterfly_serena', qty: 1 },
      unlockInsects: 500,
    },
    butterfly_rare: {
      name: 'Papillon Rare (Aléatoire)', icon: '✨🦋',
      category: 'butterfly',
      ingredients: { mutagen_t3: 1, phyto_c: 3, animal_food_t3: 2, honey: 1 },
      incubationTime: 300,
      output: { item: '__random_butterfly__', qty: 1 },
      unlockInsects: 5000,
    },

    // ── Poissons ──
    fish_ulani: {
      name: 'Poisson Ulani', icon: '🐟',
      category: 'fish',
      ingredients: { phyto_a: 3, animal_food_t1: 2, ice: 5 },
      incubationTime: 90,
      output: { item: 'fish_ulani', qty: 1 },
      unlockAnimals: 50,
    },
    fish_sneepa: {
      name: 'Poisson Sneepa', icon: '🐠',
      category: 'fish',
      ingredients: { phyto_b: 2, animal_food_t2: 2, mutagen_t1: 1 },
      incubationTime: 150,
      output: { item: 'fish_sneepa', qty: 1 },
      unlockAnimals: 500,
    },
    fish_rare: {
      name: 'Poisson Rare (Aléatoire)', icon: '✨🐠',
      category: 'fish',
      ingredients: { phyto_c: 3, animal_food_t3: 3, mutagen_t2: 1, algae: 5 },
      incubationTime: 240,
      output: { item: '__random_fish__', qty: 1 },
      unlockAnimals: 5000,
    },

    // ── Grenouilles ──
    frog_common: {
      name: 'Grenouille commune', icon: '🐸',
      category: 'frog',
      ingredients: { phyto_a: 2, animal_food_t1: 3, bacteria: 5 },
      incubationTime: 90,
      output: { item: 'frog_common', qty: 1 },
      unlockAnimals: 50,
    },
    frog_toxifia: {
      name: 'Grenouille Toxifia', icon: '🐸',
      category: 'frog',
      ingredients: { mutagen_t2: 1, phyto_b: 3, animal_food_t2: 2 },
      incubationTime: 200,
      output: { item: 'frog_toxifia', qty: 1 },
      unlockAnimals: 2000,
    },
    frog_rare: {
      name: 'Grenouille Rare (Aléatoire)', icon: '✨🐸',
      category: 'frog',
      ingredients: { mutagen_t3: 2, phyto_c: 3, animal_food_t3: 3, mutagen_t4: 1 },
      incubationTime: 360,
      output: { item: '__random_frog__', qty: 1 },
      unlockAnimals: 10000,
    },
  };

  // ─── État ─────────────────────────────────────────────────
  const state = {
    slots: [null, null, null], // 3 slots d'incubation simultanés
    // slot: { recipeId, startedAt, finishAt }
  };

  // ─── Init ──────────────────────────────────────────────────
  function init(gameState) {
    _gameState = gameState;
    _load();

    document.addEventListener('keydown', (e) => {
      if (e.code === 'KeyG') toggleDNAPanel();
    });

    // Reprendre les incubations en cours
    const now = Date.now();
    for (let i = 0; i < state.slots.length; i++) {
      const slot = state.slots[i];
      if (!slot) continue;
      const remaining = slot.finishAt - now;
      if (remaining <= 0) {
        _finishIncubation(i);
      } else {
        const idx = i;
        setTimeout(() => _finishIncubation(idx), remaining);
      }
    }

    console.log('✅ DNA Lab initialized');
  }

  // ─── Démarrer une incubation ──────────────────────────────
  function startIncubation(recipeId, slotIndex) {
    const recipe = INCUBATION_RECIPES[recipeId];
    if (!recipe || !_gameState) return;

    // Vérifier slot libre
    if (state.slots[slotIndex]) {
      _showNotif('❌ Ce slot est déjà occupé', 'error');
      return;
    }

    // Vérifier déverrouillage
    if (recipe.unlockBiomass  && (_gameState.biomass         || 0) < recipe.unlockBiomass)  { _showNotif('🔒 Biomasse insuffisante', 'error'); return; }
    if (recipe.unlockInsects  && (_gameState.biomassInsects  || 0) < recipe.unlockInsects)  { _showNotif('🔒 Biomasse insectes insuffisante', 'error'); return; }
    if (recipe.unlockAnimals  && (_gameState.biomassAnimals  || 0) < recipe.unlockAnimals)  { _showNotif('🔒 Biomasse animaux insuffisante', 'error'); return; }

    // Vérifier ingrédients
    for (const [item, qty] of Object.entries(recipe.ingredients)) {
      if ((_gameState.inventory[item] || 0) < qty) {
        const itm = ITEMS?.[item];
        _showNotif(`❌ Manque ${itm?.name || item} ×${qty}`, 'error');
        return;
      }
    }

    // Consommer les ingrédients
    for (const [item, qty] of Object.entries(recipe.ingredients)) {
      _gameState.inventory[item] -= qty;
      if (_gameState.inventory[item] <= 0) delete _gameState.inventory[item];
    }

    const now = Date.now();
    state.slots[slotIndex] = {
      recipeId,
      startedAt: now,
      finishAt:  now + recipe.incubationTime * 1000,
    };

    _showNotif(`🧬 Incubation démarrée : ${recipe.icon} ${recipe.name}`, 'info');
    render();
    _save();

    setTimeout(() => _finishIncubation(slotIndex), recipe.incubationTime * 1000);
  }

  // ─── Terminer une incubation ──────────────────────────────
  function _finishIncubation(slotIndex) {
    const slot = state.slots[slotIndex];
    if (!slot || !_gameState) return;

    const recipe = INCUBATION_RECIPES[slot.recipeId];
    if (!recipe) { state.slots[slotIndex] = null; return; }

    state.slots[slotIndex] = null;

    // Résoudre l'output aléatoire
    let outputId  = recipe.output.item;
    let outputQty = recipe.output.qty || 1;

    if (outputId === '__random_butterfly__') {
      const pool = ['butterfly_clema','butterfly_serena','butterfly_nica','butterfly_tenta','butterfly_umbra'];
      outputId = pool[Math.floor(Math.random() * pool.length)];
    } else if (outputId === '__random_fish__') {
      const pool = ['fish_ulani','fish_sneepa','fish_aela','fish_guppy','fish_barb'];
      outputId = pool[Math.floor(Math.random() * pool.length)];
    } else if (outputId === '__random_frog__') {
      const pool = ['frog_common','frog_toxifia','frog_trajuu','frog_canaria'];
      outputId = pool[Math.floor(Math.random() * pool.length)];
    }

    _gameState.inventory[outputId] = (_gameState.inventory[outputId] || 0) + outputQty;

    // Bonus biomasse
    const biomassBonus = { butterfly: 'biomassInsects', fish: 'biomassAnimals', frog: 'biomassAnimals' };
    const target = biomassBonus[recipe.category];
    if (target && _gameState[target] !== undefined) {
      _gameState[target] = Math.min(100, (_gameState[target] || 0) + 0.5);
    }

    const item = ITEMS?.[outputId];
    _showNotif(`✅ Incubation terminée ! ${item?.icon || recipe.icon} ${item?.name || outputId} obtenu !`, 'stage');
    render();
    _save();
  }

  // ─── Panneau DNA ──────────────────────────────────────────
  function toggleDNAPanel() {
    const panel = document.getElementById('dna-panel');
    if (!panel) return;
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) render();
  }

  function render() {
    const panel = document.getElementById('dna-panel');
    if (!panel || panel.classList.contains('hidden')) return;

    // Slots d'incubation
    for (let i = 0; i < 3; i++) {
      _renderSlot(i);
    }

    // Liste des recettes disponibles
    const listEl = document.getElementById('dna-recipes');
    if (!listEl) return;
    listEl.innerHTML = '';

    const categories = ['butterfly', 'fish', 'frog'];
    const catLabels  = { butterfly: '🦋 Papillons', fish: '🐠 Poissons', frog: '🐸 Grenouilles' };

    for (const cat of categories) {
      const header = document.createElement('div');
      header.className = 'dna-cat-header';
      header.textContent = catLabels[cat];
      listEl.appendChild(header);

      for (const [recipeId, recipe] of Object.entries(INCUBATION_RECIPES)) {
        if (recipe.category !== cat) continue;

        // Vérifier déverrouillage
        let locked = false;
        if (recipe.unlockBiomass && (_gameState?.biomass || 0) < recipe.unlockBiomass) locked = true;
        if (recipe.unlockInsects && (_gameState?.biomassInsects || 0) < recipe.unlockInsects) locked = true;
        if (recipe.unlockAnimals && (_gameState?.biomassAnimals || 0) < recipe.unlockAnimals) locked = true;

        const canAfford = !locked && Object.entries(recipe.ingredients).every(
          ([item, qty]) => (_gameState?.inventory[item] || 0) >= qty
        );

        const costStr = Object.entries(recipe.ingredients).map(([item, qty]) => {
          const have = _gameState?.inventory[item] || 0;
          const ok   = have >= qty;
          const itm  = ITEMS?.[item];
          return `<span class="${ok ? 'cost-ok' : 'cost-nok'}">${itm?.icon || '📦'}${itm?.name || item} ×${qty}</span>`;
        }).join(' ');

        const div = document.createElement('div');
        div.className = `dna-recipe${locked ? ' dna-locked' : ''}${!canAfford && !locked ? ' dna-no-items' : ''}`;
        div.innerHTML = `
          <div class="dna-icon">${recipe.icon}</div>
          <div class="dna-info">
            <div class="dna-name">${recipe.name}</div>
            <div class="dna-cost">${locked ? '🔒 Déverrou requis' : costStr}</div>
            <div class="dna-time">⏱ ${recipe.incubationTime}s</div>
          </div>
          <div class="dna-slot-btns">
            ${[0,1,2].map(si => `
              <button class="dna-start-btn" onclick="DNALab.startIncubation('${recipeId}', ${si})"
                title="Slot ${si+1}" ${locked || !canAfford || state.slots[si] ? 'disabled' : ''}>S${si+1}</button>
            `).join('')}
          </div>
        `;
        listEl.appendChild(div);
      }
    }
  }

  function _renderSlot(i) {
    const slotEl = document.getElementById(`dna-slot-${i}`);
    if (!slotEl) return;

    const slot = state.slots[i];
    if (!slot) {
      slotEl.innerHTML = `<div class="dna-slot-empty">Slot ${i+1} — Libre</div>`;
      return;
    }

    const recipe  = INCUBATION_RECIPES[slot.recipeId];
    const now     = Date.now();
    const pct     = Math.min(100, ((now - slot.startedAt) / (slot.finishAt - slot.startedAt)) * 100);
    const rem     = Math.max(0, Math.ceil((slot.finishAt - now) / 1000));

    slotEl.innerHTML = `
      <div class="dna-slot-active">
        <div class="dna-slot-name">${recipe?.icon || '🧬'} ${recipe?.name || 'Incubation'}</div>
        <div class="dna-slot-bar-wrap">
          <div class="dna-slot-bar" style="width:${pct.toFixed(1)}%"></div>
        </div>
        <div class="dna-slot-time">${rem}s · ${pct.toFixed(0)}%</div>
      </div>
    `;
  }

  // ─── Update (barre de progression) ───────────────────────
  function update() {
    const hasActive = state.slots.some(s => s !== null);
    if (!hasActive) return;

    const panel = document.getElementById('dna-panel');
    if (panel && !panel.classList.contains('hidden')) {
      for (let i = 0; i < 3; i++) _renderSlot(i);
    }
  }

  // ─── Persistance ──────────────────────────────────────────
  function _save() {
    try { localStorage.setItem('pc_dna', JSON.stringify(state)); } catch(_) {}
  }

  function _load() {
    try {
      const d = JSON.parse(localStorage.getItem('pc_dna') || 'null');
      if (d?.slots) state.slots = d.slots;
    } catch(_) {}
  }

  function _showNotif(msg, type) {
    const notif = document.getElementById('notif');
    if (notif) {
      notif.textContent = msg;
      notif.className   = 'notif-' + type;
      notif.style.opacity = '1';
      clearTimeout(DNALab._t);
      DNALab._t = setTimeout(() => { notif.style.opacity = '0'; }, 4000);
    }
  }

  return { init, update, startIncubation, toggleDNAPanel, render };

})();
