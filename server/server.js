const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const http = require('http');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Base de données SQLite
const db = new sqlite3.Database('./planet.db', (err) => {
  if (err) console.error('Erreur DB:', err);
  else console.log('✅ Base de données connectée');
});

// Initialiser les tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS worlds (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE,
    terrain_data TEXT,
    oxygen REAL DEFAULT 0,
    temperature REAL DEFAULT 0,
    pressure REAL DEFAULT 0,
    biomass REAL DEFAULT 0,
    terraform_index REAL DEFAULT 0,
    ti_rate REAL DEFAULT 0,
    stage_number INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY,
    world_id INTEGER,
    item_name TEXT,
    quantity INTEGER,
    FOREIGN KEY(world_id) REFERENCES worlds(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS player_pos (
    id INTEGER PRIMARY KEY,
    world_id INTEGER,
    x REAL,
    y REAL,
    z REAL,
    FOREIGN KEY(world_id) REFERENCES worlds(id)
  )`);
});

// Serveur HTTP pour WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let gameState = {
  worlds: {},
  players: {}
};

// WebSocket
wss.on('connection', (ws) => {
  console.log('🎮 Joueur connecté');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleGameMessage(ws, data);
    } catch (err) {
      console.error('Erreur parsing message:', err);
    }
  });

  ws.on('close', () => {
    console.log('🚪 Joueur déconnecté');
  });

  ws.on('error', (err) => {
    console.error('❌ Erreur WebSocket:', err);
  });
});

function handleGameMessage(ws, data) {
  switch (data.type) {
    case 'join_game':
      joinGame(ws, data);
      break;
    case 'move_player':
      movePlayer(ws, data);
      break;
    case 'terraform':
      terraform(ws, data);
      break;
    case 'craft':
      craft(ws, data);
      break;
    case 'get_state':
      ws.send(JSON.stringify({ type: 'state', data: gameState }));
      break;
    default:
      console.log('Message inconnu:', data.type);
  }
}

function joinGame(ws, data) {
  const playerId = data.playerId || 'player_' + Date.now();
  const worldName = data.worldName || 'default_world';

  gameState.players[playerId] = {
    id: playerId,
    x: 0,
    y: 50,
    z: 0,
    world: worldName
  };

  // Vérifier si le monde existe
  db.get('SELECT * FROM worlds WHERE name = ?', [worldName], (err, row) => {
    if (err) console.error(err);

    if (!row) {
      // Créer un nouveau monde
      db.run(
        'INSERT INTO worlds (name, oxygen, temperature, pressure, biomass, terraform_index, ti_rate, stage_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [worldName, 0, 0, 0, 0, 0, 0, 1],
        function(err) {
          if (err) console.error(err);
          else {
            gameState.worlds[worldName] = {
              id: this.lastID,
              oxygen: 0,
              temperature: 0,
              pressure: 0,
              biomass: 0,
              terraform_index: 0,
              ti_rate: 0,
              stage_number: 1,
            };
            sendGameState(ws, playerId, worldName);
          }
        }
      );
    } else {
      gameState.worlds[worldName] = {
        id: row.id,
        oxygen: row.oxygen,
        temperature: row.temperature,
        pressure: row.pressure,
        biomass: row.biomass || 0,
        terraform_index: row.terraform_index || 0,
        ti_rate: row.ti_rate || 0,
        stage_number: row.stage_number || 1,
      };
      sendGameState(ws, playerId, worldName);
    }
  });
}

function movePlayer(ws, data) {
  const playerId = data.playerId;
  if (gameState.players[playerId]) {
    gameState.players[playerId].x = data.x;
    gameState.players[playerId].y = data.y;
    gameState.players[playerId].z = data.z;
  }
}

function terraform(ws, data) {
  const playerId = data.playerId;
  const worldName = gameState.players[playerId]?.world;

  if (gameState.worlds[worldName]) {
    const world = gameState.worlds[worldName];
    const amount = data.amount || 1;

    switch (data.terraformType) {
      case 'oxygen':
        world.oxygen = Math.min((world.oxygen || 0) + amount, 100);
        break;
      case 'temperature':
        world.temperature = Math.min((world.temperature || 0) + amount, 100);
        break;
      case 'pressure':
        world.pressure = Math.min((world.pressure || 0) + amount, 100);
        break;
      case 'biomass':
        world.biomass = Math.min((world.biomass || 0) + amount, 100);
        break;
      case 'ti':
        // Mise à jour du Terraform Index directement
        world.terraform_index = data.ti || world.terraform_index;
        world.ti_rate         = data.tiRate || world.ti_rate;
        world.stage_number    = data.stageNumber || world.stage_number;
        break;
    }

    // Sauvegarder en BD
    db.run(
      `UPDATE worlds
       SET oxygen = ?, temperature = ?, pressure = ?, biomass = ?,
           terraform_index = ?, ti_rate = ?, stage_number = ?
       WHERE name = ?`,
      [
        world.oxygen || 0,
        world.temperature || 0,
        world.pressure || 0,
        world.biomass || 0,
        world.terraform_index || 0,
        world.ti_rate || 0,
        world.stage_number || 1,
        worldName,
      ]
    );

    broadcastGameState();
  }
}

function craft(ws, data) {
  const playerId = data.playerId;
  const worldId = gameState.worlds[gameState.players[playerId]?.world]?.id;
  const item = data.item;
  const quantity = data.quantity || 1;

  if (worldId) {
    db.run(
      'INSERT INTO inventory (world_id, item_name, quantity) VALUES (?, ?, ?) ON CONFLICT(item_name) DO UPDATE SET quantity = quantity + ?',
      [worldId, item, quantity, quantity]
    );
  }

  broadcastGameState();
}

function sendGameState(ws, playerId, worldName) {
  ws.send(JSON.stringify({
    type: 'game_joined',
    playerId: playerId,
    player: gameState.players[playerId],
    world: gameState.worlds[worldName]
  }));
}

function broadcastGameState() {
  const message = JSON.stringify({ type: 'state_update', data: gameState });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Routes HTTP
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/api/worlds', (req, res) => {
  db.all('SELECT * FROM worlds', (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.get('/api/worlds/:name', (req, res) => {
  db.get('SELECT * FROM worlds WHERE name = ?', [req.params.name], (err, row) => {
    if (err) res.status(500).json({ error: err.message });
    else if (!row) res.status(404).json({ error: 'World not found' });
    else res.json(row);
  });
});

app.get('/api/items', (req, res) => {
  // Retourner la liste des items (simulée côté serveur)
  res.json({ message: 'Items définis côté client dans js/data/items.js' });
});

// Démarrer le serveur
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🌍 PLANET CRAFTER - SERVEUR ACTIF 🌍  ║
╚════════════════════════════════════════╝
🔗 http://localhost:${PORT}
📡 WebSocket: ws://localhost:${PORT}
  `);
});
