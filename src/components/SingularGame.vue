<template>
    <br> <br>
   <div v-if="noContent"> <h1> Could not find game with ID: {{ route.params.id }}. </h1></div>

    <button  class="btn42" @click="boardAPI?.toggleOrientation()"> Flip Board </button> 
    <br> <br>
    <main class = "grid"> 
    <section class="grid-singular"> 
            <div >
                <TheChessboard
              :board-config="boardConfig"
              :reactive-config="reactiveConfig"
              :player-color="playerColorChoice"
              @board-created="(api) => (boardAPI = api)"
            />
            </div>
      

    
      <div class="gridItem2"> 
        <div class="gameHistoryItem1 biggerText"> 
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

        <div class="gameHistoryItem5">  
            <h1 class="winnerChicken"> {{ winner }}</h1>
          
         </div>
       </div>
    </section> 
    </main>
    </template>
    
<script setup >
    
    import { reactive, ref, watch, nextTick, onMounted, watchEffect  } from 'vue';
    import { TheChessboard,BoardApi } from 'vue3-chessboard';
    import 'vue3-chessboard/style.css';
    import GameHistoryMove from '@/components/GameHistoryMove.vue';

    import { useRoute, useRouter} from 'vue-router';
    const route = useRoute();
    const router = useRouter();


    const playerColorChoice = ref('abc');
    const stockfishEloChoice = ref(1500);
    const stockfishColor = ref('');
    const reactiveConfig = true;

    const moveHistory = ref([]);
    //const moveHistory = ref(['a2a3','a4b5','c2c3','d4d2','e5e3','a2a3','a4b5','c2c3','d4d2','e5e3','a2a3','a4b5','c2c3','d4d2','e5e3','a2a3','a4b5','c2c3','d4d2','e5e3','a2a3','a4b5','c2c3','d4d2','e5e3','a2a3','a4b5','c2c3','d4d2','e5e3','a2a3','a4b5','c2c3','d4d2','e5e3','a2a3','a4b5','c2c3','d4d2','e5e3','a2a3','a4b5','c2c3','d4d2','e5e3','a2a3','a4b5','c2c3','d4d2','e5e3']);
   
    const winner = ref('');
    const fen = ref('');
    const wins = ref(0);
    let jsonData = '';
    
    let boardAPI = BoardApi;
    
    const boardConfig = reactive({
      coordinates: true,
      viewOnly: true,
      autoCastle: true,
      orientation: playerColorChoice
    });
    

    const elo = ref('');
    const color = ref('');
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
    const isViewingHistory = ref(false);
    const historyPlyCounter = ref(0);
    const numberScroll = ref(0);

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
 
const noContent = ref(true);

const getGame = async () => {


try {

  //const response = await fetch(`http://localhost:8888/get/game/${route.params.id}`, {
    const response = await fetch(`https://slychess.com/get/game/${route.params.id}`, {
    method: 'GET',
  });
  
  if (response.status == 204){
      noContent.value = true;
  }
  if (response.status == 200) {
    noContent.value = false;
        // Parse the JSON data from the response

        jsonData = await response.json();
        stockfishEloChoice.value = jsonData.elo;
        winner.value = jsonData.winner;
        playerColorChoice.value = jsonData.color;
        wins.value = jsonData.wins;
        moveHistory.value = jsonData.moves.split(',');
        await nextTick();
     
        let config = { // reactive doesn't require .value
                  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                  coordinates: true,
                  viewOnly: true,
                  orientation:  playerColorChoice.value,
                  animation: {
                  enabled: false,
                  duration: 0,
                }
         }
         boardAPI.setConfig(config); 
  
   
          for(let i =0; i<moveHistory.value.length; i++){
          boardAPI.move(moveHistory.value[i]);
          }

         setTimeout(loadPgn, 100); // this is required when move count is above 197. 
         // The move array will be correct and history will work but the board position upon loading 
         // will be a few moves back. This is why we loadPGN afterwards.
         setTimeout(scrollToBottom, 100);
       //  let lastMove = moveHistory.value.length-1;
         //boardAPI.move(moveHistory.value[lastMove]);

    } else {
        // Handle error cases, for example, log an error message
        console.error('Failed to fetch gane:', response.statusText);
    }
} catch (error) {
  console.error('Fetching game error ', error);
}
}
function loadPgn(){
       
  let pgn = boardAPI.getPgn();
   boardAPI.loadPgn(pgn);
 
}
 onMounted(  () => {
  getGame();
})

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
      margin-top:-10px;
    
    }
    
     li {
        list-style-type: none;
    }
    .highlight{
      background-color:darkgray;
    }
    .grid{
      display: grid;
      grid-template-columns: 90%;
      align-items: center;
      justify-content: center;
      margin-left: 24%;
    
    }
    .grid-singular{
        display: flex;
    }

    .gridItem2{
    
      display:grid;
      grid-template-columns: 1fr 1fr 1fr;
      justify-content: center;
      align-items:center;
      border: 5px darkgray;
      border-style:double;

      
    background: radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%);
    
      width:300px;
      margin-top:66px;
      margin-bottom:100px;
    
    }
    .gameHistoryItem1{
    grid-area: 1/1/1/4;

    
    }
    .gameHistoryItem2{
      grid-area: 2/1/2/4;
      z-index: 5;

    }
    .gameHistoryItem2Child{
      display: flex;
      flex-grow: 1;
      justify-content: center;
    }
    .gameHistoryItem3{
      z-index: 4;
      grid-area: 3/1/4/5;
 
  
    }
  
    
    .gameHistoryItem5{
      grid-area:  5/1/5/4;
      

    }
    .test{
      margin-top:-20px;
      display:flex;
      align-self: flex-start;
    }
    
    .biggerText{
      padding:4px;
      font-size:30px;
      justify-content: center;
      text-align:center;
    }
    .winnerChicken{
      font-size:34px;
      margin-top:20px;
    }
    .moveHistory{
        font-size:30px;
    }
    
    
    .btn42 {
      padding:6px;
      font-size:24px;
    
    }
    
    .btn42:hover{
      background:white;
    }
    


    </style>