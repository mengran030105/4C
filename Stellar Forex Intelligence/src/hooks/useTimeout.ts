/**
 * 定时执行 hooks
 */

import { tryOnBeforeUnmount } from "@vueuse/core";
import { ref, watch } from "vue";

export function useTimeout(handle: () => void, wait: number, native?: boolean) {
  // 根据 readyRef 判断 timeout 函数是否执行完
  const { readyRef } = useTimeoutRef();
  if (native) {
    handle();
  } else {
    watch(
      readyRef,
      (maturity) => {
        maturity && handle();
      },
      { immediate: false }
    );
  }

  function useTimeoutRef() {
    const readyRef = ref(false);
    let timer: TimeoutHandle;

    // 终止当前 timeout
    function stop() {
      readyRef.value = false;
      timer && clearTimeout(timer);
    }
    // 开始 timeout
    function start() {
      timer = setTimeout(() => {
        readyRef.value = true;
      }, wait);
    }

    start();

    // 卸载 timeout 副作用
    tryOnBeforeUnmount(() => {
      stop();
    });

    return {
      readyRef,
      stop,
      start,
    };
  }
}

declare type TimeoutHandle = ReturnType<typeof setTimeout>;
