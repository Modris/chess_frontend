<template>
   <main> 
   <a href="/"> MainPage</a>
   <button @click="getGameHistory">Get Game History</button>
   <button @click="lastMoves"> lastMoves</button>
   <input v-model="page" placeholder="Page">
   <input v-model="pageSize" placeholder="Page Size">
  <p> Page: {{  page }}. PageSize: {{ pageSize}}</p>
    <p> {{ boardConfig[0]}}</p>
  <br><br>
            <article>
                <div v-for="(numberOfElements, index) in numberOfElements" :key="index" class="grid">
                    <div  class="grid-item" >
                    <TheChessboard 
                        :board-config="boardConfig[index]"
                        :reactive-config="reactiveConfig"
                        :player-color="playerColorChoice"
                        @board-created="(api) => boardAPIBind(api, index)"
                    />
                    </div>
                    <div class="grid-item" >
                    <p>Lorem ipsum2 </p>
                    </div>
                </div>
                </article>
   
      
    
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
const numberOfElements = ref(5);
const movesArray = ref([]);

const boardConfig = ref({});

const boardAPI = ref([]);

let bAPI = ref();
const boardAPIBind = (api, index) => {
  // Save the board API instance to the boardAPI array
  boardAPI.value[index] = api;
  boardConfig.value[index] =  ({ // reactive doesn't require .value
                  coordinates: true,
                  viewOnly: true,
                  animation: {
                  enabled: false,
                  duration: 0,
                   }
                 })

};




const  calledHistory = ref(false);
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };




const emit = defineEmits(['server-give-best-move','started-new-game','game-over', 'game-history-user', 'undo-executed'])


let jsonData = '';

const fenList = ref([]);
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

           // console.log(response);
            console.log(jsonData.numberOfElements);
            numberOfElements.value = jsonData.numberOfElements;
        
            
            for(let i =0; i<numberOfElements.value; i++){
          
              movesArray.value[i] = jsonData.content[i].moves.split(',');
              fenList.value[i] = jsonData.content[i].fen
              
              boardConfig.value[i] = ({ // reactive doesn't require .value
                  fen: jsonData.content[i].fen,
                  coordinates: true,
                  viewOnly: true,
                  orientation:  jsonData.content[i].color,
                  animation: {
                  enabled: false,
                  duration: 0,
                }
                 })
              
              boardConfig.value[i].fen = jsonData.content[i].fen;
                 
             
                //let lastMove = movesArray.value[i].length-1;
               //boardAPI.value[i].setPosition(fenList.value[i]); 
               //boardAPI.value[i].move(movesArray.value[i][lastMove]);
               
            }
           // setTimeout(function5, 200);
           // calledHistory.value = true;
           setTimeout(lastMoves,5);
          

        } else {
            // Handle error cases, for example, log an error message
            console.error('Failed to fetch game history:', response.statusText);
        }
    } catch (error) {
      console.error('Saving Game into Database Error: ', error);
    }
}
function function5(){
  for(let i =0; i<numberOfElements.value; i++){
  boardAPI.value[i].resetBoard();
  }
}
function lastMoves(){

  if( boardAPI.value != null  && jsonData != null && movesArray.value != null && numberOfElements.value >0){
    for(let i =0; i<numberOfElements.value; i++){
        if(boardAPI.value[i]){ // otherwise it will cry about boardAPI.value[i] is undefined...
          boardAPI.value[i].resetBoard(); // so the animation is set to 0 
          let lastMove = movesArray.value[i].length-1;
          boardAPI.value[i].setPosition(fenList.value[i]); 
          boardAPI.value[i].move(movesArray.value[i][lastMove]);
        }
      
      }
  }
}


onMounted(  () => {
    getGameHistory();
  // lastMoves();
})




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



</style>