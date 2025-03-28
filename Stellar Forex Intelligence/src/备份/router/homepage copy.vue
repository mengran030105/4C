<template>
  <div class="dashboard-container">
    <div class="dashboard">
      <!-- 中间列 -->
      <div class="column2">
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="选择日期"
          :disabled-date="disabledDate"
          @change="handleDateSelected"
        />
        <div ref="chartRef" class="chart" :style="chartStyle" />

        <!-- 汇率详情板块 -->
        <div v-if="showDetails" class="chart-container exchange-rate-container">
          <div class="exchange-rate-details">
            <div class="header">
              <h2>{{ selectedCountry }} - {{ formattedDate }} 汇率详情</h2>
              <button class="close-button" @click="closeExchangeRate">×</button>
            </div>
            <table id="exchangeRatesTable">
              <thead>
                <tr>
                  <th rowspan="2">货币</th>
                  <th rowspan="2">货币符号</th>
                  <th colspan="2">主流货币信息</th>
                </tr>
                <tr>
                  <th>货币名称</th>
                  <th>货币汇率</th>
                </tr>
              </thead>
              <tbody v-if="new_data">
                <tr>
                  <td rowspan="9" style="vertical-align: middle">
                    {{ new_data.currency }}
                  </td>
                  <td rowspan="9" style="vertical-align: middle">
                    {{ new_data.currency_sign }}
                  </td>
                  <td>{{ new_data[`currency1_name`] }}</td>
                  <td>{{ new_data[`currency_rate1`] }}</td>
                </tr>
                <tr v-for="index in 8" :key="index">
                  <td>{{ new_data[`currency${index + 1}_name`] || "---" }}</td>
                  <td>{{ new_data[`currency_rate${index + 1}`] || "---" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 右侧列 -->
      <div class="column1">
        <div ref="pieChart" class="chart-container" />
        <div ref="lineChart" class="chart-container" />
        <div
          v-if="showDetails"
          ref="barChart"
          class="chart-container"
          style="height: 400px; width: 100%"
        />
      </div>
    </div>

    <!-- 新闻/政策切换板块 -->
    <div v-if="showDetails" class="info-panel-container">
      <div class="info-panel">
        <div class="info-tabs">
          <button
            class="tab-button"
            :class="{ active: activeTab === 'news' }"
            @click="activeTab = 'news'"
          >
            新闻
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'policy' }"
            @click="activeTab = 'policy'"
          >
            货币政策
          </button>
        </div>

        <div class="info-content">
          <div
            v-if="activeTab === 'news' && newsData.length > 0"
            class="news-list"
          >
            <div
              v-for="(item, index) in newsData"
              :key="index"
              class="news-item"
              @click="selectNews(index)"
            >
              <h3>{{ item.title }}（点击查看新闻详情）</h3>
              <!-- 点击后展示的详细内容 -->
              <div v-if="selectedNewsIndex === index" class="news-detail">
                <p>{{ item.content }}</p>
                <span class="news-date">{{ item.date }}</span>
              </div>
            </div>
          </div>

          <div
            v-if="activeTab === 'policy' && policyData.length > 0"
            class="policy-list"
          >
            <div
              v-for="(item, index) in policyData"
              :key="index"
              class="policy-item"
            >
              <h3>{{ item.title }}</h3>
              <p>{{ item.content }}</p>
            </div>
          </div>

          <div
            v-if="
              (activeTab === 'news' && newsData.length === 0) ||
              (activeTab === 'policy' && policyData.length === 0)
            "
            class="no-data"
          >
            暂无数据
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, computed, watch } from "vue";
import * as echarts from "echarts";
import geo from "@/json/geo";
import mapping from "@/json/mapping";
import axios from "axios";
import dayjs from "dayjs";

const showDetails = ref(false); // 控制所有详情板块显示
const activeTab = ref("news"); // 当前激活的标签页
const newsData = ref<any[]>([]); // 新闻数据
const selectedNewsIndex = ref<number | null>(null);
const policyData = ref<any[]>([]); // 政策数据
const chartRef = ref<HTMLDivElement | null>(null);
const selectedDate = ref<string>("2024-01-01");
const selectedCountry = ref<string>("");
const showExchangeRate = ref<boolean>(false);
const myChart = ref<echarts.ECharts | null>(null); // 保存 ECharts 实例

const selectNews = (index: number) => {
  if (selectedNewsIndex.value === index) {
    // 如果点击的是已选中的新闻，则关闭
    selectedNewsIndex.value = null;
  } else {
    // 否则打开该新闻
    selectedNewsIndex.value = index;
  }
};

const barChart = ref<HTMLDivElement | null>(null); // 用来保存柱状图的 DOM 引用
const showBarChart = ref<boolean>(false); // 控制柱状图是否显示
const formattedDate = computed(() => {
  if (!selectedDate.value) return "";
  const date = new Date(selectedDate.value);
  return date.toLocaleDateString(); // 只显示日期部分
});

// 主要货币数据
const currencyData = [
  {
    name: "EUR",
    rates: [
      0.92265, 0.92665, 0.9333, 0.92325, 0.93335, 0.9246, 0.9052, 0.89535,
      0.92095, 0.94545, 0.96095
    ]
  },
  {
    name: "JPY",
    rates: [
      147.365, 150.655, 151.345, 156.32, 156.985, 160.88, 152.7, 146.18,
      142.815, 153.245, 149.755, 157
    ]
  },
  {
    name: "GBP",
    rates: [
      0.789827, 0.792111, 0.796242, 0.785577, 0.790826, 0.779029, 0.761789,
      0.747245, 0.771694, 0.785238, 0.796908
    ]
  },
  {
    name: "CNY",
    rates: [
      7.198, 7.22235, 7.229, 7.23275, 7.26725, 7.241, 7.0913, 7.01105, 7.11615,
      7.24605, 7.29935
    ]
  }
];
// 地图样式
const chartStyle = ref({ width: "100%", height: "500px" });
const pieChart = ref<HTMLDivElement | null>(null);

// 只允许 2024 年内选择
const disabledDate = date => {
  const minDate = new Date("2024-01-01");
  const maxDate = new Date("2024-12-31");
  return date < minDate || date > maxDate;
};

// 监听 showExchangeRate 的变化
watch(showExchangeRate, () => {
  // 在下一个 DOM 更新周期后调用 resize
  nextTick(() => {
    if (myChart.value) {
      myChart.value.resize(); // 手动调整 ECharts 尺寸
    }
  });
});

// 发送数据到后端
const new_data = ref<any>(null);

const sendToBackend = async (datas: {
  country?: string;
  date?: string;
  countries?: string[];
}) => {
  // 检查 country 和 date 是否存在
  if (!datas.country || !datas.date) {
    console.error("国家或日期未选择，无法发送请求");
    return;
  }

  // 检查日期格式是否正确
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(datas.date)) {
    console.error("日期格式不正确，应为 YYYY-MM-DD");
    return;
  }

  try {
    const response = await axios.post("http://121.36.9.36:8000/submit/", datas);
    new_data.value = response.data.table_data;
    console.log(new_data);
  } catch (error) {
    console.error("Error sending data to backend:", error);
    // 提示用户后端连接失败，但地图应该仍然显示
    // alert("无法连接到后端，地图将加载默认数据。");
  }
};
console.log(new_data);
onMounted(async () => {
  await nextTick(); // 确保 DOM 完成渲染
  if (!chartRef.value) {
    console.error("❌ chartRef 未绑定到 DOM！");
    return;
  }
  myChart.value = echarts.init(chartRef.value);
  if (!myChart.value) {
    console.error("❌ ECharts 初始化失败！");
    return;
  }
  echarts.registerMap("WorldCountry", geo.WorldCountryGeo);
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
        itemStyle: {
          areaColor: "rgb(078,101,155)",
          borderColor: "rgba(253, 207, 158, 0.6)",
          borderWidth: 0.3
        },
        emphasis: {
          label: { show: true, fontSize: "14" },
          itemStyle: {
            areaColor: "rgb(183, 118, 108)",
            borderColor: "rgba(253, 207, 158, 0.8)",
            borderWidth: 0.8
          }
        },
        nameMap: mapping.CountryNameZhMapping
      }
    ]
  };
  myChart.value.setOption(options);
  myChart.value.on("click", (params: any) => {
    if (!params.name) return;
    selectedCountry.value = params.name;

    if (selectedDate.value) {
      fetchAllData();
    }
  });
  console.log(myChart.value.getOption());
  window.addEventListener("resize", () => myChart.value?.resize());

  // 柱状图
  const lineChart = echarts.init(
    document.querySelectorAll(".chart-container")[1] as any
  );

  lineChart.setOption({
    title: { text: "📈 主要货币汇率趋势", top: 0 },
    tooltip: { trigger: "axis" },
    legend: { data: currencyData.map(c => c.name), top: 30 },
    grid: { top: 60, left: "10%", right: "10%", bottom: "10%" },
    xAxis: {
      type: "category",
      data: Array.from(
        { length: currencyData[0].rates.length },
        (_, i) => `Day ${i + 1}`
      )
    },
    yAxis: { type: "value" },
    series: currencyData.map(currency => ({
      name: currency.name,
      type: "line",
      data: currency.rates
    }))
  });
  // 饼图（市场占比）
  if (!pieChart.value) {
    console.error("❌ pieChart 未绑定到 DOM！");
    return;
  }

  // 绑定 ECharts
  const pieChartInstance = echarts.init(pieChart.value);
  pieChartInstance.setOption({
    title: { text: "🍕 主要货币占比" },
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        data: [
          { name: "USD", value: 47.89 },
          { name: "EUR", value: 22.85 },
          { name: "JPY", value: 3.61 },
          { name: "GBP", value: 6.84 },
          { name: "CNY", value: 4.47 },
          { name: "other", value: 14.34 }
        ]
      }
    ]
  });
});

const handleDateSelected = (date: Date) => {
  selectedDate.value = dayjs(date).format("YYYY-MM-DD");

  if (selectedCountry.value) {
    fetchAllData();
  }
};

watch(new_data, () => {
  nextTick(() => {
    if (!barChart.value || !new_data.value) return;
    console.log("new_data.value:", new_data.value); // 调试输出

    // 获取 currencies 和 rates
    const currencies = [
      new_data.value.currency1_name,
      new_data.value.currency2_name,
      new_data.value.currency3_name,
      new_data.value.currency4_name,
      new_data.value.currency5_name,
      new_data.value.currency6_name,
      new_data.value.currency7_name,
      new_data.value.currency8_name
    ];

    const rates = [
      new_data.value.currency_rate1,
      new_data.value.currency_rate2,
      new_data.value.currency_rate3,
      new_data.value.currency_rate4,
      new_data.value.currency_rate5,
      new_data.value.currency_rate6,
      new_data.value.currency_rate7,
      new_data.value.currency_rate8
    ];

    // 过滤空值的货币和汇率，保证它们一一对应
    const validCurrencies = currencies.filter(currency => currency !== null);
    const validRates = rates
      .filter(rate => rate !== null)
      .map(rate => parseFloat(rate));

    console.log("validCurrencies:", validCurrencies);
    console.log("validRates:", validRates);

    // 如果没有有效数据，则不显示柱状图
    if (validCurrencies.length === 0 || validRates.length === 0) {
      showBarChart.value = false; // 不显示柱状图
      return;
    } else {
      showBarChart.value = true; // 显示柱状图
    }

    // 初始化 ECharts 实例
    const barChartInstance = echarts.init(barChart.value);

    // 设置柱状图的配置
    const barChartOptions = {
      title: {
        text: `📊 ${new_data.value.currency} 汇率对比`,
        left: "center"
      },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: validCurrencies, // x 轴数据是有效的货币名称
        axisLabel: { rotate: 45 } // 如果名称太长，旋转标签
      },
      yAxis: { type: "value" },
      series: [
        {
          name: `汇率(${new_data.value.currency_sign})`,
          type: "bar",
          data: validRates, // y 轴数据是有效的汇率值
          itemStyle: { color: "#5470C6" }
        }
      ]
    };

    // 设置图表选项
    barChartInstance.setOption(barChartOptions);
  });
});

const fetchAllData = async () => {
  showDetails.value = true;

  // 获取汇率数据
  await sendToBackend({
    country: selectedCountry.value,
    date: selectedDate.value
  });

  // 获取新闻数据
  try {
    const newsResponse = await axios.get(`http://121.36.9.36:8000/news`, {
      params: {
        country: selectedCountry.value,
        date: selectedDate.value
      }
    });
    newsData.value = newsResponse.data;
  } catch (error) {
    console.error("获取新闻数据失败:", error);
    newsData.value = [];
  }

  // 获取政策数据
  try {
    const policyResponse = await axios.get(`http://121.36.9.36:8000/policy`, {
      params: {
        country: selectedCountry.value,
        date: selectedDate.value
      }
    });
    policyData.value = policyResponse.data;
  } catch (error) {
    console.error("获取政策数据失败:", error);
    policyData.value = [];
  }
};

// 关闭汇率详情
const closeExchangeRate = () => {
  showDetails.value = false;
  selectedDate.value = "";
  selectedCountry.value = "";
  newsData.value = [];
  policyData.value = [];
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.dashboard {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.column1 {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: clamp(5px, 2%, 30px);
}

.column2 {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.center {
  align-items: center;
}

.chart-container {
  flex: 1;
  width: 100%;
  min-height: 300px;
}

.calendar {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  height: 30px;
}

.exchange-rate-container {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.exchange-rate-details {
  width: 100%;
  height: 100%;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.header {
  display: flex;
  justify-content: center;
  /* 标题居中 */
  align-items: center;
  position: relative;
  /* 为按钮定位提供参考 */
  margin-bottom: 16px;
}

.close-button {
  position: absolute;
  /* 绝对定位 */
  right: 0;
  /* 放置在最右侧 */
  width: 28px;
  height: 28px;
  cursor: pointer;
  background: rgb(215, 213, 213);
  padding: 2px;
  border-radius: 8px;
  font-weight: bold;
  color: black;
  font-size: 18px;
  transition: background-color 0.3s ease;
  border: none;
  outline: none;
}

.close-button:hover {
  background-color: rgb(194, 191, 191);
}

#exchangeRatesTable {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

#exchangeRatesTable th,
#exchangeRatesTable td {
  padding: 12px;
  border: 1px solid #ded3d3;
  text-align: center;
}

#exchangeRatesTable th {
  background-color: #f5f5f5;
  font-weight: bold;
}

#exchangeRatesTable tr:hover {
  background-color: #f9f9f9;
}

.info-panel-container {
  display: grid;
  grid-template-columns: 2fr 1fr; /* 与column2和column1的比例一致 */
  gap: 20px;
}

.info-panel {
  grid-column: 1 / span 2; /* 跨两列 */
  width: 100%;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 15px;
}
.info-tabs {
  display: flex;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 15px;
}

.tab-button {
  padding: 8px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
}

.tab-button.active {
  border-bottom: 2px solid #409eff;
  color: #409eff;
  font-weight: bold;
}

.info-content {
  min-height: 200px;
}

.policy-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.news-item {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.news-item:hover {
  background-color: #f9f9f9;
}

.policy-item h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.news-item h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.news-item p,
.policy-item p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.news-detail {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.news-detail p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.news-date {
  font-size: 12px;
  color: #999;
  display: block;
  text-align: right;
}

.no-data {
  text-align: center;
  padding: 50px;
  color: #999;
}
</style>
