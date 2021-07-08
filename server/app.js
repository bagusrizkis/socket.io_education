const express = require('express');
const app = express();
const http = require('http').createServer(app)
const PORT = 3000

const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
})

app.get('/', (req, res) => {
    res.send('Hallo')
})

// listening dari client
io.on('connect', (socket) => {
    console.log('ada yang terkoneksi: ', socket.id)

    // listen server dari client
    socket.on('chat', payload => {
        // console.log(payload)

        // ! event emit
        // send ke client (emit)
        // io.emit('clientChat', payload)
        
        // ! broadcast
        socket.broadcast.emit('clientChat', payload)
    })

    // listen dari client
    socket.on('typing', (payload, isType) => {
        console.log('typing: ', payload)
        let msg = ""
        if (isType) {
            if (payload) {
                msg = payload + ' is typing'
            } else {
                msg = 'somebody is typing'
            }
        } else {
            msg = ""
        }
        // teriak ke client
        socket.broadcast.emit('typingToClient', msg)
    })
})

http.listen(PORT, () => {
    console.log('listening on *:', PORT)
})