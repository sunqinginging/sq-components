<template>
  <label class="sq-checkbox">
    <span
      class="sq-checkbox__input"
      :class="{
        'is-checked': isChecked,
        'is-disabled': isDisabled,
        'is-indeterminate': indeterminate,
      }"
    >
      <input
        v-if="isBoolean"
        type="checkbox"
        class="sq-checkbox__original"
        @change="handleChange"
        v-model="model"
        :disabled="disabled"
      />
      <input
        v-else
        type="checkbox"
        class="sq-checkbox__original"
        @change="handleChange"
        v-model="model"
        :value="value"
        :disabled="disabled"
      />
      <span class="sq-checkbox__inner"> </span>
    </span>
    <span class="sq-checkbox__label">
      <slot>
        {{ label }}
      </slot>
    </span>
  </label>
</template>

<script setup>
import { computed, ref, inject } from "vue";
import { checkboxGroupContextKey } from "./types.js";
import { formItemContextKey } from "../Form/types.js";

defineOptions({
  name: "sq-checkbox",
});

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: Boolean,
    // required: true,
  },
  value: {
    type: [String, Number],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  indeterminate: {
    type: Boolean,
    default: false,
  },
});

const isBoolean = computed(() => {
  console.log(typeof model == "boolean");
  return typeof model == "boolean";
});

const isDisabled = computed(() => {
  return props.disabled;
});

const isChecked = computed(() => {
  return isGroup.value ? model.value.includes(props.value) : model.value;
});

const emit = defineEmits(["update:modelValue", "change"]);
// 通过inject注入checkboxgroup提供的modelValue数组类型
const checkboxGroupContext = inject(checkboxGroupContextKey, undefined);
// 通过判断注入的是否为undefined 来判断是否当前属于isGroup的插槽下
const isGroup = computed(() => checkboxGroupContext !== undefined);

// model为组件的value的值
const model = computed({
  get: () => {
    // props.modelValue
    // group内的checkbox是通过vue封装的v-model接受数组 控制多个复选框
    if (isGroup.value) {
      return checkboxGroupContext.modelValue.value;
    } else {
      // 单独的复选框
      return props.modelValue;
    }
  },
  set: (value) => {
    if (isGroup.value) {
      // 调用group的修改状态的值
      checkboxGroupContext && checkboxGroupContext.changeEvent(value);
    } else {
      // 单个复选框 触发自己的v-model
      emit("update:modelValue", value);
      runValidate("change");
    }
  },
});

const handleChange = (e) => {
  // 通过监听原生的checkbox的change事件 获取原生checkbox的checked属性来判断是否选中状态
  emit("change", e.target.checked);
};

// 作为子组件用在formItem的时候 校验
const formItemContext = inject(formItemContextKey, undefined);
const runValidate = (trigger) => {
  if (formItemContext) {
    formItemContext.validate(trigger).catch((error) => {
      console.log(error);
    });
  }
};
</script>
