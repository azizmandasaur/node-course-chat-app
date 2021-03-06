var socket = io();

function scrollToBottom () {
    var messages = $("#messages");
    var newMessage = messages.children('li:last-child');

    var scrollHeight = messages.prop('scrollHeight');
    var scrollTop = messages.prop('scrollTop');
    var clientHeight = messages.prop('clientHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(scrollTop + clientHeight + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight)
    }
}

socket.on('connect', function () {
    console.log('Connected to server.');
    var params = jQuery.deparam(window.location.search);
    
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error');
        }
    });
});

socket.on('upadateUserList', function (users) {
    var ol = $("<ol></ol>");
    users.forEach(function (user) {
        ol.append($("<li></li>").text(user));
    });
    $("#users").html(ol);
});

socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format("LT");

    var template = $("#message-template").html();
    var html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });
    
    $("#messages").append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format("LT");

    var template = $("#location-message-template").html()
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

    $("#messages").append(html);scrollToBottom();
});

socket.on('disconnect', function () {
    console.log('Disconnected from server.');
});

$("#message-form").on("submit", function(e) {
    e.preventDefault();

    var messageTextbox = $("#message");
    socket.emit('createMessage', {
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