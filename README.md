# Chess_Frontend. A Puzzle piece for SlyChess project.

<div align="center">
  <img src="/project_images/chess_frontend_highlight.png" alt="test">
</div>

* Vue3 reactive Javascript framework with composition API.

* New Game Overlay was achieved using CSS Grids and flexbox.
  
* WebSocket + STOMP connection to Chess_Manager with Webstomp-client library.

* Lichess style chess board for Vue3 (vue3-chessboard).

* The ability to view saved Chess Games. Ability to view individual chess games with correct game id.

* Login/Logout buttons so the frontend can initiate the login/logout flow.

# Main Page
<div align="center">
  <img src="/project_images/main.png" alt="main image">
</div>

# WebSockets with STOMP. 

The WebSockets + STOMP protocol is achieved from using webstomp-client library. We connect to the Chess_Manager with function connect().
We can close the connection with function called close() in WebSocket.vue. The 3 main functions are:

1) sendFen. We ask Chess_Manager for the best move which the Stockfish engine has to play with the FEN payload. If we receive a response we
save the best move and emit "received-server-bestmove".

2) WebSocket status. Upon successful connection we emit "websocket-status" so the Chess.vue can display green or red connection bar depending
on the connection status.

3) handlePing() and how it ties with websocketReconnect(). We have a custom heartbeat implementation which upon having a successful WebSocket connection the frontend initiates the ping pong pattern. The server must respond with "Pong" while the frontend must respond with "Ping". 8 seconds without a successful "Pong" after "Ping" was sent
we initiate an attempt to reconnect to the WebSocket connection for 15 seconds. We achieve this with using setInterval, setTimeout and clearInterval, clearTimeout usage
and functions websocketReconnect() and maxReconnectAttempts(). After reconnecting we ask the server once again for the best move just in case.

# Lichess style Chess Board

I used vue3-chessboard library which is a vue wrapper around the popular lichess JS library which gives you very many and nice features. Mainly we have custom events 
for every move made, draw or checkmate. We also have a reactive config for the chessboard itself so we can change the player color, orientation or FEN. This is used 
to view saved and individual games.

# Viewing history (saved games)

GameHistoryAll.vue I initialize chessboards depending on the total size of elements received from Page<SaveGame> from Chess_Manager. It was very important for me
to achieve the highlighted move that is visible in the project images. I achieved this by setting the FEN position of the previous to last move and then executing the last move. What took a lot of time to figure out was the time lag of loading 5,10,20 or 50 games. That was due to using a reactive config instead of default one. It was a problem
because of how vue implements it's reactivity. Removing that increased the response time of the viewing history thousandfold or more. I can display 50 games in mere milliseconds instead of 5 seconds.

<div align="center">
   <img src="/project_images/history.png" alt="history">
</div>

# Viewing individual games according to Game ID

SingularGame.vue. I couldn't do the same technique from Game History here where i set the FEN and then execute the last move because setting position deletes the game history.
So my idea was to disable the chessboard animation and just execute all of the saved moves and then i can view history from the instantly executed moves. However after about 195 moves it wouldn't show the last few made moves. So my solution was to read the board PGN ("Board representation in String with all the moves") and load the config with the PGN. That solved the highlighting last move problem.

# Login/Logout

The Frontend is responsible for initiating the Login and Logout flow. Login and Logout is done with window.location.href so we have a full page reload and flush client side cache. For Logout we receive 202 status code and a Location Header from Chess_Manager to follow through for the Authorization Server to complete the logout completely.

<div align="center">
   <img src="/project_images/login.png" alt="login">
</div>

# New Game Overlay

This was achieved using CSS Grid and flexbox properties to achieve overlapping grid.

<div align="center">
   <img src="/project_images/overlay.png" alt="overlay">
</div>

# End
