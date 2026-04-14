// ============================================================
//  EVENTS DATA  –  Événements météo & météorites
//  Source : wiki officiel – The Planet Crafter
// ============================================================

// ─── Événements météorites ────────────────────────────────────
const METEOR_EVENTS = [
  {
    id: 'rock_meteor',
    name: 'Pluie de météorites',
    nameFr: 'Pluie de météorites',
    icon: '☄️',
    type: 'meteor',
    unlockTi: 0,
    skyColor: 0xff2200,
    drops: ['iron', 'cobalt', 'magnesium', 'silicon', 'titanium', 'aluminum'],
    dropQty: { min: 3, max: 8 },
    description: 'La première pluie de météorites, disponible dès le début. Le ciel devient rouge.',
    triggered: false,  // déclenché automatiquement (aléatoire)
  },
  {
    id: 'iridium_shower',
    name: 'Pluie d\'Iridium',
    nameFr: 'Pluie d\'Iridium',
    icon: '💜',
    type: 'meteor',
    unlockTi: 345e3,
    skyColor: 0xffcc00,
    drops: ['iridium'],
    dropQty: { min: 3, max: 6 },
    description: 'Déclenchée par la fusée Champ magnétique. Le ciel vire au jaune, météorites à traînées rouges.',
    triggered: true,  // déclenché par une fusée
    triggerRocket: 'magnetic_field',
  },
  {
    id: 'uranium_shower',
    name: 'Pluie d\'Uranium',
    nameFr: 'Pluie d\'Uranium',
    icon: '☢️',
    type: 'meteor',
    unlockTi: 345e3,
    skyColor: 0xffcc00,
    drops: ['uranium'],
    dropQty: { min: 3, max: 6 },
    description: 'Déclenchée par la fusée Attraction d\'astéroïdes. Traînées vertes.',
    triggered: true,
    triggerRocket: 'asteroid_attraction',
  },
  {
    id: 'super_alloy_storm',
    name: 'Tempête de Super Alliage',
    nameFr: 'Tempête de Super Alliage',
    icon: '✨',
    type: 'meteor',
    unlockTi: 200e6,
    skyColor: 0x330066,
    drops: ['super_alloy'],
    dropQty: { min: 8, max: 20 },
    description: 'Nombreuses météorites avec lueur violette. Ciel violet foncé. Disparaissent vite !',
    triggered: false,
  },
  {
    id: 'osmium_shower',
    name: 'Pluie d\'Osmium',
    nameFr: 'Pluie d\'Osmium',
    icon: '🔵',
    type: 'meteor',
    unlockTi: 700e6,
    skyColor: 0x0000bb,
    drops: ['osmium', 'sulfur'],
    dropQty: { min: 2, max: 5 },
    description: 'Peu de météorites bleues à traînées sombres. La planète brille d\'un bleu vif.',
    triggered: false,
  },
  {
    id: 'pulsar_meteor',
    name: 'Météorite Pulsar',
    nameFr: 'Météorite Pulsar',
    icon: '💫',
    type: 'meteor',
    unlockTi: 8e9,
    skyColor: 0x4466ff,
    fogColor: 0xff88cc,
    drops: ['pulsar_quartz'],
    dropQty: { min: 8, max: 12 },
    description: 'Unique immense météorite violette, lente et bruyante. Laisse ~10 quartz pulsar.',
    triggered: false,
  },
];

// ─── Événements environnementaux ─────────────────────────────
const ENVIRONMENT_EVENTS = [
  {
    id: 'night',
    name: 'Nuit',
    nameFr: 'Nuit',
    icon: '🌙',
    type: 'environment',
    unlockTi: 0,
    skyColor: 0x000011,
    fogColor: 0x000022,
    description: 'Le ciel s\'assombrit. Purement esthétique, n\'affecte pas la production solaire.',
    triggered: false,
    duration: 120,  // secondes (plus courte que le jour)
  },
  {
    id: 'solar_flare',
    name: 'Éruption solaire',
    nameFr: 'Éruption solaire',
    icon: '☀️',
    type: 'environment',
    unlockTi: 0,
    skyColor: 0xffdd00,
    fogColor: 0xffaa00,
    description: 'Ciel jaune, lunes blanches, brouillard et bruit de vent.',
    triggered: false,
    duration: 180,
  },
  {
    id: 'solar_eclipse',
    name: 'Éclipse solaire',
    nameFr: 'Éclipse solaire',
    icon: '🌑',
    type: 'environment',
    unlockTi: 175e3,
    skyColor: 0xcc9900,
    fogColor: 0xaa7700,
    description: 'Ciel plus sombre, lunes noires, brouillard épais.',
    triggered: false,
    duration: 200,
  },
  {
    id: 'sandstorm',
    name: 'Tempête de sable',
    nameFr: 'Tempête de sable',
    icon: '🌪️',
    type: 'environment',
    unlockTi: 350e3,
    skyColor: 0xff6600,
    fogColor: 0xdd5500,
    description: 'Ciel orange vif, bruit de vent intense, visibilité réduite.',
    triggered: false,
    duration: 240,
  },
  {
    id: 'rain',
    name: 'Pluie',
    nameFr: 'Pluie',
    icon: '🌧️',
    type: 'environment',
    unlockTi: 350e3,
    skyColor: 0x4466aa,
    fogColor: 0x3355aa,
    description: 'Gouttes d\'eau, sol brillant, ciel légèrement assombri.',
    triggered: false,
    duration: 300,
  },
  {
    id: 'rainstorm',
    name: 'Tempête de pluie',
    nameFr: 'Tempête de pluie',
    icon: '⛈️',
    type: 'environment',
    unlockTi: 875e3,
    skyColor: 0x334455,
    fogColor: 0x222233,
    description: 'Pluie intense, visibilité très réduite, ciel gris foncé nuageux.',
    triggered: false,
    duration: 360,
  },
  {
    id: 'green_storm',
    name: 'Tempête verte',
    nameFr: 'Tempête verte',
    icon: '🌿',
    type: 'environment',
    unlockTi: 650e6,
    unlockBiomass: 175000,
    skyColor: 0x228833,
    fogColor: 0x114422,
    description: 'Ciel verdâtre, brouillard vert brillant et particules vertes. Déclenchée par fusée.',
    triggered: true,
    triggerRocket: ['plant_rocket', 'seed_spreader'],
    duration: 300,
  },
  {
    id: 'purple_eclipse',
    name: 'Éclipse violette',
    nameFr: 'Éclipse violette',
    icon: '🟣',
    type: 'environment',
    unlockTi: 700e6,
    skyColor: 0xaa00ff,
    fogColor: 0x880088,
    description: 'Ciel violet vif, lunes noires, bruit de vent.',
    triggered: false,
    duration: 220,
  },
];

// ─── Tous les événements combinés ────────────────────────────
const ALL_EVENTS = [...METEOR_EVENTS, ...ENVIRONMENT_EVENTS];

// ─── Système d'événements aléatoires ─────────────────────────
const EventSystem = {
  _rollInterval: 20000,    // ms : vérification toutes les 20 secondes
  _rollChance: 0.02,       // 2% de chance par vérification
  _activeEvent: null,
  _eventTimer: null,
  _timerHandle: null,
  _onEventStart: null,     // callback(event)
  _onEventEnd: null,       // callback()

  init(currentTi, onStart, onEnd) {
    this._onEventStart = onStart;
    this._onEventEnd   = onEnd;
    this._timerHandle  = setInterval(() => this._roll(currentTi), this._rollInterval);
  },

  updateTi(ti) {
    this._currentTi = ti;
  },

  _roll(ti) {
    if (this._activeEvent) return;  // un événement est déjà en cours
    if (Math.random() > this._rollChance) return;  // pas de déclenchement

    // Obtenir les événements disponibles (non déclenchés par fusée)
    const available = ALL_EVENTS.filter(e =>
      !e.triggered &&
      (e.unlockTi || 0) <= (this._currentTi || ti)
    );
    if (available.length === 0) return;

    const event = available[Math.floor(Math.random() * available.length)];
    this._startEvent(event);
  },

  triggerRocketEvent(rocketId) {
    const event = ALL_EVENTS.find(e =>
      e.triggered && (
        e.triggerRocket === rocketId ||
        (Array.isArray(e.triggerRocket) && e.triggerRocket.includes(rocketId))
      )
    );
    if (event) this._startEvent(event);
  },

  _startEvent(event) {
    this._activeEvent = event;
    if (this._onEventStart) this._onEventStart(event);

    const duration = (event.duration || 180) * 1000;
    this._eventTimer = setTimeout(() => this._endEvent(), duration);
  },

  _endEvent() {
    this._activeEvent = null;
    if (this._onEventEnd) this._onEventEnd();
  },

  stop() {
    clearInterval(this._timerHandle);
    clearTimeout(this._eventTimer);
  },

  getActiveEvent() {
    return this._activeEvent;
  },
};
