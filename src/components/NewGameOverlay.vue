<template>
  <br>
  <span> Play with the computer </span>
  <br><br>
  <span> Choose Elo: </span>
    <br>
<slider v-model="stockfishElo" color="#09793c" track-color="#FEFEFE" width="100%" :min="min" :max="max" 
   :alwaysShowHandle="answ" :tooltip="answ" :alwaysShowTooltip="answ" :modelValue="myNumber" :height="height" />
    <br><br><br>
<div class="container"> 
    <div class="item1"> <button class="black" @click="startGameWithBlack">  </button>  </div>
    <div class="item2"><button class="random" @click="startGameWithRandomSide">  </button>  </div>
    <div class="item3"><button class="white" @click="startGameWithWhite">  </button>  </div>
</div>
</template>

<script setup>
import {ref} from 'vue';
import slider from 'vue3-slider';
const max = 3190;
const min = 1320;
const answ = true;
const height = 20;
var stockfishElo = ref(1500);

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
.container{
    display:flex;
    justify-content: center;
    align-items: center; /* Center items vertically */
    height:100px;
}
.item1{
    width:200px;
    height:210px;
    align-self: center;
}
.item2{
    width:240px;
    height:240px;
    align-self:  center;
}
.item3{
    width:200px;
    height:210px;
    align-self: center;
}

.black{
    
  background-image: url("black_player_bg.webp");
  background-color:lightblue;
  width:80%;
  height:60%;
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: 120%;
}
.random{
    
  background-image: url("random_player_bg.webp");
  background-color:lightblue;
  width:80%;
  height:60%;
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: 100%;
  }
  .white{
    
  background-image: url("white_player_bg.webp");
  background-color:lightblue;
  width:80%;
  height:60%;
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: 110%;
  }
  button:hover{
    background-color: green;
  }
</style>