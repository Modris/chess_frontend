<template>


</template>

<script setup>
import {ref} from 'vue';
import Stomp from "webstomp-client";
const userId = crypto.randomUUID(); // this will only work on localhost or HTTPS!!
console.log(userId)
const url = 'http://localhost:8080/websocket'; // http link because of sockJS.
const socket = new SockJS(url);
var stomp = Stomp.over(socket);
var payload = JSON.stringify({'fen': 'k7/7Q/5Q2/8/8/8/3K4/8 w - - 0 1', 'userId': userId});

stomp.connect('guest', 'guest', function(frame) {
    console.log("Connected!");
    stomp.subscribe("/topic/bestmove"+userId, handleServerResponse);
    sendFen();
});

function sendFen(){
    console.log('Client Sending fen to Server!'+payload);
    stomp.send("/app/websocket", payload);  // Remember /app prefix because of Spring Backend config.
}
function handleServerResponse(message){
    console.log("Received message from Server: "+message);
}

stomp.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stomp.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};


</script>