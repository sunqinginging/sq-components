<template>
  <div
    :style="{
      zIndex: zIndex,
    }"
    class="sq-overlay"
    :class="overlayClass"
    @click="handleMaskClick"
  >
    <slot></slot>
  </div>
</template>

<script setup>
defineOptions({
  name: "sq-overlay",
});

const props = defineProps({
  mask: {
    type: Boolean,
    default: true,
  },
  overlayClass: {
    type: [String],
    default: "",
  },
  zIndex: {
    type: Number,
    default: 2000,
  },
});

const emit = defineEmits(["click"]);

const handleMaskClick = () => {
  emit("click");
};
</script>

<style scoped>
.sq-overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
}
</style>
