var socket = io();

socket.on('connect', function () {
    console.log('Connected to server.');
});

socket.on('newMessage', function (message) {
    console.log('newMessage', message);
    
    var li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    $("#messages").append(li);
});

socket.on('newLocationMessage', function(message) {
    var li = $('<li></li>');
    var a = $('<a target="_blank">My Current Location</a>')
    a.attr('href', message.url);

    li.text(`${message.from}: `);
    li.append(a);

    $("#messages").append(li);
});

socket.on('disconnect', function () {
    console.log('Disconnected from server.');
});

$("#message-form").on("submit", function(e) {
    e.preventDefault();

    var messageTextbox = $("#message");
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val(),
    }, function (data) {
        messageTextbox.val('')
    });
});

var locationButton = $("#send-location");
locationButton.on("click", function() {
    if(!navigator.geolocation){
        return alert("Geolocation is not supported in your browser");
    } 

    locationButton.attr('disabled', 'disabled').text('Sending location...')
    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        locationButton.removeAttr('disabled').text('Send location');
        alert("Unable to fetch location");
    });
});