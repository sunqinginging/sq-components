<template>
  <div
    class="sq-switch"
    :class="{
      'is-checked': checked,
    }"
    @click="handleSwitchChange"
  >
    <input
      class="sq-switch__input"
      type="checkbox"
      role="switch"
      ref="iptRef"
      :name="name"
      @keydown.enter="handleSwitchChange"
    />
    <div class="sq-switch__core">
      <div class="sq-switch__inner" v-if="activeText || inactiveText">
        {{ checked ? activeText : inactiveText }}
      </div>
      <div class="sq-switch__action"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";

const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [Boolean, String, Number],
    required: true,
  },
  activeValue: {
    type: [Boolean, String, Number],
    default: true,
  },
  inactiveValue: {
    type: [Boolean, String, Number],
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  activeText: {
    type: String,
    default: "",
  },
  inactiveText: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["update:modelValue", "change"]);

const innerValue = ref(props.modelValue);

const checked = computed(() => {
  return innerValue.value == props.activeValue;
});

const handleSwitchChange = () => {
  if (props.disabled) {
    return;
  }
  const newValue = checked.value ? props.inactiveValue : props.activeValue;
  innerValue.value = newValue;
  emits("change", newValue);
  emits("update:modelValue", newValue);
};

const iptRef = ref(null);

onMounted(() => {
  iptRef.value.checked = checked.value;
});

watch(checked, (newValue) => {
  iptRef.value.checked = newValue;
});

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = newValue;
  }
);
</script>
