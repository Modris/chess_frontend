<template>
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
      :board-config="boardConfig" reactive-config
      @board-created="(api) => (boardAPI = api)"
      @checkmate="handleCheckmate"
      @move="handleMove"
      @draw="handleDraw"
    />
  </section>
</template>

<script setup >
import { reactive, ref} from 'vue';
import { TheChessboard,BoardApi } from 'vue3-chessboard';
import 'vue3-chessboard/style.css';


var setPosition = ref('');

function setPositionConfirm(){
    boardAPI.setPosition(setPosition.value);
    console.log(setPosition.value);
}
let boardAPI = BoardApi;
const boardConfig = reactive({
  coordinates: true,
  viewOnly: false,
});

const handleNewGame = () =>{
    boardAPI.resetBoard();
    
    boardConfig.viewOnly = false;
}

const handleUndo = () => {
    boardAPI.undoLastMove();
    boardConfig.viewOnly = false;
}

function handleCheckmate(isMated) {
  if (isMated === 'w') {
    alert('Black wins!');
  } else {
    alert('White wins!');
  }
  boardConfig.viewOnly = true;
}

function handleMove(move) {
  var fen = boardAPI.getFen();
  console.log(fen)
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