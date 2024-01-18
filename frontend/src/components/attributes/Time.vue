<script setup>
  import { useRoutineStore } from "../../stores/RoutineStore"; 
  const routineStore = useRoutineStore();

    const updateMyProperty = (newValue) => {
      const index = routineStore.index;
      routineStore.routineExercises[index].customFields.time = newValue;
    }

</script>

<template>
    <div class="input-group mb-3">
        <span class="input-group-text attributeLabel" id="basic-addon1">Time</span>
        <input type="text" class="form-control" aria-label="Text input with dropdown button" maxlength="20"
        :value="routineStore.routineExercises[routineStore.index].customFields.time" @input="updateMyProperty($event.target.value)">
        <button type="button" class=" input-group-text material-icons" id="removeAttribute"  aria-label="Close" @click="routineStore.removeDisplayedAttribute('time')">close</button>
    </div>
</template>

<style>

#removeAttribute {
    background-color: #F76B69;
    color: white;
    font-weight: 500;
}

.attributeLabel {
    color:  #3C4553;
    font-weight: 500;
}
</style>