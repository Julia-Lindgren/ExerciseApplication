import {defineStore} from 'pinia'
import axios from 'axios'
import {auth} from '../fire.js';
import { useUserStore } from './UserStore.js';

export const useExerciseStore = defineStore('exerciseStore', {
    state: () => ({
        exercises: [],
        customExercises: [],
        filterTags: [],
        favouriteFilter: false,
        filteredExercises: [],
        searchedExercises: [],
        searchTerm: "",
        loading: false,
        isLoggedIn: false,
    }),
    getters: {
        //Return all the selected filter tags
        selectedFilterTags() {
            return this.filterTags;
        },
        //Return exercises that should be displayed based on the selected filters and search term
        displayedExercises() {
            if((this.searchTerm.length > 0)) {
                return this.searchedExercises;
            } else if (this.filterTags.length > 0 || this.favouriteFilter === true) {
                return this.filteredExercises;
            } else {
                return this.exercises;
            }
        },   
    },
    actions: {

        //Delete a custom exercise by its id
        async deleteExercise(_id) {
            const res = await axios.delete('/api/exercises/' + _id).then(response => {
                const indexAllExercises = this.exercises.findIndex(exercise => exercise._id === _id);
                const indexCustomExercises = this.customExercises.findIndex(exercise => exercise._id === _id);
                 if (indexAllExercises !== -1) {
                    this.exercises.splice(indexAllExercises, 1);
                    this.customExercises.splice(indexCustomExercises, 1);
                }
              });
        },

        //Get an exercise by its id
        getExerciseById(exerciseId) {
            const exercise = this.exercises.find(exercise => exerciseId === exercise._id);
            return exercise;
        },

        //Adds the checked filter to the array
        setFilterTag(tag) {
            this.filterTags.push(tag);
        },

        //Removes the unchecked filter from the array
        removeFilterTag(tag) {
            const index = this.filterTags.indexOf(tag);
            if (index > -1) {
              this.filterTags.splice(index, 1);
            }
        },

        //Resets the filter
        resetFilter() {
            this.filterTags = [];
            this.favouriteFilter = false;
            this.filteredExercises = [];
        },

        //When a user ticks/unticks a filter, calculate the new exercises that should be displayed, with the search term respected
        updateFilteredExercises() {
            if (this.favouriteFilter === true ) {
                const userStore = useUserStore(); 
                const filtered = this.exercises.filter(exercise => {
                    // Check if ALL tags in filterTags array are included in the exercise tags array
                    return this.filterTags.every(tag => exercise.tags.includes(tag)) && userStore.favouriteExercises.includes(exercise._id);
                  })
                  this.filteredExercises = filtered;
            } else {
                const filtered = this.exercises.filter(exercise => {
                    // Check if ALL tags in filterTags array are included in the exercise tags array
                    return this.filterTags.every(tag => exercise.tags.includes(tag))
                  })
                  this.filteredExercises = filtered;
            }
              //Need to update searched exercises if the filter changes too
              if(this.searchTerm.length > 0) {
                this.updateSearchedExercises(this.searchTerm);
              }
        },

        //When a term is searched update the exercises that should be displayed
        updateSearchedExercises(searchTerm) {
            this.searchTerm = searchTerm;
            const titleMatches = [];
            const descMatches = [];
            //Using ternary operator, if condition is true, the left variable will be set, vice versa.
            const exerciseArray = this.filterTags.length > 0 || this.favouriteFilter === true ? this.filteredExercises : this.exercises;
            
           // Loop through each exercise in filteredExercises and add it to the appropriate array
            for (const exercise of exerciseArray) {
                const lowerCaseTitle = exercise.title.toLowerCase()
                const lowerCaseDescription = exercise.description.toLowerCase()
                const lowerCaseSearchTerm = searchTerm.toLowerCase()
            
                if (lowerCaseTitle.includes(lowerCaseSearchTerm)) {
                titleMatches.push(exercise)
                } else if (lowerCaseDescription.includes(lowerCaseSearchTerm)) {
                descMatches.push(exercise)
                }
            }

            //Title matches have priority over description
            // Combine the titleMatches and descMatches arrays while ensuring that titleMatches appear before descMatches
            this.searchedExercises = [...titleMatches, ...descMatches];
        },

        //Gets all the exercises from the databse
        async getExercises() {
            
            try {
                const res = await axios.get('/api/exercises/')
                .then(response => {
                    const exercises = response.data;
                    const email = auth.currentUser.email;
                    const filteredExercises = exercises.filter(exercise => exercise.owner === "premade" || exercise.owner === email );
                    const userCustomExercises = exercises.filter(exercise => exercise.owner === email );
                
                    this.exercises = filteredExercises;
                    this.customExercises = userCustomExercises;
            })
            } catch (e) {
                // console.error('Error:', e);
            }
            
        },

        //Create a new exercise
        async addExercise(exercise) {
            try {
                const res = await axios.post('/api/exercises/', exercise).then(response => {
                this.exercises.push(exercise);
                });
            } catch (e) {
                // console.error('Error:', e);
            }
        }
    }    
})