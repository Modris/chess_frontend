<template>
  <h1> Stockfish Elo: {{   stockfishEloChoice}}.</h1>
  <h1 v-if="winner == 'white' || winner == 'black'"> Winner:... {{ winner }}</h1>
<section>
    <div>
    <br>
    <input v-model="setPosition">
    <button @click="setPositionConfirm()"> Set Position </button>
    <br>
      <button @click="boardAPI?.toggleOrientation()">
        Toggle orientation
      </button>
      <button @click="handleNewGame">New Game</button>
      <button @click="handleUndo">Undo</button>
      <button @click="boardAPI?.toggleMoves()">Hints</button>
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

var playerColorChoice = ref('abc');
var stockfishEloChoice = ref(1600);
var setPosition = ref('');
var stockfishColor = ref('');
const reactiveConfig = true;

function setPositionConfirm(){
    boardAPI.setPosition(setPosition.value);
    console.log(setPosition.value);
}
let boardAPI = BoardApi;

var boardConfig = reactive({
  coordinates: true,
  viewOnly: false,
  autoCastle: true,
  orientation: playerColorChoice,
  turnColor: 'white',
});



const handleUndo = () => {
    boardAPI.undoLastMove();
    boardAPI.undoLastMove();

    var fen = 'undo'; // reset fen to undo so the watcher in websocket with the new move will update
    // the server move depends on current fen. If fen is the same with undo then there will be no stockfish call.
    emit('server-give-best-move', fen);
    boardConfig.viewOnly = false;
}
var winner = ref('');
function handleCheckmate(isMated) {
  if(isMated == 'white'){
   // alert("Black wins");
    winner = 'black';
  } else if(isMated == 'black'){
   // alert("White wins");
    winner= 'white';
  }

  boardConfig.viewOnly = true;
}

const emit = defineEmits(['server-give-best-move','started-new-game'])

const props = defineProps({
  stockfishMove: String,
  startNewGame: Object,
    chosenColor: Object,
    stockfishEloChosen: Object,
})

watch(() => props.stockfishMove, (newstockfishMove) => {
      if(boardConfig.viewOnly != true && boardAPI.getTurnColor() == stockfishColor.value){
        boardAPI.move(newstockfishMove);
      }
})


watch( () => props.startNewGame.value,async (newstartNewGame) => {
      if(newstartNewGame == true){

        playerColorChoice.value = props.chosenColor.value;
        stockfishEloChoice.value = props.stockfishEloChosen.value;
        if(props.chosenColor.value == 'white'){
          stockfishColor.value = 'black';
        } else if (props.chosenColor.value == 'black'){
          stockfishColor.value = 'white';
        }
        handleNewGame();
       await(nextTick);
        if( playerColorChoice.value = props.chosenColor.value){
          emit('started-new-game');
          handleNewGame(); // For some reason on the 1st call the player-color binding doesn't execute
          // even though it is correctly set. I think it has to do with the async sequence. Not sure. 
        }
      

      }
})
function handleNewGame() {
  console.log("handle new game:"+playerColorChoice.value)
    boardAPI.resetBoard();
    winner = '';
    boardConfig.viewOnly = false;
    if(stockfishColor.value == boardAPI.getTurnColor()){
      handleMove();
      console.log("stockfish")
    }
}

function handleMove() {
  if(boardConfig.viewOnly != true && stockfishColor.value == boardAPI.getTurnColor()){
    var fen = boardAPI.getFen();
    emit('server-give-best-move', fen);
  }
}

function handleDraw() {

  var isDraw = boardAPI.getIsDraw();
  var isStalemate = boardAPI.getIsStalemate();
  var isTreeFoldRepetition = boardAPI.getIsThreefoldRepetition();
  var isInsufficientMaterial = boardAPI.getIsInsufficientMaterial();
  boardConfig.viewOnly = true;
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

</script>