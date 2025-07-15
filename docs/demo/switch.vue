<template>
  <SqSwitch
    v-model="value1"
    activeText="开着状态"
    inactiveText="关着状态"
  ></SqSwitch>
</template>

<script setup>
import SqSwitch from "../../src/components/Switch/index.vue";
import { ref } from "vue";

const value1 = ref(false);
</script>
