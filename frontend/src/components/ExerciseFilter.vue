<script setup>
    import { ref } from "vue";
    import { useExerciseStore } from "../stores/ExerciseStore";  

    const exerciseStore = useExerciseStore();
 
    const categories = {
    shoulder: ref(false),
    elbow: ref(false),
    hip: ref(false),
    wrist: ref(false),
    knee: ref(false),
    ankle: ref(false),
    
    shoulders: ref(false),
    chest: ref(false),
    back: ref(false),
    arms: ref(false),
    abs: ref(false),
    legs: ref(false),

    mobility: ref(false),
    strength: ref(false),
    endurance: ref(false),
    stability: ref(false),

    favourite: ref(false),
    custom: ref(false)
    }

    //Updates values when user changes a filter selection
    const onCheckboxChange = (id) => {
        categories[id].value = !categories[id].value // toggle the value

        if (categories[id].value === true) {
            exerciseStore.setFilterTag(id);
            exerciseStore.updateFilteredExercises();
        } else {
            exerciseStore.removeFilterTag(id);
            exerciseStore.updateFilteredExercises();
        }
    }

    //Updates values when user changes the favourite filter selection
    const onFavouriteCheckboxChange = (id) => {
        categories[id].value = !categories[id].value // toggle the value

        if (categories[id].value === true) {
            exerciseStore.favouriteFilter = true;
            exerciseStore.updateFilteredExercises();
        } else {
            exerciseStore.favouriteFilter = false;
            exerciseStore.updateFilteredExercises();
        }
    }

    const resetFilter = () => {
        exerciseStore.resetFilter();
        for (const key in categories) {
            categories[key].value = false;
        }
        exerciseStore.updateFilteredExercises();
    }

    //Reset filter upon refreshing component
    resetFilter();
</script>

<template>
    <div class = "filterBox">
        <!-- Filter header -->
        <div class="top">
            <h1 class="header">Filter</h1>
            <button id="resetButton"  type="button" @click="resetFilter()">Reset</button>
        </div>

        <!-- Filter List With categories -->
        <div class="categoryList">

            <!-- Joint category -->
            <button class="btn btn-primary categoryButton" type="button" data-bs-toggle="collapse" data-bs-target="#focus" aria-expanded="false" aria-controls="focus">
            <span>Joint</span>
            <i class="material-icons routineListIcons" data-bs-toggle="tooltip" title="Delete Routine">expand_more</i>
            </button>
            <div class="collapse" id="focus">
                <div class="card card-body">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="shoulder"  @change="onCheckboxChange($event.target.id)" :checked="categories['shoulder'].value">
                        <label class="form-check-label" for="shoulder">
                            Shoulder
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="elbow"  @change="onCheckboxChange($event.target.id)" :checked="categories['elbow'].value">
                        <label class="form-check-label" for="elbow">
                            Elbow
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="wrist"  @change="onCheckboxChange($event.target.id)" :checked="categories['wrist'].value">
                        <label class="form-check-label" for="wrist">
                            Wrist
                        </label>
                    </div>
                    <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="hip"  @change="onCheckboxChange($event.target.id)" :checked="categories['hip'].value">
                            <label class="form-check-label" for="hip">
                                Hip
                            </label>
                    </div>
                    <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="knee" @change="onCheckboxChange($event.target.id) " :checked="categories['knee'].value">
                            <label class="form-check-label" for="knee">
                                Knee
                            </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="ankle"  @change="onCheckboxChange($event.target.id)" :checked="categories['ankle'].value">
                        <label class="form-check-label" for="ankle">
                            Ankle
                        </label>
                    </div>
                </div>
            </div>

            <!-- Muscle group category -->
            <button class="btn btn-primary categoryButton" type="button" data-bs-toggle="collapse" data-bs-target="#muscle" aria-expanded="false" aria-controls="muscle">
                <span>Muscle Group</span>
                <i class="material-icons routineListIcons" data-bs-toggle="tooltip" title="Delete Routine">expand_more</i>
            </button>

            <div class="collapse" id="muscle">
                <div class="card card-body">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="shoulders"  @change="onCheckboxChange($event.target.id)" :checked="categories['shoulders'].value">
                        <label class="form-check-label" for="shoulders">
                            Shoulders
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="chest"  @change="onCheckboxChange($event.target.id)" :checked="categories['chest'].value">
                        <label class="form-check-label" for="chest">
                            Chest
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="back"  @change="onCheckboxChange($event.target.id)" :checked="categories['back'].value">
                        <label class="form-check-label" for="back">
                            Back
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="arms"  @change="onCheckboxChange($event.target.id)" :checked="categories['arms'].value">
                        <label class="form-check-label" for="arms">
                            Arms
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="abs"  @change="onCheckboxChange($event.target.id)" :checked="categories['abs'].value">
                        <label class="form-check-label" for="abs">
                            Abs
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="legs"  @change="onCheckboxChange($event.target.id)" :checked="categories['legs'].value">
                        <label class="form-check-label" for="legs">
                            Legs
                        </label>
                    </div>
                </div>
            </div>

            <!-- Exercise Type category -->
            <button class="btn btn-primary categoryButton" type="button" data-bs-toggle="collapse" data-bs-target="#purpose" aria-expanded="false" aria-controls="purpose">
                <span>Exercise Type</span>
                <i class="material-icons routineListIcons" data-bs-toggle="tooltip" title="Delete Routine">expand_more</i>
            </button>

            <div class="collapse" id="purpose">
                <div class="card card-body">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="mobility" @change="onCheckboxChange($event.target.id)"  :checked="categories['mobility'].value">
                        <label class="form-check-label" for="mobility">
                            Mobility
                        </label>
                    </div>
                    <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="strength" @change="onCheckboxChange($event.target.id)"  :checked="categories['strength'].value">
                            <label class="form-check-label" for="strength">
                                Strength
                            </label>
                    </div>
                    <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="endurance" @change="onCheckboxChange($event.target.id)"  :checked="categories['endurance'].value">
                            <label class="form-check-label" for="endurance">
                                Endurance
                            </label>
                    </div>
                    <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="stability" @change="onCheckboxChange($event.target.id)"  :checked="categories['stability'].value">
                            <label class="form-check-label" for="stability">
                                Stability
                            </label>
                    </div>
                </div>
            </div>

            <!-- Other category -->
            <button class="btn btn-primary categoryButton" type="button" data-bs-toggle="collapse" data-bs-target="#other" aria-expanded="false" aria-controls="purpose">
                <span>Other</span> 
                <i class="material-icons routineListIcons" data-bs-toggle="tooltip" title="Delete Routine">expand_more</i>
            </button>

            <div class="collapse" id="other">
                <div class="card card-body">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="favourite" @change="onFavouriteCheckboxChange($event.target.id)"  :checked="categories['favourite'].value">
                        <label class="form-check-label" for="favourite">
                            Favourite
                        </label>
                    </div>
                    <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="custom" @change="onCheckboxChange($event.target.id)"  :checked="categories['custom'].value">
                            <label class="form-check-label" for="custom">
                                Custom
                            </label>
                    </div>
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
 .filterBox {
    background-color: #3C4553;
    width: 15vw;
    min-width: 200px;
    box-shadow: 2px 0px 2px rgb(125, 125, 125);
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 92vh;
    overflow-y:scroll;
 }

 .header {
    color: rgb(255, 255, 255);    
 }

 .top {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 40px;
    padding: 0px 15px;
    padding-top: 30px;
 }

 #resetButton {
    background-color: #F76B69;
    margin-top: 15px;
    width: 80px;
    height: 30px;
    font-weight: 500;
    color: white;
    border-radius: 20px;
    border: none;
    box-shadow: 2px 2px 5px #333333;   
 }

 .categoryList {
    display: flex;
    flex-direction: column;
    align-items: center;
 }

 .categoryButton {
    background-color:  #ffffff;
    color: #3C4553;
    font-weight: 500px;
    width: 150px;
    font-weight: 500;
    border: none;
    margin-top: 10px;
    background-color: #1FAB89;
    color: #ffffff;
    border-radius: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* gap: 5px; */
 }

 .categoryButton:hover {
    background-color: #1fab8892;
 }

 .card {
    width: 120px;
    margin-top: 5px;
    margin-bottom: 10px;
    border-radius: 20px;
 }

 .form-check {
    font-weight: 400;
}

.form-check-input {
    box-shadow: none;
    border-color: #3C4553;
    
}
.form-check-input:checked {
    background-color: #1FAB89;
    box-shadow: 0 0 0 3px #21b48f86;
}
</style>