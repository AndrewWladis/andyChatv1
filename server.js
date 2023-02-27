const io = require('socket.io')(3000)
const users = {}
var Filter = require('bad-words');
var customFilter = new Filter({ placeHolder: '💀'});
let i = 0;

io.on('connection', socket => {
  socket.on('new-user', name => {
    console.log(name, i, typeof(name))
    if ([undefined, null, "null"].indexOf(name) != -1) {
      users[socket.id] = name
      socket.broadcast.emit('user-connected', name)
    }
  })
  socket.on('send-chat-message', message => {
    if ([undefined, null, "null"].indexOf(users[socket.id]) != -1) {
      socket.broadcast.emit('chat-message', { message: customFilter.clean(message), name: users[socket.id] })
    }
  })
  socket.on('send-breaking-bad-quote', message => {
    if ([undefined, null, "null"].indexOf(users[socket.id]) != -1) {
      socket.broadcast.emit('chat-message', { message: customFilter.clean(message.quote), name: message.author })
    }
  })
  socket.on('send-andymoji', moji => {
    if ([undefined, null, "null"].indexOf(users[socket.id]) != -1) {
      socket.broadcast.emit('andymoji-message', { andimoji: moji, name: users[socket.id] })
    }
  })
  socket.on('disconnect', () => {
    if ([undefined, null, "null"].indexOf(users[socket.id]) != -1) {
      socket.broadcast.emit('user-disconnected', users[socket.id])
    }
    delete users[socket.id]
  })
})