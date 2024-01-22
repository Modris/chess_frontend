<template>

</template>

<script setup>
import {ref, watch, defineProps} from 'vue';
import Stomp from "webstomp-client";
const userId = crypto.randomUUID(); // this will only work on localhost or HTTPS!!
const url = 'http://localhost:8080/websocket'; // http link because of sockJS.
//let options = {debug: false, protocols: Stomp.supportedProtocols()};
let socket = new SockJS(url);
let  stomp = Stomp.over(socket, ['v10.stomp', 'v11.stomp', 'v12.stomp']);

//var payload = JSON.stringify({'fen': 'k7/7Q/5Q2/8/8/8/3K4/8 w - - 0 1', 'userId': userId});
const payload = ref('');
const bestmove = ref('');

let SOCKET_CONNECTING = 0;
let SOCKET_OPEN = 1;
let SOCKET_CLOSING = 2;
let SOCKET_CLOSED = 3;
let reconnectInterval = ref(null); 

stomp.connect('guest', 'guest', function(frame) {
    console.log("Connected!");
    clearInterval(intervalId.value); // clears attempting to reconnect interval.
    stomp.subscribe("/topic/bestmove"+userId, handleServerResponse);
    //sendFen();
});

const props = defineProps({
  fen: String,
  stockfishEloChosen: Number,
  move: String,
  fenHistoryUser: String,
  moveHistoryUser: String,
})
/*
    watch(() => props.fen, (newFen) => {
    if(newFen != 'undo'){ 
        // if fen is undo then don't send to server. Same thing for start new game. Fen reset due to watcher usage.
    payload.value = JSON.stringify({'fen': newFen, 'userId': userId,'chosenElo':props.stockfishEloChosen,'move':props.move});
    sendFen(payload.value);
    }
})
Watcher was not the best idea due to black starting a game twice in a row would mean no new fen.
So i exposed the method instead and the app will call it.
*/

defineExpose({
    sendFen,
    userId,
})


function sendFen(payload){
    //console.log('Client Sending fen to Server!'+payload);
    stomp.send("/app/websocket", payload);  // Remember /app prefix because of Spring Backend config.
}


const emit = defineEmits(['received-server-bestmove'])
function handleServerResponse(message){
    bestmove.value = message.body;
    console.log("Received from server: "+bestmove.value)
    emit('received-server-bestmove', bestmove.value);


}

stomp.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stomp.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};
const intervalId = ref(null);

socket.onclose= () => {
    // reconnect now...
    console.log("Socket closed....");
    //stomp.disconnect(); // for proper cleanup of resources
   // reconnectInterval.value = setInterval(reconnectingIntervalFunction, 1000);

}
/*
  // Your function to be called at regular intervals
  let reconnectingIntervalFunction = () => {
    
    if(socket.readyState == SOCKET_CONNECTING ||  socket.readyState == SOCKET_OPEN) {
         // don't reconnect if we are attempting to connect
        return;
    }
    if(socket.readyState == SOCKET_CLOSED){
        console.log("Websocket closed. Attempting to reconnect");
    }

    socket = new SockJS(url); // fresh start for clean connection
    options = {debug: false, protocols: Stomp.VERSIONS.supportedProtocols()};
    stomp = Stomp.over(socket, options); // fresh start for clean connection

    stomp.connect('guest', 'guest', function(frame) {
        console.log("Reconnected!");
        clearInterval(intervalId.value); // clears attempting to reconnect interval.
        stomp.subscribe("/topic/bestmove"+userId, handleServerResponse);
    });

 };
 */
</script>