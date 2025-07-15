<template>
  <Tooltip
    :manual="false"
    :open-delay="300"
    :close-delay="300"
    ref="tooltipRef"
    trigger="click"
    placement="bottom"
  >
    <div>触发的点</div>
    <template #content> 2323 </template>
  </Tooltip>

  <div @click="handleShow">手动延迟打开</div>
  <div @click="handleHide">手动延迟关闭</div>
</template>
<script setup>
import Tooltip from "../../src/components/Tooltip/Tooltip.vue";
import { ref } from "vue";

const tooltipRef = ref(null);
const handleShow = () => {
  tooltipRef.value.show();
};

const handleHide = () => {
  tooltipRef.value.hide();
};
</script>
