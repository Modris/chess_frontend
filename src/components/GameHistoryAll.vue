<template>
   <a href="/"> MainPage</a>
   <button @click="getGameHistory">Get Game History</button>
    <main class = "grid"> 
     
      <section>
            <div>
            <br>
            <br>
            </div>
          <article v-if = "calledHistory" class = "grid"> 
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
    
import { onMounted, reactive, ref, watch, nextTick } from 'vue';
import { TheChessboard,BoardApi } from 'vue3-chessboard';
import 'vue3-chessboard/style.css';
import GameHistoryMove from '@/components/GameHistoryMove.vue';
const playerColorChoice = ref('abc');
const reactiveConfig = true;



const movesArray1 = ref('');
const movesArray2 = ref('');
const movesArray3 = ref('');
const movesArray4 = ref('');
const movesArray5 = ref('');

const  calledHistory = ref(false);
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };




const emit = defineEmits(['server-give-best-move','started-new-game','game-over', 'game-history-user', 'undo-executed'])


let boardAPI1 = BoardApi;
let boardAPI2 = BoardApi; 
let boardAPI3 = BoardApi;  
let boardAPI4 = BoardApi; 
let boardAPI5 = BoardApi;
    


function handleBoardCreated1(api) {
  boardAPI1 = api;
}

function handleBoardCreated2(api) {
  boardAPI2 = api;
}

function handleBoardCreated3(api) {
  boardAPI3 = api;
}

function handleBoardCreated4(api) {
  boardAPI4 = api;
}

function handleBoardCreated5(api) {
  boardAPI5 = api;
}

const boardConfig1 = reactive({
  coordinates: true,
  viewOnly: true,
  animation: {
    enabled: false,
    duration: 0,
  }
});

const boardConfig2 = reactive({
  coordinates: true,
  viewOnly: true,
  animation: {
    enabled: false,
    duration: 0,
  }
});

const boardConfig3 = reactive({

  coordinates: true,
  viewOnly: true,
  animation: {
    enabled: false,
    duration: 0,
  }
});

const boardConfig4 = reactive({
  coordinates: true,
  viewOnly: true,
  animation: {
    enabled: false,
    duration: 0,
  }
});
const boardConfig5 = reactive({
  coordinates: true,
  viewOnly: true,
  animation: {
    enabled: false,
    duration: 0,
  }
});
let jsonData = '';
const getGameHistory = async () => {
    // Get CSRF token from cookie
    const csrfToken = getCookie('XSRF-TOKEN');
    try {
      // Send a POST request to /logout with the CSRF token
      const response = await fetch('http://localhost:8888/getGameHistory', {
        method: 'GET',
        headers: {
        
         'X-XSRF-TOKEN': csrfToken, // Include CSRF token in the header
        },
        credentials: 'include', // Include cookies in the request

      });
      if (response.ok) {
            // Parse the JSON data from the response
            jsonData = await response.json();
            
            movesArray1.value = jsonData[0].moves.split(',');
             movesArray2.value = jsonData[1].moves.split(',');
             movesArray3.value = jsonData[2].moves.split(',');
             movesArray4.value = jsonData[3].moves.split(',');
             movesArray5.value = jsonData[4].moves.split(',');

             //fen1.value = jsonData[0].fen;
             boardConfig1.fen = jsonData[0].fen;
             boardConfig2.fen  = jsonData[1].fen;
             boardConfig3.fen = jsonData[2].fen;
             boardConfig4.fen = jsonData[3].fen;
             boardConfig5.fen = jsonData[4].fen;

             boardConfig1.orientation = jsonData[0].color;
             boardConfig2.orientation = jsonData[1].color;
             boardConfig3.orientation = jsonData[2].color;
             boardConfig4.orientation = jsonData[3].color;
             boardConfig5.orientation = jsonData[4].color;
             calledHistory.value = true;


        } else {
            // Handle error cases, for example, log an error message
            console.error('Failed to fetch game history:', response.statusText);
        }
    } catch (error) {
      console.error('Saving Game into Database Error: ', error);
    }
}

function lastMoves(){
  console.log("last moves called.");
  if( typeof boardAPI1.move === 'function' && 
    typeof boardAPI2.move === 'function' &&
    typeof boardAPI3.move === 'function' &&
    typeof boardAPI4.move === 'function' &&
    typeof boardAPI5.move === 'function' && jsonData != null){
      console.log("we in lastMoves if");
      boardAPI1.move(movesArray1.value[movesArray1.value.length-1]);
      boardAPI2.move(movesArray2.value[movesArray2.value.length-1]);
      boardAPI3.move(movesArray3.value[movesArray3.value.length-1]);
      boardAPI4.move(movesArray4.value[movesArray4.value.length-1]);
      boardAPI5.move(movesArray5.value[movesArray5.value.length-1]);
  }
}

onMounted(async () => {
  await getGameHistory();
  lastMoves();

})
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
  border: 5px burlywood;
  border-style:double;
  flex-shrink: 1;
}



</style>