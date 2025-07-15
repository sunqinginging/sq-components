<template>
  <form>
    <slot></slot>
  </form>
</template>

<script setup>
import { provide, ref } from "vue";
import { formContextKey } from "./types.js";

defineOptions({
  name: "sq-form"
})

const props = defineProps({
  model: {
    type: Object,
    required: true,
  },
  rules: {
    type: Object,
  },
});

// fields 用来保存form组件下的每个formItem组件的上下文的validate resetField clearValidate
const fields = ref([]);

const addField = (field) => {
  fields.value.push(field);
};

const removeField = (field) => {
  const idx = fields.value.indexOf(field);
  if (idx > -1) {
    fields.value.splice(idx, 1);
  }
};

// 校验form下的所有表单项
const validate = async () => {
  console.log(fields.value);
  let errors = {};
  for (let field of fields.value) {
    try {
      await field.validate("");
    } catch (error) {
      console.log(error);
      errors = {
        ...errors,
        ...error.fields,
      };
    }
  }
  if (errors.length > 0) {
    return Promise.reject(errors);
  } else {
    return true;
  }
  // console.log(errors);
};

const resetFields = (props) => {
  const fieldList = props
    ? props.length > 0
      ? fields.value.filter((i) => props.includes(i.prop))
      : fields.value
    : fields.value;
  fieldList.forEach((field) => {
    field.resetField();
  });
};

defineExpose({
  validate,
  resetFields,
});

// 将接受到的prop的model和rules通过provide提供给插槽内的formItem
provide(formContextKey, {
  model: props.model,
  rules: props.rules,
  fields,
  addField,
  removeField,
});
</script>
