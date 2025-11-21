import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import serverless from 'serverless-http';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data);
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
    console.log('user disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('Socket.io server is running.');
});

export const handler = serverless(app);