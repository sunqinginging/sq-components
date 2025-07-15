<template>
  <div style="width: 100%">
    <VirtualScrollList
      :data="virtualScrollData"
      :dataComponent="DemoItem"
      :estimateSize="30"
    ></VirtualScrollList>
  </div>
</template>

<script setup>
import { ref } from "vue";
import VirtualScrollList from "@/components/VirtualScrollList/VirtualScrollList";
import DemoItem from "@/components/VirtualScrollList/item.vue";

const virtualScrollData = ref([]);
for (let i = 0; i < 100; i++) {
  virtualScrollData.value.push({
    id: i,
    label: `${i}${i}__${i}${i}哈哈啊哈哈啊哈哈哈啊哈哈哈啊哈哈哈啊哈啊哈哈啊哈啊哈哈哈哈啊哈哈哈`,
  });
}

const createData = () => {
  return [
    {
      label: nextLabel(),
      key: 1,
      isLeaf: false,
      children: [],
    },
    {
      label: nextLabel(),
      key: 2,
      isLeaf: false,
      children: [],
    },
  ];
};

const nextLabel = (currentLabel) => {
  if (!currentLabel) {
    return "一一得一";
  }
  if (currentLabel == "一一得一") {
    return "二二得四";
  }
  if (currentLabel == "二二得四") {
    return "三三得九";
  }
  if (currentLabel == "三三得九") {
    return "四四十六";
  }
  return "";
};

const handleLoad = (node) => {
  // 内部需要将展开的节点传递过来
  console.log(node);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          label: nextLabel(node.label),
          key: node.key + nextLabel(node.label),
          isLeaf: false,
        },
      ]);
    }, 3000);
  });
};
</script>
