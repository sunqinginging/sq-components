<template>
  <button
    class="sq-button"
    :class="{
      [`sq-button--${type}`]: type,
      [`sq-button--${size}`]: size,
      'is-disabled': disabled,
      'is-plain': plain || text,
      'is-text': text,
    }"
  >
    <span>
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
defineOptions({
  name: "sq-button",
});

const props = defineProps({
  type: {
    type: String,
    default: "primary",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  text: {
    type: Boolean,
    default: false,
  },
  plain: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "default",
  },
});
</script>
