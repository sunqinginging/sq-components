<template>
  <div class="sq-tooltip" v-on="outerEvents" ref="parentRef">
    <div class="sq-tooltip__trigger" ref="triggerRef" v-on="events">
      <slot></slot>
    </div>
    <div
      class="sq-tooltip__content"
      ref="tooltipRef"
      id="tooltip"
      :style="tooltipStyle"
      v-if="isOpen"
    >
      <slot name="content">{{ content }}</slot>
      <!--arrow tooltip的箭头-->
      <div
        id="arrow"
        ref="arrowRef"
        :style="arrowStyle"
        class="sq-tooltip__arrow"
      ></div>
    </div>
  </div>

  <!-- <div style="position: relative">
    <button id="button" aria-describedby="tooltip" ref="triggerRef">按钮</button>
    <div id="tooltip" role="tooltip" ref="tooltipRef" :style="tooltipStyle">
      My tooltip very good
      <div id="arrow" ref="arrowRef" :style="arrowStyle"></div>
    </div>
  </div> -->
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import {
  computePosition,
  flip,
  shift,
  offset,
  arrow,
  size,
} from "@floating-ui/dom";
import useClickOutside from "./useClickOutside.js";
import { debounce } from "../../utils/common";

const props = defineProps({
  content: {
    type: String,
    default: "",
  },
  placement: {
    type: String,
    default: "bottom",
  },
  trigger: {
    type: String,
    default: "click",
  },
  manual: {
    type: Boolean,
    default: false,
  },
  openDelay: {
    type: Number,
    default: 0,
  },
  closeDelay: {
    type: Number,
    default: 0,
  },
});

const emits = defineEmits(["visible-change", "click-outside"]);

const isOpen = ref(false);

const triggerOpen = () => {
  // isOpen.value = !isOpen.value;
  // emit("visible-change", isOpen.value);
  if (isOpen.value) {
    closeFinal();
  } else {
    openFinal();
  }
};

const open = () => {
  isOpen.value = true;
  emits("visible-change", true);
};

const close = () => {
  isOpen.value = false;
  emits("visible-change", false);
};

const openDebounce = debounce(open, props.openDelay);
const closeDebounce = debounce(close, props.closeDelay);
// 延迟触发 要保证这次open之前触发的close的定时器延迟也取消了 这次close之前的open的定时器延迟的open也取消了
const openFinal = () => {
  closeDebounce.cancel();
  openDebounce();
};

const closeFinal = () => {
  openDebounce.cancel();
  closeDebounce();
};

let events = reactive({});
let outerEvents = reactive({});

const attachEvents = () => {
  if (props.trigger == "hover") {
    events["mouseenter"] = openFinal();
    outerEvents["mouseleave"] = closeFinal();
  } else if (props.trigger == "click") {
    events["click"] = triggerOpen;
  }
};
if (!props.manual) {
  attachEvents();
}

watch(
  () => props.trigger,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      events = {};
      outerEvents = {};
      attachEvents();
    }
  }
);

watch(
  () => props.manual,
  (newValue) => {
    if (newValue) {
      events = {};
      outerEvents = {};
    } else {
      attachEvents();
    }
  }
);

watch(
  isOpen,
  (newValue) => {
    if (newValue) {
      resetFloatPosition();
    }
  },
  {
    flush: "post",
  }
);

// https://floating-ui.com/docs/tutorial#placements
const triggerRef = ref(null);
const tooltipRef = ref(null);
const arrowRef = ref(null);
const parentRef = ref(null);
// 给文档除容器以外的元素绑定点击事件
useClickOutside(parentRef, () => {
  if (isOpen.value && props.trigger == "click" && !props.manual) {
    close();
  }
  // emit事件 向父组件告知容器外元素的点击事件
  emits("click-outside");
});

const tooltipStyle = reactive({
  left: "0px",
  top: "0px",
});

const arrowStyle = ref({
  left: "0px",
  top: "0px",
});
const borderInsertColor = ref("#fff");

onMounted(() => {
  const element = document.querySelector(".sq-tooltip");
  borderInsertColor.value = getComputedStyle(element).getPropertyValue(
    "--sq-tooltip-border-color"
  );
});

// 设置float的position
const resetFloatPosition = () => {
  computePosition(triggerRef.value, tooltipRef.value, {
    placement: props.placement,
    middleware: [
      offset(6),
      flip(),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            minWidth: `${rects.reference.width}px`,
          });
        },
      }),
      shift({
        padding: 5,
      }),
      arrow({
        element: arrowRef.value,
      }),
    ],
  }).then(({ x, y, placement, middlewareData }) => {
    tooltipStyle.left = `${x}px`;
    tooltipStyle.top = `${y}px`;
    const { x: arrowX, y: arrowY } = middlewareData.arrow;

    const staticSide = {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right",
    }[placement.split("-")[0]];

    let styleObj = {
      left: arrowX != null ? `${arrowX}px` : "",
      top: arrowY != null ? `${arrowY}px` : "",
      right: "",
      bottom: "",
      [staticSide]: "-5px",
    };
    if (staticSide == "left") {
      styleObj["border-left"] = `1px solid ${borderInsertColor.value}`;
      styleObj["border-bottom"] = `1px solid ${borderInsertColor.value}`;
    } else if (staticSide == "right") {
      styleObj["border-right"] = `1px solid ${borderInsertColor.value}`;
      styleObj["border-top"] = `1px solid ${borderInsertColor.value}`;
    } else if (staticSide == "top") {
      styleObj["border-left"] = `1px solid ${borderInsertColor.value}`;
      styleObj["border-top"] = `1px solid ${borderInsertColor.value}`;
    } else if (staticSide == "bottom") {
      styleObj["border-right"] = `1px solid ${borderInsertColor.value}`;
      styleObj["border-bottom"] = `1px solid ${borderInsertColor.value}`;
    }
    arrowStyle.value = styleObj;
    // console.log(placement.split("-")[0], staticSide);
  });
};

defineExpose({
  show: openFinal,
  hide: closeFinal,
});
</script>
