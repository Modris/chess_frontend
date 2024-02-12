<template>
   <main> 
   <a href="/"> MainPage</a>
    <br> <br>

<section class="grid-stats"> 
  <div class = "stats"> 

    <div class="stats-item"> Games: {{ totalElements }}</div>
    <div class="stats-item"> Wins: {{  totalWins }}</div>
    <div class="stats-item"> Losses: {{  totalLosses }}</div>
    <div class="stats-item"> Draws: {{  totalDraws }}</div>
    <div class="stats-item"> Total Pages: {{  totalPages }}</div>
    <div class="stats-item"> Current Page: {{ page }}</div>
  </div>
</section>
  <br>
<section class = "grid-buttons"> 
    <div class = "buttons"> 

          <button class = "btn99" @click="firstPage">First </button>
          <button class = "btn99" @click="previousPage">  Prev  </button>
          <button class = "btn99" @click="nextPage">  Next </button>
          <button class = "btn99" @click="lastPage">  Last </button>
    </div>
  </section>
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
                    <div class="grid-item2" >
                      <div v-if="movesArray[index] != null" class = "grid-item2-item">
                        <span class="moves" v-if="movesArray[index].length <= 6"> 
                            <span v-for="n in movesArray[index].length-1">  &nbsp; {{ n }}. {{  movesArray[index][n] }}</span>
                        </span> 
                        <span class="moves" v-if="movesArray[index].length  > 6"> 
                          <span v-for="n in 6"> &nbsp; {{ n }}. {{ movesArray[index][n] }}  </span>
                          <span> ... {{  movesArray[index].length }} moves.  </span>
                        </span> 
                      </div>
                      <div class = "grid-item2-item2">
                        
                        <span class = "enemy"> Player </span>
                           <span class = "bigSword" > ⚔️</span>
                        <span class = "enemy"> Stockfish {{ elo[index] }} </span>
                        <br> <br> 
                        <span :class="{'loser': !winnerBoolean[index], 'winner': winnerBoolean[index]}">   {{ winner[index] }} </span>
        
                      </div>
        
                    </div>
                </div>
                </article>
   
      
    
    </main>
    </template>
    
 <script setup >
    
import { onMounted, reactive, ref, watch, nextTick, withDirectives } from 'vue';
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
const totalWins = ref(0);
const totalLosses = ref(0);
const totalDraws = ref(0);

const totalPages = ref(0);
const totalElements = ref(0);
const pageNumber = ref(0);
const winner = ref([]);
const winnerBoolean = ref([]);
const elo = ref([]);
const getStatistics = async () => {

  // Get CSRF token from cookie
  const csrfToken = getCookie('XSRF-TOKEN');

    try {

      const response = await fetch('http://localhost:8888/statistics', {
        method: 'GET',
        headers: {
        
         'X-XSRF-TOKEN': csrfToken, // Include CSRF token in the header
        },
        credentials: 'include', // Include cookies in the request
      });
      
      if (response.ok) {
        
            // Parse the JSON data from the response
            jsonData = await response.json();
             totalWins.value = jsonData.totalWins;
             totalLosses.value = jsonData.totalLosses;
             totalDraws.value = jsonData.totalDraws;
 
        } else {
            // Handle error cases, for example, log an error message
            console.error('Failed to fetch statistics:', response.statusText);
        }
    } catch (error) {
      console.error('Fetching statistics error ', error);
    }

}
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
       
            numberOfElements.value = jsonData.numberOfElements;
            await nextTick();
            totalPages.value = jsonData.totalPages;
            totalElements.value = jsonData.totalElements;
            pageNumber.value = jsonData.pageable.pageNumber;

            for(let i =0; i<numberOfElements.value; i++){
              if(jsonData.content[i].wins == 1){
                console.log("yes");
                winnerBoolean.value[i] = true;
              }
              elo.value[i] = jsonData.content[i].elo;
              winner.value[i] = jsonData.content[i].winner;
              movesArray.value[i] = jsonData.content[i].moves.split(',');
              fenList.value[i] = jsonData.content[i].fen
              let config = { // reactive doesn't require .value
                  fen: jsonData.content[i].fen,
                  coordinates: true,
                  viewOnly: true,
                  orientation:  jsonData.content[i].color,
                  animation: {
                  enabled: false,
                  duration: 0,
                }
                 }
              boardAPI.value[i].setConfig(config); 

               let lastMove = movesArray.value[i].length-1;
            //   boardAPI.value[i].setPosition(fenList.value[i]); 
               boardAPI.value[i].move(movesArray.value[i][lastMove]);
               
            }
 
          

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
          boardAPI.value[i].resetBoard(); // so the animation is set to 0 
          let lastMove = movesArray.value[i].length-1;
          boardAPI.value[i].setPosition(fenList.value[i]); 
          boardAPI.value[i].move(movesArray.value[i][lastMove]);
        }
      
      }
  }
}


onMounted(  () => {
    getStatistics();
    getGameHistory();

  // lastMoves();
})

function firstPage() {
  page.value = 0;
  getGameHistory();
}
function previousPage(){
  if(page.value > 0 ){
    page.value--;
    getGameHistory();
  }
}
function nextPage(){

  if(page.value < totalPages.value-1 ){
    page.value++;
    getGameHistory();
  }
}
function lastPage(){
  if(totalPages.value > 1){
    page.value = totalPages.value-1; // because page starts at 0 instead of 1
    getGameHistory();
  }
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

.grid-item2{
  display: grid;
  grid-template-columns: 50% 50%;
  border: 5px burlywood;
   border-style:double;
   justify-content: center;
}

.grid-item2-item{
  grid-area: span 1/1 / 2/3;
  align-self: flex-end;
}
.grid-item2-item2{
  grid-area: span 1/1 / 2/3;
  align-self: center;
  margin-top: -20px;
}
.bigSword{

  font-size: 60px;
}
.enemy{
  font-size: 40px;

}
.grid-stats{
  display:grid;
  grid-template-columns: 60%;
  justify-content: center;
  align-items: center;

}
.stats{

  display:flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(89.9deg, rgb(208, 246, 255) 0.1%, rgb(255, 237, 237) 47.9%, rgb(255, 255, 231) 100.2%);


}

.stats-item{
  border: 5px gray;
  border-style: double;
  padding: 14px;
  font-size:20px;
  flex-grow: 1;
}

.grid-buttons{
  display: grid;
  grid-template-columns: 25%;
  align-items: center;
  justify-content: center;
 
}
.buttons{
  display: flex;
  background: linear-gradient(109.6deg, rgb(151, 213, 255) 11.2%, rgb(255, 155, 185) 91.1%);
  flex-grow: 1;
}

.btn99{
  flex-grow: 1;
  font-size:28px;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  padding: 11px;
  background-color: transparent;

}
.btn99:hover{
  background-color: lightblue;
}
.winner{
 color: green;
 font-size: 40px;
}
.loser{
  color: red;
  font-size: 40px;
}
.moves{
  font-size:20px;
  font-weight: 400;
}
</style>