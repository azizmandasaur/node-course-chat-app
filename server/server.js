const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
let app = express();

let server = http.createServer(app);

app.use(express.static(publicPath));

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New User Connected.');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);

        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from server');
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('User', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected.');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});