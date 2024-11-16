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
    io.socketsLeave(socket.id)

    io.emit('chat message', socket.name , ' connected')
    socket.join(room)
    socket.room = room
    console.log(socket.rooms)
  })

  socket.on('whos-typing', (data) => {
    socket.broadcast.emit('whos-typing', {name:socket.name,typing:true})
    console.log(socket.name,' is typing',data , ' ;');
    if(data){
      console.log('hai')
    }
  })

  socket.on('stop-typing', () => {
    socket.broadcast.emit('whos-typing',{name:socket.name,typing:false})
    console.log(socket.name,' is done typing');
  })

  socket.on('whos-online', async() => {
    const users = await io.in(socket.room).fetchSockets()
    const names = users.map(user => user.name)
    io.in(socket.room).emit('whos-online', names)
    console.log(names)
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
