const socket = io();
const chat = document.getElementById('chat');
const form = document.getElementById('form');
const input = document.getElementById('input');

// Receive system messages (join/leave)
socket.on('systemMessage', (msg) => {
  const item = document.createElement('div');
  item.classList.add('message', 'system');
  item.textContent = msg;
  chat.appendChild(item);
  chat.scrollTop = chat.scrollHeight;
});

// Receive chat messages
socket.on('chatMessage', (msg) => {
  const item = document.createElement('div');
  item.classList.add('message');
  item.classList.add(msg.sender === '🤖 Bot' ? 'bot' : 'user');
  item.textContent = `${msg.sender}: ${msg.text}`;
  chat.appendChild(item);
  chat.scrollTop = chat.scrollHeight;
});

// Send message
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    socket.emit('chatMessage', text);
    input.value = '';
  }
});
