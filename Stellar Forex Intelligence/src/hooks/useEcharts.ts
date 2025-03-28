/**
 * echarts hooks，用于快速构建 echarts ui
 */

import { useDebounceFn, tryOnBeforeUnmount } from "@vueuse/core";
import { unref, nextTick, ref, type Ref } from "vue";
import { EChartsOption } from "echarts";
import echarts from "../utils/lib/echarts";
import { useEventListener } from "./useEventListener";
import { useTimeout } from "./useTimeout";

export function useEcharts(elRef: Ref<HTMLDivElement>) {
  let chartInstance: echarts.ECharts | null = null;
  let resizeFn: Fn = resize;
  const cacheOptions = ref({}) as Ref<EChartsOption>;
  let removeResizeFn: Fn = () => {};

  // resize 防抖处理
  resizeFn = useDebounceFn(resize, 200);

  // 获取 options
  function getOptions() {
    return {
      ...cacheOptions.value,
    } as EChartsOption;
  }

  // 初始化 echarts 渲染对象
  function initCharts() {
    const el = unref(elRef);
    if (!el || !unref(el)) {
      return;
    }
    chartInstance = echarts.init(el);
    const { removeEvent } = useEventListener({
      el: window,
      name: "resize",
      listener: resizeFn,
    });
    removeResizeFn = removeEvent;
  }

  // 设置 echarts 图表渲染选项
  function setOptions(options: EChartsOption, clear = false) {
    cacheOptions.value = options;
    nextTick(() => {
      useTimeout(() => {
        if (!chartInstance) {
          initCharts();
          if (!chartInstance) return;
        }
        clear && chartInstance?.clear();
        chartInstance?.setOption({ ...getOptions() });
      }, 30);
    });
  }

  // echarts 缩放适应屏幕宽高
  function resize() {
    chartInstance?.resize({
      animation: {
        duration: 300,
        easing: "quadraticIn",
      },
    });
  }

  // 销毁 size 监听器副作用
  tryOnBeforeUnmount(() => {
    removeResizeFn();
  });

  function getInstance(): echarts.ECharts | null {
    if (!chartInstance) {
      initCharts();
    }
    return chartInstance;
  }

  return {
    getInstance,
    setOptions,
    echarts,
  };
}

interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}
