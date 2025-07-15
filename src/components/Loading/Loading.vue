<template>
  <Transition name="fade" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      class="sq-loading"
      :style="{
        background: background,
      }"
      :class="{
        'is-fullscreen': fullscreen,
      }"
    >
      <SqIcon spin icon="fa-solid fa-spinner " size="2x"></SqIcon>

      {{ text }}
    </div>
  </Transition>
</template>

<script setup>
import SqIcon from "../Icon/Icon.vue";

defineOptions({
  name: "sq-loading",
  inheritAttrs: false,
});

const props = defineProps({
  background: {
    type: String,
    default: "rgba(0,0,0, 0.6)",
  },
  text: {
    type: String,
    default: "加载中...",
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
  // visible是一个ref对象
  visible: {
    type: Object,
  },
  handleAfterLeave: {
    type: Function,
  },
  zIndex: {
    type: [String, Number],
    default: 100,
  },
});
</script>

<style>
@import url("./style.css");
</style>
