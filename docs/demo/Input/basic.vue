<template>
  <SqInput v-model="testValue" showPassword clearable maxlength="11">
    <template #prepend>#123#</template>
    <template #suffix>@</template>
    <template #append>洗刷刷</template>
    <template #prefix>前面</template>
  </SqInput>
</template>

<script setup>
import SqInput from "@/components/Input/input.vue";
import { ref } from "vue";

const testValue = ref("");
</script>
