<template>
    <div class="flexbox"> 
        <button @click="firstMove">⏮️ </button>
        <button @click="previous"> ◀️ </button>
        <button @click="next"> ▶️ </button>
        <button @click="lastMove">⏭️ </button>
</div>
</template>

<script setup>



const props = defineProps({
    stockfishEloChoice: Number,
})

const emit = defineEmits(['previous-pressed','next-pressed', 'firstmove-pressed', 'lastmove-pressed'])
function firstMove(){
    emit('firstmove-pressed');
}
function previous(){
    emit('previous-pressed');
}
function next(){
    emit('next-pressed');
}
function lastMove(){
    emit('lastmove-pressed');
}

// Testing if it's feasible to implement game history based upon last fen + move for highlight.
// This proved to work so i'll implement backend Database.
/*
const fen = "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 0 1";
const fen2 = "rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR w KQkq - 0 1"
const move = "g8f6";
const move2 = "a2a3";
const emit = defineEmits(['start'])
function start(){
    emit('start', fen2, move2);
}
*/
</script>

<style scoped>
.flexbox{
    display:flex;
    justify-content: center;
}
button{
    font-size:40px;
    padding: 0;
    margin: 0;
}
</style>