<template>
  <div class="sq-checkbox-group">
    <slot></slot>
  </div>
</template>

<script setup>
import { provide, nextTick, computed, inject } from "vue";
import { checkboxGroupContextKey } from "./types.js";
import { formItemContextKey } from "../Form/types.js";

defineOptions({
  name: "sq-checkbox-group",
});

// 多选框组
// https://cn.vuejs.org/guide/essentials/forms.html#checkbox
// 可以将多个复选框绑定到同一个数组 即当前group组件的modelValue

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

const modelValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    console.log(value, "儿子的checkbox的v-model修改了 触发了set方法");
    changeEvent(value);
  },
});

const emit = defineEmits(["update:modelValue", "change"]);
// 通过provide将group的modelValue和changeEvent传递下去
const changeEvent = async (value) => {
  emit("update:modelValue", value);
  await nextTick();
  runValidate("change");
  emit("change", value);
};

const formItemContext = inject(formItemContextKey, undefined);
const runValidate = (trigger) => {
  if (!formItemContext) {
    return;
  }
  formItemContext.validate(trigger).catch((error) => {
    console.log(error);
  });
};

provide(checkboxGroupContextKey, {
  modelValue,
  changeEvent,
});
</script>
