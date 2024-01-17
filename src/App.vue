<template>
  <h1> APP mv {{ move }}</h1>
    <div  class="center"> 
    <h1 class="wide" v-if="newGameSelected">
      <NewGameOverlay @black-side="newGameWithBlack" @random-side="newGameWithRandom" @white-side="newGameWithWhite"/>
    </h1>
   </div>

  <NewGameButton @new-game="updateNewGame"/>
  <Chess  @game-history-user="updateHistoryServer" @game-over=updateMove @started-new-game=resetValue @server-give-best-move="updateFen" :stockfishMove="stockfishMove"
        v-bind="groupedProps"/>
  <WebSocket @received-server-bestmove=updateBestMove :moveHistoryUser="moveHistoryUser" :fenHistoryUser="fenHistoryUser" :move="move" :stockfishEloChosen="stockfishEloChosen" :fen="fen"/>
  
</template>


<script setup>
import {ref} from 'vue';
import Chess from '@/components/Chess.vue';
import WebSocket from '@/components/WebSocket.vue';
import NewGameButton from '@/components/NewGameButton.vue';
import NewGameOverlay from '@/components/NewGameOverlay.vue';

/*
 The sequence is:
  0) Start new game. Inject stockfishEloChosen, move into Websocket.vue
  1) server-give-best-move 2) update the fen 3) inject fen + move inside Websocket.vue 
  4) Websocket.vue watcher will notice changed fen value and send a request to the server for the best move
  5) received-server-bestmove from Websocket.vue emits to App.vue which calls function updateBestMove
  6) The function updates stockfishmove which then gets injected into the Chess.vue
  7) Chess.vue notices with watcher changed stockfishmove; boardAPI.move(move) is executed.
  8) userFen.value is set before the move is made (gameHistory is made from old fen+move executed for highlight);
  9) We wait for user to make a move. If he made a move Chess.vue handleMove() function is called.
  10) We emit to server to save game-history-user from Chess.vue. userFen + userMove
  11) App.vue notices emit from Chess.vue and sends fenHistoryUser +userMove prop to websocket the emit.

*/
var move = ref('begn');
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
  move.value = 'begn';
  stockfishEloChosen.value = stockfishElo.value.toString();
  startNewGame.value = true; 
  //console.log(groupedProps.value[0].value);
}
function newGameWithRandom(stockfishElo){
  move.value = 'begn';
  var random = ['white', 'black'];
  var randomIndex = Math.floor(Math.random() * random.length); 
  var randomColor = random[randomIndex];
  newGameSelected.value = false;
  chosenColor.value = randomColor;
  stockfishEloChosen.value = stockfishElo.value.toString();
  startNewGame.value = true;
}

function newGameWithWhite(stockfishElo){
  move.value = 'begn';
  newGameSelected.value = false;
  chosenColor.value = 'white';
  stockfishEloChosen.value = stockfishElo.value.toString();
  startNewGame.value = true;
}

function resetValue(){
  startNewGame.value = false;
}
function updateMove(end){
  move.value = end;
}
var fenHistoryUser = ref('');
var moveHistoryUser = ref('');
function updateHistoryServer(userFen, userMove){
  moveHistoryUser.value = userMove;
  fenHistoryUser.value = userFen;
}
</script>

<style>
  .center {
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