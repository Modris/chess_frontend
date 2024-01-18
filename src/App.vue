<template>
  <NewGameButton @new-game="updateNewGame"/>
  <main class = "container1">
    <div> </div> <!-- Do not Delete. For centering purposes. Also future features on the left are open.-->
    <div class="mainItem"> 
      <Chess  @game-history-user="updateHistoryServer" @game-over=updateMove @started-new-game=resetValue @server-give-best-move="updateFen" :stockfishMove="stockfishMove"
            v-bind="groupedProps"/>
    </div>

     <div> 
      Move history here
     </div>

     <div  v-if="newGameSelected" class="containerOverlap"> 
      <div> <button @click="closeOverlay" class="btn"> ❌ </button></div>
      <div> 
        <h1 class= " containerOverlapItem">
          <NewGameOverlay @black-side="newGameWithBlack" @random-side="newGameWithRandom" @white-side="newGameWithWhite"/>
        </h1>     
      </div>
  </div>
 <WebSocket @received-server-bestmove=updateBestMove :moveHistoryUser="moveHistoryUser" :fenHistoryUser="fenHistoryUser" :move="move" :stockfishEloChosen="stockfishEloChosen" :fen="fen"/>
  
  </main>


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
const move = ref('begn');
const fen = ref('');
function updateFen(currentFen){
  fen.value = currentFen;
}

const stockfishMove = ref('');
function updateBestMove(bestmoveServer){
  stockfishMove.value = bestmoveServer;
}
const newGameSelected = ref('');
const startNewGame = ref('');
const chosenColor = ref('');
const stockfishEloChosen = ref(1500);

let groupedProps = { startNewGame, chosenColor, stockfishEloChosen };

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
  let random = ['white', 'black'];
  let randomIndex = Math.floor(Math.random() * random.length); 
  let randomColor = random[randomIndex];
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

function closeOverlay(){
  newGameSelected.value = false;
}
</script>

<style>

.container1{
  display:grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows:auto;
  border: 1px solid black; 
  border-style:dotted;
  justify-content: center;

}
.containerOverlap{
  grid-area: span 1/2 / 2/2;
  justify-content: center;
  align-items: center; /* Center the content horizontally and vertically */
  width: 350px; /* Set a maximum width for the containerOverlap */
  height:35px;
  margin: 0 auto; /* Center the containerOverlap within its parent */
  margin-top:50px;
  z-index:10;
}
.containerOverlapItem{
  background: radial-gradient(590px at 8.2% 83.8%, rgb(18, 35, 60) 0%, rgb(187, 187, 187) 90%);
  width: 100%;
  height:50%;
  box-sizing: border-box; /* Include padding and border in the total width */
  border: 5px  solid rgb(130, 108, 108); 
  border-style:double;
  border-radius:10px;
  margin-top:-30px;
}

.mainItem{
  grid-area: span 1/2 / 2/2;
}


.btn {
  width: 50px;
  height: 50px;
  background: gray;
  border-radius: 50%;
  color: white;
  margin-left:92%;
  font-size:20px;
}
.btn:hover{
  background: linear-gradient(to bottom, hotpink 0%, tomato 100%);
}
</style>