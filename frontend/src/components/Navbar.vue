<script setup>
import { useUserStore } from '../stores/UserStore';
import router from '../router.js';
import {auth} from '../fire.js';
import {ref} from "vue";
const userStore = useUserStore();

const logout =  () => {
   userStore.logout()
  router.push("/login");
}

const loggedIn = ref(false);

auth.onAuthStateChanged( (user) =>{
  if(user) {
    loggedIn.value = true;
  } else {
    loggedIn.value = false;
  }
})
</script>

<template>
    <div class="container">
      <nav class="navbar navbar-expand fixed-top">
        <ul class="navbar-nav">
          <li v-if="loggedIn" class="nav-item">
            <router-link to="/exercises" class="nav-link">Exercises</router-link>
          </li>
          <li v-if="loggedIn" class="nav-item">
            <router-link to="/routines" class="nav-link">Routines</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/help" class="nav-link">Help</router-link>
          </li>
          <li v-if="!loggedIn" class="nav-item">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
          <li v-if="!loggedIn" class="nav-item">
            <router-link to="/register" class="nav-link">Register</router-link>
          </li>
          <li v-if="loggedIn" class="nav-item">
          <button class="btn logoutButton" @click="logout()">Log Out</button>
        </li>
        </ul>
      </nav><br />
    </div>
  </template>
  
  <style>
    .navbar {
      background-color: #1FAB89;
      min-height: 8vh;
      box-shadow: 2px 1px 2px rgb(125, 125, 125);
      display: flex;
      flex-direction: row;
      justify-content: center;
    }

    .navbar-nav {
      display: flex;
      flex-direction: row;
      gap: 20px;
    }

    .nav-link {
      color: rgb(255, 255, 255);
      
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
        .fade-enter, .fade-leave-active {
        opacity: 0
    }

    .logoutButton {
      color: white;

    }
  </style>

