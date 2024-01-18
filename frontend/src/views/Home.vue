<script setup>
    import {auth} from '../fire.js';
    import { useUserStore } from "../stores/UserStore";  
    import router from '../router';
    const userStore = useUserStore();

    //Ensure auth.CurrentUser loads in before trying to access any properties.
    auth.onAuthStateChanged((user) => {
        if (user) {
            // userEmail = user.email;
            userStore.getUser();
        } else {
           // userEmail = null;
        }
    });

    const registerRedirect = () => {
        router.push('/register');
    }

    const loginRedirect = () => {
        router.push('/login');
    }
</script>

<template>
    <div class="home"> 
        <div class="homeBox">
            <h1 class="display-6">Welcome!</h1>
            <button class="registerRedirect"  @click="registerRedirect()">Register an account</button>
            <button class="registerRedirect"  @click="loginRedirect()">Already have one?</button>
        </div>
    </div>  
</template>

<style scoped>
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .registerRedirect {
        color: #393E46;
        margin-top: 15px;
        background: none;
        border: none;
        font-size: 20px;
        
    }

    .registerRedirect:hover {
        color: #1FAB89;
        text-decoration: underline #1FAB89;
    }

    .homeBox {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #fcfcfc;
        border-radius: 20px;
        /* border: 1px solid rgb(240, 240, 240); */
        padding: 60px;
        margin-top: 5vh;
        box-shadow: 2px 2px 5px rgb(125, 125, 125);
    }
    .home {
        min-width: 400px;
        height: 92vh;
        padding-top: 50px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        justify-content: top;
        background-color: #eeeeee;
    }

    .display-6 {
        color: #393E46;
        font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        font-size: 40px;
        margin-bottom: 40px;
    }
</style>
