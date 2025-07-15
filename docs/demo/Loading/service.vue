<template>
  <div
    class="test-loading"
    style="
      width: 100%;
      height: 180px;
      border: 1px solid #666;
      display: flex;
      justify-content: center;
      align-items: center;
    "
  >
    内容展示区域
  </div>
</template>
<script setup>
import SqLoading from "@/components/Loading/index.js";
import { onMounted, ref } from "vue";

let loadingInstance;

onMounted(() => {
  loadingInstance = SqLoading.service({
    target: ".test-loading",
  });
  setTimeout(() => {
    loadingInstance.close();
  }, 3000);
});
</script>
