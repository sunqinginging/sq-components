<template>
  <Tree
    :data="treeData"
    keyField="id"
    labelField="label"
    childrenField="children"
    :defaultExpandedKeys="[]"
    :load="handleLoad"
    :lazy="false"
    :show-checkbox="true"
    :default-checked-keys="['2', '5']"
  >
    <template #default="{ node, data }">
      <div style="display: flex; align-items: center">
        <span>{{ node.label }}</span>
        <div style="display: inline-flex; align-items: center">
          <SqButton text type="primary">新增</SqButton>
          <SqButton text type="danger">删除</SqButton>
        </div>
      </div>
    </template>
  </Tree>
</template>

<script setup>
import { ref } from "vue";
import Tree from "@/components/Tree/Tree.vue";
import SqButton from "@/components/Button/Button.vue";

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

// const treeData = ref(createData());
const treeData = ref([
  {
    id: "1",
    label: "一一一",
    children: [
      {
        id: "2",
        label: "一一一1",
        children: [],
      },
      {
        id: "3",
        label: "一一一3",
        children: [],
      },
      {
        id: "4",
        label: "一一一4",
        children: [
          {
            id: "5",
            label: "——————5",
            children: [],
          },
          {
            id: "6",
            label: "——————6",
            children: [],
          },
        ],
      },
    ],
  },
]);
</script>
