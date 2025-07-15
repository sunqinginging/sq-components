<template>
  <div class="sq-tree-item">
    <div
      class="sq-tree-item__modify"
      :style="{
        paddingLeft: `${item.level * 16}px`,
      }"
    >
      <div
        class="sq-tree-item__icon"
        :class="{
          collapse: !expanded,
        }"
        @click="handleClick"
      >
        <ExpandIcon></ExpandIcon>
      </div>

      <div
        class="sq-tree-item__icon sq-tree-item__icon--loading"
        v-if="isLoading"
      >
        <LoadingIcon />
      </div>
      <div v-if="showCheckbox">
        <SqCheckbox
          :model-value="checked"
          :indeterminate="indeterminate"
          @change="handleCheckboxChange"
        ></SqCheckbox>
      </div>
    </div>

    <div class="sq-tree-item__content" @click="handleClick">
      <span v-if="!slots.default"> {{ item.label }}</span>
      <TreeItemContent :node="item" :slots="slots" v-else></TreeItemContent>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from "vue";
import ExpandIcon from "./icons/ExpandIcon.vue";
import LoadingIcon from "./icons/LoadingIcon.vue";
import { treeContextKey } from "./types";
import TreeItemContent from "./treeItemContent";
import SqCheckbox from "../Checkbox/Checkbox.vue";

defineOptions({
  name: "sq-tree-item",
});

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  expanded: {
    type: Boolean,
    required: true,
  },
  loadingKeys: {
    type: Set,
  },
  showCheckbox: {
    type: Boolean,
    default: false,
  },
  checked: {
    type: Boolean,
    required: true,
  },
  indeterminate: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggle", "toggleCheck"]);

const handleClick = () => {
  emit("toggle", props.item);
};

const isLoading = computed(() => {
  return props.loadingKeys.has(props.item.key);
  // return true;
});

const handleCheckboxChange = (value) => {
  emit("toggleCheck", props.item, value);
};

// slots是一个插槽对象 每个插槽是个方法 返回的是一个包含虚拟dom的数组
// 不能直接在.vue的文件的template模板中直接编译 需要h渲染函数或者直接jsx
const treeContext = inject(treeContextKey);
const slots = treeContext.slots;
</script>
