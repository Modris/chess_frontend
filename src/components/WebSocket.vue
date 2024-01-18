<template>

</template>

<script setup>
import {ref, watch, defineProps} from 'vue';
import Stomp from "webstomp-client";
const userId = crypto.randomUUID(); // this will only work on localhost or HTTPS!!
const url = 'http://localhost:8080/websocket'; // http link because of sockJS.
const socket = new SockJS(url);
const stomp = Stomp.over(socket);
//var payload = JSON.stringify({'fen': 'k7/7Q/5Q2/8/8/8/3K4/8 w - - 0 1', 'userId': userId});
const payload = ref('');
const bestmove = ref('');
stomp.connect('guest', 'guest', function(frame) {
    console.log("Connected!");
    stomp.subscribe("/topic/bestmove"+userId, handleServerResponse);
    //sendFen();
});

const props = defineProps({
  fen: String,
  stockfishEloChosen: String,
  move: String,
  fenHistoryUser: String,
  moveHistoryUser: String,
})

    watch(() => props.fen, (newFen) => {
    if(newFen != 'undo'){ 
        // if fen is undo then don't send to server. Same thing for start new game. Fen reset due to watcher usage.
    payload.value = JSON.stringify({'fen': newFen, 'userId': userId,'chosenElo':props.stockfishEloChosen,'move':props.move});
    sendFen(payload.value);
    }
})

watch(() => props.fenHistoryUser, (fenHistoryUser) => {
    if(fenHistoryUser != 'undo'){ 
        // if fen is undo then don't send to server. Same thing for start new game. Fen reset due to watcher usage.
    payload.value = JSON.stringify({'fen': fenHistoryUser, 'userId': userId,'chosenElo':props.stockfishEloChosen,'move':props.moveHistoryUser});
    sendFen(payload.value);
    }
})


function sendFen(payload){
    //console.log('Client Sending fen to Server!'+payload);
    stomp.send("/app/websocket", payload);  // Remember /app prefix because of Spring Backend config.
}


const emit = defineEmits(['received-server-bestmove'])
function handleServerResponse(message){
    bestmove.value = message.body;
    console.log(bestmove.value)
    emit('received-server-bestmove', bestmove.value);


}

stomp.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stomp.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};


</script>