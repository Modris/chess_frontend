<template>


<main> 
    <div class="app-container"> 
     <div class="navbar" >  <Header /> </div>

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
import Header from './components/Header.vue'


</script>
  
<style>

body {
	margin: 0;
	padding: 0;
}

.navbar {
	width: 100%;

}

.app-container {
	display: flex;
	flex-direction: column;


}

.content {
	flex-grow: 1;
	padding-bottom: 30px;

}

.fade-enter-active,
.fade-leave-active {
	transition-property: opacity;
	transition-duration: 0.2s;
}


.fade-enter,
.fade-leave-active {
	opacity: 0
}
</style>