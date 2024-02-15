<template>
   <main> 


   <br> 
    <h1 v-if="!authenticated"> Please <button class="buttons2" @click=login> Login </button> to View and Save Games!</h1>
  
    <br>
 <div v-if="boardAPI != null"> 
</div>

<section class="grid-stats"> 
  <div class = "stats"> 
    
    <div class="stats-item"> Games: {{ totalElements }}</div>
    <div class="stats-item"> Wins: {{  totalWins }}</div>
    <div class="stats-item"> Losses: {{  totalLosses }}</div>
    <div class="stats-item"> Draws: {{  totalDraws }}</div>
    <div class="stats-item"> Total Pages: {{  totalPages }}</div>
    <div class="stats-item"> Current Page: {{ pageNumber }}</div>
    
  </div>
</section>
  <br>
<section class = "grid-buttons"> 
    <div class = "buttons"> 
      <div class="biggerText" > Page Size: 
        <select class="selectTextSize" id="pageSize" v-model="pageSize">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="25">25</option>
          <option value="50">50</option>
         </select>  
      
      </div>
         
      
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
                        
                        <span class = "enemy"> {{ player }} </span>
                           <span class = "bigSword" > ⚔️</span>
                        <span class = "enemy"> Stockfish {{ elo[index] }} </span>
                        <br> <br> 
                        <span :class="{'loser': !winnerBoolean[index], 'winner': winnerBoolean[index]}">   {{ winner[index] }} </span>
        
                      </div>
                      <div  class = "grid-item2-item3">
                        <div class="grid-item2-item3-flexbox"> 
                          <router-link class="reviewClass" :to="`/game/${gameID[index]}`"> Review Game</router-link>
                        </div>
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
import { useRoute, useRouter} from 'vue-router';
const route = useRoute();
const router = useRouter();
const pageSize = ref(5);

const numberOfElements = ref(5);
const movesArray = ref([]);
const boardConfig = {};

const login = () => {
    // Redirect to the specified URL
    window.location.href = '/oauth2/authorization/keycloak';
  };

const boardAPI = [];
const player = ref('Player');
let bAPI = ref();
const boardAPIBind = (api, index) => {
  // Save the board API instance to the boardAPI array
  boardAPI[index] = api;
  boardConfig[index] = basicConfig;

};

let basicConfig = ({ 
                  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                  orientation: 'white',
                  coordinates: true,
                  viewOnly: true,
                  animation: {
                  enabled: false,
                  duration: 0,
                }
                 })

const dynamicURL = ref(`/history/page/1`);


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
const pageNumber = ref(1);
const winner = ref([]);
const winnerBoolean = ref([]);
const elo = ref([]);
const authenticated = ref(false);
const gameID = ref([]);


const getUsername = async () => {

  try {

    const response = await fetch('http://localhost:8888/user', {
      method: 'GET',
    });
    
    if (response.status == 200) {
      authenticated.value = true;
          // Parse the JSON data from the response
          jsonData = await response.json();
          player.value = jsonData.username.charAt(0).toUpperCase() + jsonData.username.slice(1);;


      } else {
          // Handle error cases, for example, log an error message
          console.error('Failed to fetch username:', response.statusText);
          if(response.statusText == 'Unauthorized'){
            authenticated.value = false;
          }
      }
  } catch (error) {
    console.error('Fetching username error ', error);
  }

}


const getStatistics = async () => {

    try {

      const response = await fetch('http://localhost:8888/statistics', {
        method: 'GET',
      });
      
      if (response.status == 200) {
        
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
    formData.append('page', pageNumber.value-1); // -1 because page starts at 0 for backend numbering instead of 1
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
      
      if (response.status == 200) {
        

            // Parse the JSON data from the response
            jsonData = await response.json();

           // console.log(response);
       
            numberOfElements.value = jsonData.numberOfElements;
            await nextTick();
            totalPages.value = jsonData.totalPages;
            totalElements.value = jsonData.totalElements;
            pageNumber.value = jsonData.pageable.pageNumber+1;

            for(let i =0; i<numberOfElements.value; i++){
              if(jsonData.content[i].wins == 1){
                winnerBoolean.value[i] = true;
              } else {
                winnerBoolean.value[i] = false;
              }
              gameID.value[i] = jsonData.content[i].game_id;
              elo.value[i] = jsonData.content[i].elo;
              winner.value[i] = jsonData.content[i].winner;
              movesArray.value[i] = jsonData.content[i].moves.split(',');
             // fenList.value[i] = jsonData.content[i].fen


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
              boardAPI[i].setConfig(config); 

              //boardConfig[i].fen = jsonData.content[i].fen;
              //boardConfig[i].orientation = jsonData.content[i].color;
               let lastMove = movesArray.value[i].length-1;

             //  boardAPI.value[i].setPosition(jsonData.content[i].fen); 
               boardAPI[i].move(movesArray.value[i][lastMove]);

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


watch(pageSize, () => {


  pageNumber.value = 1;
  getGameHistory();
})

onMounted(  () => {
  if( route.params.id > 1){
      pageNumber.value =  route.params.id;
    }

    getStatistics();
    getUsername();
    getGameHistory();
    

  // lastMoves();
})

function firstPage() {

  if(pageNumber.value != 1){
    pageNumber.value = 1;
  
    router.push(`/history/page/${pageNumber.value}`);
    getGameHistory();
  }
}
function previousPage(){
  if(pageNumber.value > 1 ){
    pageNumber.value--;
    router.push(`/history/page/${pageNumber.value}`);
    getGameHistory();

  }
}
function nextPage(){

  if(pageNumber.value < totalPages.value ){
    pageNumber.value++;
    router.push(`/history/page/${pageNumber.value}`);
    getGameHistory();

  }
}
function lastPage(){
  if(pageNumber.value != totalPages.value && totalPages.value > 1){
    pageNumber.value = totalPages.value; // because page starts at 0 instead of 1
    router.push(`/history/page/${pageNumber.value}`);
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
.grid-item2-item3{
  grid-area: span 1/1 / 2/3;
  align-self: first baseline;
}
.grid-item2-item3-flexbox{
  display: flex;
  align-self: flex-stat;
}
.bigSword{

  font-size: 60px;
}
.reviewClass{
  font-size: 30px;
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
  grid-template-columns: 55%;
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
  font-family: 'Franklin Gothic Medium';
  padding: 11px;
  background-color: transparent;

}
.biggerText{
  align-self: center;
  font-size:28px;
  font-family: 'Franklin Gothic Medium';
  padding: 11px;
  background-color: transparent;
  border: 3px black double;
  
}
.selectTextSize{
  font-size: 20px;
}
.inputPage{
  font-size: 20px;
  text-align: center;
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
.buttons2{
  display: inline;
    padding:10px;
    color: blueviolet;
    font-size: 30px;
    text-decoration: none;
    background: transparent;
    border: none;
    cursor: pointer;

}
.buttons2:hover{
    background-color: lightblue;
}
.buttons2:focus{
    outline: none;
}
</style>