<template>
  <div
    class="sq-waterfall"
    ref="containerTargetRef"
    :style="{
      height: containerHeight + 'px',
    }"
  >
    <template v-if="data.length > 0 && columnWidth">
      <div
        class="sq-waterfall-item"
        v-for="(item, index) in data"
        :key="item[nodeKey]"
        :style="{
          width: columnWidth + 'px',
          left: `${item._style ? item._style.left : 0}px`,
          top: `${item._style ? item._style.top : 0}px`,
        }"
      >
        <slot name="default" :item="item" :index="index"></slot>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, nextTick, watch } from "vue";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  nodeKey: {
    type: String,
    default: "id",
  },
  column: {
    type: Number,
    default: 2,
  },
  columnSpacing: {
    type: Number,
    default: 20,
  },
  rowSpacing: {
    type: Number,
    default: 20,
  },
});
// 容器总高度=最高的那一列的高度
const containerHeight = ref(0);
const columnHeightObj = ref({});
const containerTargetRef = ref(null);
const containerWidth = ref(0);

const initColumnHeightObj = () => {
  columnHeightObj.value = {};
  for (let i = 0; i < props.column; i++) {
    columnHeightObj.value[i] = 0;
  }
};

const columnWidth = ref(0);

onMounted(() => {
  initColumnHeightObj();
  calculateColumnWidth();
});

const containerLeft = ref(0);
// 获取容器的宽度
const getContainerWidth = () => {
  // console.log(getComputedStyle(containerTargetRef.value, null).width);
  const { paddingLeft, paddingRight } = getComputedStyle(
    containerTargetRef.value,
    null
  );
  containerLeft.value = parseFloat(paddingLeft);
  containerWidth.value =
    containerTargetRef.value.offsetWidth -
    parseFloat(paddingRight) -
    parseFloat(paddingLeft);
};

const columnSpacingTotal = computed(() => {
  return (props.column - 1) * props.columnSpacing;
});

// 计算每一列的宽度
const calculateColumnWidth = () => {
  getContainerWidth();
  columnWidth.value =
    (containerWidth.value - columnSpacingTotal.value) / props.column;
};

const itemHeights = ref([]);

// 等待所有图片完成之后 获取瀑布流的每一项的高度
const waitImgLoaded = () => {
  itemHeights.value = [];
  // 获取每一项的容器元素
  const itemElements = [
    ...document.getElementsByClassName("sq-waterfall-item"),
  ];
  // 获取每一项下面的img标签元素 获取img的图片地址
  const imgElements = [];
  itemElements.forEach((el) => {
    imgElements.push(...el.getElementsByTagName("img"));
  });
  const imgUrlList = imgElements.map((item) => item.src);

  const promiseList = [];
  imgUrlList.forEach((img, index) => {
    promiseList[index] = new Promise((resolve, reject) => {
      const imgObj = new Image();
      imgObj.src = img;
      imgObj.onload = () => {
        resolve({
          img,
          index,
        });
      };
    });
  });

  Promise.all(promiseList).then((data) => {
    // 所有图片加载完成
    itemElements.forEach((el) => {
      itemHeights.value.push(el.offsetHeight);
    });
    calculateItemLocation();
  });
};

watch(
  () => props.data,
  (newValue) => {
    nextTick(() => {
      waitImgLoaded();
    });
  },
  {
    deep: true,
    immediate: true,
  }
);

// 计算渲染位置
const calculateItemLocation = () => {
  // 将每一项的定位信息保存在_style属性的top和left中
  props.data.forEach((item, index) => {
    if (item._style) {
      // 避免重复计算
      return;
    }
    item._style = {};
    item._style.left = getItemLeft();
    item._style.top = getItemTop();
    increaseMinHeight(index);
  });
  updateContainerHeight();
};

// 获取高度最小一列下的left
const getItemLeft = () => {
  const column = getMinHeightColumn();
  return (
    column * (columnWidth.value + props.columnSpacing) + containerLeft.value
  );
};

const getItemTop = () => {
  return getMinHeight();
};

const increaseMinHeight = (index) => {
  const minColumn = getMinHeightColumn();
  columnHeightObj.value[minColumn] +=
    itemHeights.value[index] + props.rowSpacing;
};

const updateContainerHeight = () => {
  containerHeight.value = getMaxHeight();
};

// 获取高度最大列的值
const getMaxHeight = () => {
  const heightList = Object.values(columnHeightObj.value);
  return Math.max(...heightList);
};

// 获取高度最小列的值
const getMinHeight = () => {
  const heightList = Object.values(columnHeightObj.value);
  return Math.min(...heightList);
};

// 获取高度最小列的索引
const getMinHeightColumn = () => {
  const minHeight = getMinHeight();
  return Object.values(columnHeightObj.value).findIndex((item) => {
    return item == minHeight;
  });
};
</script>
