<template>

</template>

<script setup>
// Testing if it's feasible to implement game history based upon last fen + move for highlight.
// This proved to work so i'll implement backend Database.
const fen = "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 0 1";
const fen2 = "rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR w KQkq - 0 1"
const move = "g8f6";
const move2 = "a2a3";
const emit = defineEmits(['start'])
function start(){
    emit('start', fen2, move2);
}
</script>