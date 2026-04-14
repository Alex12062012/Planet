// ============================================================
//  EQUIPMENT  –  Slots d'équipement + effets sur le joueur
//  Slots : head, suit, backpack, boots, jetpack
// ============================================================

const Equipment = (() => {

  // ─── Slots équipés ────────────────────────────────────────
  const equipped = {
    head:     null,   // combinaison / casque
    suit:     null,   // exosquelette
    backpack: null,   // sac à dos
    boots:    null,   // bottes
    jetpack:  null,   // jetpack
  };

  // ─── État jetpack ─────────────────────────────────────────
  const jetpackState = {
    fuel:        100,  // 0–100%
    maxFuel:     100,
    active:      false,
    velY:        0,    // vitesse verticale actuelle
  };

  const JETPACK_ACCEL    = 12;  // m/s²
  const JETPACK_MAX_UP   = 10;  // vitesse montée max
  const JETPACK_FUEL_USE = 15;  // %/s fuel consommé
  const JETPACK_RECHARGE = 5;   // %/s recharge au sol
  const GRAVITY          = -18; // m/s² gravité

  let _playerPos    = null;
  let _getHeightAt  = null;
  let _keys         = {};     // touches actives (partagé avec player.js)
  let _isFlying     = false;
  let _groundY      = 0;
  let _velY         = 0;

  // ─── Init ──────────────────────────────────────────────────
  function init(playerPos, getHeightAt, keys) {
    _playerPos   = playerPos;
    _getHeightAt = getHeightAt;
    _keys        = keys;

    // Charger équipement sauvegardé
    _load();
    _updateEffects();
    _renderEquipmentUI();

    // Raccourci X = ouvrir équipement
    document.addEventListener('keydown', (e) => {
      if (e.code === 'KeyX') toggleEquipmentPanel();
      if (e.code === 'Space' && equipped.jetpack) _activateJetpack(true);
    });
    document.addEventListener('keyup', (e) => {
      if (e.code === 'Space') _activateJetpack(false);
    });

    console.log('✅ Equipment system initialized');
  }

  // ─── Update (jetpack physique) ────────────────────────────
  function update(delta) {
    if (!_playerPos || !_getHeightAt) return;

    const groundY = _getHeightAt(_playerPos.x, _playerPos.z) + 1.7;
    _groundY = groundY;

    if (equipped.jetpack && jetpackState.active) {
      // Mode vol
      _isFlying = true;
      _velY += JETPACK_ACCEL * delta;
      _velY  = Math.min(_velY, JETPACK_MAX_UP);

      // Consommer du carburant
      const fuelRate = jetpackState.maxFuel === -1 ? 0 : JETPACK_FUEL_USE;
      jetpackState.fuel = Math.max(0, jetpackState.fuel - fuelRate * delta);
      if (jetpackState.fuel <= 0) {
        _activateJetpack(false);
        _isFlying = false;
      }
    } else {
      // Gravité
      if (_playerPos.y > groundY + 0.1) {
        _velY += GRAVITY * delta;
        _isFlying = _playerPos.y > groundY + 0.5;
      } else {
        _velY    = 0;
        _isFlying = false;
        // Recharger jetpack au sol
        if (equipped.jetpack) {
          jetpackState.fuel = Math.min(jetpackState.maxFuel === -1 ? 100 : jetpackState.maxFuel,
            jetpackState.fuel + JETPACK_RECHARGE * delta);
        }
      }
    }

    // Appliquer déplacement vertical
    _playerPos.y = Math.max(groundY, _playerPos.y + _velY * delta);

    // Mettre à jour HUD jetpack
    _updateJetpackHUD();
  }

  // ─── Activer / désactiver jetpack ─────────────────────────
  function _activateJetpack(on) {
    if (!equipped.jetpack) return;
    if (on && jetpackState.fuel > 0) {
      jetpackState.active = true;
      _velY = Math.max(_velY, 0); // repartir vers le haut
    } else {
      jetpackState.active = false;
    }
  }

  // ─── Équiper un item ──────────────────────────────────────
  function equip(itemId) {
    const recipe = RECIPES ? RECIPES[itemId] : null;
    if (!recipe || !recipe.slot) {
      _notif('❌ Cet objet ne peut pas être équipé', 'error');
      return false;
    }

    // Vérifier qu'on l'a dans l'inventaire
    const gs = _getGameState();
    if (!gs || (gs.inventory[itemId] || 0) <= 0) {
      _notif('❌ Vous n\'avez pas cet objet', 'error');
      return false;
    }

    const slot = recipe.slot;
    const prevSlot = equipped[slot];

    // Remettre l'ancien dans l'inventaire
    if (prevSlot) {
      gs.inventory[prevSlot] = (gs.inventory[prevSlot] || 0) + 1;
    }

    // Équiper
    equipped[slot] = itemId;
    gs.inventory[itemId] = Math.max(0, (gs.inventory[itemId] || 0) - 1);
    if (gs.inventory[itemId] === 0) delete gs.inventory[itemId];

    // Initialiser le jetpack
    if (slot === 'jetpack') {
      const effect = recipe.effect || {};
      jetpackState.maxFuel = effect.fuelCapacity || 30;
      jetpackState.fuel    = jetpackState.maxFuel === -1 ? 100 : jetpackState.maxFuel;
    }

    _updateEffects();
    _renderEquipmentUI();
    _save();
    _notif(`✅ ${ITEMS?.[itemId]?.icon || ''} ${recipe.name} équipé`, 'success');
    return true;
  }

  // ─── Déséquiper ───────────────────────────────────────────
  function unequip(slot) {
    if (!equipped[slot]) return;
    const gs = _getGameState();
    if (gs) {
      gs.inventory[equipped[slot]] = (gs.inventory[equipped[slot]] || 0) + 1;
    }
    equipped[slot] = null;
    _updateEffects();
    _renderEquipmentUI();
    _save();
  }

  // ─── Calculer les effets cumulés ──────────────────────────
  function _updateEffects() {
    const gs = _getGameState();
    if (!gs) return;

    let inventoryBonus = 0;
    let speedMult      = 1.0;
    let oxygenCap      = 1.0;
    let carryWeight    = 1.0;
    let radProtect     = 0;

    for (const [, itemId] of Object.entries(equipped)) {
      if (!itemId) continue;
      const recipe = RECIPES?.[itemId];
      const effect = recipe?.effect;
      if (!effect) continue;

      if (effect.inventorySlots)   inventoryBonus += effect.inventorySlots;
      if (effect.speedMultiplier)  speedMult       = Math.max(speedMult, effect.speedMultiplier);
      if (effect.oxygenCapacity)   oxygenCap       = Math.max(oxygenCap, effect.oxygenCapacity);
      if (effect.carryWeight)      carryWeight    += effect.carryWeight;
      if (effect.radiationProtect) radProtect      = Math.max(radProtect, effect.radiationProtect);
    }

    // Exposer les effets globaux
    Equipment._effects = {
      inventoryCapacity: 10 + inventoryBonus, // base 10 + bonus
      speedMultiplier:   speedMult,
      oxygenCapacity:    oxygenCap,
      carryWeight:       carryWeight,
      radiationProtect:  radProtect,
      hasJetpack:        !!equipped.jetpack,
    };
  }

  // ─── Getter d'effet ───────────────────────────────────────
  function getEffect(name) {
    return Equipment._effects?.[name] ?? _getDefaultEffect(name);
  }

  function _getDefaultEffect(name) {
    const defaults = {
      inventoryCapacity: 10,
      speedMultiplier:   1.0,
      oxygenCapacity:    1.0,
      carryWeight:       1.0,
      radiationProtect:  0,
      hasJetpack:        false,
    };
    return defaults[name] ?? null;
  }

  // ─── UI Panneau équipement ─────────────────────────────────
  function toggleEquipmentPanel() {
    const panel = document.getElementById('equipment-panel');
    if (!panel) return;
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) _renderEquipmentUI();
  }

  function _renderEquipmentUI() {
    const slots = ['head', 'suit', 'backpack', 'boots', 'jetpack'];
    const slotIcons = {
      head: '🪖', suit: '🥼', backpack: '🎒', boots: '👢', jetpack: '🚀'
    };
    const slotNames = {
      head: 'Casque/Combinaison', suit: 'Armure/Exosquelette',
      backpack: 'Sac à dos', boots: 'Bottes', jetpack: 'Jetpack'
    };

    for (const slot of slots) {
      const slotEl = document.getElementById(`equip-slot-${slot}`);
      if (!slotEl) continue;

      const itemId = equipped[slot];
      const recipe = itemId ? RECIPES?.[itemId] : null;
      const item   = itemId ? ITEMS?.[itemId]   : null;

      slotEl.innerHTML = `
        <div class="equip-slot-icon">${item?.icon || slotIcons[slot]}</div>
        <div class="equip-slot-info">
          <div class="equip-slot-name">${slotNames[slot]}</div>
          <div class="equip-slot-item">${recipe?.name || '<i>Vide</i>'}</div>
          ${recipe?.effect ? `<div class="equip-slot-effect">${_formatEffect(recipe.effect)}</div>` : ''}
        </div>
        ${itemId ? `<button class="equip-remove-btn" onclick="Equipment.unequip('${slot}')">✕</button>` : ''}
      `;
    }

    // Afficher les items équipables depuis l'inventaire
    const gs = _getGameState();
    const equippableList = document.getElementById('equippable-items');
    if (equippableList && gs) {
      equippableList.innerHTML = '';
      const equippable = Object.entries(gs.inventory)
        .filter(([id, qty]) => qty > 0 && RECIPES?.[id]?.slot)
        .map(([id, qty]) => ({ id, qty, recipe: RECIPES[id], item: ITEMS?.[id] }));

      if (equippable.length === 0) {
        equippableList.innerHTML = '<div class="equip-empty">Aucun équipement dans l\'inventaire</div>';
      }
      for (const { id, qty, recipe, item } of equippable) {
        const div = document.createElement('div');
        div.className = 'equippable-item';
        div.innerHTML = `
          <span class="equip-item-icon">${item?.icon || '📦'}</span>
          <span class="equip-item-name">${recipe?.name || id}</span>
          <span class="equip-item-qty">×${qty}</span>
          <button class="equip-btn" onclick="Equipment.equip('${id}')">Équiper</button>
        `;
        equippableList.appendChild(div);
      }
    }

    // Stats globales
    const statsEl = document.getElementById('equip-stats-summary');
    if (statsEl && Equipment._effects) {
      const e = Equipment._effects;
      statsEl.innerHTML = `
        <div class="equip-stat">🎒 Inventaire : <b>${e.inventoryCapacity} slots</b></div>
        <div class="equip-stat">🏃 Vitesse : <b>×${e.speedMultiplier.toFixed(1)}</b></div>
        <div class="equip-stat">🫁 O2 capacité : <b>×${e.oxygenCapacity.toFixed(1)}</b></div>
        <div class="equip-stat">💪 Charge : <b>×${e.carryWeight.toFixed(1)}</b></div>
        <div class="equip-stat">☢️ Radiation protect : <b>${e.radiationProtect}%</b></div>
        ${e.hasJetpack ? '<div class="equip-stat">🚀 Vol activé</div>' : ''}
      `;
    }
  }

  function _formatEffect(effect) {
    const parts = [];
    if (effect.inventorySlots)   parts.push(`+${effect.inventorySlots} slots`);
    if (effect.speedMultiplier)  parts.push(`×${effect.speedMultiplier} vitesse`);
    if (effect.oxygenCapacity)   parts.push(`×${effect.oxygenCapacity} O2`);
    if (effect.carryWeight)      parts.push(`+${effect.carryWeight} charge`);
    if (effect.radiationProtect) parts.push(`${effect.radiationProtect}% rad. prot.`);
    if (effect.flight)           parts.push('Vol');
    if (effect.fuelCapacity === -1) parts.push('Carburant ∞');
    else if (effect.fuelCapacity) parts.push(`${effect.fuelCapacity}s vol`);
    return parts.join(' · ');
  }

  // ─── Jetpack HUD ──────────────────────────────────────────
  function _updateJetpackHUD() {
    const jp = document.getElementById('jetpack-hud');
    if (!jp) return;

    if (!equipped.jetpack) {
      jp.style.display = 'none';
      return;
    }

    jp.style.display = 'flex';
    const fuelPct  = jetpackState.maxFuel === -1 ? 100 : (jetpackState.fuel / jetpackState.maxFuel) * 100;
    const fuelBar  = document.getElementById('jetpack-fuel-bar');
    const fuelTxt  = document.getElementById('jetpack-fuel-val');
    const flyingEl = document.getElementById('jetpack-status');

    if (fuelBar) fuelBar.style.width = fuelPct.toFixed(1) + '%';
    if (fuelTxt) fuelTxt.textContent = jetpackState.maxFuel === -1 ? '∞' : Math.floor(fuelPct) + '%';
    if (flyingEl) flyingEl.textContent = jetpackState.active ? '🚀 Vol' : (_isFlying ? '↘ Chute' : '✅ Sol');
  }

  // ─── Helpers ──────────────────────────────────────────────
  function _getGameState() {
    return typeof gameState !== 'undefined' ? gameState : null;
  }

  function _notif(msg, type) {
    const notif = document.getElementById('notif');
    if (notif) {
      notif.textContent = msg;
      notif.className = 'notif-' + type;
      notif.style.opacity = '1';
      clearTimeout(Equipment._notifTimer);
      Equipment._notifTimer = setTimeout(() => { notif.style.opacity = '0'; }, 3000);
    }
  }

  // ─── Persistance ──────────────────────────────────────────
  function _save() {
    try {
      localStorage.setItem('pc_equipment', JSON.stringify(equipped));
    } catch(_) {}
  }

  function _load() {
    try {
      const d = JSON.parse(localStorage.getItem('pc_equipment') || 'null');
      if (d) {
        for (const [slot, itemId] of Object.entries(d)) {
          if (slot in equipped) equipped[slot] = itemId;
        }
        // Initialiser jetpack si équipé
        if (equipped.jetpack) {
          const recipe = RECIPES?.[equipped.jetpack];
          const effect = recipe?.effect || {};
          jetpackState.maxFuel = effect.fuelCapacity || 30;
          jetpackState.fuel    = jetpackState.maxFuel === -1 ? 100 : jetpackState.maxFuel;
        }
      }
    } catch(_) {}
  }

  // ─── Effets par défaut ────────────────────────────────────
  Equipment._effects = {
    inventoryCapacity: 10,
    speedMultiplier:   1.0,
    oxygenCapacity:    1.0,
    carryWeight:       1.0,
    radiationProtect:  0,
    hasJetpack:        false,
  };

  return {
    init,
    update,
    equip,
    unequip,
    getEffect,
    toggleEquipmentPanel,
    getEquipped: () => ({ ...equipped }),
    getJetpackState: () => ({ ...jetpackState }),
    isFlying: () => _isFlying,
    _effects: Equipment._effects,
  };

})();
