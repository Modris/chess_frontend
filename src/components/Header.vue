<template>
    <Login ref="myChildLogin" />
    <nav>
        <div> <button  class="buttons1" @click="mainPage">Main</button> </div>
        <div>  <button  class="buttons1" @click="pushHist">History</button> </div>
        <div> 
             <button v-if="!authenticated" class="buttons2" @click="login">Login</button>
             <button v-if="authenticated" class="buttons3" @click="logout">Logout</button> 
        </div>

    </nav>



  

</template>

<script setup>
import { ref, onMounted} from 'vue'
import Login from './Login.vue';
import { useRoute, useRouter} from 'vue-router';
const route = useRoute();
const router = useRouter();

const myChildLogin = ref(null);


const emit = defineEmits(['stop-websocket']);

function mainPage(){
    router.push("/");
}
function pushHist(){
   // emit('stop-websocket');
    router.push("/history");
}

function login(){
    myChildLogin.value.login();
}
function logout(){
    myChildLogin.value.logout();
}

const authenticated = ref(false);
const getUsername = async () => {

  try {
    // const response = await fetch('http://localhost:8888/user', {
    const response = await fetch('https://slychess.com/user', {
      method: 'GET',
    }
    );
    
    if (response.ok) {
      authenticated.value = true;
      } else {
          // Handle error cases, for example, log an error message
          console.error('Failed to fetch username:', response.statusText);
          if(response.statusText == 'Unauthorized'){
            authenticated.value = false;
          }
      }
  } catch (error) {
    console.error('Fetching username error ', error);
  }

}

onMounted( () => {
    getUsername();
})
</script>

<style>

nav{
    width:100%;
    font-family: Arial;
    background: #005AA7;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #FFFDE4, #005AA7);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #FFFDE4, #005AA7); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    
    display:flex;
    flex-direction:row;
    justify-content: center;
    align-items: center;
    flex-wrap:wrap;
}

nav a, .buttons1{
    display: block;
    padding:10px;
    color: #fff;
    line-height: 30px;
    font-size: 20px;
    text-decoration: none;
}

nav a:hover, .buttons1:hover{
    background-color: #086e27;
}
.buttons1 {
  background: transparent;
  font-size: 20px;
  border: none;
  cursor: pointer;
}

.buttons1:focus {
  outline: none; /* Remove the default focus style on button click */
}
.buttons2{
    display: block;
    padding:10px;
    color: blue;
    line-height: 30px;
    font-size: 20px;
    text-decoration: none;
    background: transparent;
    border: none;
    cursor: pointer;

}
.buttons2:hover{
    background-color: #086e27;
}
.buttons2:focus{
    outline: none;
}
.buttons3{
    display: block;
    padding:10px;
    color: blue;
    line-height: 30px;
    font-size: 20px;
    text-decoration: none;
    background: transparent;
    font-size: 20px;
    border: none;
    cursor: pointer;

}
.buttons3:hover{
    background-color: lightcoral;
}
.buttons3:focus{
    outline: none;
}

</style>