const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
let app = express();

let server = http.createServer(app);

app.use(express.static(publicPath));

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New User Connected.');

    socket.on('disconnect', () => {
        console.log('User Disconnected.');
    });
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});