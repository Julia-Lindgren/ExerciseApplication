<script setup>
    import { ref } from "vue";
    import { useExerciseStore } from "../stores/ExerciseStore";  
    
    const exerciseStore = useExerciseStore();
    const searchTerm = ref('');

    const submitSearch = () => {
        if (searchTerm.value.length > 0 ) {
            exerciseStore.updateSearchedExercises(searchTerm.value);   
        } else {
            exerciseStore.searchedExercises = [];
            exerciseStore.searchTerm = "";
            searchTerm.value = "";
        }
    }

    const resetSearch = () => {
        searchTerm.value = "";
        exerciseStore.searchedExercises = [];
        exerciseStore.searchTerm = "";
    }
</script>

<template>
     <div id="searchBar">
        <form @submit.prevent = "submitSearch" class="input-group">
            <button class="material-icons input-group-text" id="searchButton">search</button>
            <input id="searchInput" class="form-control" type = "text" placeholder = "Search..." maxlength="200" v-model ="searchTerm">
            <button class="material-icons input-group-text" id="resetFilterButton" @click="resetSearch()">close</button>
        </form>
    </div>
</template>

<style scoped>
    #searchBar {
        padding-top: 40px;
        min-width: 300px;
    }

    #searchButton {
        background-color: #ffffff;;
        padding: 10px;
        cursor: pointer;
        font-size: 1em;
        border-right: 0; 
        font-size: large;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
    }

    #searchInput {
        border: 1px solid #dbdbdb;
        padding: 10px;
        color: #555;
        font-size: 1em;
        border-left: 0;
        border-right: 0;
    }

    #searchInput:focus {
        box-shadow: 0 0 0 3px #21b48f49;
        border-radius: 5px;
        border-color:#21b48f49 ;
    }

    #resetFilterButton {
        background-color: rgb(255, 255, 255);
        border-left: 0;
        font-size: large;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
    }
</style>