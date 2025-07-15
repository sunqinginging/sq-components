<template>
  <span
    class="sq-icon"
    :class="{
      [`sq-icon-${type}`]: type,
    }"
    :style="customStyles"
  >
    <font-awesome-icon v-bind="{ ...iconProps, ...$attrs }" />
  </span>
</template>

<script setup>
import { computed, useAttrs } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// https://docs.fontawesome.com/web/use-with/vue/add-icons#importing-from-svg-icon-packages
// vitepress使用icon组件的时候 也需要在/theme/index下扩展组件的时候引入svg图标包
defineOptions({
  name: "sq-icon",
  inheritAttrs: false,
});

// https://docs.fontawesome.com/web/use-with/vue/style#rotate-and-flip-icons
const props = defineProps({
  size: {
    type: String,
    // Font Awesome supports t-shirt size scale from 2xs to 2xl as well as literal sizing from 1x to 10x
  },
  rotation: {
    type: String, // 旋转
  },
  flip: {
    type: String,
    // 水平horizontal 或 垂直vertical
  },
  icon: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    // 设置primary、info、success、warning、danger 来设置color的css变量值
  },
  color: {
    type: String,
    // 直接通过style设置color的值
  },
  // 是否旋转 通过使用awesome的spin属性
  spin: {
    type: Boolean,
    default: false,
  },
});

// 给FontAwesomeIcon绑定的props传递过来的属性字段
const iconProps = computed(() => {
  return omit(props, ["type", "color"]);
});

const omit = (obj, keys) => {
  // 删除obj里的props里声明的属性
  return Object.keys(obj).reduce((res, key) => {
    if (!keys.includes(key)) {
      if (obj[key]) {
        res[key] = obj[key];
      }
    }
    return res;
  }, {});
};

const customStyles = computed(() => {
  return props.color ? { color: props.color } : {};
});
</script>
