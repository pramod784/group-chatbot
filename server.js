// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const users = {}; // socket.id => username

io.on('connection', (socket) => {
  console.log('🟢 New connection:', socket.id);

  // Assign random username
  const username = `User_${Math.floor(Math.random() * 1000)}`;
  users[socket.id] = username;

  // Notify others
  io.emit('systemMessage', `${username} joined the chat`);

  // Handle incoming messages
  socket.on('chatMessage', (msg) => {
    const sender = users[socket.id];
    console.log(`💬 ${sender}: ${msg}`);

    // Broadcast to all users
    io.emit('chatMessage', { sender, text: msg });

    // Bot logic
    let botReply = null;
    if (msg.toLowerCase().includes('hello')) {
      botReply = `Hey ${sender}! 👋 Welcome to the group.`;
    } else if (msg.toLowerCase().includes('time')) {
      botReply = `🕓 The current time is ${new Date().toLocaleTimeString()}`;
    } else if (msg.toLowerCase().includes('help')) {
      botReply = `Here are some commands you can try:\n- "hello"\n- "time"\n- "help"`;
    }

    if (botReply) {
      io.emit('chatMessage', { sender: '🤖 Bot', text: botReply });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    io.emit('systemMessage', `${username} left the chat`);
    console.log('🔴 Disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3500;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
