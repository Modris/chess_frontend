<template>
     

  <a href="/history"> History</a>
    <Login ref="myChildLogin" v-bind="groupedPropsSaveGame"/>
    <NewGameButton @new-game="updateNewGame"/>
    <main class = "container1">
      <div> </div> <!-- Do not Delete. For centering purposes. Also future features on the left are open.-->
      <div class="mainItem"> 
        <Chess  @save-game="saveGameServer" @undo-executed="undoExecuted" @game-history-user="updateHistoryServer"
         @started-new-game=resetValue @server-give-best-move="callServerForBestMove" 
         :stockfishMove="stockfishMove"
              v-bind="groupedProps"
              :websocketStatus="websocketStatus"/>
      </div>
  
    
  
       <div  v-if="newGameSelected" class="containerOverlap"> 
        <div> <button @click="closeOverlay" class="btn"> ❌ </button></div>
        <div> 
          <h1 class= " containerOverlapItem">
            <NewGameOverlay @black-side="newGameWithBlack" @random-side="newGameWithRandom" @white-side="newGameWithWhite"/>
          </h1>     
        </div>
    </div>
   <WebSocket ref="myChildWebsSocket" @websocket-status="websocketStatusUpdate" @received-server-bestmove=updateBestMove :moveHistoryUser="moveHistoryUser"
    :fenHistoryUser="fenHistoryUser"  :stockfishEloChosen="stockfishEloChosen" :fen="fen"
     />
    
    </main>
  
  
  </template>
  
  
  <script setup>
  import {ref} from 'vue';
  import Chess from '@/components/Chess.vue';
  import GameHistoryAll from '@/components/GameHistoryAll.vue';
  import WebSocket from '@/components/WebSocket.vue';
  import NewGameButton from '@/components/NewGameButton.vue';
  import NewGameOverlay from '@/components/NewGameOverlay.vue';
  import Login from '@/components/Login.vue';
  const myChildWebsSocket = ref(null);

  /*
   The sequence is:
    0) Start new game. Inject stockfishEloChosen, move into Websocket.vue
    1) server-give-best-move 2) update the fen 3) inject fen + move inside Websocket.vue 
    4) Websocket.vue watcher will notice changed fen value and send a request to the server for the best move
    
    CHANGED:
  
    1) server-give-best-move 2) with defineExpose from Websocket.vue we call for bestmove straight up.
    5) received-server-bestmove from Websocket.vue emits to App.vue which calls function updateBestMove
    6) The function updates stockfishmove which then gets injected into the Chess.vue
    7) Chess.vue notices with watcher changed stockfishmove; boardAPI.move(move) is executed.
    8) userFen.value is set before the move is made (gameHistory is made from old fen+move executed for highlight);
    9) We wait for user to make a move. If he made a move Chess.vue handleMove() function is called.
    10) We emit to server to save game-history-user from Chess.vue. userFen + userMove
    11) App.vue notices emit from Chess.vue and sends fenHistoryUser +userMove prop to websocket the emit.
  
  */
  
  const fen = ref('');
  const payload = ref('');
  function callServerForBestMove(currentFen){
    myChildWebsSocket.value.userId
    if(currentFen != 'undo'){ 
    payload.value = JSON.stringify({'fen': currentFen, 'userId': myChildWebsSocket.value.userId,'chosenElo':stockfishEloChosen.value,'move':'test'});
    myChildWebsSocket.value.sendFen(payload.value);
    fen.value = currentFen;
    }
  }
  

  const stockfishMove = ref('');
  function updateBestMove(bestmoveServer){
    stockfishMove.value = bestmoveServer;
  }
  const newGameSelected = ref('');
  const startNewGame = ref('');
  const chosenColor = ref('');
  const stockfishEloChosen = ref(1500);
  
  let groupedProps = { startNewGame, chosenColor, stockfishEloChosen };

  function updateNewGame(value){
    newGameSelected.value = value;
  }
  function undoExecuted(){
    stockfishMove.value = 'h8h8';
  }
  function newGameWithBlack(stockfishElo){
    newGameSelected.value = false;
    chosenColor.value = 'black';
  
    stockfishEloChosen.value = stockfishElo;
    startNewGame.value = true; 
    //console.log(groupedProps.value[0].value);
  }
  function newGameWithRandom(stockfishElo){
  
    let random = ['white', 'black'];
    let randomIndex = Math.floor(Math.random() * random.length); 
    let randomColor = random[randomIndex];
    newGameSelected.value = false;
    chosenColor.value = randomColor;
    stockfishEloChosen.value = stockfishElo;
    startNewGame.value = true;
  }
  
  function newGameWithWhite(stockfishElo){
   
    newGameSelected.value = false;
    chosenColor.value = 'white';
    stockfishEloChosen.value = stockfishElo;
    startNewGame.value = true;
  }
  
  function resetValue(){
    startNewGame.value = false;
  }
  
  var fenHistoryUser = ref('');
  var moveHistoryUser = ref('');
  function updateHistoryServer(userFen, userMove){
    moveHistoryUser.value = userMove;
    fenHistoryUser.value = userFen;
  }
  
  function closeOverlay(){
    newGameSelected.value = false;
  }
  
  let websocketStatus = ref(true);
  function websocketStatusUpdate(condition){
    websocketStatus.value = condition;
  }

  const winner = ref('');
  const moveHistoryString = ref('');
  const beforeLastFen = ref('');
  const playerColorChoice = ref('');
  const stockfishEloChoice = ref('');
  function saveGameServer( moveHistoryAnswer, moveHistoryFenAnswer, winnerAnswer, playerColorChoiceAnswer, stockfishEloChoiceAnswer){
    stockfishEloChoice.value = stockfishEloChoiceAnswer;
    winner.value = winnerAnswer;
    playerColorChoice.value = playerColorChoiceAnswer;
    beforeLastFen.value = moveHistoryFenAnswer.value[moveHistoryFenAnswer.value.length-2]; // before last FEN
    moveHistoryString.value = moveHistoryAnswer.value.toString();

  }
  let groupedPropsSaveGame = { moveHistoryString, beforeLastFen, winner, playerColorChoice, stockfishEloChoice }
  </script>
  
  <style>
  
  .container1{
    display:grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows:auto;
  
    justify-content: center;
  
  }
  .containerOverlap{
    grid-area: span 1/2 / 1/3;
    justify-content: center;
    align-items: center; /* Center the content horizontally and vertically */
    width: 350px; /* Set a maximum width for the containerOverlap */
    height:35px;
    margin: 0 auto; /* Center the containerOverlap within its parent */
    margin-top:50px;
    z-index:10;
  }
  .containerOverlapItem{
    background: radial-gradient(590px at 8.2% 83.8%, rgb(18, 35, 60) 0%, rgb(187, 187, 187) 90%);
    width: 100%;
    height:50%;
    box-sizing: border-box; /* Include padding and border in the total width */
    border: 5px  solid rgb(130, 108, 108); 
    border-style:double;
    border-radius:10px;
    margin-top:-30px;
  }
  
  .mainItem{
    grid-area: span 1/2 / 1/3;
    margin-left:320px;
  }
  
  
  .btn {
    width: 50px;
    height: 50px;
    background: gray;
    border-radius: 50%;
    color: white;
    margin-left:92%;
    font-size:20px;
  }
  .btn:hover{
    background: linear-gradient(to bottom, hotpink 0%, tomato 100%);
  }
  </style>