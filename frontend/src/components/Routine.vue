<script setup>
    import { useRoutineStore } from "../stores/RoutineStore"; 
    import setsComponent from "./attributes/Sets.vue"; 
    import repsComponent from "./attributes/Reps.vue"; 
    import weightComponent from "./attributes/Weight.vue"; 
    import timeComponent from "./attributes/Time.vue"; 
    import notesComponent from "./attributes/Notes.vue"; 
    import distanceComponent from "./attributes/Distance.vue"; 
    import {ref as vueRef} from "vue";
    import { storage} from '../fire.js';
    import { ref as fireRef } from 'firebase/storage';
    import { getDownloadURL, uploadBytes } from "@firebase/storage";
    import router from "../router";

    const routineStore = useRoutineStore(); 
    const selectedExercise = vueRef(null);

    //Open the correct modal
    const openModal = (exercise, modalType) => {
          selectedExercise.value = exercise;
          routineStore.editingExercise = exercise;
          routineStore.index = routineStore.routineExercises.indexOf(exercise);
          const modal = document.getElementById(modalType);
          const modalInstance = new bootstrap.Modal(modal);
          modalInstance.show();
      }

    const selectedItems = vueRef([]);

    //Update the title
    const updateRoutineName = (newTitle) => {
        routineStore.routineName = newTitle;
      }

    // Function to handle the file selection event and update the selectedImage variable
    const selectImage = (event) => {
      routineStore.selectedImage = event.target.files[0];
      //If user opens file selector and clicks cancel the image should not be stored in the routine anymore.
      if(routineStore.selectedImage === undefined) {
        routineStore.routineCoverImageUrl = '';
      }
    };

    const imageUploadSuccess = vueRef();
    const imageUploadError = vueRef();

    //Uploads an image to the firebase store and saves the URL location
    const uploadImage = async () => {
        imageUploadSuccess.value = "";
        imageUploadError.value = '';
        const file = routineStore.selectedImage;

        if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
        }

        try {
        // Create a new Firebase Storage reference with a unique name
        const fileName = `${new Date().getTime()}-${routineStore.selectedImage.name}`;

        //Reference to path and filename to upload
        const storageRef = fireRef(storage, 'userRoutineImages/'+fileName);

        // Upload the file to Firebase Storage
        uploadBytes(storageRef, file).then( (snapshot) => {
          imageError.value = '';
          imageUploadSuccess.value = "Image uploaded successfully";
      
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            // console.log("Download URL:", downloadURL);

            routineStore.routineCoverImageUrl = downloadURL;
          });

        })
      } catch (error) {
        imageUploadError.value = 'Error uploading image';
        // throw error;
      }
    }

    const titleError = vueRef('');
    const imageError = vueRef('');
    const minExercisesError = vueRef('');

    //Creates a routine if all fields are valid
    const createRoutine = async () => {
        titleError.value = '';
        imageError.value = '';
        minExercisesError.value = '';
        imageUploadError.value = '';
        imageUploadSuccess.value = '';

          if(routineStore.routineName.length < 1 || routineStore.routineName.length > 26) {
            titleError.value = "Routine title must be 1 to 26 characters long";
            return false;
          }

          if(routineStore.routineCoverImageUrl.length < 1) {
            imageError.value = "Please upload an image";
            return false;
          }

          if(routineStore.routineExercises.length < 1) {
            minExercisesError.value = "Add at least one exercise";
            return false;
          }

          if(routineStore.routineExercises.length > 50) {
            minExercisesError.value = "Max amount of exercises reached (50)";
            return false;
          }

          try {
            await routineStore.createRoutine();
            router.push('/routines');
            } catch (error) {
            }
      }
</script>

<template>
   <div class="routineList">
        <div class="routineHeaderBox">
                <div class="routineHeader">
                    <h2>Create Routine</h2>
                    <button id="saveRoutineButton" @click="createRoutine()">Create</button>
                </div>
              
                <!-- Title section -->
                <span v-if="titleError" class="input-group-text"  id="errorMessage">{{titleError}}</span>
                <div class="titleBox input-group" >
                    <span class="input-group-text titleInput " id="basic-addon1">Title</span>
                    <input type="text" class="form-control" maxlength="26" placeholder="Give your routine a name" aria-label="Title" aria-describedby="basic-addon1"
                    :value="routineStore.routineName" @input="updateRoutineName($event.target.value)">
                    <span v-if="titleError" class="input-group-text material-icons"  id="errorIcon">warning</span>
                </div>
              
                <!-- Image Upload section -->
                <div>
                    <label class="imageDescription">Upload a cover image for your routine </label>
                    <span v-if="imageError" class="input-group-text"  id="errorMessage">{{imageError}}</span>
                    <span v-if="imageUploadSuccess" class="input-group-text"  id="imageSuccess">{{imageUploadSuccess}}</span>
                    <span v-if="imageUploadError" class="input-group-text"  id="imageUploadError">{{imageUploadError}}</span>
                    <div class=" input-group" id="upload-form">
                      <input class="form-control" type="file" id="formFile" name="file" @change="selectImage"  ref="fileInput" multiple="false" required accept="image/* ">
                      <span v-if="imageError" class="input-group-text material-icons"  id="errorIcon">warning</span>
                      <button id="uploadButton" class="input-group-text" @click="uploadImage()">Upload</button>
                    </div>
                </div>
              
                <!-- Too few exercises warning -->
                <div class= 'input-group '>
                  <span v-if="minExercisesError" class="input-group-text "  id="errorMessageExercise">{{minExercisesError}}</span>
                  <span v-if="minExercisesError" class="input-group-text material-icons"  id="errorIconExercise">warning</span>
                </div >
            </div>
            
            <!-- Display all exercises that have been added to the routine -->
            <div v-for="exercise in routineStore.routineExercises" :key="exercise._id">
                <div class="routineExercise" >
                    <div id="innerCard">
                    <h3 id="exerciseTitle">{{ exercise.title }}</h3>
                    <img id="fireImg" draggable="false" :src="exercise.imageUrl">
                </div>

                <!-- Exercise actions -->
                <div id="routineOverlay">
                    <i class="material-icons routine-exercise-icons" data-bs-toggle="tooltip" title="Remove Exercise" @click="routineStore.removeRoutineExercise(exercise)">delete</i>
                    <i class="material-icons routine-exercise-icons" data-bs-toggle="tooltip" title="Move Up" @click="routineStore.moveUp(exercise)">expand_less</i>
                    <i class="material-icons routine-exercise-icons" data-bs-toggle="tooltip" title="Move Down" @click="routineStore.moveDown(exercise)">expand_more</i>
                    <i class="material-icons routine-exercise-icons" data-bs-toggle="tooltip" title="Edit" @click="openModal(exercise,'editModal')">edit</i>
                </div>
            </div>       
        </div>
    </div>

        <!-- Edit routine exercise Modal -->
        <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" data-bs-backdrop="static" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="editModalLabel">{{ selectedExercise ? selectedExercise.title : '' }}</h1>
                    </div>
                    <div class="modal-body">
                       
                      <!-- Add attributes section -->
                      <div class="dropdown">
                          <button class="btn btn-secondary dropdown-toggle" id="addAttributeButton" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Add Attribute
                          </button>
                          <ul class="dropdown-menu">
                            <li><a class="dropdown-item" @click="routineStore.addAttribute('notes',selectedExercise._id)">Notes</a></li>
                            <li><a class="dropdown-item" @click="routineStore.addAttribute('reps',selectedExercise._id)">Reps</a></li>
                            <li><a class="dropdown-item" @click="routineStore.addAttribute('sets',selectedExercise._id)">Sets</a></li>
                            <li><a class="dropdown-item" @click="routineStore.addAttribute('weight',selectedExercise._id)">Weight</a></li>
                            <li><a class="dropdown-item" @click="routineStore.addAttribute('distance',selectedExercise._id)">Distance</a></li>
                            <li><a class="dropdown-item" @click="routineStore.addAttribute('time',selectedExercise._id)">Time</a></li>
                          </ul>
                      </div>

                      <!-- Show selected attributes-->
                      <notesComponent class="notesComponent" v-if="selectedExercise && routineStore.matchingAttribute('notes', selectedExercise._id)" label="Notes" />
                      <repsComponent v-if="selectedExercise && routineStore.matchingAttribute('reps', selectedExercise._id)" label="Reps" />
                      <setsComponent v-if="selectedExercise && routineStore.matchingAttribute('sets', selectedExercise._id)"  label="Sets" />
                      <weightComponent v-if="selectedExercise && routineStore.matchingAttribute('weight', selectedExercise._id)" label="Weight" />
                      <distanceComponent v-if="selectedExercise && routineStore.matchingAttribute('distance', selectedExercise._id)"  label="Distance" />
                      <timeComponent v-if="selectedExercise && routineStore.matchingAttribute('time', selectedExercise._id)" label="Time" />
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>  
        </div>   
</template>

<style scoped>

.notesComponent {
    margin-bottom: 15px;
}

.btn-primary {
    background-color: #1FAB89;
    border: #1FAB89;
}

#addAttributeButton {
    background-color: #1FAB89;
    border: none;
    margin-top: 20px;
    margin-bottom: 10px;
}

.modal-body {
    overflow-y: scroll;
    min-height: 300px;
    max-height: 60vh;
}

#imageSuccess {
    color: #F76B69;
    color: #1FAB89;
    font-weight: 500;
    border: none;
    background-color: #1fab8800;
}

#imageUploadError {
    color: #F76B69;
    font-weight: 500;
    border: none;
    background-color: #1fab8800;
}

#errorMessage {
    color: #F76B69;
    border: none;
    background-color: #fcfcfc00;
    font-weight: 500;
}

#errorIcon {
    background-color: #F76B69;
    color: #ffffff;
}

#errorMessage:hover {
    cursor:default;
}

#errorMessageExercise {
    color: #F76B69;
    border: none;
    background-color: #f7e3e300;
    font-weight: 500;
    font-size:18px;
}

#errorIconExercise {
    color: #F76B69;
    background-color: #1fab8800;
    border: none;
    font-size: 24px;
}

#errorMessageExercise:hover {
    cursor:default;
}

.imageDescription {
    font-size: 1em;
    color: #3C4553;
    font-weight: 500;
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

.form-control:focus {
    box-shadow: 0 0 0 3px #21b48f49;
    border-color:#21b48f49 ;
}

.routineList {
    background-color: rgb(228, 230, 232);
    width: 24vw;
    min-width: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 92vh;
    padding-top: 20px;
    padding-bottom: 20px;
    overflow-y: scroll; 
    padding-left: 1vw;
    padding-right: 1vw;

}

#exerciseRoutineCard {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
    background-color: rgb(255, 255, 255);
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
    padding: 20px; 
}

#RoutineCardOverlay {
    transition: .5s ease;
    opacity: 0;
    position:relative;
    text-align: center;
    display: flex;
    justify-content: center;
    gap: 5px;
}

.routineExercise {
    color: #3C4553;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: top;  
    width: 18vw;
    min-width: 300px;
    min-height: 100px;
    background: rgb(255, 255, 255);
    margin-top: 20px;
    border-radius: 10px;
    box-shadow: 2px 4px 6px rgb(125, 125, 125);
}

#innerCard {
    background-color: #ffffff;
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
    border-radius: 20px;
    justify-content: center;
}

.routineHeaderBox {
    display: flex;
    flex-direction: column;
    gap: 1vh;
}
.routine-exercise-icons {
      color: #3C4553;
      min-width: 30px;
 }

.routine-exercise-icons:hover {
      color: #1FAB89;
      cursor: pointer;
 }

#routineOverlay {
    transition: .5s ease;
    opacity: 1;
    position:relative;
    text-align: center;
    display: flex;
    justify-content: center;
    gap: 5px;
}

#exerciseTitle {
    font-size: 25px;
}

#fireImg {
    max-width: 90px;
    max-height: 90px;
}

.titleBox {
    display: flex;
}

.routineHeader {
    color: #3C4553;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
}

#saveRoutineButton {
    background-color: #1FAB89;
    color: white;
    border: 0;
    font-weight: 500;
    border-radius: 20px;
    cursor: pointer;
    font-size: 1em;
    max-height: 30px;
    margin-top: 5px;
    width: 80px;
}

#uploadButton {
    background-color: #1FAB89;
    border: none;
    color: white;
    font-weight: 500;
}
</style>

