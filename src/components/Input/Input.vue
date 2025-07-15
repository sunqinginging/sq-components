<template>
  <div
    class="sq-input"
    :class="{
      [`sq-input-${type}`]: type,
      [`sq-input-${size}`]: size,
      'is-disabled': disabled,
      'is-focus': isFocus,
      'is-prepend': $slots.prepend,
      'is-append': $slots.append,
    }"
  >
    <!--input-->
    <template v-if="type == 'text'">
      <div v-if="$slots.prepend" class="sq-input__prepend">
        <slot name="prepend"></slot>
      </div>

      <div class="sq-input__wrapper">
        <span v-if="$slots.prefix" class="sq-input__prefix">
          <slot name="prefix"></slot>
        </span>

        <input
          :type="
            showPassword ? (isPasswordVisible ? 'text' : 'password') : type
          "
          v-model="inputValue"
          :maxlength="maxlength"
          :minlength="minlength"
          :placeholder="placeholder"
          :readonly="readonly"
          @input="handleInput"
          class="sq-input__inner"
          @blur="handleBlur"
          @focus="handleFocus"
          ref="inputRef"
        />

        <span
          v-if="$slots.suffix || showClear || showPasswordIcon"
          class="sq-input__suffix"
        >
          <slot name="suffix"></slot>
          <SqIcon
            icon="fa-solid fa-circle-xmark"
            @click="handleClear"
            v-if="showClear"
          ></SqIcon>
          <!--password icon-->
          <template v-if="showPasswordIcon">
            <SqIcon
              icon="fa-solid fa-eye"
              v-if="isPasswordVisible"
              @click="togglePasswordVisible"
            ></SqIcon>
            <SqIcon
              icon="fa-solid fa-eye-slash"
              v-if="!isPasswordVisible"
              @click="togglePasswordVisible"
            ></SqIcon>
          </template>
        </span>
      </div>

      <div class="sq-input__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, inject, computed } from "vue";
import { formItemContextKey } from "../Form/types";
import SqIcon from "../Icon/Icon.vue";

defineOptions({
  name: "sq-input",
});

const inputRef = ref(null);

// formItem组件内的input select等 通过key值注入inject
const formItemContext = inject(formItemContextKey, undefined);

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  size: {
    type: String,
    default: "default",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  showPassword: {
    type: Boolean,
    default: false,
  },
  maxlength: {
    type: [Number, String],
  },
  minlength: {
    type: [Number, String],
  },
  placeholder: {
    type: String,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const showClear = computed(() => {
  return (
    props.clearable && !props.disabled && !!inputValue.value && isFocus.value
  );
});

const isFocus = ref(false);

const handleBlur = (event) => {
  isFocus.value = false;
  emits("blur", event);
  runValidate("blur");
};

const handleFocus = (event) => {
  isFocus.value = true;
  emits("focus", event);
};

const showPasswordIcon = computed(() => {
  return props.showPassword && !props.disabled && !!inputValue.value;
});

const isPasswordVisible = ref(false);

const togglePasswordVisible = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const emits = defineEmits([
  "update:modelValue",
  "input",
  "blur",
  "focus",
  "change",
  "clear",
]);
const inputValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue;
  }
);

const handleClear = () => {
  inputValue.value = "";
  emits("update:modelValue", "");
  emits("clear");
};

const handleInput = () => {
  emits("update:modelValue", inputValue.value);
  emits("input", inputValue.value);
  runValidate("change");
};

const runValidate = (trigger) => {
  if (!formItemContext) {
    return;
  }
  formItemContext.validate(trigger).catch((error) => {
    console.log(error);
  });
};

defineExpose({
  ref: inputRef,
});
</script>
