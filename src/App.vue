<script setup>
import { ref, onMounted, computed } from "vue";
import Collapse from "./components/Collapse/Collapse.vue";
import collapseItem from "./components/Collapse/collapseItem.vue";
import Message from "./components/Message/Message.vue";
import { createMessage } from "./components/Message/method";
import VirtualScrollList from "./components/VirtualScrollList/VirtualScrollList";
import DemoItem from "./components/VirtualScrollList/item.vue";
import Tree from "./components/Tree/Tree.vue";
import Input from "./components/Input/Input.vue";

import { debounce } from "./utils/common";

import { SqLoading } from "./components/Loading/index";

import {
  useFloating,
  offset,
  flip,
  shift,
  arrow,
  autoUpdate,
} from "@floating-ui/vue";

const reference = ref(null);
const floating = ref(null);
const floatingArrow = ref(null);
const { floatingStyles, middlewareData } = useFloating(reference, floating, {
  placement: "bottom-end",
  middleware: [offset(8), flip(), shift()],
  // whileElementsMounted: autoUpdate,
  // whileElementsMounted(referenceEl, floatingEl, update) {
  //   const cleanup = autoUpdate(referenceEl, floatingEl, update, {
  //     ancestorScroll: false,
  //   });
  //   return cleanup;
  // },
});

const arrowStyle = computed(() => {
  console.log(middlewareData.value);
  return {};
});

const collapseValue = ref([]);

onMounted(() => {
  // const messageInstance = createMessage({
  //   message: "哈哈 111",
  // });
  // createMessage({
  //   message: "哈哈 222",
  //   duration: 1000,
  // });

  setTimeout(() => {
    // messageInstance.destory();
    // 通过调用loading组件内的loading的方法 通过导出的loading对象的close关闭
    const loadingInstance = SqLoading.service({
      text: "哈哈哈",
      lock: true,
    });

    // setTimeout(() => {
    //   loadingInstance.close();
    // }, 3000);
  }, 1000);
});

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

const treeData = ref(createData());

// const treeData = ref([
//   {
//     id: "1",
//     label: "一一一",
//     children: [
//       {
//         id: "2",
//         label: "一一一1",
//         children: [],
//       },
//       {
//         id: "3",
//         label: "一一一2",
//         children: [],
//       },
//     ],
//   },
//   {
//     id: "4",
//     label: "二二二",
//     children: [
//       {
//         id: "5",
//         label: "二二二1",
//       },
//     ],
//   },
// ]);

const iptValue = ref("测试ipt");

const iptHasChange = (value) => {
  console.log("input触发了", value);
};

const handleIpt = debounce(iptHasChange, 3000);
</script>

<template>
  <!-- <div style="margin-top: 100px"></div> -->
  <Input v-model="iptValue" @input="handleIpt" />
  <Tree
    :data="treeData"
    keyField="key"
    labelField="label"
    childrenField="children"
    :defaultExpandedKeys="['1']"
    :load="handleLoad"
    :lazy="true"
  >
    <template #default="{ node, data }">
      <div style="display: flex; align-items: center">
        <span>{{ node.label }}</span>
        <div style="display: inline-flex; align-items: center">
          <div style="cursor: pointer; margin-right: 10px">删除</div>
          <div style="cursor: pointer; margin-right: 10px">新增</div>
        </div>
      </div>
    </template>
  </Tree>

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
  <VirtualScrollList
    :data="virtualScrollData"
    :dataComponent="DemoItem"
    :estimateSize="30"
    style="width: 200px"
  ></VirtualScrollList>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
