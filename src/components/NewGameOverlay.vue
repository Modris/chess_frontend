<template>
  <p> Stockfish Strength: {{ stockfishElo }} elo </p>  
    <br>
<slider v-model="stockfishElo" color="#FB278D" track-color="#FEFEFE" width="100%" :min="min" :max="max" 
    :tooltip="answ" :alwaysShowTooltip="answ" :modelValue="myNumber" :height="height"/>
<p> Player Color:</p>
<button @click="startGameWithBlack"> Black </button> 
<button @click="startGameWithRandomSide"> Random Side </button> 
<button @click="startGameWithWhite"> White </button> 
</template>

<script setup>
import {ref} from 'vue';
import slider from 'vue3-slider';
const max = 3190;
const min = 1320;
const answ = true;
const height = 20;
var stockfishElo = ref(1600);

const emit = defineEmits(['black-side','random-side','white-side'])
function startGameWithBlack(){
    emit('black-side', stockfishElo);
}

function startGameWithRandomSide(){
    emit('random-side', stockfishElo);
}

function startGameWithWhite(){
    emit('white-side',stockfishElo);
}
</script>

<style scoped>

</style>