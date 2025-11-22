import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://collabo-color-app.vercel.app',
  },
});

interface User {
  id: string;
  name: string;
}

const connectedUsers: { [socketId: string]: User } = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('register', (user: User) => {
    // Отправляем новому пользователю список уже подключенных
    socket.emit('current-users', Object.values(connectedUsers));

    // Регистрируем нового пользователя и оповещаем остальных
    connectedUsers[socket.id] = user;
    socket.broadcast.emit('user-connected', user);
    console.log(`User ${user.name} registered`);
  });

  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data);
  });

  socket.on('erasing', (data) => {
    socket.broadcast.emit('erasing', data);
  });

  socket.on('clear', () => {
    socket.broadcast.emit('clear');
  });

  socket.on('undo', (data) => {
    socket.broadcast.emit('undo', data);
  });

  socket.on('redo', (data) => {
    socket.broadcast.emit('redo', data);
  });

  socket.on('selectImage', (data) => {
    socket.broadcast.emit('imageSelected', data);
  });

  socket.on('disconnect', () => {
    const user = connectedUsers[socket.id];
    if (user) {
      socket.broadcast.emit('user-disconnected', user);
      delete connectedUsers[socket.id];
      console.log(`User ${user.name} disconnected`);
    } else {
      console.log('user disconnected');
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server listening on port ${PORT}`);
});