<template>
  <Transition name="fade-in" @after-leave="$emit('destory')">
    <Overlay
      style="display: flex; align-items: center; justify-content: center"
      @click="handleMaskClick"
      v-show="visible"
    >
      <div class="sq-message-box">
        <div class="sq-message-box__header">
          <div class="sq-message-box__title">{{ title }}</div>
          <div class="sq-message-box__close">
            <SqIcon icon="fa-solid fa-xmark"></SqIcon>
          </div>
        </div>
        <div class="sq-message-box__content">{{ message }}</div>
        <div class="sq-message-box__footer">
          <SqButton
            type="info"
            @click="handleAction('close')"
            v-if="showCancelButton"
            >{{ cancelButtonText }}</SqButton
          >
          <SqButton @click="handleAction('comfirm')" v-if="showConfirmButton">{{
            confirmButtonText
          }}</SqButton>
        </div>
      </div>
    </Overlay>
  </Transition>
</template>

<script setup>
import Overlay from "../Overlay/Overlay.vue";
import { nextTick, onMounted, reactive, ref, watch } from "vue";
import { useZIndex } from "../../hooks/useZIndex.js";
import SqIcon from "../Icon/Icon.vue";
import SqButton from "../Button/Button.vue";

defineOptions({
  name: "sq-message-box",
  inheritAttrs: false,
});

const props = defineProps({
  closeOnClickModal: {
    type: Boolean,
    default: true,
  },
  beforeClose: {
    type: Function,
  },

  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  confirmButtonText: {
    type: String,
    default: "确定",
  },
  showConfirmButton: {
    type: Boolean,
    default: true,
  },
  cancelButtonText: {
    type: String,
    default: "取消",
  },
  showCancelButton: {
    type: Boolean,
    default: false,
  },
});

const visible = ref(false);

const emit = defineEmits(["destory", "action"]);

const { nextZIndex } = useZIndex();

const state = reactive({
  ...props,
  zIndex: nextZIndex(),
  action: "",
});

watch(visible, (value) => {
  if (value) {
    state.zIndex = nextZIndex();
  }
});

const handleMaskClick = () => {
  props.closeOnClickModal && handleAction("close");
};

const doClose = async () => {
  if (!visible.value) {
    return;
  }
  visible.value = false;
  await nextTick();
  if (state.action) {
    // 触发h创建虚拟dom时传递的onAction属性方法
    emit("action", state.action);
  }
};

// action: cancel confrim close
const handleAction = (action) => {
  state.action = action;
  if (state.beforeClose) {
    state.beforeClose(action, state, doClose);
  } else {
    doClose();
  }
};

onMounted(() => {
  visible.value = true;
});

defineExpose({
  visible,
});
</script>
