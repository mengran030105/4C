<template>
  <div class="chart-container">
    <v-chart class="chart" :option="chartOption" autoresize />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { use } from "echarts/core";
import VChart from "vue-echarts";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

// 注册 ECharts 组件
use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer
]);

// 定义 Props
interface ChartData {
  time: string[];
  values: number[];
}

const props = defineProps<{
  chartData: ChartData;
  title: string; // 新增 title 属性
}>();

// 计算 ECharts 配置
const chartOption = computed(() => {
  // 获取最大值和最小值
  const values = props.chartData.values || [];
  const maxValue = Math.max(...values) * 1.1; // 最大值的 1.1 倍
  const minValue = Math.min(...values) * 0.9; // 最小值的 0.9 倍
  return {
    title: {
      text: props.title, // 使用传递的 title 属性
      left: "center"
    },
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const { name, value } = params[0];
        return `时间: ${name} <br> 值: ${value}`;
      }
    },
    xAxis: {
      type: "category",
      data: props.chartData.time || [],
      boundaryGap: false
    },
    yAxis: {
      type: "value",
      min: parseFloat(minValue.toFixed(2)),
      max: parseFloat(maxValue.toFixed(2))
    },
    series: [
      {
        name: "风险信号",
        type: "line",
        data: props.chartData.values || [],
        smooth: true,
        lineStyle: {
          width: 2
        }
      }
    ]
  };
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>