<template>
  <Collapse v-model="collapseValue">
    <collapseItem title="哈哈第一个" name="1">
      <div style="background-color: aliceblue; height: 200px">
        展开的内容 我在打一个
      </div>
    </collapseItem>
    <collapseItem name="2">
      <template #header>哈哈这是第二个呀</template>
      <div style="background-color: red; height: 300px">我在第二行展开呢</div>
    </collapseItem>
  </Collapse>
</template>

<script setup>
import { ref } from "vue";
import Collapse from "@/components/Collapse/Collapse.vue";
import CollapseItem from "@/components/Collapse/collapseItem.vue";

const collapseValue = ref([]);
</script>
