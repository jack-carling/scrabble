const { v4: uuidv4 } = require('uuid');

const getSquares = require('./squares');

let connections = {};
let rooms = [];
let squares = {};

module.exports = (app) => {
  app.get('/sse', (req, res) => {
    const id = uuidv4();
    connections[id] = res;

    req.on('close', () => {
      delete connections[id];
      const index = rooms.findIndex((x) => x.id === id);
      const room = rooms[index]?.room;
      // Write user disconnected
      rooms.splice(index, 1);
      if (!room) return;
      const checkRooms = rooms.filter((x) => x.room === room).length;
      if (!checkRooms) {
        delete squares[room];
      }
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

    if (!id) {
      const message = 'ID is missing.';
      handleError(res, message);
      return;
    }
    if (!name) {
      const message = 'Name is missing.';
      handleError(res, message);
      return;
    }
    if (!room) {
      const message = 'Room is missing.';
      handleError(res, message);
      return;
    }

    const player = rooms.filter((x) => x.room === room).length;
    rooms.push({ room, id, name, player });

    if (!squares.hasOwnProperty(room)) {
      squares[room] = [];
      squares[room] = [...getSquares];

      for (let i = squares[room].length - 1; i > 0; i--) {
        const newIndex = Math.floor(Math.random() * (i + 1));
        const oldValue = squares[room][newIndex];
        squares[room][newIndex] = squares[room][i];
        squares[room][i] = oldValue;
      }
    }

    const data = rooms.filter((x) => x.room === room);
    const message = JSON.stringify({ data, setPlayers: true });

    broadcastRoom(room, message);
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

  app.get('/sse/squares', (req, res) => {
    const id = req.query.id;
    const count = Number(req.query.count);
    if (!id) {
      const message = 'ID is missing.';
      handleError(res, message);
      return;
    }
    if (!count || !Number.isInteger(count)) {
      const message = 'Count is missing and/or not valid number.';
      handleError(res, message);
      return;
    }
    if (count < 0 || count > 7) {
      const message = 'Count cannot be less than 0 or greater than 7.';
      handleError(res, message);
      return;
    }
    const { room } = rooms.find((x) => x.id === id);

    const remaining = squares[room].length;
    if (!remaining) {
      const message = 'No squares remaining';
      handleError(res, message);
      return;
    }

    let max = Math.max(remaining, count);
    if (max > 7) max = 7;
    if (max > count) max = count;

    let data = [];
    for (let i = 0; i < max; i++) {
      const random = Math.floor(Math.random() * squares[room].length);
      data.push(squares[room][random]);
      squares[room].splice(random, 1);
    }

    res.json({ success: true, data: JSON.stringify(data) });
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
