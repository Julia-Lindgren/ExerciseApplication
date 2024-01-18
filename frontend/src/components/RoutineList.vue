<script setup>
    import { ref } from "vue";
    import { useRoutineStore } from "../stores/RoutineStore";  
    import router from "../router.js"; 
    const routineStore = useRoutineStore();
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    
    routineStore.getUserRoutines();
    const selectedRoutine = ref(null);

    //Open the correct modal that is clicked
    const openModal = (routine, modalType) => {
        selectedRoutine.value = routine;
        routineStore.editingRoutine = routine;
        routineStore.routineIndex = routineStore.userRoutines.indexOf(routine);
        const modal = document.getElementById(modalType);
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    }

    const modal = ref(null);
    const title = ref(null);
    //Function to create a printable version of the selected routine
    const printModal = () => {
        const content = modal.value.innerHTML;
        const routineTitle = title.value.innerHTML;
         
        
        const printWindow = window.open('', 'PrintWindow', 'height=400,width=600');

        printWindow.document.write(`<html><head><title>${routineTitle}
            </title><style>
                #fireImage {
                    width: 120px;
                        height: 120px;
                }

                .routineExercisesModal {
                    background-color: #ffffff;
                    border-bottom: 2px solid rgb(215, 215, 215);
                    padding: 5px;
                    margin: 5px;
                    display: flex;
                    flex-direction: row;
                    gap: 20px;
                }

                .exerciseMain {
                    display: flex;
                    flex-direction: column;
                    border-left: 2px solid rgb(200, 200, 200);
                    padding-left: 10px;
                }

                .exerciseTitle {
                    font-size: 22px;
                    font-weight: 500;
                }

                .attributes {
                    font-size: 15px;
                    overflow-wrap: break-word;
                    width: 800px;
                }

                .description {
                    font-size: 15px;
                    overflow-wrap: break-word;
                    width: 800px;
                }

                #AttributeKey {
                    font-weight: bold;
                }
             </style></head>
            <body><div class="print-modal">${content}</div></body></html>`);
        printWindow.document.close();

         printWindow.addEventListener('load', () => {
            printWindow.print();
         })
    }

    //Update the title
    const deleteRoutine = async () => {
        await routineStore.deleteRoutine();
        //Refresh
        // await routineStore.getUserRoutines();
        // router.go();
      }
</script>

<template>
    <!-- Routine window -->
    <div class="routine">
        <h1 class="display-6">Your Routines</h1>
        <div class = "routineGrid">
            <div class="row row-cols-2 row-cols-md-4 g-4">
                <div v-for="routine in routineStore.userRoutines"  >
                    <div class="card " id="routineCard">
                        <div class="card-image">
                            <img  :src="routine.routineImageUrl" class="card-img-top routineCoverImage" alt="...">
                        </div>
                        <div class="card-body">
                            <div class="card-title">{{ routine.title }}</div>
                        </div>
                        <div class="card-footer">
                            <i class="material-icons routineListIcons" data-bs-toggle="tooltip" title="View Routine" @click="openModal(routine, 'showRoutineModal')">visibility</i>
                            <i class="material-icons routineListIcons" data-bs-toggle="tooltip" title="Delete Routine" @click="openModal(routine, 'deleteRoutineModal')">delete</i>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- View Routine Modal -->
    <div class="modal fade" id="showRoutineModal" tabindex="-1" aria-labelledby="showRoutineModal" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" >
            <div class="modal-content" >
                <div class="modal-header" >
                    <h1 class="modal-title fs-5" id="editModalLabel" ref="title" >{{ selectedRoutine ? selectedRoutine.title : '' }}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="modalRoutine" ref="modal">
                    <div v-for="exercise in routineStore.editingRoutine.exercises">
                        <div class="routineExercisesModal">
                            <img id="fireImage" draggable="false" :src="exercise.imageUrl">
                            <div class="exerciseMain">
                                <div class="exerciseTitle">{{exercise.title}}</div>
                                <div class="description">{{exercise.description}}  </div>
                                <div class="attributes" v-for="[key, value] in Object.entries(exercise.customFields)" :key="key">
                                    <div v-if="value.length > 0">
                                        <div><span id="AttributeKey">{{ key.charAt(0).toUpperCase() + key.slice(1) }}</span>: {{ value }}</div>
                                    </div>
                                </div>                               
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="openModal(selectedRoutine, 'deleteRoutineModal')">Delete</button>
                    <div class="right-buttons">
                        <button type="button" class="btn btn-primary" @click="printModal()">Print</button>
                        <button type="button" class="btn btn-primary"  @click="" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>  
    </div> 

    <!-- Confirm Delete Routine Modal -->
    <div class="modal fade" id="deleteRoutineModal" tabindex="-1" aria-labelledby="deleteRoutineModal" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header" id="modalHeader">
                    <h1 class="modal-title fs-5" id="deleteRoutineModalLabel">Deleting {{ selectedRoutine ? selectedRoutine.title : '' }}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this routine permanently?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="deleteRoutine()">Delete</button>
                    <button type="button" class="btn btn-primary"  @click="" data-bs-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>  
    </div>   
</template>
  
<style scoped>
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

#AttributeKey {
    font-weight: 500;
}
.modal-body {
    overflow-y: scroll;
    overflow-x: hidden;
    max-height: 65vh;
}

#deleteRoutineButton {
    background-color: #F76B69;
    
}

.description {
    max-width: 280px;
    overflow-wrap: break-word;
}

.attributes {
    max-width: 280px;
    overflow-wrap: break-word;
}

.modal-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.right-buttons {
    display: flex;
    flex-direction: row;
    gap: 20px;
}
.btn-secondary {
    background-color: #F76B69;
    border: none;
}

.btn-primary {
    background-color: #1FAB89;
    border: none;
}

#fireImage {
    max-width: 130px;
    max-height: 130px;
}

.exerciseTitle {
    font-size: 22px;
    font-weight: 500;
}
.exerciseMain {
    display: flex;
    flex-direction: column;
    border-left: 2px solid rgb(200, 200, 200);
    padding-left: 10px;
}

.routineExercisesModal {
    background-color: #ffffff;
    border-bottom: 2px solid rgb(215, 215, 215);
    padding: 5px;
    margin: 5px;
    display: flex;
    flex-direction: row;
    gap: 20px;

}
.display-6 {
    padding-top: 5vh;
        color: #393E46;
        font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        font-size: 40px;
        padding-bottom: 1vh;
    }
.routineListIcons {
    cursor: pointer;
}

.routineListIcons:hover {
    cursor: pointer;
    color: #1FAB89;
}

.routineCoverImage {
    max-width: 100%;
    max-height: 100%;
    display: flex;
    padding: 5px;
    border-radius: 20px;
    
}

#routineCard {
    border-radius: 20px;
    width: 15vw;
    min-width: 200px;
    min-height: 250px;
    float: none;
    background-color: #ffffff;
    color: #393E46;
    font-weight: 500;
    border: none;
    box-shadow: 2px 2px 5px rgb(125, 125, 125);
}

.card-image {
    display: flex;
    justify-content: center;
    height: 160px;
    border-radius: 20px;
}

.card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;
    height: 60px;
    font-size: 22px;
    text-align: center;
}

.card-footer {
    color: #393E46;
    background-color: #ffffff;
    border-top: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
}

.routineGrid {
    max-width: 80vw;
    width: 80vw;
    border-radius: 20px;
    padding: 30px;
    max-height: 80vh;
    overflow-y: scroll;
    background-color: #f8f8f8;
}

.routine {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #eeeeee;
    width: 100vw;
}
</style>