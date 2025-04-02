<template>
  <div ref="chartRef" class="chart" />
</template>

<script lang="ts" setup>
import { ref, onMounted, defineEmits, nextTick } from "vue";
import * as echarts from "echarts";
import geo from "../json/geo";
import mapping from "../json/mapping";

// 绑定 DOM 容器
const chartRef = ref<HTMLDivElement | null>(null);
const emit = defineEmits(["countrySelected"]);
const selectedCountries = ref<string[]>([]);

// **确保 geo 数据可用**
if (!geo.WorldCountryGeo) {
  console.error("geo.WorldCountryGeo 为空！");
}

onMounted(async () => {
  await nextTick();

  if (!chartRef.value) {
    console.error("hartRef 未绑定到 DOM！");
    return;
  }

  const myChart = echarts.init(chartRef.value);
  if (!myChart) {
    console.error("ECharts 初始化失败！");
    return;
  }

  echarts.registerMap("WorldCountry", geo.WorldCountryGeo);

  // 地图配置项
  const options: echarts.EChartsOption = {
    tooltip: { trigger: "item" },
    toolbox: {
      show: true,
      orient: "vertical",
      left: "right",
      top: "center",
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      }
    },
    visualMap: {
      min: 0,
      max: 1,
      show: false,
      inRange: { color: ["rgb(078,101,155)", "rgb(183, 118, 108)"] }
    },
    series: [
      {
        name: "世界地图",
        type: "map",
        map: "WorldCountry",
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: "14" },
          itemStyle: { areaColor: "rgb(183, 118, 108)" }
        },
        nameMap: mapping.CountryNameZhMapping
      }
    ]
  };

  myChart.setOption(options);

  // 点击事件：选择国家
  myChart.on("click", (params: any) => {
    if (!params.name) return;

    const country = params.name;
    if (!selectedCountries.value.includes(country)) {
      if (selectedCountries.value.length < 2) {
        selectedCountries.value.push(country);
      } else {
        selectedCountries.value.shift();
        selectedCountries.value.push(country);
      }
    }

    emit("countrySelected", selectedCountries.value);

    // **更新地图高亮**
    myChart.setOption({
      series: [
        {
          data: selectedCountries.value.map(name => ({ name, value: 1 }))
        }
      ]
    });
  });

  window.addEventListener("resize", () => myChart.resize());
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 500px;
}
</style>
