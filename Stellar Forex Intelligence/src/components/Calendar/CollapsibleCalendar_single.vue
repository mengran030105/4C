<template>
  <div class="calendar-container">
    <input
      v-model="selectedDate"
      type="date"
      class="date-picker"
      @change="handleDateChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from "vue";

const emit = defineEmits(["dateSelected"]);
const selectedDate = ref("");

const handleDateChange = () => {
  if (selectedDate.value) {
    emit("dateSelected", selectedDate.value);
  }
};
</script>

<style scoped>
.calendar-container {
  text-align: center;
  width: 50px;
}
.date-picker {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}
</style>
