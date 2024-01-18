import {defineStore} from 'pinia'
import axios from 'axios'
import {auth} from '../fire.js';

export const useRoutineStore = defineStore('routineStore', {
    state: () => ({
        routineExercises: [],
        routineName: '',
        routineCoverImageUrl: '',
        selectedImage: undefined , //the currently selected image (not uploaded)
        loading: false,
        attributesToDisplay: [], // stored as [{_id: exId, type: "distance", value: ""}]
        editingExercise: [],
        index: null, // the index of the exercise that is being edited
        userRoutines: [], //Routines fetched from database that user has created
        editingRoutine: [],
        routineIndex: null,
        
    }),
    getters: {
    },
    actions: {

        //Deletes a routine
        async deleteRoutine() {
            const _id = this.editingRoutine._id;
            const res = await axios.delete('/api/routines/' + _id).then(response => {
                const index = this.userRoutines.findIndex(routine => routine._id === _id);
                 if (index !== -1) {
                    this.userRoutines.splice(index, 1);
                }
              });
        },

        //Gets all the routines of the current logged in user based on their email.
        async getUserRoutines() {
            const userEmail = auth.currentUser.email;
            try {
                const res = await axios.get('/api/routines/', {params: {userEmail: userEmail}})
                .then(response => {
                this.userRoutines = response.data;
            })
            } catch (e) {
                // console.error('Error:', e);
            }
        },

        //Creates a routine
        async createRoutine() {
            const user = auth.currentUser;
            const email = user.email;

            const routine = {
                title: this.routineName,
                owner:email ,
                routineImageUrl: this.routineCoverImageUrl,
               exercises: this.routineExercises,
            }

            try {
                const res = await axios.post('/api/routines/', routine).then(response => {
                //Refresh all fields after a routine is created succesfully!
                this.routineCoverImageUrl = '';
                this.selectedImage = undefined;
                this.routineName = '';
                this.routineExercises = [];
                });
            } catch (e) {
                // console.error('Error:', e);
            }
        },

        //TIf the user clicks the X on an attribute to no longer display it on their screen and set te value to empty again.
        removeDisplayedAttribute(attribute) {
            const index = this.index;
            const exerciseId = this.editingExercise._id
            this.routineExercises[index].customFields[attribute] = "";

            const displayIndex = this.attributesToDisplay.findIndex(i => i.type === attribute && i._id === exerciseId);
            this.attributesToDisplay.splice(displayIndex, 1);
        },

        //Runs when the user clicks add attribute , and saves the id and associates attribute name with exercise.
        addAttribute(attribute, exerciseId) {
            if (!this.attributesToDisplay.some(i => i.type === attribute && i._id === exerciseId)) {
                this.attributesToDisplay.push({ type: attribute, _id: exerciseId});
              }
        },

        //Runs when checking if an attribute has been added by the user yet, so decides whether to show the respective component or not. 
        matchingAttribute(attribute, exerciseId) {
              const matchingItem = this.attributesToDisplay.find(i => {
                return i._id === exerciseId && i.type === attribute;
              });

              if(matchingItem) {
                return true;
              } else {
                return false;
              }
        },
        
        //When adding a routine to the create routine part, create a new version of the exercises with fields the user can customise.
        addRoutineExercise(exercise) {
            const isDuplicate = this.routineExercises.some(e => e._id === exercise._id);

            if(!isDuplicate) {
                this.routineExercises.push({
                    _id: exercise._id,
                    title: exercise.title,
                    imageUrl: exercise.imageUrl,
                    description: exercise.description,
                    tags: exercise.tags,
                    customFields: {
                        notes: "",
                        distance: "",
                        reps: "",
                        sets: "",
                        time: "",
                        weight: ""
                    },
                });
            }
        },

        //Removes an exercise from the routine builder
        removeRoutineExercise(exercise) {
            const index = this.routineExercises.indexOf(exercise);
            
            if (index > -1) {
              this.routineExercises.splice(index, 1);
            }
        },

        //Moves an exercise up by one index in the routine builder
        moveUp(exercise) {
            const index = this.routineExercises.indexOf(exercise);
            if (index > 0) {
                const temp = this.routineExercises[index - 1];
                this.routineExercises[index - 1] = exercise;
                this.routineExercises[index] = temp;
            }
        },
        
        //Moves an exercise down by one index in the routine builder
        moveDown(exercise) {
            const index = this.routineExercises.indexOf(exercise);
            if (index < this.routineExercises.length - 1) {
                const temp = this.routineExercises[index + 1];
                this.routineExercises[index + 1] = exercise;
                this.routineExercises[index] = temp;
            }
        }
    },   
})