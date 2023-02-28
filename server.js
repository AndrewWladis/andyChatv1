const io = require("socket.io")(3000, {
  cors: {
    origin: "https://andychat.onrender.com/",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

const users = {}
var Filter = require('bad-words');
var customFilter = new Filter({ placeHolder: '💀'});

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    /*if (users[socket.id] === 'Andy' && message.startsWith('BANdy ')) {
      let user
      io.to(users[message.split('BANdy ')[1].toLowerCase()]).emit("ban", 'ban');
    } else {
      socket.broadcast.emit('chat-message', { message: customFilter.clean(message), name: users[socket.id]});
    }*/
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