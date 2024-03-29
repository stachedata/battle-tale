let app = require('express')()
let http = require('http').createServer(app)
let io = require('socket.io')(http)

io.on('connection', socket => {
  socket.on('createRoom', rsp => {
    const roomNumber = Math.floor(10000 + Math.random() * 90000)
    const room = io.of('/' + roomNumber)
    let users = []

    room.on('connection', user => {
      user.on('join', (name, rsp) => {
        let u = {}
        u[user.id] = name
        users.push(u)
        console.log(users)
        rsp(users)
      })
      user.on('users', rsp => {
        rsp(users)
      })
    })
    io.of(room.name).emit('updateUserList', users)

    rsp(roomNumber)
  })
})
http.listen(8000)
