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
      :default-value="defaultMonth"
      :disabledDate="disabledDate"
      @change="handleDateRangeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElDatePicker, ElMessage } from "element-plus";

const dateRange = ref<[Date, Date] | null>(null);

const defaultMonth = ref<Date>(new Date(2024, 11));

const emit = defineEmits(["dateRangeSelected"]);

// 处理日期范围变化
const handleDateRangeChange = (val: [string, string] | null) => {
  if (!val || val.length !== 2) return;

  const startDate = new Date(val[0]);
  const endDate = new Date(val[1]);
  const diffDays = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays > 15) {
    ElMessage.warning("由于DeepSeek的tokens有限，日期跨度请勿超过15天");
    dateRange.value = null;
    return;
  }

  emit("dateRangeSelected", [startDate, endDate]);
};

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
