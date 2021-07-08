const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3000

const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
})

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

io.on('connect', (socket) => {
    // console.log('ada user connect id :', socket.id)

    // listen event dari client
    socket.on('chat', (payload, room) => {
        // console.log(payload);

        // ! event emit
        // io.emit('clientChat', payload)

        // ! broadcast
        // socket.broadcast.emit('clientChat', payload)

        // ! Private Room
        if (!room) {
            // ! broadcast
            socket.broadcast.emit('clientChat', payload)
        } else {
            // ! broadcast ke room private
            socket.to(room).emit('clientChat', payload)
        }
    })

    // join ke room
    socket.on('joinRoom', (room) => {
        console.log("User ID: ", socket.id, 'joined room: ', room);
        socket.join(room)
    })

    socket.on('changeIsTyping', (payload, room) => {
        console.log('masuk', payload)
        socket.to(room).emit('sendIsTyping', payload)
    })
})


http.listen(PORT, () => {
    console.log('Listening on port: 3000')
})