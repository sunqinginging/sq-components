<template>
  <div
    class="sq-select"
    @click="toggleDropdown"
    @mouseenter="states.mouseOver = true"
    @mouseleave="states.mouseOver = false"
  >
    <SqTooltip
      placement="bottom"
      :manual="true"
      ref="tooltipRef"
      @click-outside="controlDropdown(false)"
    >
      <SqInput
        ref="inputRef"
        v-model="states.inputValue"
        :placeholder="filterPlaceholder"
        :disabled="disabled"
        :readonly="!filterable || !isDropdownShow"
        @input="debounceOnFilter"
        @keydown="handleKeydown"
      >
        <template #suffix>
          <SqIcon
            icon="fa-solid fa-circle-xmark"
            v-if="showClearIcon"
            class="sq-select__clear"
            @mousedown.prevent="() => {}"
            @click.stop="handleClear"
          ></SqIcon>
          <SqIcon
            icon="fa-solid fa-chevron-down"
            class="sq-select__arrow"
            :class="{
              'is-active': isDropdownShow,
            }"
          ></SqIcon>
        </template>
      </SqInput>
      <template #content>
        <div class="sq-select__loading" v-if="states.loading">
          <SqIcon icon="fa-solid fa-spinner" spin color="#a8abb2"></SqIcon>
          <span>loading</span>
        </div>
        <div class="sq-select__nodata" v-else-if="filterOptions.length == 0">
          no data
        </div>
        <ul class="sq-select__menu" v-else>
          <template v-for="(item, index) in filterOptions" :key="index">
            <li
              class="sq-select__menu-item"
              :class="{
                'is-disabled': item.disabled,
                'is-selected':
                  states.selectOption &&
                  states.selectOption.value == item.value,
                'is-highlight': states.highlightIndex == index,
              }"
              :id="`select-item-${item.value}`"
              @click.stop="handleSelectItemChange(item)"
            >
              <!-- {{ item.label }} -->
              <RenderVnode
                :vNode="renderLabel ? renderLabel(item) : item.label"
              ></RenderVnode>
            </li>
          </template>
        </ul>
      </template>
    </SqTooltip>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import SqInput from "../Input/Input.vue";
import SqTooltip from "../Tooltip/Tooltip.vue";
import SqIcon from "../Icon/Icon.vue";
import RenderVnode from "../common/RenderVnode";
import { debounce } from "../../utils/common";

defineOptions({
  name: "SqSelect",
});

const emits = defineEmits([
  "change",
  "update:modelValue",
  "visible-change",
  "clear",
]);

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  placeholder: {
    type: String,
    default: "Select",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array,
    default: () => [],
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  // option选项 自定义模板
  renderLabel: {
    type: Function,
  },
  filterable: {
    type: Boolean,
    default: false,
  },
  filterMethod: {
    type: Function,
  },
  // 远程搜索
  remote: {
    type: Boolean,
    default: false,
  },
  remoteMethod: {
    type: Function,
  },
});

// 监听键盘事件
const handleKeydown = (e) => {
  switch (e.key) {
    case "Enter":
      if (!isDropdownShow.value) {
        controlDropdown(true);
      } else {
        if (
          states.highlightIndex > -1 &&
          filterOptions.value[states.highlightIndex]
        ) {
          handleSelectItemChange(filterOptions.value[states.highlightIndex]);
        } else {
          controlDropdown(false);
        }
      }
      break;
    case "Escape":
      if (isDropdownShow.value) {
        controlDropdown(false);
      }
      break;
    case "ArrowUp":
      e.preventDefault();
      if (filterOptions.value.length > 0) {
        if (states.highlightIndex == -1 || states.highlightIndex == 0) {
          // 初始化的时候 或者当前高亮index为0的时候 键盘向上按键 则移动为最后一个
          states.highlightIndex = filterOptions.value.length - 1;
        } else {
          states.highlightIndex--;
        }
      }

      break;
    case "ArrowDown":
      e.preventDefault();
      if (filterOptions.value.length > 0) {
        if (
          states.highlightIndex == filterOptions.value.length - 1 ||
          states.highlightIndex == -1
        ) {
          states.highlightIndex = 0;
        } else {
          states.highlightIndex++;
        }
      }
      break;
    default:
      break;
  }
};

const filterOptions = ref(props.options);
watch(props.options, (newOptions) => {
  filterOptions.value = newOptions;
});

const generateFilterOptions = async (searchValue) => {
  if (!props.filterable) {
    return;
  }
  if (props.filterMethod && typeof props.filterMethod == "function") {
    filterOptions.value = props.filterMethod(searchValue);
  } else if (props.remote && typeof props.remoteMethod == "function") {
    states.loading = true;
    try {
      filterOptions.value = await props.remoteMethod(searchValue);
    } catch (error) {
      console.log(error);
      filterOptions.value = [];
    } finally {
      states.loading = false;
    }
  } else {
    filterOptions.value = props.options.filter((option) =>
      option.label.includes(searchValue)
    );
  }

  states.highlightIndex = -1;
};

// 对input时间进行防抖处理
const timeout = computed(() => {
  return props.remote ? 300 : 0;
});

const onFilter = () => {
  generateFilterOptions(states.inputValue);
};

const debounceOnFilter = debounce(() => {
  onFilter();
}, timeout.value);

const filterPlaceholder = computed(() => {
  return props.filterable && states.selectOption && isDropdownShow.value
    ? states.selectOption.label
    : props.placeholder;
});

const findOption = (value) => {
  const option = props.options.find((item) => item.value == value);
  return option ? option : null;
};
const initialOption = findOption(props.modelValue);
const innerValue = ref(initialOption ? initialOption.label : "");

watch(
  () => props.modelValue,
  () => {
    let newOption = findOption(props.modelValue);
    states.inputValue = newOption ? newOption.label : "";
    states.selectOption = newOption || null;
  }
);

const states = reactive({
  inputValue: initialOption ? initialOption.label : "",
  selectOption: initialOption || null,
  // 鼠标hover
  mouseOver: false,
  // 远程搜索 是否在加载中
  loading: false,
  highlightIndex: -1,
});
const inputRef = ref(null);

const tooltipRef = ref("");
const isDropdownShow = ref(false);

const showClearIcon = computed(() => {
  return (
    props.clearable &&
    states.mouseOver &&
    states.inputValue.trim() != "" &&
    states.selectOption
  );
});

const controlDropdown = (show) => {
  if (show) {
    // 打开
    if (props.filterable && states.selectOption) {
      states.inputValue = "";
    }
    if (props.filterable) {
      generateFilterOptions(states.inputValue);
    }
    tooltipRef.value.show();
  } else {
    // 收起
    tooltipRef.value.hide();
    if (props.filterable) {
      states.inputValue = states.selectOption ? states.selectOption.label : "";
    }
    states.highlightIndex = -1;
  }
  isDropdownShow.value = show;
  emits("visible-change", show);
};

const toggleDropdown = () => {
  if (props.disabled) {
    return;
  }
  if (isDropdownShow.value) {
    controlDropdown(false);
  } else {
    controlDropdown(true);
  }
};

const handleSelectItemChange = (item) => {
  if (item.disabled) {
    return;
  }
  // innerValue.value = item.label;
  states.inputValue = item.label;
  states.selectOption = item;
  emits("change", item.value);
  emits("update:modelValue", item.value);
  controlDropdown(false);
  inputRef.value.ref.focus();
  states.mouseOver = false;
};

const handleClear = () => {
  states.selectOption = null;
  states.inputValue = "";

  emits("clear");
  emits("change", "");
  emits("update:modelValue", "");
};
</script>
