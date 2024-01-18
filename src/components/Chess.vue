<template>
  <h1> ply number {{ historyPlyCounter}}</h1>
  <h1 v-if="moveHistory.length >0"> Move: {{ moveHistory[historyPlyCounter-1]  }} </h1>
  <div class="gamehistory"> 
    <GameHistoryMove @firstmove-pressed="firstMovePressedHistory" 
    @lastmove-pressed="lastMovePressedHistory" @next-pressed="nextPressedHistory"
     @previous-pressed="previousPressedHistory" 
     :stockfishEloChoice="stockfishEloChoice"/>

    <h1 v-if="winner == 'white' || winner == 'black'"> Winner:... {{ winner }}</h1>
    <div class = "moveHistoryFlexbox">
      <li v-for="item in moveHistory">
        <span> {{  item }}</span>
      </li>
    </div>
    <br><br>
  </div>

<section>
    <div>
    <br>
    <input v-model="setPosition">
    <button @click="setPositionConfirm()"> Set Position </button>
    <br>
      <button @click="boardAPI?.toggleOrientation()">
        Toggle orientation
      </button>
      <button v-if="!hideUndo" @click="handleUndo">Undo</button>
      <button v-else> Undo disabled</button>
      {{ hideUndo}}
    </div>
    <TheChessboard
      :board-config="boardConfig"
      :reactive-config="reactiveConfig"
      :player-color="playerColorChoice"
      @board-created="(api) => (boardAPI = api)"
      @checkmate="handleCheckmate"
      @move="handleMove"
      @draw="handleDraw"
    />
  </section>
</template>

<script setup >

import { reactive, ref, watch, nextTick } from 'vue';
import { TheChessboard,BoardApi } from 'vue3-chessboard';
import 'vue3-chessboard/style.css';
import GameHistoryMove from '@/components/GameHistoryMove.vue';
const playerColorChoice = ref('abc');
const stockfishEloChoice = ref(1500);
const setPosition = ref('');
const stockfishColor = ref('');
const reactiveConfig = true;
const moveHistory = ref([]);

function setPositionConfirm(){
    boardAPI.setPosition(setPosition.value);
    console.log(setPosition.value);
}
let boardAPI = BoardApi;

const boardConfig = reactive({
  coordinates: true,
  viewOnly: false,
  autoCastle: true,
  orientation: playerColorChoice,
  turnColor: 'white',
});

const hideUndo = ref(true); // by default hide;
const handleUndo = () => {
  if(boardAPI.getTurnColor() == stockfishColor.value){
    hideUndo.value = true;
  } else{
    hideUndo.value = false;
    boardAPI.undoLastMove();
    boardAPI.undoLastMove();

     fen.value = 'undo'; // reset fen to undo so the watcher in websocket with the new move will update
    // the server move depends on current fen. If fen is the same with undo then there will be no stockfish call.
    emit('server-give-best-move', fen.value);
    boardConfig.viewOnly = false;
  }
}
const winner = ref('');


const emit = defineEmits(['server-give-best-move','started-new-game','game-over', 'game-history-user'])

const props = defineProps({
  stockfishMove: String,
  startNewGame: Object,
    chosenColor: Object,
    stockfishEloChosen: Object,
})
const userFen = ref('');
watch(() => props.stockfishMove, (newstockfishMove) => {
      if(boardConfig.viewOnly != true && boardAPI.getTurnColor() == stockfishColor.value){
        userFen.value = boardAPI.getFen();
        boardAPI.move(newstockfishMove);

      }
})


watch( () => props.startNewGame.value,async (newstartNewGame) => {
      if(newstartNewGame == true){
        playerColorChoice.value = props.chosenColor.value;
        stockfishEloChoice.value = props.stockfishEloChosen.value;
        hideUndo.value = true; //1st move, disable undo button.
        if(props.chosenColor.value == 'white'){
          stockfishColor.value = 'black';
        } else if (props.chosenColor.value == 'black'){
          stockfishColor.value = 'white';
        }
        moveHistory.value.length = 0;
        
        //handleNewGame();
        
       await(nextTick);
        if( playerColorChoice.value = props.chosenColor.value){
          handleNewGame(); // For some reason on the 1st call the player-color binding doesn't execute
          // even though it is correctly set. I think it has to do with the async sequence. Not sure. 
          emit('started-new-game');
        }
      

      }
})
const fen = ref('');

function handleNewGame() {
    boardAPI.resetBoard();
    winner.value = '';
    boardConfig.viewOnly = false;
    fen.value = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    emit('server-give-best-move', fen.value); // for updating fen value to starting as White.
    if(stockfishColor.value == boardAPI.getTurnColor()){
      handleMove();
    }
}

function handleMove() {
  if(boardAPI.getLastMove()){
    moveHistory.value.push(boardAPI.getLastMove().lan);
  }else {
        console.error('Last move is undefined');
      }


  if(boardConfig.viewOnly != true && boardAPI.getTurnColor() == playerColorChoice.value){

    
    //moveHistory.value = moveHistory.value +','+boardAPI.getLastMove();
    //emit('game-history-user', userFen.value, boardAPI.getLastMove().lan); // save user move to game history
    hideUndo.value = false;
  } else if(boardConfig.viewOnly != true && stockfishColor.value == boardAPI.getTurnColor()){
    hideUndo.value = true;
     fen.value = boardAPI.getFen();
    emit('server-give-best-move', fen.value); 
  }
}

function handleDraw() {

  let isDraw = boardAPI.getIsDraw();
  let isStalemate = boardAPI.getIsStalemate();
  let isTreeFoldRepetition = boardAPI.getIsThreefoldRepetition();
  let isInsufficientMaterial = boardAPI.getIsInsufficientMaterial();
  boardConfig.viewOnly = true;
  hideUndo.value = true;
  emit('game-over', 'end');
  if(isDraw && isStalemate){
    alert('Draw. Stalemate.');
  } else if(isDraw && isTreeFoldRepetition){
    alert('Draw. Three fold repetition.');
  } else if(isDraw && isInsufficientMaterial){
    alert('Draw. Insufficient Material.');
  } else{
    alert('Draw.');
  }
}
function handleCheckmate(isMated) {
  emit('game-over', 'end');
  hideUndo.value = true;
  boardConfig.viewOnly = true;
  if(isMated == 'white'){
   // alert("Black wins");
    winner.value = 'black';
  } else if(isMated == 'black'){
   // alert("White wins");
   winner.value = 'white';
  }

  
}
function historyStart(fen, move){

    boardConfig.viewOnly = true;
    boardAPI.setPosition(fen);
    boardAPI.move(move);
}

const isViewingHistory = ref(false);
const historyPlyCounter = ref(0);

function previousPressedHistory(){
  if( isViewingHistory.value == true){
    if( historyPlyCounter.value >=2){
      historyPlyCounter.value = historyPlyCounter.value -1;
    boardAPI.viewPrevious();
    }
  } else{
    isViewingHistory.value = true;
    historyPlyCounter.value =  boardAPI.getCurrentPlyNumber()-1;
    boardAPI.viewPrevious();
  }
}


function  nextPressedHistory(){
  if( isViewingHistory.value == true){
    if(historyPlyCounter.value < boardAPI.getCurrentPlyNumber() )
    historyPlyCounter.value = historyPlyCounter.value+1;
     boardAPI.viewNext();
   }
  }


function  firstMovePressedHistory(){
  if(boardAPI.getCurrentPlyNumber() >0){

    boardAPI.viewHistory(1);
    isViewingHistory.value = true;
    historyPlyCounter.value = 1;
  }
}
function  lastMovePressedHistory(){
  boardAPI.stopViewingHistory();
  isViewingHistory.value = false;
  historyPlyCounter.value = boardAPI.getCurrentPlyNumber();
  
}

</script>

<style scoped>
.moveHistoryFlexbox{
  display:flex;
  gap:20px;
  flex-wrap:wrap;
  width:100px;  

}
.moveHistoryFlexbox li {
    list-style-type: none;
}
</style>