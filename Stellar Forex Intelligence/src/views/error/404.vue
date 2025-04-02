<template>
  <div style="display: block">
    <div class="custom-message-container" v-if="showMessage">
      <div class="custom-message">
        若页面长时间未响应，请退出系统重新登陆！
        <i class="el-icon-close" @click="closeMessage"></i>
      </div>
    </div>
    <div style="display: flex; width: 100%; align-items: center">
      <div class="selection">
        <div class="up">
          <el-select
            v-model="selectedCountries"
            multiple
            placeholder="请选择国家"
            class="select_country"
          >
            <el-option
              v-for="(countryZh, countryEn) in countryMapping"
              :key="countryEn"
              :label="countryZh"
              :value="countryEn"
              class="select_country"
            />
          </el-select>
          <CollapsibleCalendar
            class="select_calendar"
            @dateRangeSelected="handleDateRangeChange"
          />
        </div>
        <div class="down">
          <el-input
            v-model.number="maxDrawdown"
            type="number"
            placeholder="请输入最大回撤比例"
            class="drawdown-input"
            :step="0.01"
          >
            <template #append>%</template>
          </el-input>
          <el-select
            v-model="selectedPeriod"
            placeholder="选择交易期限"
            class="period-select"
          >
            <el-option label="5年" :value="5" />
            <el-option label="3年" :value="3" />
            <el-option label="1年" :value="1" />
          </el-select>
        </div>
      </div>
      <el-button class="button" @click="updateCountries"> 查询 </el-button>
    </div>
    <div class="chart_container">
      <RiskChart
        class="chart1"
        :chartData="chartData1"
        title="预测汇率波动图"
      />
      <RiskChart
        class="chart2"
        :chartData="chartData2"
        title="真实汇率波动图"
      />
    </div>
    <div class="chart_container">
      <DrawDownChart
        class="chart1"
        :chartData="chartData3"
        title="预测风险信号图"
        :maxDrawdown="maxDrawdown"
      />
      <DrawDownChart
        class="chart2"
        :chartData="chartData4"
        title="真实风险信号图"
        :maxDrawdown="maxDrawdown"
      />
    </div>

    <div class="report_container">
      <div class="report_title">分析报告</div>
      <div v-if="reportContent" class="report_content">
        {{ reportContent }}
      </div>
      <div v-else class="report_empty">暂无报告数据</div>
    </div>

    <div class="portfolio_container" v-if="portfolioData.length > 0">
      <div class="portfolio_title">最优投资组合建议</div>
        <div class="portfolio_notice">
          （基于您选择的第二个国家对应的货币--<b>{{ secondCountryName }}</b>货币的最优投资组合建议）
        </div>
      <div class="portfolio_content">
        <div class="table-wrapper">
          <el-table 
            :data="portfolioData" 
            style="width: 80%; margin: 0 auto;"
          >
            <el-table-column 
              prop="currency" 
              label="货币" 
              width="300"
              align="center"
            />
            <el-table-column 
              prop="weight" 
              label="权重" 
              width="300"
              align="center"
            >
              <template #default="{ row }">
                {{ (row.weight * 100).toFixed(2) }}%
              </template>
            </el-table-column>
            <el-table-column 
              prop="class" 
              label="类别"
              width="320"
              align="center"
            >
              <template #default="{ row }">
                <el-tag :type="getTagType(row.class)">
                  {{ formatClass(row.class) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import RiskChart from "@/components/LineChart/RiskChart.vue";
import countryNameZhMapping from "@/json/mapping/country-name-zh-mapping.json";
import CollapsibleCalendar from "@/components/Calendar/CollapsibleCalendar.vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import DrawDownChart from "@/components/LineChart/DrawDownChart.vue";

// 定义 ChartData 类型
interface ChartData {
  time: string[];
  values: number[];
}

interface PortfolioItem {
  currency: string;
  weight: number;
  class: "safe_haven" | "major" | "emerging"; // 明确三种类型
}

const router = useRouter();

const showMessage = ref(true);

const closeMessage = () => {
  showMessage.value = false;
};
setTimeout(() => {
  closeMessage();
}, 10000);

// 响应式数据
const selectedCountries = ref<string[]>([]);
const dateRange = ref<[Date, Date]>([
  new Date("2024-12-01"),
  new Date("2024-12-07")
]); // 默认日期范围
const chartData1 = ref<ChartData>({ time: [], values: [] });
const chartData2 = ref<ChartData>({ time: [], values: [] });
const chartData3 = ref<ChartData>({ time: [], values: [] }); // 预测的最大回撤比例
const chartData4 = ref<ChartData>({ time: [], values: [] }); // 实际的最大回撤比例

const reportContent = ref<string>("");
const portfolioData = ref<PortfolioItem[]>([]);

// 国家映射
const countryMapping = ref<Record<string, string>>(countryNameZhMapping);

const maxDrawdown = ref<number>();
const selectedPeriod = ref<number>();
const secondCountryName = computed(() => {
  return selectedCountries.value.length >= 2 
    ? countryMapping.value[selectedCountries.value[1]]
    : '';
});

// 初始化逻辑
onMounted(() => {
  ElMessageBox.alert("本页面需生成报告，加载时间较长，请耐心等待", "提示", {
    confirmButtonText: "确定",
    callback: () => {
      // 用户点击确定后的回调
    }
  });
});

// 处理日期范围变化
const handleDateRangeChange = (range: [string, string] | [Date, Date]) => {
  dateRange.value = [
    new Date(range[0]), // 强制转换为 Date
    new Date(range[1])
  ];
  fetchChartData();
};

// 更新国家
const updateCountries = () => {
  console.log("更新国家:", selectedCountries.value);
  fetchChartData();
};

// 统一数据获取方法
const fetchChartData = async () => {
  const startDate = dateRange.value[0].toISOString().split("T")[0];
  const endDate = dateRange.value[1].toISOString().split("T")[0];
  if (selectedCountries.value.length !== 2) {
    ElMessage.warning("请选择两个国家");
    return;
  }
  if (maxDrawdown.value === null || maxDrawdown.value <= 0) {
    ElMessage.warning("请输入有效的最大回撤比例");
    return;
  }
  if (selectedPeriod.value === null) {
    ElMessage.warning("请选择交易期限");
    return;
  }

  // 检查 dateRange 是否有效
  if (!dateRange.value || !dateRange.value[0] || !dateRange.value[1]) {
    ElMessage.warning("请选择有效的日期范围");
    return;
  }

  // 确保 dateRange.value[0] 和 dateRange.value[1] 是 Date 对象
  if (
    !(dateRange.value[0] instanceof Date) ||
    !(dateRange.value[1] instanceof Date)
  ) {
    ElMessage.warning("日期格式无效");
    return;
  }
  console.log("开始请求 API...");
  try {
    console.log("发送请求参数:", {
      countries: selectedCountries.value,
      startDate, // 转换为 YYYY-MM-DD 格式
      endDate,
      maxDrawdown: maxDrawdown.value,
      investmentPeriod: selectedPeriod.value
    });

    const response = await axios.post(
      "http://121.36.9.36:8000/currency_pair/", //"http://121.36.9.36:5959/currency_pair/"
      {
        countries: selectedCountries.value,
        startDate: dateRange.value[0].toISOString().split("T")[0],
        endDate: dateRange.value[1].toISOString().split("T")[0],
        maxDrawdown: maxDrawdown.value,
        investmentPeriod: selectedPeriod.value
      }
    );
    console.log("API 响应:", response.data); // 🚀 确保 API 返回了数据
    // 处理响应数据
    chartData1.value = {
      time: response.data.data.date_time, // x 轴
      values: response.data.data.predict_rate.map(Number) // y 轴（转为 number）
    };

    chartData2.value = {
      time: response.data.data.date_time, // x 轴
      values: response.data.data.true_rate.map(Number) // y 轴（转为 number）
    };

    chartData3.value = {
      time: response.data.data.date_time, // x 轴
      values: response.data.data.maxdd_predict.map(Number) // y 轴（转为 number）
    };

    chartData4.value = {
      time: response.data.data.date_time, // x 轴
      values: response.data.data.maxdd_true.map(Number) // y 轴（转为 number）
    };

    if (response.data.data.ai_result) {
      reportContent.value = response.data.data.ai_result; // 存储报告内容
    } else {
      reportContent.value = "未找到报告内容";
    }

    if (response.data.data.hedge_portfolio) {
      portfolioData.value = response.data.data.hedge_portfolio;
    }
  } catch (error) {
    console.error("请求失败:", error);
    // ElMessage.error("数据加载失败");
  }
};

// 分类标签
const getTagType = (classType: string) => {
  switch (classType) {
    case "safe_haven":
      return "success"; // 绿色 - 避险货币
    case "major":
      return "primary"; // 蓝色 - 主要货币
    case "emerging":
      return "warning"; // 黄色 - 新兴货币
    default:
      return "info";
  }
};

const formatClass = (classType: string) => {
  switch (classType) {
    case "safe_haven":
      return "避险货币";
    case "major":
      return "主要货币";
    case "emerging":
      return "新兴货币";
    default:
      return classType;
  }
};

// 自动响应参数变化
watch([selectedCountries, dateRange], () => {
  if (selectedCountries.value.length === 2 && dateRange.value) {
    fetchChartData();
  }
});
</script>

<style scoped>
.custom-message-container {
  position: fixed;
  top: 40px;
  right: 40px;
  z-index: 9999;
}

.custom-message {
  position: relative;
  min-width: 300px;
  padding: 10px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.custom-message::before {
  content: "";
  position: absolute;
  top: -10px;
  right: 30px;
  border-width: 0 10px 10px;
  border-style: solid;
  border-color: transparent transparent #fff;
  z-index: 1;
}

.custom-message::after {
  content: "";
  position: absolute;
  top: -11px;
  right: 30px;
  border-width: 0 10px 10px;
  border-style: solid;
  border-color: transparent transparent #ebeef5;
  z-index: 0;
}

.el-icon-close {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #c0c4cc;
}

.max {
  width: 100%;
  display: flex;
  align-items: center;
}
.selection {
  width: 100%;
  display: block;
}

.up {
  display: flex;
}

.down {
  display: flex;
}

.select_calendar {
  margin-top: 10px;
  padding: 10px;
  width: 100%;
}
.select_country {
  margin-top: 10px;
  padding: 10px;
  width: 100%;
}

.drawdown-input {
  padding: 10px;
  width: 100%; /* max-width: 200px; */
}

.drawdown-input :deep(.el-input-group__append) {
  padding: 0 12px;
  background-color: var(--el-fill-color-light);
}

.period-select {
  padding: 10px;
  width: 100%;
}
.chart_container {
  margin-top: 50px;
  display: flex;
}
.button {
  margin-left: 20px;
  margin-right: 20px;
  align-items: center;
  width: 10%;
}
.chart1 {
  width: 50%;
}
.chart2 {
  width: 50%;
}
.report_container {
  margin: 20px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}
.report_title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
.report_content {
  white-space: pre-wrap; /* 保留换行符和空格 */
  font-size: 14px;
  line-height: 1.6; /* 增加行高 */
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #eee; /* 添加边框 */
}
.report_empty {
  color: #999;
  font-style: italic;
}
.portfolio_container {
  margin: 20px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}

.portfolio_title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.portfolio_content {
  padding: 10px;
}

.portfolio_container .el-table {
  background-color: #5677a8; /* 浅灰色背景 */
}

.table-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}
.portfolio_notice {
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 4px;
  color: #606266;
  text-align: center;
}

.portfolio_notice b {
  color: #409eff;
  font-weight: bold;
}
</style>
