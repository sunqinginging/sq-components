<template>
  <div class="sq-collapse-item">
    <div
      class="sq-collapse-item__header"
      @click="handleClick"
      :class="{
        'is-disabled': disabled,
      }"
    >
      <slot name="header">{{ title }}</slot>
    </div>
    <Transition name="slide" v-on="transitionEvents">
      <div class="sq-collapse-item__content" v-show="isActive">
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, inject } from "vue";
import { collpaseContextKey } from "./types";

defineOptions({
  name: "sq-collapse-item",
});

const props = defineProps({
  name: {
    type: [String, Number],
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
  },
});

const collpaseContext = inject(collpaseContextKey);

const isActive = computed(() => {
  return collpaseContext.activeNames.value.includes(props.name);
});

const handleClick = () => {
  if (props.disabled) {
    return;
  }
  collpaseContext.handleItemClick(props.name);
};

// 使用Transition组件的JavaScript 钩子
const transitionEvents = {
  // 在元素被插入到 DOM 之前被调用 enter-from
  beforeEnter(el) {
    el.style.height = "0px";
    el.style.overflow = "hidden";
  },
  // 在元素被插入到 DOM 之后的下一帧被调用 用这个来开始进入动画
  enter(el) {
    el.style.height = `${el.scrollHeight}px`;
  },
  afterEnter(el) {
    el.style.height = "";
    el.style.overflow = "";
  },
  beforeLeave(el) {
    el.style.height = `${el.scrollHeight}px`;
    el.style.overflow = "hidden";
  },
  // 开始离开动画
  leave(el) {
    el.style.height = "0px";
  },
  afterLeave(el) {
    el.style.height = "";
    el.style.overflow = "";
  },
};
</script>
