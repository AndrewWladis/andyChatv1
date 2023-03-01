const io = require("socket.io")(3000);

const users = {}
var Filter = require('bad-words');
var customFilter = new Filter({ placeHolder: '💀'});

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    if (users[socket.id] === 'Andy' && message.startsWith('BANdy ')) {
      io.to(users[message.split(' ')[1].toLowerCase()]).emit("ban", message.split(' ')[2]);
    }
    socket.broadcast.emit('chat-message', { message: customFilter.clean(message), name: users[socket.id]});
  })
  socket.on('send-andymoji', moji => {
    socket.broadcast.emit('andymoji-message', { andimoji: moji, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})