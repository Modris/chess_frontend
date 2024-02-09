<template>
   <a href="/"> MainPage</a>

    <main class = "grid"> 
     
      <section>
            <div>
            <br>
            <input v-model="setPosition">
            <button @click="setPositionConfirm()"> Set Position </button>
            <button @click="setMoveLast()"> f6g7 </button>
          
            <br>
            </div>
          <article class = "grid"> 
            <div class = "grid-item"> 
              <TheChessboard
              :board-config="boardConfig1"
              :reactive-config="reactiveConfig"
              :player-color="playerColorChoice"
              @board-created="handleBoardCreated1" />
            </div>
            <div class = "grid-item"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>
        
             <div class = "grid-item"> 
              <TheChessboard
              :board-config="boardConfig2"
              :reactive-config="reactiveConfig"
              :player-color="playerColorChoice"
              @board-created="handleBoardCreated2" />
            </div>
            <div class = "grid-item"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. </div>
            <div class = "grid-item"> 
              <TheChessboard
              :board-config="boardConfig3"
              :reactive-config="reactiveConfig"
              :player-color="playerColorChoice"
              @board-created="handleBoardCreated3" />
            </div>
            <div class = "grid-item"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. </div>
             <div class = "grid-item"> 
              <TheChessboard
              :board-config="boardConfig4"
              :reactive-config="reactiveConfig"
              :player-color="playerColorChoice"
              @board-created="handleBoardCreated4" />
            </div>
            <div class = "grid-item"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>
            <div class = "grid-item"> 
              <TheChessboard
              :board-config="boardConfig5"
              :reactive-config="reactiveConfig"
              :player-color="playerColorChoice"
              @board-created="handleBoardCreated5" />
            </div>
            <div class = "grid-item"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. </div>
          </article>
      </section>
    
      
    
    </main>
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
const emit = defineEmits(['server-give-best-move','started-new-game','game-over', 'game-history-user', 'undo-executed'])

function setPositionConfirm(){
        boardAPI.setPosition(setPosition.value);
        console.log(setPosition.value);
}
let boardAPI1 = BoardApi;
let boardAPI2 = BoardApi; 
let boardAPI3 = BoardApi;  
let boardAPI4 = BoardApi; 
let boardAPI5 = BoardApi;
    


function handleBoardCreated1(api) {
  boardAPI1 = api;
  boardAPI1.move("f6g7");
}

function handleBoardCreated2(api) {
  boardAPI2 = api;
  boardAPI2.move("a2a3");
}

function handleBoardCreated3(api) {
  boardAPI3 = api;
  boardAPI3.move("a2a4");
}

function handleBoardCreated4(api) {
  boardAPI4 = api;
  boardAPI4.move("h7h6");
}

function handleBoardCreated5(api) {
  boardAPI5 = api;
  boardAPI5.move("e8e7");
}

const boardConfig1 = reactive({
  fen: "8/7K/5q2/4q3/6p1/6k1/8/8 b - - 11 67",
  coordinates: true,
  viewOnly: false,
  orientation: playerColorChoice,
  turnColor: 'white',
  animation: {
    enabled: false,
    duration: 0,
  }
});

const boardConfig2 = reactive({
  fen: "rnbqkb1r/ppp1pp1p/6p1/3n4/3P4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 1",
  coordinates: true,
  viewOnly: false,
  orientation: playerColorChoice,
  turnColor: 'white',
  animation: {
    enabled: false,
    duration: 0,
  }
});

const boardConfig3 = reactive({
  fen: "rnbqkb1r/pp3ppp/3ppn2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 1",
  coordinates: true,
  viewOnly: false,
  orientation: playerColorChoice,
  turnColor: 'white',
  animation: {
    enabled: false,
    duration: 0,
  }
});

const boardConfig4 = reactive({
  fen: "rnbqkb1r/ppppp1pp/5n2/6B1/3Pp3/2N5/PPP2PPP/R2QKBNR b KQkq - 0 1",
  coordinates: true,
  viewOnly: false,
  orientation: playerColorChoice,
  turnColor: 'white',
  animation: {
    enabled: false,
    duration: 0,
  }
});
const boardConfig5 = reactive({
  fen: "4r3/8/8/5R2/4P1k1/4K3/8/8 b - - 0 1",
  coordinates: true,
  viewOnly: false,
  orientation: playerColorChoice,
  turnColor: 'white',
  animation: {
    enabled: false,
    duration: 0,
  }
});

</script> 

<style scoped>

.grid{
  display:grid;
  grid-template-columns: 300px 700px;
  flex-shrink: 1;
  padding-left: 6.5%;
}

.grid-item{
  display: flex;
  border-color: 5px green;
  border-style:dotted;
  flex-shrink: 1;
}



</style>