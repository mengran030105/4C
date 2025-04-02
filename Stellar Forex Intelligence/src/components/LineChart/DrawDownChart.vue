<template>
  <div class="chart-container" ref="chartContainer">
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, nextTick } from "vue";
import * as echarts from "echarts";

const props = defineProps<{
  chartData: {
    time: string[];
    values: number[];
  };
  maxDrawdown?: number;
  title: string;
}>();

const chartContainer = ref<HTMLElement | null>(null);
const chart = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;

const initChart = async () => {
  await nextTick();
  if (!chart.value || !chartContainer.value) return;

  disposeChart();
  myChart = echarts.init(chart.value);

  // 强制设置容器尺寸
  chartContainer.value.style.width = "100%";
  chartContainer.value.style.height = "400px";

  renderChart();

  // 添加响应式监听
  resizeObserver = new ResizeObserver(() => {
    myChart?.resize();
  });
  resizeObserver.observe(chartContainer.value);
};

const disposeChart = () => {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
};

const renderChart = () => {
  if (!myChart) return;

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

onMounted(() => {
  initChart();
});

onBeforeUnmount(() => {
  disposeChart();
});

watch(
  () => [props.chartData, props.maxDrawdown],
  () => {
    renderChart();
  },
  { deep: true }
);
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  position: relative;
}

.chart {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
