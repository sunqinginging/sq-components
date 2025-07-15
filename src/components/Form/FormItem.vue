<template>
  <div
    class="sq-form-item"
    :class="{
      'is-error': isError,
    }"
  >
    <div class="sq-form-item__label-wrap">
      <label class="sq-form-item__label">{{ label }}</label>
    </div>

    <div class="sq-form-item__content">
      <slot></slot>
      <div class="sq-form-item__error" v-if="isError">
        {{ validateData.errorMsg }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  onMounted,
  onBeforeUnmount,
  ref,
  inject,
  computed,
  reactive,
  provide,
} from "vue";
import { formContextKey, formItemContextKey } from "./types";
import Schema from "async-validator";

defineOptions({
  name: "sq-form-item",
});

const formContext = inject(formContextKey);

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  prop: {
    type: String,
  },
});

const validateData = reactive({
  status: "init", // 'init' 'success' 'error'
  errorMsg: "",
  loading: false,
});

const itemValue = computed(() => {
  return formContext.model[props.prop];
});

const rule = computed(() => {
  return formContext.rules[props.prop];
});

const isError = () => {
  return validateData.status == "error";
};

const getTriggerRules = (trigger) => {
  const rules = rule.value;
  if (rules.length == 0) {
    return [];
  }
  if (!trigger) {
    return rules;
  }
  return rules.filter((item) => {
    return !item.trigger || item.trigger == trigger;
  });
};

const validate = (trigger) => {
  if (props.prop == null) {
    return Promise.resolve(true);
  }
  // 通过rules内的每一项的trigger的配置 来过滤当前校验的具体的规则
  const triggerRules = getTriggerRules(trigger);

  const descriptor = {
    [props.prop]: triggerRules,
  };
  const validator = new Schema(descriptor);
  validateData.loading = true;
  return validator
    .validate({
      [props.prop]: itemValue.value,
    })
    .then(() => {
      validateData.errorMsg = "";
      validateData.status = "success";
    })
    .catch(({ errors, fields }) => {
      validateData.status = "error";
      if (errors.length > 0) {
        validateData.errorMsg = errors[0].message;
      }
      return Promise.reject({ errors, fields });
    })
    .finally(() => {
      validateData.loading = false;
    });
};

const resetField = () => {
  formContext.model[props.prop] = initialValue;
};

const clearValidate = () => {
  validateData.status = "init";
  validateData.errorMsg = "";
  validateData.loading = false;
  resetField();
};

defineExpose({ validate, resetField, clearValidate });

// formItem 将自己的校验方法通过provide传递给自己的插槽内的子组件
// 组件库封装的form内部的表单组件 通过inject注入
const formItemContext = {
  validate,
  prop: props.prop,
  resetField,
  clearValidate,
};

provide(formItemContextKey, formItemContext);

// 表单项的初始值
let initialValue = "";

// formItem加载的时候 将组件自己的几个关键钩子的对象push进field保存进来
onMounted(() => {
  formContext.addField(formItemContext);
  initialValue = formContext.model[props.prop];
});
// formItem卸载前，将自己push的对象 splice
onBeforeUnmount(() => {
  formContext.removeField(formItemContext);
});
</script>
