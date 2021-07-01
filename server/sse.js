const { v4: uuidv4 } = require('uuid');

let connections = {};
let rooms = [];

module.exports = (app) => {
  app.get('/sse', (req, res) => {
    const id = uuidv4();
    connections[id] = res;

    req.on('close', () => {
      delete connections[id];
      const index = rooms.findIndex((x) => x.id === id);
      rooms.splice(index, 1);
    });

    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    });

    const message = JSON.stringify({ id, initial: true });
    res.write(`data: ${message} \n\n`);
  });

  app.post('/sse/join', (req, res) => {
    const id = req.query.id;
    const name = req.query.name;
    const room = req.query.room;
    const player = rooms.filter((x) => x.room === room).length;
    rooms.push({ room, id, name, player });

    const data = rooms.filter((x) => x.room === room);
    const message = JSON.stringify({ data, setPlayers: true });

    for (let player of rooms) {
      if (player.room === room) {
        connections[player.id].write(`data: ${message} \n\n`);
      }
    }
    res.json({ success: true });
  });

  app.post('/sse/play', (req, res) => {
    const id = req.query.id;
    if (!id) {
      const message = 'ID is missing.';
      handleError(res, message);
      return;
    }
    const { room } = rooms.find((x) => x.id === id);
    const message = JSON.stringify({ data: req.body, setBoard: true });
    broadcastRoom(room, message);
    res.json({ success: true });
  });

  app.post('/sse/check', (req, res) => {
    const id = req.query.id;
    if (!id) {
      const message = 'ID is missing.';
      handleError(res, message);
      return;
    }
    const { room } = rooms.find((x) => x.id === id);
    const message = JSON.stringify({ checkBoard: true });
    broadcastRoom(room, message);
    res.json({ success: true });
  });
};

function broadcastRoom(room, message) {
  for (let player of rooms) {
    if (player.room === room) {
      connections[player.id].write(`data:${message}\n\n`);
    }
  }
}

function handleError(res, message) {
  message = `Error: ${message}`;
  const response = { success: false, message };
  res.json(response);
}
