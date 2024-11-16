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

  console.log(socket.rooms)
  socket.on('name-auth', (name,room) => {
    socket.name = name
    io.emit('chat message', socket.name , ' connected')
    socket.join(room)
  })

  socket.on('online', () => {
    io.emit('online', io.engine.clientsCount)
  })

  socket.emit('chat message', socket.name + ' connected')
  socket.on('chat message', (msg) => {
    io.emit('chat message', socket.name ,msg)
  })
 
  socket.on('disconnect', () => {
    console.log(socket.name,' user diconnected');
    socket.broadcast.emit('chat message', socket.name ,'disconnected');
  })
});

server.listen(3000, () => {
    console.log('listening on *:3000')
})
