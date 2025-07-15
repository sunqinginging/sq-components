<template>
  <div class="sq-collapse">
    <slot />
  </div>
</template>

<script setup>
import { ref, watch, provide } from "vue";
import { collpaseContextKey } from "./types";

defineOptions({
  name: "sq-collapse",
});

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  accordion: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update:modelValue", "change"]);

const activeNames = ref(props.modelValue);
// 监听v-model的modelValue的值 当调用组件的父级修改modelValue的时候
// 此组件保存的activeNames也要同时更新
watch(
  () => props.modelValue,
  () => {
    activeNames.value = props.modelValue;
  }
);
// 响应式数据的变更最好也保持在提供方
const handleItemClick = (itemName) => {
  if (props.accordion) {
    // 手风琴
    let idx = activeNames.value.indexOf(itemName);
    if (idx !== -1) {
      activeNames.value = [];
    } else {
      activeNames.value = [itemName];
    }
  } else {
    let idx = activeNames.value.indexOf(itemName);
    if (idx !== -1) {
      activeNames.value.splice(idx, 1);
    } else {
      activeNames.value.push(itemName);
    }
  }
  emits("update:modelValue", [...activeNames.value]);
  emits("change", [...activeNames.value]);
};

// 通过provide将父组件的数据传递给插槽内的子组件
provide(collpaseContextKey, {
  handleItemClick,
  activeNames,
});
</script>
