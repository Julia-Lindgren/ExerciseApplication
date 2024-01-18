<script setup>
  import { useRoutineStore } from "../../stores/RoutineStore"; 
  const routineStore = useRoutineStore();

  const updateMyProperty = (newValue) => {
      const index = routineStore.index;
      routineStore.routineExercises[index].customFields.reps = newValue;
    }
</script>

<template>
    <div class="input-group mb-3">
        <span class="input-group-text attributeLabel" id="basic-addon1">Reps</span>
        <input type="text" class="form-control" aria-label="Text input with dropdown button" maxlength="20"
        :value="routineStore.routineExercises[routineStore.index].customFields.reps" @input="updateMyProperty($event.target.value)">
        <button type="button" class=" input-group-text material-icons" id="removeAttribute"  aria-label="Close" @click="routineStore.removeDisplayedAttribute('reps')">close</button>
    </div>
</template>

<style>
</style>