const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static('public'));

let broadcastState = {
  activeMode: 'football',
  score: { home: 0, away: 0, time: "00:00" },
  activeEffect: null
};

io.on('connection', (socket) => {
  console.log('Reji Bağlandı:', socket.id);
  socket.emit('stateUpdate', broadcastState);

  socket.on('changeMode', (mode) => {
    broadcastState.activeMode = mode;
    io.emit('stateUpdate', broadcastState);
  });

  socket.on('triggerEffect', (effect) => {
    broadcastState.activeEffect = effect;
    io.emit('stateUpdate', broadcastState);

    setTimeout(() => {
      broadcastState.activeEffect = null;
      io.emit('stateUpdate', broadcastState);
    }, 4000);
  });

  socket.on('updateScore', (newScore) => {
    broadcastState.score = { ...broadcastState.score, ...newScore };
    io.emit('stateUpdate', broadcastState);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Nova TV Yayın Motoru ${PORT} portunda aktif!`);
});