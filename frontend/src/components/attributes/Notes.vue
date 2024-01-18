<script setup>
    import { useRoutineStore } from "../../stores/RoutineStore"; 
    const routineStore = useRoutineStore();

    const updateMyProperty = (newValue) => {
      const index = routineStore.index;
      routineStore.routineExercises[index].customFields.notes = newValue;
    }
</script>

<template>
    <div class="notes input-group">
        <span class="input-group-text attributeLabel" id="basic-addon1">Notes</span>
        <textarea id="notes" class="form-control" name="notes" rows="3" cols="26" maxlength="600"
        :value="routineStore.routineExercises[routineStore.index].customFields.notes" @input="updateMyProperty($event.target.value)"></textarea>
        <button type="button" class=" input-group-text material-icons" id="removeAttribute"  aria-label="Close" @click="routineStore.removeDisplayedAttribute('notes')">close</button>              
    </div>
</template>

<style>
</style>