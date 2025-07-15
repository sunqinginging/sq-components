<template>
  <Transition name="fade" @enter="updateHeight" @after-leave="destoryComponent">
    <div
      class="sq-message"
      v-show="visible"
      ref="messageRef"
      :style="cssStyle"
      @click=""
    >
      <div class="sq-message__title">{{ message }}</div>
      <div>关闭</div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getLastBottomOffset } from "./method";

defineOptions({
  name: "sq-message",
});

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "success",
  },
  duration: {
    type: [String, Number],
    default: 0,
  },
  onDestoryed: {
    type: Function,
  },
  offset: {
    type: [String, Number],
    default: 30,
  },
  id: {
    type: String,
    required: true,
  },
  destory: {
    type: Function,
  },
  zIndex: {
    type: Number,
  },
});

// 多个message的排序的top
// 组件本身的props的offset + 上一个的bottomOffset(上一个偏移量)
const height = ref(0);
const lastOffset = computed(() => getLastBottomOffset(props.id));
const topOffset = computed(() => props.offset + lastOffset.value);
const bottomOffset = computed(() => height.value + topOffset.value);

const cssStyle = computed(() => {
  return {
    top: `${topOffset.value}px`,
    zIndex: props.zIndex,
  };
});

const visible = ref(false);

const startTimer = () => {
  if (props.duration == 0) {
    return;
  }
  setTimeout(() => {
    visible.value = false;
    // props.onDestoryed();
  }, props.duration);
};

const messageRef = ref(null);
// 通过监听visible的值 来控制实例的销毁
// watch(visible, (newValue) => {
//   console.log(newValue);
//   if (!newValue) {
//     props.onDestoryed();
//   }
// });
// @after-leave 动画过渡完成之后 销毁  且元素已从 DOM 中移除时调用
const destoryComponent = () => {
  props.onDestoryed();
};

// 元素被插入dom之后 的下一帧开始调用 从这个来开始进入动画
const updateHeight = () => {
  height.value = messageRef.value.getBoundingClientRect().height;
};

onMounted(async () => {
  visible.value = true;
  startTimer();
  // await nextTick();
  // height.value = messageRef.value.getBoundingClientRect().height;
});

defineExpose({
  bottomOffset,
  visible,
});
</script>
