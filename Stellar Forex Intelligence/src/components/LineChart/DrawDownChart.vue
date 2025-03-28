<template>
  <div ref="chart" style="width: 100%; height: 400px"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

const props = defineProps<{
  chartData: {
    time: string[];
    values: number[];
  };
  maxDrawdown?: number;
  title: string;
}>();

const chart = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null; // 存储图表实例

// 销毁图表实例
const disposeChart = () => {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
};

// 渲染图表
const renderChart = () => {
  if (!chart.value) return;

  // 先销毁旧实例
  disposeChart();

  // 创建新实例
  myChart = echarts.init(chart.value);

  // 处理数据为空的情况
  if (!props.chartData || !props.chartData.time || !props.chartData.values) {
    console.warn("图表数据为空");
    return;
  }

  // 生成分段折线数据
  const segments = [];
  for (let i = 0; i < props.chartData.values.length - 1; i++) {
    const startValue = props.chartData.values[i];
    const endValue = props.chartData.values[i + 1];
    const startTime = props.chartData.time[i];
    const endTime = props.chartData.time[i + 1];

    // 判断是否需要标红（处理 maxDrawdown 可能为 undefined 的情况）
    const isRed =
      props.maxDrawdown !== undefined &&
      (startValue > props.maxDrawdown || endValue > props.maxDrawdown);

    segments.push({
      data: [
        { name: startTime, value: [startTime, startValue] },
        { name: endTime, value: [endTime, endValue] }
      ],
      lineStyle: {
        color: isRed ? "#FF0000" : "#5470C6"
      }
    });
  }

  const option = {
    title: {
      text: props.title,
      left: "center"
    },
    xAxis: {
      type: "category",
      data: props.chartData.time
    },
    yAxis: {
      type: "value"
    },
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const data = params[0];
        return `
          <div>
            <strong>时间：</strong>${data.name}<br/>
            <strong>值：</strong>${data.value[1].toFixed(2)}<br/>
          </div>
        `;
      }
    },
    series: segments.map(segment => ({
      type: "line",
      data: segment.data,
      lineStyle: segment.lineStyle,
      showSymbol: false,
      smooth: true
    })),
    markLine:
      props.maxDrawdown !== undefined
        ? {
            data: [
              {
                yAxis: props.maxDrawdown,
                lineStyle: {
                  color: "#FF0000",
                  width: 2
                },
                label: {
                  show: true,
                  formatter: "最大回撤比例"
                }
              }
            ]
          }
        : undefined
  };

  myChart.setOption(option);
};

// 生命周期
onMounted(() => {
  renderChart();
});

onBeforeUnmount(() => {
  disposeChart();
});

// 监听数据变化
watch(
  () => [props.chartData, props.maxDrawdown],
  () => {
    renderChart();
  },
  { deep: true }
);
</script>
