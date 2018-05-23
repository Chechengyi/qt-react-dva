var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('http://192.168.1.108:8080/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        // stompClient.subscribe('/topic/greetings', function (greeting) {
        //     showGreeting(JSON.parse(greeting.body).content);
        // });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName(subPath) {
    // longitude altitude uid
    let longitude = 120,
        altitude = 20,
        uid = Math.floor(Math.random()*1000).toString();

    // stompClient.send("/app/hello", {}, JSON.stringify({'name': $("#name").val()}));
    stompClient.send(`/app/${subPath}`, {}, JSON.stringify({
        longitude,
        altitude,
        uid
    }));
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() {
        sendName('hello');
        sendName('courier');
    });
});