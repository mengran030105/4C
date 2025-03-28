<template>
  <div class="calendar-container">
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      :default-value="defaultDateRange"
      :disabledDate="disabledDate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ElDatePicker } from "element-plus";

// 默认日期范围
const defaultDateRange = ref<[Date, Date]>([
  new Date("2024-12-01"),
  new Date("2024-12-07")
]);
const dateRange = ref<[Date, Date]>(defaultDateRange.value);

// 触发日期范围变化事件
const emit = defineEmits(["dateRangeSelected"]);
watch(dateRange, newRange => {
  if (newRange && newRange.length === 2) {
    emit("dateRangeSelected", newRange);
  }
});

// 禁用不在2024年的日期
const disabledDate = (date: Date) => {
  const year = date.getFullYear();
  return year !== 2024;
};
</script>

<style scoped>
.calendar-container {
  width: 100%;
}
</style>