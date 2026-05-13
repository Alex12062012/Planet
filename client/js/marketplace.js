// ============================================================
//  MARKETPLACE  –  Terra Tokens + Commerce spatial
//  Touche T = ouvrir le marché
// ============================================================

const Marketplace = (() => {

  let _gameState = null;

  // ─── Catalogue du marché ──────────────────────────────────
  const SHOP_ITEMS = [
    // Blueprints premium (Terra Tokens only)
    { id: 'bp_machine_optimizer_t1', name: 'Blueprint : Machine Optimizer T1', icon: '⚙️',  price: 400,   category: 'blueprint', unlockTi: 0         },
    { id: 'bp_machine_optimizer_t2', name: 'Blueprint : Machine Optimizer T2', icon: '⚙️',  price: 1200,  category: 'blueprint', unlockTi: 875000    },
    { id: 'bp_ore_extractor_t2',     name: 'Blueprint : Extracteur T2',        icon: '⛏️',  price: 600,   category: 'blueprint', unlockTi: 175000    },
    { id: 'bp_ore_extractor_t3',     name: 'Blueprint : Extracteur T3',        icon: '⛏️',  price: 2000,  category: 'blueprint', unlockTi: 3000000   },
    { id: 'bp_biodome_t1',           name: 'Blueprint : Biodôme T1',           icon: '🌐',  price: 800,   category: 'blueprint', unlockTi: 875000    },
    { id: 'bp_biodome_t2',           name: 'Blueprint : Biodôme T2',           icon: '🌐',  price: 3000,  category: 'blueprint', unlockTi: 8000000   },
    { id: 'bp_fusion_generator',     name: 'Blueprint : Générateur Fusion',    icon: '⚡',  price: 10000, category: 'blueprint', unlockTi: 2000000000},
    { id: 'bp_nuclear_t2',           name: 'Blueprint : Nucléaire T2',         icon: '☢️',  price: 5000,  category: 'blueprint', unlockTi: 700000000 },
    { id: 'bp_jetpack_t3',           name: 'Blueprint : Jetpack T3',           icon: '🚀',  price: 8000,  category: 'blueprint', unlockTi: 0         },
    { id: 'bp_jetpack_t4',           name: 'Blueprint : Jetpack T4',           icon: '🚀',  price: 25000, category: 'blueprint', unlockTi: 0         },
    // Ressources rares
    { id: 'iridium',      name: 'Iridium ×5',         icon: '💜', price: 200,  category: 'resource', qty: 5  },
    { id: 'osmium',       name: 'Osmium ×3',          icon: '🟣', price: 350,  category: 'resource', qty: 3  },
    { id: 'uranium',      name: 'Uranium ×3',          icon: '☢️', price: 300,  category: 'resource', qty: 3  },
    { id: 'tungsten',     name: 'Tungstène ×5',        icon: '🔩', price: 180,  category: 'resource', qty: 5  },
    { id: 'super_alloy',  name: 'Super Alliage ×5',   icon: '✨', price: 250,  category: 'resource', qty: 5  },
    { id: 'zeolite',      name: 'Zéolite ×10',        icon: '🔮', price: 120,  category: 'resource', qty: 10 },
    { id: 'circuit_board',name: 'Circuit élec. ×3',   icon: '📟', price: 400,  category: 'resource', qty: 3  },
    // Consommables
    { id: 'medkit_t2',    name: 'Trousse médicale T2', icon: '💉', price: 150,  category: 'consumable', qty: 1 },
    { id: 'water_bottle_t2', name: 'Eau purifiée ×5', icon: '🫗', price: 80,   category: 'consumable', qty: 5 },
    { id: 'nutrient_bar_t2', name: 'Barre nutritive T2 ×5', icon: '🍱', price: 100, category: 'consumable', qty: 5 },
  ];

  // ─── Ventes : envoyer des items → Terra Tokens ─────────────
  const SELL_RATES = {
    iron:        2,   aluminum:    2,   cobalt:      5,
    iridium:     40,  osmium:      60,  uranium:     55,
    tungsten:    35,  super_alloy: 50,  silicon:     8,
    titanium:    12,  magnesium:   6,   phosphorus:  7,
    selenium:    8,   zeolite:     15,  obsidian:    10,
    circuit_board: 80, fusion_cell: 200, rocket_engine: 100,
    silk:        25,  honey:       20,  bioplastic:  10,
  };

  // ─── Init ──────────────────────────────────────────────────
  function init(gameState) {
    _gameState = gameState;
    _load();
    updateHUD();

    document.addEventListener('keydown', (e) => {
      if (e.code === 'KeyT') toggleMarketPanel();
    });

    console.log('✅ Marketplace initialized');
  }

  // ─── Ouvrir/fermer ────────────────────────────────────────
  function toggleMarketPanel() {
    const panel = document.getElementById('market-panel');
    if (!panel) return;
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) render();
  }

  // ─── Acheter ──────────────────────────────────────────────
  function buy(shopItemId) {
    const item = SHOP_ITEMS.find(i => i.id === shopItemId);
    if (!item || !_gameState) return;

    if ((_gameState.terraTokens || 0) < item.price) {
      _showNotif(`❌ Pas assez de Terra Tokens (${item.price} requis)`, 'error');
      return;
    }

    // Vérifier Ti requis
    if (item.unlockTi && _gameState.ti < item.unlockTi) {
      _showNotif(`🔒 Nécessite ${formatTi(item.unlockTi)}`, 'error');
      return;
    }

    _gameState.terraTokens -= item.price;

    if (item.category === 'blueprint') {
      // Ajouter aux blueprints achetés
      _gameState.purchasedBlueprints = _gameState.purchasedBlueprints || [];
      if (!_gameState.purchasedBlueprints.includes(shopItemId)) {
        _gameState.purchasedBlueprints.push(shopItemId);
      }
      _showNotif(`✅ ${item.icon} ${item.name} acheté !`, 'success');
    } else {
      // Ajouter à l'inventaire
      const qty = item.qty || 1;
      _gameState.inventory[item.id] = (_gameState.inventory[item.id] || 0) + qty;
      _showNotif(`✅ ${item.icon} ${item.name} acheté ! +${qty}`, 'collect');
    }

    updateHUD();
    render();
    _save();
  }

  // ─── Vendre ───────────────────────────────────────────────
  function sell(itemId, qty) {
    if (!_gameState) return;
    const rate = SELL_RATES[itemId];
    if (!rate) {
      _showNotif('❌ Cet item ne peut pas être vendu', 'error');
      return;
    }

    const available = _gameState.inventory[itemId] || 0;
    const toSell    = Math.min(qty, available);
    if (toSell <= 0) {
      _showNotif('❌ Pas de stock disponible', 'error');
      return;
    }

    const earned = toSell * rate;
    _gameState.inventory[itemId] -= toSell;
    if (_gameState.inventory[itemId] <= 0) delete _gameState.inventory[itemId];
    _gameState.terraTokens = (_gameState.terraTokens || 0) + earned;

    const itm = ITEMS?.[itemId];
    _showNotif(`💹 Vendu ${toSell}× ${itm?.icon || ''} ${itm?.name || itemId} → +${earned} TT`, 'collect');

    updateHUD();
    render();
    _save();
  }

  // ─── Rendre le panneau ────────────────────────────────────
  function render() {
    const panel = document.getElementById('market-panel');
    if (!panel) return;

    const tabs = ['blueprint', 'resource', 'consumable'];
    const activeTab = panel._activeTab || 'resource';

    // Onglets
    const tabsEl = document.getElementById('market-tabs');
    if (tabsEl) {
      tabsEl.innerHTML = tabs.map(t => `
        <button class="market-tab${activeTab === t ? ' active' : ''}"
          onclick="Marketplace._setTab('${t}')">${_tabLabel(t)}</button>
      `).join('');
    }

    // Liste des items achetables
    const listEl = document.getElementById('market-buy-list');
    if (listEl) {
      const items = SHOP_ITEMS.filter(i => i.category === activeTab);
      listEl.innerHTML = '';
      for (const item of items) {
        const affordable = (_gameState?.terraTokens || 0) >= item.price;
        const locked     = item.unlockTi && (_gameState?.ti || 0) < item.unlockTi;
        const div = document.createElement('div');
        div.className = `market-item${locked ? ' market-locked' : ''}${!affordable && !locked ? ' market-no-gold' : ''}`;
        div.innerHTML = `
          <span class="market-icon">${item.icon}</span>
          <div class="market-item-info">
            <div class="market-item-name">${item.name}</div>
            ${locked ? `<div class="market-item-req">🔒 ${formatTi(item.unlockTi)}</div>` : ''}
          </div>
          <div class="market-price">💎 ${item.price}</div>
          <button class="market-buy-btn" onclick="Marketplace.buy('${item.id}')" ${locked || !affordable ? 'disabled' : ''}>Acheter</button>
        `;
        listEl.appendChild(div);
      }
    }

    // Liste de vente
    const sellEl = document.getElementById('market-sell-list');
    if (sellEl) {
      sellEl.innerHTML = '';
      for (const [itemId, rate] of Object.entries(SELL_RATES)) {
        const have = _gameState?.inventory[itemId] || 0;
        if (have <= 0) continue;
        const itm = ITEMS?.[itemId];
        const div = document.createElement('div');
        div.className = 'market-sell-item';
        div.innerHTML = `
          <span class="market-icon">${itm?.icon || '📦'}</span>
          <div class="market-item-info">
            <div class="market-item-name">${itm?.name || itemId}</div>
            <div class="market-stock">En stock : ${have}</div>
          </div>
          <div class="market-rate">${rate} TT/u</div>
          <button class="market-sell-btn" onclick="Marketplace.sell('${itemId}', 1)">Vendre 1</button>
          <button class="market-sell-btn" onclick="Marketplace.sell('${itemId}', ${have})">Tout</button>
        `;
        sellEl.appendChild(div);
      }
      if (sellEl.children.length === 0) {
        sellEl.innerHTML = '<div class="market-empty">Aucun item vendable en stock</div>';
      }
    }
  }

  function _setTab(tab) {
    const panel = document.getElementById('market-panel');
    if (panel) panel._activeTab = tab;
    render();
  }

  function _tabLabel(t) {
    return { blueprint: '📋 Blueprints', resource: '💎 Ressources', consumable: '🍶 Consommables' }[t] || t;
  }

  // ─── HUD Terra Tokens ─────────────────────────────────────
  function updateHUD() {
    const el = document.getElementById('hud-tokens');
    if (el) el.textContent = ((_gameState?.terraTokens || 0)).toLocaleString() + ' TT';
  }

  // ─── Persistance ──────────────────────────────────────────
  function _save() {
    try {
      localStorage.setItem('pc_tokens',   JSON.stringify(_gameState?.terraTokens || 0));
      localStorage.setItem('pc_bp_bought', JSON.stringify(_gameState?.purchasedBlueprints || []));
    } catch(_) {}
  }

  function _load() {
    try {
      const tokens = localStorage.getItem('pc_tokens');
      if (tokens && _gameState) _gameState.terraTokens = parseInt(tokens) || 0;
      const bought = localStorage.getItem('pc_bp_bought');
      if (bought && _gameState) _gameState.purchasedBlueprints = JSON.parse(bought) || [];
    } catch(_) {}
  }

  function _showNotif(msg, type) {
    const notif = document.getElementById('notif');
    if (notif) {
      notif.textContent = msg;
      notif.className   = 'notif-' + type;
      notif.style.opacity = '1';
      clearTimeout(Marketplace._t);
      Marketplace._t = setTimeout(() => { notif.style.opacity = '0'; }, 3500);
    }
  }

  return {
    init,
    toggleMarketPanel,
    buy,
    sell,
    updateHUD,
    render,
    _setTab,
    getSellRates: () => SELL_RATES,
  };

})();
