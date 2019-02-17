const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
let app = express();
let server = http.createServer(app);
let users = new Users();

app.use(express.static(publicPath));

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New User Connected.');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and Room Name is required');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        let user = users.addUser(socket.id, params.name, params.room);
        io.to(user.room).emit('upadateUserList', users.getUserList(user.room))
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));
        socket.broadcast.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} joined`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);
        if(user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);
        if(user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('upadateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});