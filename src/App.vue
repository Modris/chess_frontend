<template>


  <main> 
    <div class="app-container"> 
      <div class="content"> 
        <router-view v-slot="{ Component }">
        <transition>
          <component :is="Component" />
        </transition>
      </router-view>
     </div>

  
    </div>
  </main>
  </template>
  
  <script setup>


  </script>
  
  <style>
  
  .app-container {
    display: flex;
    flex-direction: column;
   
  }
  .content{
    flex-grow:1;
    padding-bottom:30px;
  
  }
  .fade-enter-active, .fade-leave-active {
    transition-property: opacity;
    transition-duration: 0.2s;
  }
  

  
  .fade-enter, .fade-leave-active {
    opacity: 0
  }
  </style>