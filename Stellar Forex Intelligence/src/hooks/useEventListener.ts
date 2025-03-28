/**
 * 事件监听 hooks
 */

import type { Ref } from "vue";
import { ref, watch, unref } from "vue";
import { useThrottleFn, useDebounceFn } from "@vueuse/core";

export type RemoveEventFn = () => void;
export interface UseEventParams {
  // 需要进行事件监听 DOM 对象
  el?: Element | Ref<Element | undefined> | Window | any;
  // 事件名
  name: string;
  // 事件监听函数
  listener: EventListener;
  // 事件监听函数选项
  options?: boolean | AddEventListenerOptions;
  // 是否在组件卸载的时候自动销毁
  autoRemove?: boolean;
  // 是否作防抖处理
  isDebounce?: boolean;
  // 防抖等待时间
  wait?: number;
}
export function useEventListener({
  el = window,
  name,
  listener,
  options,
  autoRemove = true,
  isDebounce = true,
  wait = 80,
}: UseEventParams): { removeEvent: RemoveEventFn } {
  /* eslint-disable-next-line */
  let remove: RemoveEventFn = () => {};
  const isAddRef = ref(false);

  if (el) {
    const element = ref(el as Element) as Ref<Element>;

    const handler = isDebounce
      ? useDebounceFn(listener, wait)
      : useThrottleFn(listener, wait);
    const realHandler = wait ? handler : listener;
    const removeEventListener = (e: Element) => {
      isAddRef.value = true;
      e.removeEventListener(name, realHandler, options);
    };
    const addEventListener = (e: Element) =>
      e.addEventListener(name, realHandler, options);

    // 初始设置监听函数
    // dom 卸载后销毁事件监听函数
    const removeWatch = watch(
      element,
      (v, _ov, cleanUp) => {
        if (v) {
          !unref(isAddRef) && addEventListener(v);
          cleanUp(() => {
            autoRemove && removeEventListener(v);
          });
        }
      },
      { immediate: true }
    );

    remove = () => {
      removeEventListener(element.value);
      removeWatch();
    };
  }
  return { removeEvent: remove };
}
