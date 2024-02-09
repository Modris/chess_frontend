<template>
    <button @click="login">login</button>


<div>
    <button @click="logout">LogoutAJAX</button>
    <button @click="saveGame">Save Game</button>
    
  </div>
</template>

<script setup>

import {ref} from 'vue'

const listItems = ref({})

const props = defineProps({
  winner: String,
  stockfishEloChoice: String,
  playerColorChoice: Object,
  beforeLastFen: Object,
  moveHistoryString: Object,

})

const saveGame = async () => {
    // Get CSRF token from cookie
    const csrfToken = getCookie('XSRF-TOKEN');
    const formData = new FormData();
    formData.append('winner', props.winner.value)
    formData.append('elo', props.stockfishEloChoice.value)
    formData.append('color', props.playerColorChoice.value)
    formData.append('moves', props.moveHistoryString.value)
    formData.append('fen', props.beforeLastFen.value)
    try {
      // Send a POST request to /logout with the CSRF token
      const response = await fetch('http://localhost:8888/save', {
        method: 'POST',
        headers: {
        
         'X-XSRF-TOKEN': csrfToken, // Include CSRF token in the header
        },
        credentials: 'include', // Include cookies in the request
        body: formData,
      });
      console.log(response);
    } catch (error) {
      console.error('Saving Game into Database Error: ', error);
    }
}


const login = () => {
    // Redirect to the specified URL
    window.location.href = '/oauth2/authorization/keycloak';
  };

const logout = async () => {
    // Get CSRF token from cookie
    const csrfToken = getCookie('XSRF-TOKEN');

    try {
      // Send a POST request to /logout with the CSRF token
      const response = await fetch('http://localhost:8888/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
         'X-XSRF-TOKEN': csrfToken, // Include CSRF token in the header
        },
        credentials: 'include', // Include cookies in the request
      });


      // Logout request is changed to 2XX code instead of 302 redirect because 
      // then we will have CORS block the logout to Keycloak Authorization server.
      // So Backend has configured to return 2XX code with Location. 
      // Then we envoke the Location with a fresh start. It will logout the user from Keycloak.
      // console.log('Logout response:', response);
      const locationHeader = response.headers.get('Location');
      //console.log('Location header:', locationHeader);

      if (locationHeader) {
        // Initiate the Authorization Server logout to end session.
        window.location.href = locationHeader;
      } else {
        console.error('Location header is not present in the response.');
      }

    } catch (error) {
      console.error('Logout error:', error);
    }
}

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };


</script>