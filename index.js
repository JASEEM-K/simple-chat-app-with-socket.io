const { captureRejectionSymbol } = require('events')
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})
app.use(express.static('public'))


io.on('connection', (socket) => {

  socket.on('name-auth', (name,room) => {
    socket.name = name

    io.emit('chat message', socket.name,socket.id , ' connected')
    if(socket.room){
      socket.leave(socket.room)
    }
    socket.join(room)
    socket.room = room
  })

  socket.on('whos-typing', () => {
    socket.broadcast.emit('whos-typing', {name:socket.name,typing:true})
  })

  socket.on('stop-typing', () => {
    socket.broadcast.emit('whos-typing',{name:socket.name,typing:false})
  })

  socket.on('whos-online', async() => {
    const users = await io.in(socket.room).fetchSockets()
    const names = users.map(user => user.name && user.id)
    io.in(socket.room).emit('whos-online', names)
  })

  socket.in(socket.room).emit('chat message', socket.name,socket.id,  ' connected')
  socket.on('chat message', (msg) => {
    io.in(socket.room).emit('chat message', socket.name,socket.id ,msg)
  })

  socket.on('private-message', (user,msg) => {
    io.to(user).emit('private-message', {user:socket.name,id:socket.id, msg: msg}) })
 
  socket.on('disconnect', () => {
    socket.broadcast.emit('chat message', socket.name, socket.id ,'disconnected');
  })
});

server.listen(3000, () => {
    console.log('listening on *:3000')
})
