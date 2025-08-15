<template>
  <div ref="root" style="overflow-y: auto; height: 100%">
    <slot></slot>
    <div ref="intersectingRef">
      <div v-show="loading">正在加载中</div>
      <div v-if="isFinished">没有更多数据了</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, useTemplateRef, onMounted } from "vue";
import { useIntersectionObserver } from "./useIntersectionObserver";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  isFinished: {
    type: Boolean,
    required: true,
  },
});

const emits = defineEmits(["update:modelValue", "load"]);

const intersectingRef = ref(null);

const loading = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emits("update:modelValue", newValue);
  },
});

const rootRef = useTemplateRef("root");

const { isIntersecting, observe } = useIntersectionObserver(intersectingRef, {
  root: rootRef.value,
  threshold: 0.1,
});
onMounted(() => {
  observe();
});

watch(isIntersecting, () => {
  emitLoad();
});

const emitLoad = () => {
  // 当请求的loading请求结束设置为false的时候，有可能dom元素新增的列表还没加载完
  // 这时候也会导致判断的时候isIntersecting为true,使得再发起一次请求
  // 通过添加定时器 延迟触发
  setTimeout(() => {
    if (isIntersecting.value && !loading.value && !props.isFinished) {
      loading.value = true;
      console.log("要开始了");
      emits("load");
    }
  }, 100);
};

watch(loading, () => {
  emitLoad();
});
</script>
