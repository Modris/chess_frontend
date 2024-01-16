<template>
<button @click="newGame"> Start New Game</button>
</template>

<script setup>

import {ref} from 'vue';

var newGameOverlay = false;
const emit = defineEmits(['new-game'])
function newGame(){
    newGameOverlay = true;
    emit('new-game',newGameOverlay);
}

defineExpose({
    newGameOverlay,
})
</script>