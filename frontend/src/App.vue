<script setup>
import { watchEffect, ref } from "vue";
import NavBar from "./components/Navbar.vue";
import {auth} from './fire.js';

const isLoggedIn = ref(false);
watchEffect(() => {
  auth.onAuthStateChanged(user => {
    isLoggedIn.value = !!user;
  });
});
</script>

<template class="template">
    <body class="body">
        <header class="header">
            <NavBar/>
        </header>
        <main class="main">
            <router-view></router-view>
        </main>
    </body>
</template>

<style scoped>
  .body {
      display: flex;
      flex-direction: column;
  }

  .header {
      position: fixed;
      min-height: 8vh;
      max-height: 8vh;
      top: 0;
      width: 100%;
  }

  .main {
      padding-top: 8vh;
      background-color: rgb(255, 255, 255);
      flex: 1;
      min-height: 100vh;
  }
</style>
