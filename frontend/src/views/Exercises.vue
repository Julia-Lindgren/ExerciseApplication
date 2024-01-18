<script setup>
    import ExerciseList from "../components/ExerciseList.vue";
    import ExerciseFilter from "../components/ExerciseFilter.vue";
    import Routine from "../components/Routine.vue";
    import {auth} from '../fire.js';
    import { useUserStore } from "../stores/UserStore";  
    const userStore = useUserStore();

    //Ensure auth.CurrentUser loads in before trying to access any properties.
    auth.onAuthStateChanged((user) => {
        if (user) {
            userStore.getUser();
        } else {
            return;
        }
    });
</script>

<template >
    <div class="template">
        <Routine/>
        <ExerciseList/>
        <ExerciseFilter/>
    </div>
        
</template>

<style scoped>
    .template {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 5vh;  
        max-height: 90vh;
    }
</style>