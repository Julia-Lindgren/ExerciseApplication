<script setup>
    import { ref, watchEffect } from "vue";
    import { storeToRefs } from "pinia";
    import SearchBar from "./SearchBar.vue";
    import { useExerciseStore } from "../stores/ExerciseStore";  
    import { useRoutineStore } from "../stores/RoutineStore";  
    import { useUserStore } from "../stores/UserStore";  
    import {auth} from '../fire.js';
    import { ref as fireRef } from 'firebase/storage';
    import { getDownloadURL, uploadBytes } from "@firebase/storage";
    import { storage} from '../fire.js';
    import router from "../router.js"; 
    
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    const exerciseStore = useExerciseStore();
    const routineStore = useRoutineStore();
    const userStore = useUserStore();
    const newExercise = ref('');
    userStore.getUser();
   
    const selectedExercise = ref(null);
    const openModal = (exercise, modalType) => {
        // console.log("opening modal exercise is " , exercise);
        selectedExercise.value = exercise;
        const modal = document.getElementById(modalType);
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    }

    exerciseStore.getExercises();
    const faves = ref(userStore.favouriteExercises);
    
    watchEffect(() => {
             faves.value = userStore.favouriteExercises;
    });


    const title = ref('');
    const titleError = ref('');
    //Update the title
    const updateExerciseName = (newTitle) => {
      title.value = newTitle;
    }

    const description = ref('');
    const descriptionError = ref('');
    //Update the description
    const updateExerciseDescription = (newDescription) => {
        description.value = newDescription;
    }

    //Create a custom exercise if all fields are valid
    const createCustomExercise = async () => {
        
        titleError.value = "";
        descriptionError.value = "";
        imageError.value = '';
        imageUploadSuccess.value = '';
        imageUploadError.value = '';

        if(title.value.length < 1 || title.value.length > 26) {
            titleError.value = "Title must be 1 to 26 characters long"
            return false;
        }

        if(description.value.length < 1 || description.value.length > 260) {
            descriptionError.value = "Description must be 1 to 600 characters long"
            return false;
        }

        if(customImageUrl.value.length < 1) {
            imageError.value = "Please upload an image";
            return false;
        } 
         
        const user = auth.currentUser;
        const email = user.email;
        
        await exerciseStore.addExercise({
            title: title.value,
            owner: email,
            description: description.value,
            imageUrl: customImageUrl.value,
            tags:['custom']
        })
                
        customImageUrl.value = '';
        customImage.value = '';
        title.value = "";
        description.value = "";
        
        //Refresh
        await exerciseStore.getExercises();
        router.go();
    }

    const customImage = ref(null);
    const customImageUrl = ref('');

    // Function to handle the file selection event and update the selectedImage variable
     const selectImage = (event) => {
        customImage.value = event.target.files[0];
        //If user opens file selector and clicks cancel the image should not be stored in the routine anymore.
        if(customImage.value === undefined) {
        customImageUrl.value = '';
        }
    };
    const imageUploadSuccess = ref(null);
    const imageUploadError = ref(null);
    const imageError = ref(null);

    //Upload an image to the firebase cloud and get the URL back to store
    const uploadImage = async () => {
        imageUploadSuccess.value = "";
        imageUploadError.value = '';
        const file = customImage.value;

        if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
        }

        try {
        // Create a new Firebase Storage reference with a unique name
        const fileName = `${new Date().getTime()}-${customImage.value.name}`;
        // console.log(fileName, "filename");
        //Reference to path and filename to upload
        const storageRef = fireRef(storage, 'userRoutineImages/'+fileName);

        // Upload the file to Firebase Storage
        uploadBytes(storageRef, file).then( (snapshot) => {
        // console.log("uploaded!")
        imageError.value = '';
        imageUploadSuccess.value = "Image uploaded successfully";
    
        getDownloadURL(snapshot.ref).then((downloadURL) => {
            // console.log("Download URL:", downloadURL);
            customImageUrl.value = downloadURL;
        });
        })
        } catch (error) {
            imageUploadError.value = 'Error uploading image';
            // throw error;
        }
    }
</script>

<template>
    <div class="overall">

        <div class="aboveGrid">
            <!-- Create custom exercise button -->
            <button id="customExerciseButton" @click="openModal(exercise, 'createModal')">Create Exercise</button>

            <!-- Search bar -->
            <SearchBar/>
            <div></div>
        </div>

        <!-- Exercise list of all exercises from the database -->
        <div class = "grid">
            <div v-for="exercise in exerciseStore.displayedExercises" :key="exercise.id" >
                <div class="exercise">
                    <div id="normalDisplay">
                        <h3 id="exerciseTitle">{{ exercise.title }}</h3>
                        <img id="fireImage" draggable="false" :src="exercise.imageUrl">
                    </div>
                    <!-- Exercise overlay actions -->
                    <div id="overlay">
                            <i class="material-icons exercise-icons" data-bs-toggle="tooltip" title="Add Exercise" @click="routineStore.addRoutineExercise(exercise)">add_circle</i>
                            <i class="material-icons exercise-icons" data-bs-toggle="tooltip" title="Info" @click="openModal(exercise, 'infoModal')">info</i>
                            <i v-if="!(exerciseStore.customExercises.includes(exercise))" class="material-icons exercise-icons" data-bs-toggle="tooltip" title="Similar Exercises" @click="openModal(exercise, 'similarExercisesModal')">signpost</i>
                            <i v-if="exerciseStore.customExercises.includes(exercise)" class="material-icons exercise-icons" data-bs-toggle="tooltip" title="Similar Exercises" @click="openModal(exercise, 'deleteExerciseModal')">delete</i>
                            <i v-if="faves && faves.includes(exercise._id)" class="material-icons exercise-icons" id="favourite" data-bs-toggle="tooltip" title="Favourite"  @click="userStore.removeFavouriteExercise(exercise._id)">favorite</i>
                            <i v-else class="material-icons exercise-icons" data-bs-toggle="tooltip" title="Favourite" @click="userStore.addFavouriteExercise(exercise._id)">favorite</i>
                        </div>
                </div>          
            </div>
        </div>

        <!-- Confirm Delete Custom Exercise Modal -->
        <div class="modal fade" id="deleteExerciseModal" tabindex="-1" aria-labelledby="deleteExerciseModal" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header" id="modalHeader">
                            <h1 class="modal-title fs-5" id="deleteExerciseModalLabel">Deleting {{ selectedExercise ? selectedExercise.title : '' }}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                    <div class="modal-body">
                        Are you sure you want to delete this exercise permanently?
                    </div>
                    <div class="modal-footer delete-footer">
                        <button type="button" class="btn btn-secondary deleteButton" data-bs-dismiss="modal" @click="exerciseStore.deleteExercise(selectedExercise._id)">Delete</button>
                        <button type="button" class="btn btn-primary cancelButton"  @click="" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>  
        </div>   

        <!-- Info Modal -->
        <div class="modal fade" id="infoModal" tabindex="-1" aria-labelledby="infoModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header" id="modalHeader">
                            <h1 class="modal-title fs-5" id="infoModalLabel">Information about {{ selectedExercise ? selectedExercise.title : '' }}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                    <div class="modal-body">
                        <div class="modal-images"  >
                            <img :src="selectedExercise ? selectedExercise.imageUrl : '' " alt="Image" id="fireImage">
                            <img  v-if="!(exerciseStore.customExercises.includes(selectedExercise))" :src="selectedExercise ? selectedExercise.muscleImageUrl : '' " alt="MuscleImage" id="fireImage">
                        </div>
                        <div class="exerciseDescription">
                            <span class="descriptionTitle" >Instructions</span>
                            {{ selectedExercise ? selectedExercise.description : '' }}
                        </div>
                        <div v-if="selectedExercise && selectedExercise.references.length > 0" class="exerciseReferences">
                            <span class="referenceTitle" >Want to know more?</span>
                            <div class="references">   
                                <div  v-for="reference in selectedExercise.references" >
                               {{ reference }}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary modalButton" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>  
        </div>   

        <!-- Create Custom Exercise Modal -->
        <div class="modal fade" id="createModal" tabindex="-1" aria-labelledby="createModal" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header" id="modalHeader">
                            <h1 class="modal-title fs-5" id="createModalLabel">Create your own exercise</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                    <div class="modal-body customBody">
                        <span v-if="titleError" class="input-group-text"  id="errorMessage">{{titleError}}</span>
                        <div class="titleBox input-group" >
                            <span class="input-group-text titleInput " id="basic-addon1">Title</span>
                            <input type="text" class="form-control" maxlength="26" placeholder="Give your exercise a name" aria-label="Title" aria-describedby="basic-addon1"
                            @input=updateExerciseName($event.target.value)>
                            <span v-if="titleError" class="input-group-text material-icons"  id="errorIcon">warning</span>
                        </div>
                        
                        <span v-if="descriptionError" class="input-group-text"  id="errorMessage">{{descriptionError}}</span>
                        <div class="notes input-group">
                            <span class="input-group-text" id="basic-addon1">Description</span>
                            <textarea id="notes" class="form-control" name="notes" rows="3" cols="26" maxlength="260" @input=updateExerciseDescription($event.target.value)></textarea>
                        </div>

                        <!-- Image section -->
                        <div>
                            <label class="imageDescription">Upload an image for your exercise </label>
                            <span v-if="imageError" class="input-group-text"  id="errorMessage">{{imageError}}</span>
                            <span v-if="imageUploadSuccess" class="input-group-text"  id="imageSuccess">{{imageUploadSuccess}}</span>
                            <span v-if="imageUploadError" class="input-group-text"  id="imageUploadError">{{imageUploadError}}</span>
                            <div class=" input-group" id="upload-form">
                            <input class="form-control" type="file" id="formFile" name="file" @change="selectImage"  ref="fileInput" multiple="false" required accept="image/* ">
                            <span v-if="imageError" class="input-group-text material-icons"  id="errorIcon">warning</span>
                            <button id="uploadButton" class="input-group-text" @click="uploadImage()">Upload</button>
                            </div>
                        </div>

                    </div>
                    <div class="modal-footer custom-footer">
                        <!-- <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> -->
                        <button type="button" class="btn btn-primary modalButton" @click="createCustomExercise()">Create</button>
                        <button type="button" class="btn btn-primary modalButton" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>  
        </div> 

        <!-- Similar Exercises Modal -->
        <div class="modal fade" id="similarExercisesModal" tabindex="-1" aria-labelledby="similarExercisesModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content similarContent">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="similarExercisesModalLabel">Similar Exercises to {{ selectedExercise ? selectedExercise.title : '' }}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div v-if="selectedExercise" class="similarExercises">
                            <div v-for="exerciseId in selectedExercise.similarExercises" >
                                <div class="similarExercise">
                                    {{ (exerciseStore.getExerciseById(exerciseId) && exerciseStore.getExerciseById(exerciseId).title) || 'Loading...' }}
                                    <img v-if="exerciseStore.getExerciseById(exerciseId) && exerciseStore.getExerciseById(exerciseId).imageUrl" :src="exerciseStore.getExerciseById(exerciseId).imageUrl " alt="ExerciseImage" id="fireImage">
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary modalButton" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>  
        </div>  
    </div>
</template>

<style scoped>



.delete-footer, .custom-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.deleteButton {
    background-color: #F76B69;
    border: none;
}

.cancelButton {
    background-color: #1FAB89;
    border: none;
}

#errorMessage {
    background: none;
    border: none;
    color: #F76B69;
    font-weight: 500;
}

#errorIcon {
    background-color: #F76B69;
    color: white;
}

#imageSuccess {
    background: none;
    border: none;
    color: #1FAB89;
    font-weight: 500;
}
.titleBox {
    padding-bottom: 20px;
}

.imageDescription {
    padding-top: 20px;
    font-weight: 500;
}

.aboveGrid {
    display: flex;
    flex-direction: row;
    align-items: space-between;
    justify-content: center;
    gap: 50px;
    padding-right: 130px;
    width: 100%;
    min-width: 200px;
}
.referenceTitle {
    font-weight: 500;
}

#uploadButton {
    background-color: #1FAB89;
    color: white;
}

.customBody {
    display: flex;
    flex-direction: column;
}

#customExerciseButton {
    background-color: #1FAB89;
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
    border-radius: 20px;
    margin-top: 40px;
    border: none;
    padding: 10px;
    min-width: 130px;

}

.descriptionTitle {
    font-weight: 500;
}

.exerciseDescription {
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
    padding-top: 10px;
}

.exerciseReferences {
    display: flex;
    flex-direction: column;
}

.references {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.exerciseDescription {
    overflow-wrap: break-word;
}
.similarContent {
    min-width: 500px;
}
.similarExercises {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 50px;
    
}

.similarExercise {
    display: flex;
    flex-direction: column;
    font-size: 20px;
    font-weight: 500;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.modalButton {
    background-color: #1FAB89;
    border: none;
}

::-webkit-scrollbar {
  width: 15px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 20px;
  margin-top: 6vh;
  margin-bottom: 6vh;
  box-shadow: inset 1px 2px 4px grey; 
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #1FAB89;
  background: #1fab888d;
  border-radius: 20px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #1fab888d;
  background: #21b48f;
  border-radius: 20px;
}

#favourite {
    color: rgb(214, 71, 71);
}
.overall {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 92vh;
}

 .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    grid-gap: 20px;
    background-color: rgb(228, 230, 232);
    min-width: 50vw;
    margin-top: 20px;
    margin-bottom: 100px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    min-height: 70vh;
    border-radius: 20px;
    box-shadow: 2px 2px 5px rgb(125, 125, 125); 
    overflow-y: scroll; 
 }

 .exercise {
    color: #3C4553;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 220px;
    min-height: 200px;
    max-height: 200px;
    padding: 6px 20px;
    background: rgb(255, 255, 255);
    margin-top: 20px;
    border-radius: 4px;
    box-shadow: 2px 4px 6px rgb(125, 125, 125);
    border-radius: 10px;
 }

 .modal-images {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 30px;
 }

 #exerciseTitle {
    font-size: 24px
 }

 #normalDisplay {
    display: flex;
    flex-direction: column;
    align-items: center;
 }

 .exercise-icons {
    color: #3C4553;
    min-width: 30px;
 }

 .exercise-icons:hover {
    color: #21b48f;
    cursor: pointer;

 }

 #overlay {
  transition: .5s ease;
  opacity: 0;
  position:relative;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 5px;
}

.exercise:hover #normalDisplay *:not(#exerciseTitle, #overlay){
  opacity: 0.4;
}

.exercise:hover #overlay {
  opacity: 1;
}

#fireImage {
    max-width: 180px;
    max-height: 130px;
}
</style>