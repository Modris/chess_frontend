<template>


  <main> 
    <div class="app-container"> 

      <div class="content"> 
        <transition name="fade">
        <router-view />
        </transition>
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
    transition-duration: .05s;
  }
  
  .fade-enter-active {
    transition-delay: .05s;
  }
  
  .fade-enter, .fade-leave-active {
    opacity: 0
  }
  </style>