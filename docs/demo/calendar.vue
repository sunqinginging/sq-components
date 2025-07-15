<template>
  <SqCalendar v-model="value"></SqCalendar>
</template>

<script setup>
import SqCalendar from "../../src/components/Calendar/Calendar.vue";
import { ref } from "vue";

const value = ref(new Date());
</script>
