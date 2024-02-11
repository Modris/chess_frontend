<template>
<main> 
    <a href="/"> MainPage</a>
    <button @click="getGameHistory">Get Game History</button>
    <button @click="clearConfig5"> Clear config5</button>
    <input v-model="page" placeholder="Page">
    <input v-model="pageSize" placeholder="Page Size">
   <p> Page: {{  page }}. PageSize: {{ pageSize}}</p>
 <p> {{ boardConfig[0]}}</p>
       <section>
             <div>
             <br>
            
             <br>
             </div>
            <!-- -->
            <article >
                <div v-for="(pageSize, index) in pageSize" :key="index" class="grid">
                    <div class="grid-item" >
                    <TheChessboard
                        :board-config="boardConfig[index]"
                        :reactive-config="reactiveConfig"
                        :player-color="playerColorChoice"
                        @board-created="(api) => (boardAPI[index] = api)"
                    />
                    </div>
                    <div class="grid-item" >
                    <p>Lorem ipsum</p>
                    </div>
                </div>
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
 
 const page = ref('0');
 const pageSize = ref(5);
 
 const movesArray = ref([]);
 
 const boardConfig = ref([reactive]);

 
 const  calledHistory = ref(false);
 const getCookie = (name) => {
     const value = `; ${document.cookie}`;
     const parts = value.split(`; ${name}=`);
     if (parts.length === 2) return parts.pop().split(';').shift();
   };
 
 
 
 
 const emit = defineEmits(['server-give-best-move','started-new-game','game-over', 'game-history-user', 'undo-executed'])
 
 const boardAPI = ref([]);
 
 let jsonData = '';
 const numberOfElements = ref(5);
 const getGameHistory = async () => {
     // Get CSRF token from cookie
     const csrfToken = getCookie('XSRF-TOKEN');
     const formData = new FormData();
     formData.append('page', page.value);
     formData.append('pageSize', pageSize.value);
     try {
 
       const response = await fetch('http://localhost:8888/getGameHistory', {
         method: 'POST',
         headers: {
         
          'X-XSRF-TOKEN': csrfToken, // Include CSRF token in the header
         },
         credentials: 'include', // Include cookies in the request
         body: formData,
       });
       
       if (response.ok) {
 
 
             // Parse the JSON data from the response
             jsonData = await response.json();
 
             console.log(response);
             console.log(jsonData.numberOfElements);
             numberOfElements.value = jsonData.numberOfElements;
             for(let i =0; i<numberOfElements.value; i++){
    
               movesArray[i] = jsonData.content[i].moves.split(',');
               boardConfig[i] = ({
                   fen: jsonData.content[i].fen,
                   coordinates: true,
                   viewOnly: true,
                   orientation:  jsonData.content[i].color,
                   animation: {
                   enabled: false,
                   duration: 0,
                 }
               })
 
               //boardConfig1.fen = jsonData.content[0].fen;
              //boardConfig1.orientation = jsonData.content[0].color;
             }
             lastMoves();
             lastMoves();
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
 
   if( boardAPI.value != null  && jsonData != null && movesArray.value != null && numberOfElements.value >0){
       for(let i =0; i<numberOfElements.value; i++){
         if(boardAPI.value[i]){ // otherwise it will cry about boardAPI.value[i] is undefined...
           boardAPI.value[i].move(movesArray[i][movesArray[i].length-1]);
         }
       
       }
   }
 }
 
 
 
 onMounted(async () => {
   //await getGameHistory();
   //lastMoves();
   testing();
 })
 
 
  function clearConfig5(){


        for(let i =0; i<5; i++){
          //boardAPI.value[i].resetBoard();
            movesArray[i] = "a2a3";
              boardConfig.value[i] = reactive({
            fen: "8/8/8/1k5p/7P/1PK5/8/8 w - - 0 1",
            coordinates: true,
            viewOnly: true,
            orientation: 'white',
            animation: {
            enabled: false,
            duration: 0,
            }
            })
           // boardAPI.value[i].resetBoard();
          
          
        }

/*
        for(let i =0; i<5; i++){
          //rnbq1rk1/ppp1npbp/3pp1p1/7P/3PP3/2N1B3/PPP2PP1/R2QKBNR w KQ - 2 7
            boardAPI.value[i].setPosition("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
            boardAPI.value[i].move("a2a3");
    }
    */

 }
 function testing() { 
 
   for(let i =0; i<5; i++){
    movesArray[i] = "f6f2";
   boardConfig[i] = ({
       fen: "3r2k1/p4pbp/1p4p1/4P3/4qP1P/3bK1P1/PB1QNR2/8 w - - 2 32",
       coordinates: true,
       viewOnly: true,
       orientation: 'black',
       animation: {
       enabled: false,
       duration: 0,
     }
    })
 
 }
 calledHistory.value = true;
 }
 
 </script> 
 
 <style scoped>
 
 .grid{
   display:grid;
   grid-template-columns: 300px 700px;
   flex-shrink: 1;
   padding-left: 9.5%;
 }
 
 .grid-item{
   display: flex;
   border: 5px burlywood;
   border-style:double;
   flex-shrink: 1;
 }
 
 .grid-item1{
   display: flex;
   border: 5px burlywood;
   border-style:double;
   flex-shrink: 1;
   width: 300px;
   height: 300px;
 }
 
 
 .grid-item2{
   display: flex;
   border: 5px burlywood;
   border-style:double;
   flex-shrink: 1;
   width: 1000px;
   height: 300px;
 }
 
 
 
 </style>