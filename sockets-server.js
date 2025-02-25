// server.js
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer();
const io = socketIo(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado', socket.id);

  // Simula un evento cada cierto tiempo
  setInterval(() => {
    socket.emit('agentsUpdated', {
      id: 1,
      status: 'ocupado',
      waitTime: Math.floor(Math.random() * 300)
    });
  }, 5000);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado', socket.id);
  });
});

server.listen(4000, () => {
  console.log('Servidor WebSocket en puerto 4000');
});
