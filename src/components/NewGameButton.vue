<template>
<button @click="newGame" class="bn41"> Start New Game</button>
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

<style scoped>
.bn41 {

  background: radial-gradient(328px at 2.9% 15%, rgb(191, 224, 251) 0%, rgb(232, 233, 251) 25.8%, rgb(252, 239, 250) 50.8%, rgb(234, 251, 251) 77.6%, rgb(240, 251, 244) 100.7%);
  color: #004953;
  border-radius: 6px;
  box-sizing: border-box;
  height: 40px;
  font-size: 20px;
  font-weight: 600;
  padding: 4px;
  text-decoration: none;
  text-align:center;
  width: 225px;
}
</style>