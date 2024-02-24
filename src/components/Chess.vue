<template>
<main class = "grid"> 
  <section class="section1">
        <div>
        <br>

      
        <br>
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

  <div class="gridItem2"> 
    <div class="gameHistoryItem1 biggerText"> 
      <button :class="{'websocket_online': !websocketStatus, 'websocket_offline': websocketStatus}"> &nbsp; &nbsp;</button>
        <span> Stockfish elo: {{ stockfishEloChoice}} </span> </div>
    <div class="gameHistoryItem2">
      <div class="gameHistoryItem2Child"> <GameHistoryMove @firstmove-pressed="firstMovePressedHistory" 
                @lastmove-pressed="lastMovePressedHistory" @next-pressed="nextPressedHistory"
                @previous-pressed="previousPressedHistory" 
               :stockfishEloChoice="stockfishEloChoice"/>
      </div>
    </div>
    <div class="gameHistoryItem3"> 
      <div id="scroller" class = "moveHistoryFlexbox"> 
      <h1 class="moveHistory" v-if="moveHistory.length == 0"> Move History</h1>
      <li v-for="(item,index) in moveHistory">
        <span v-bind:class="{ 'highlight': 
              (isViewingHistory && moveHistory.length > 0 && index == historyPlyCounter-1 && moveHistory[historyPlyCounter - 1] === item) ||
              (!isViewingHistory && moveHistory[moveHistory.length - 1] === item && index == moveHistory.length-1)
                }">
              {{ index+1 }}   {{ item }} 
          </span>
      </li>
     </div>
   
    </div>
    <div class="gameHistoryItem4"> 
     
      <div v-if="!gameOver" class="gameHistoryItem4Flexbox"> 
        
          <div> 
            <button  class="btn42" v-bind:class="{'btn43': !resignAllowed}" @click="handleResign"> Resign</button>
          </div>  
          <div> 
          <button  class="btn42" @click="boardAPI?.toggleOrientation()"> Flip Board </button> 
          </div>
          <div> 
          <button   class="btn42" v-bind:class="{'btn43': hideUndo}" @click="handleUndo">Undo</button> 
          </div>
      </div>
    </div>
    <div class="gameHistoryItem4Overlap"> 
      <div class="gameHistoryItem4OverlapFlexbox">
         <h1 class="winnerChicken"> {{ winner }}</h1> 
      </div>
    </div>
 
   </div>
  

</main>
</template>

<script setup >

import { reactive, ref, watch, nextTick } from 'vue';
import { TheChessboard,BoardApi } from 'vue3-chessboard';
import 'vue3-chessboard/style.css';
import GameHistoryMove from '@/components/GameHistoryMove.vue';
const playerColorChoice = ref('abc');
const stockfishEloChoice = ref(1500);
const stockfishColor = ref('');
const reactiveConfig = true;
const moveHistory = ref([]);
const moveHistoryFen = ref([]);
const result = ref('');
const emit = defineEmits(['save-game','server-give-best-move','started-new-game','game-over', 'game-history-user', 'undo-executed'])



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

  if (!hideUndo.value && boardConfig.viewOnly != true && boardAPI.getTurnColor() == stockfishColor.value){
    hideUndo.value = true;
  } else if (!hideUndo.value && boardConfig.viewOnly != true){ 
    hideUndo.value = false;
    boardAPI.undoLastMove();
    boardAPI.undoLastMove();
    moveHistory.value.length -=2;
    moveHistoryFen.value.length -=2;
     fen.value = 'undo'; // reset fen to undo so the watcher in websocket with the new move will update
    // the server move depends on current fen. If fen is the same with undo then there will be no stockfish call.
    emit('server-give-best-move', fen.value);
    boardConfig.viewOnly = false;

    emit('undo-executed'); // this is neccessary so after undo even if the same stockfish move is called it will
    // execute. Because i have a watcher based on stockfishmove...
  }
}
const winner = ref('');
const gameOver = ref(false);


const props = defineProps({
  stockfishMove: String,
  startNewGame: Object,
    chosenColor: Object,
    stockfishEloChosen: Object,
    websocketStatus: Boolean,
})
const userFen = ref('');
watch(() => props.stockfishMove, (newstockfishMove) => {
      if(boardConfig.viewOnly != true && boardAPI.getTurnColor() == stockfishColor.value){
        userFen.value = boardAPI.getFen();
        boardAPI.move(newstockfishMove);
      }
})

const resignAllowed = ref(false);
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
        moveHistoryFen.value.length = 0;
        historyPlyCounter.value = 0;
        resignAllowed.value = true;
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
    gameOver.value = false;
    boardConfig.viewOnly = false;
    fen.value = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    //emit('server-give-best-move', fen.value); // for updating fen value to starting as White.
    emit('undo-executed')
    if(stockfishColor.value == boardAPI.getTurnColor()){
      handleMove();
    } else if(boardAPI.getTurnColor() == playerColorChoice.value){
      
    }
}

function handleMove() {

    if(boardAPI.getCurrentPlyNumber() != 0){
    moveHistory.value.push(boardAPI.getLastMove().lan);
    moveHistoryFen.value.push(boardAPI.getFen());
  }
  if(boardConfig.viewOnly != true && boardAPI.getTurnColor() == playerColorChoice.value && boardAPI.getCurrentPlyNumber() > 1){

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
  
  resignAllowed.value = false;
  let isDraw = boardAPI.getIsDraw();
  let isStalemate = boardAPI.getIsStalemate();
  let isTreeFoldRepetition = boardAPI.getIsThreefoldRepetition();
  let isInsufficientMaterial = boardAPI.getIsInsufficientMaterial();
  boardConfig.viewOnly = true;
  hideUndo.value = true;
  emit('game-over', 'end');
  if(isDraw && isStalemate){
    winner.value = 'Draw. Stalemate.';
  } else if(isDraw && isTreeFoldRepetition){
    winner.value = 'Draw. Three fold repetition.';
  } else if(isDraw && isInsufficientMaterial){
    winner.value = 'Draw. Insufficient Material.';
  } else{
    winner.value = 'Draw.';
  }
  gameOver.value = true;
  result.value = "Draw";
  saveGame();
}
function handleCheckmate(isMated) {
  
  resignAllowed.value = false;
  emit('game-over', 'end');
  hideUndo.value = true;
  boardConfig.viewOnly = true;
  if(isMated == 'white'){
   // alert("Black wins");
    winner.value = 'Black is victorious';
    if(playerColorChoice.value == 'black'){
      result.value = "Win";
    } else {
      result.value = "Loss";
    }
  } else if(isMated == 'black'){
   // alert("White wins");
   if(playerColorChoice.value == 'white'){
      result.value = "Win";
    } else {
      result.value = "Loss";
    }
   winner.value = 'White is victorious';
  } 
  gameOver.value = true;
  saveGame();
}

function handleResign(){
  if(boardConfig.viewOnly != true && playerColorChoice.value != 'abc'){
    hideUndo.value = true;
    let firstLetter = playerColorChoice.value.charAt(0).toUpperCase();
    let restOfString = playerColorChoice.value.substring(1);
    winner.value = firstLetter+restOfString+' resigns.';
    gameOver.value = true;
    boardConfig.viewOnly = true;
    resignAllowed.value = false;

    result.value = "Loss";
    saveGame();
  }
}

function  saveGame(){

  emit('save-game', result.value, moveHistory, moveHistoryFen, winner.value, playerColorChoice.value, stockfishEloChoice.value);

}


watch(moveHistory.value, () => {
  // Use nextTick to wait for the DOM to update before scrolling
  nextTick(() => {
    scrollToBottom();
  });
});

const currentHistoryPosition = ref(0);
    const maxScrollHeight = ref(0);

    function scrollToBottom(){
      let scroller = document.querySelector("#scroller");
       currentHistoryPosition.value = scroller.scrollHeight;
       maxScrollHeight.value = scroller.scrollHeight;
      scroller.scrollTo({ top:  currentHistoryPosition.value});
    }
    function scrollToTop(){
      let scroller = document.querySelector("#scroller");
       currentHistoryPosition.value = 0;
      scroller.scrollTo({ top:  currentHistoryPosition.value});
    }

    function scrollToBottomSlightly(){
      let scroller = document.querySelector("#scroller");
      if(currentHistoryPosition.value == 0){
        currentHistoryPosition.value = currentHistoryPosition.value-30;
      } 
      currentHistoryPosition.value = currentHistoryPosition.value+13;
      if(currentHistoryPosition.value > maxScrollHeight.value-90 ){
        currentHistoryPosition.value =  maxScrollHeight.value;
      }
        scroller.scrollTo({ top:  currentHistoryPosition.value});
  
    }
    function scrollToTopSlightly(){
      
      let scroller = document.querySelector("#scroller");
      if(currentHistoryPosition.value == scroller.scrollHeight){
        currentHistoryPosition.value = currentHistoryPosition.value-90;
      } 

       currentHistoryPosition.value = currentHistoryPosition.value-13;

       if(currentHistoryPosition.value <0){
        currentHistoryPosition.value = 0;
      }
      scroller.scrollTo({ top:  currentHistoryPosition.value});

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
        scrollToTopSlightly();
        }
      } else if( boardAPI.getCurrentPlyNumber() > 1) {
        isViewingHistory.value = true;
        historyPlyCounter.value =  boardAPI.getCurrentPlyNumber()-1;
        boardAPI.viewPrevious();
        scrollToTopSlightly();
     
      }
    }
    
    
    function  nextPressedHistory(){
      if( isViewingHistory.value == true){
        if(historyPlyCounter.value < boardAPI.getCurrentPlyNumber() )
        historyPlyCounter.value = historyPlyCounter.value+1;
         boardAPI.viewNext();
         scrollToBottomSlightly();
       }
      }
    
    
    function  firstMovePressedHistory(){

    
      if(boardAPI.getCurrentPlyNumber() >0){
    
        boardAPI.viewHistory(1);
        isViewingHistory.value = true;
        historyPlyCounter.value = 1;
        scrollToTop();
      }
    }
    function  lastMovePressedHistory(){
      boardAPI.stopViewingHistory();
      isViewingHistory.value = false;
      historyPlyCounter.value = boardAPI.getCurrentPlyNumber();
      scrollToBottom();
      
    }



</script>

<style scoped>
.moveHistoryFlexbox{
  display:flex;
  justify-content: center;
  gap:20px;
  flex-wrap:wrap;
  width:240px;  
  height: 100px;
  overflow-y: auto;
  padding:30px;
  margin-top:-30px;

}

 li {
    list-style-type: none;
}
.highlight{
  background-color:darkgray;
}
.grid{
  display: grid;
  grid-template-columns: 1fr 1fr;
 

}
.gridItem2{
  display:grid;
  grid-template-columns: 1fr;
  justify-content: center;
  align-items:center;
  border: 5px darkgray;
  border-style:double;
  
background: radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%);

  width:300px;
  margin-top:100px;
  margin-bottom:100px;
  padding: 0px;
  grid-gap: 20px;
  
}
.gameHistoryItem1{
grid-area: 1/1/1/4;


}
.gameHistoryItem2{
  grid-area: 2/1/2/4;
  z-index:5;

}
.gameHistoryItem2Child{
      display: flex;
      flex-grow: 1;
      justify-content: center;

    

    }
.gameHistoryItem3{

  grid-area: 3/1/3/4;


}
.gameHistoryItem4{
  grid-area:  4/1/4/4;
  z-index:6;
  height:60px;
}
.gameHistoryItem4Flexbox{
  display:flex;

  justify-content: center;

}
.gameHistoryItem4Overlap{
  grid-area: 4/1/4/4;
  z-index:5;
  margin-top:-30px;

}


.biggerText{
  padding: 0;
  margin: 0;
  font-size:30px;
  justify-content: center;
  text-align:center;
}
.winnerChicken{
  font-size:40px;
  padding: 0;
  margin: 0;
}
.gameHistoryItem4OverlapFlexbox{
  display: flex;
  flex-shrink: 1;
  justify-content: center;
}


.btn42 {
  padding:6px;
  font-size:24px;

}

.btn42:hover{
  background:white;
}

.btn43{
  padding:6px;
  font-size:24px;
  background-color:#F08080;
}
.btn43:hover{
  background:white;
}

.websocket_online{
  font-size:20px;
  border-radius: 50%;
  background-color:green;

}
.websocket_offline{
  font-size:20px;
  border-radius: 50%;
  background-color:#F08080;
}
</style>