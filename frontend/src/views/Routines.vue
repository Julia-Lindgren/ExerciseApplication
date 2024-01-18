<script setup>
    import RoutineList from "../components/RoutineList.vue";
    import {auth} from '../fire.js';

    import { useUserStore } from "../stores/UserStore";  
    const userStore = useUserStore();

    //Ensure auth.CurrentUser loads in before trying to access any properties.
    auth.onAuthStateChanged((user) => {
        if (user) {
            userStore.getUser();
        } else {
            // userEmail = null;
        }
    });
</script>

<template >
    <div class="routineMain">
        <RoutineList/>
    </div>
</template>

<style scoped>
    .routineMain {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 5vh;  
        min-height: 100vh;
    }
</style>