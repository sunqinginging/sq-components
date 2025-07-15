<template>
  <div
    style="
      width: 100%;
      height: 180px;
      border: 1px solid #666;
      display: flex;
      justify-content: center;
      align-items: center;
    "
    v-loading="isloading"
    sq-loading-text="loading"
  >
    内容展示区域
  </div>
</template>
<script setup>
import SqLoading from "@/components/Loading/index.js";
import { ref } from "vue";

const vLoading = SqLoading.directive;

const isloading = ref(true);

setTimeout(() => {
  isloading.value = false;
}, 2000);
</script>
