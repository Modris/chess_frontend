<template>
</template>

<script setup>
import { ref, watch, defineProps, nextTick} from 'vue';
import Stomp from "webstomp-client";
const userId = crypto.randomUUID(); // this will only work on localhost or HTTPS!!
//const url = 'ws://localhost:8888/websocket'; // Now ws. before it was http link because of sockJS.
const url = 'wss://slychess.com/websocket';
//let options = {debug: false, protocols: Stomp.supportedProtocols()};
let options = { debug: false, protocols: ['v12.stomp'], heartbeat: {incoming: 0, outgoing: 0} };
let socket = null;
let stomp = '';
let websocketClosed = ref(false);


const payload = ref('');
const bestmove = ref('');

let reconnectInterval = null;
let reconnectIntervalAfterClosed = null;
let handlePingInterval = null;
let initialConnectPing = null;
let SOCKET_CONNECTING = 0;
let SOCKET_OPEN = 1;
let SOCKET_CLOSING = 2;
let SOCKET_CLOSED = 3;

 function connect(){
    socket = new WebSocket(url);
    stomp = Stomp.over(socket, options);
    stomp.connect('guest', 'guest', function (frame) {
    console.log('Connected!');
    stomp.subscribe(`/topic/bestmove${userId}`, handleServerResponse);
    websocketClosed.value = false;
     emit('websocket-status', websocketClosed.value); // You might want to use emit here if emit is defined in your component
     initialConnectPing = setTimeout(handlePing,3000);
  });

  stomp.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
    };

    stomp.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };

    socket.onclose= () => {
        console.log("WebSocket closed....");
    }

}





function sendFen(payload){
    //console.log('Client Sending fen to Server!'+payload);
    stomp.send("/app/websocket", payload);  // Remember /app prefix because of Spring Backend config.
}


const emit = defineEmits(['received-server-bestmove', 'websocket-status'])

function handleServerResponse(message){
    bestmove.value = message.body;
    let result = message.body.replaceAll("\"", "");
    bestmove.value = result;
    console.log("Received from server: "+bestmove.value)
    if(bestmove.value == 'Pong'){
        clearInterval(reconnectInterval); // heartbeat every 3 seconds.

        handlePingInterval = setTimeout(handlePing,3000);
    } else{
        emit('received-server-bestmove', bestmove.value);
    }

}

function handlePing  () {

    if(socket.readyState == SOCKET_OPEN){
    let ping = JSON.stringify({'fen': 'Ping', 'userId': userId, 'move': 'Ping'});
    console.log("Sending Ping!");
    stomp.send("/app/websocket", ping);
    }
  
    reconnectInterval = setInterval(reconnectingIntervalFunction, 8000); // 8 seconds before we attempt to reconnect
    // if no pong is received it will call reconnectIntervalFunction().
}



function close() {
    clearInterval(reconnectInterval);
    clearTimeout(handlePingInterval);
    clearTimeout(initialConnectPing);
     socket.close();
     stomp.disconnect();
}




function reconnectingIntervalFunction()  {
    clearInterval(reconnectInterval);
    clearTimeout(handlePingInterval);
   setTimeout(maxReconnectAttemps, 15000); // We will disable reconnects after 15 seconds.
   reconnectIntervalAfterClosed = setInterval(websocketReconnect, 3000); // reconnect every 3 seconds.

    
  }

  function maxReconnectAttemps() {
    clearInterval(reconnectIntervalAfterClosed);
   close();
    console.log("Maximum websocket reconnecting time reached. No more websocket reconnect attempts.");
  }

function websocketReconnect() {

    websocketClosed.value = true;
    emit('websocket-status', websocketClosed.value);

    if(socket.readyState == SOCKET_CONNECTING  || socket.readyState == SOCKET_CLOSING) {
         // don't reconnect if we are attempting to connect, connection is open or the socket is closing.
        return;
    }
    if(socket.readyState == SOCKET_CLOSED){
        console.log("WebSocket closed. Attempting to reconnect");
    }
    if(socket.readyState == SOCKET_OPEN){
        //console.log("Websocket is Open. Clearing the interval value.");
       // clearInterval(reconnectIntervalAfterClosed);
       // Disabling this for now. For some reason i had a false positive.
    }

    socket = new WebSocket(url);
    stomp = Stomp.over(socket, options);
    stomp.connect('guest', 'guest', function(frame) {
        console.log("Reconnected!");
        stomp.subscribe("/topic/bestmove"+userId, handleServerResponse);
        clearInterval(reconnectIntervalAfterClosed); // clears attempting to reconnect interval.
        initialConnectPing = setTimeout(handlePing, 3000); // heartbeat every 3 seconds.
        setTimeout(callServerForBestMoveWebsocket,1000); // wait for connection to 100% establish.

        websocketClosed.value = false;
        emit('websocket-status', websocketClosed.value);
    });
  }

  function callServerForBestMoveWebsocket(){
    // ideally i should check if it's stockfishMove but that requires for Chess.vue to always emit server more to app.vue
    // and then app.vue to inject prop into websocket.vue.
    // right now this will make 1 extra call to server for bestmove for Stockfish player color on successful reconnect
    // not bad as it is right now
    if(props.fen != 'undo'){ 
    payload.value = JSON.stringify({'fen': props.fen, 'userId': userId,'chosenElo': props.stockfishEloChosen,'move':'webs'});
    sendFen(payload.value);
    }
}
    

 
const props = defineProps({
  fen: String,
  stockfishEloChosen: Number,
  move: String,
  fenHistoryUser: String,
  moveHistoryUser: String,
})

defineExpose({
    sendFen,
    userId,
    socket,
    connect,
    close,
    handlePing,
    reconnectInterval
})

</script>