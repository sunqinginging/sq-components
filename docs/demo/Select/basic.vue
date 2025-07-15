<template>
  <!-- <SqSelect
    :options="options"
    v-model="value"
    :renderLabel="templateLabel"
  ></SqSelect> -->
  <SqSelect :options="options" v-model="value" filterable></SqSelect>
</template>

<script setup>
import SqSelect from "@/components/Select/Select.vue";
import { ref, h, render } from "vue";

const options = ref([
  {
    label: "苹果",
    value: "apple",
  },
  {
    label: "香蕉",
    value: "banana",
  },
  {
    label: "草莓",
    value: "strawberry",
    disabled: true,
  },
]);

const value = ref("apple");

const templateLabel = (item) => {
  return h(
    "div",
    {
      style: {
        color: "green",
      },
    },
    `${item.label}-自定义模板`
  );
};
</script>
