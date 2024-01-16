<template>
    <div  class="center"> 
    <h1 class="wide" v-if="newGameSelected">
      <NewGameOverlay @black-side="newGameWithBlack" @random-side="newGameWithRandom" @white-side="newGameWithWhite"/>
    </h1>
   </div>

  <NewGameButton @new-game="updateNewGame"/>
  <Chess  @started-new-game=resetValue @server-give-best-move="updateFen" :stockfishMove="stockfishMove"
        v-bind="groupedProps"/>
  <WebSocket @received-server-bestmove=updateBestMove :stockfishEloChosen="stockfishEloChosen" :fen="fen"/>
  
</template>


<script setup>
import {ref} from 'vue';
import Chess from '@/components/Chess.vue';
import WebSocket from '@/components/WebSocket.vue';
import NewGameButton from '@/components/NewGameButton.vue';
import NewGameOverlay from '@/components/NewGameOverlay.vue';

/*
 The sequence is:
  0) Start new game. Inject stockfishEloChosen into Websocket.vue
  1) server-give-best-move 2) update the fen 3) inject fen inside Websocket.vue
  4) Websocket.vue watcher will notice changed fen value and send a request to the server for the best move
  5) 
*/
var fen = ref('');
function updateFen(currentFen){
  fen.value = currentFen;
}

var stockfishMove = ref('');
function updateBestMove(bestmoveServer){
  stockfishMove.value = bestmoveServer;
}
var newGameSelected = ref('');
var startNewGame = ref('');
var chosenColor = ref('');
var stockfishEloChosen = ref('1600');

var groupedProps = { startNewGame, chosenColor, stockfishEloChosen };

function updateNewGame(value){
  newGameSelected.value = value;
}

function newGameWithBlack(stockfishElo){
  newGameSelected.value = false;
  chosenColor.value = 'black';
  stockfishEloChosen.value = stockfishElo.value.toString();
  startNewGame.value = true; 
  //console.log(groupedProps.value[0].value);
}
function newGameWithRandom(stockfishElo){
  var random = ['white', 'black'];
  var randomIndex = Math.floor(Math.random() * random.length); 
  var randomColor = random[randomIndex];
  newGameSelected.value = false;
  chosenColor.value = randomColor;
  stockfishEloChosen.value = stockfishElo.value.toString();
  startNewGame.value = true;
}

function newGameWithWhite(stockfishElo){
  newGameSelected.value = false;
  chosenColor.value = 'white';
  stockfishEloChosen.value = stockfishElo.value.toString();
  startNewGame.value = true;
}

function resetValue(){
  startNewGame.value = false;
}
</script>

<style>
  .center {
    box-sizing: border-box;
    border: 1px black;
    border-style: dotted;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 500px; /* Set the maximum width of the container */
    width: 100%; /* Allow the container to take full width if available */
    margin: 0 auto; /* Center the container horizontally */
  
}

.wide{
  width: 100%;
  object-fit: cover;
}
</style>