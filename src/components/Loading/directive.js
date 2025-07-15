import { Loading } from "./loading";

const INSTANCE_KEY = "SqLoading";

const createInstance = (el, binding) => {
  // 获取自定义指令的修饰符 lock fullscreen
  const getModifier = (key) => {
    return binding.modifiers[key];
  };
  // 获取自定义指令绑定的元素的属性attribute的属性值
  const getProp = (name) => {
    return el.getAttribute(`sq-loading-${name}`);
  };

  const fullscreen = getModifier("fullscreen");

  const options = {
    text: getProp("text"),
    spinner: getProp("spinner"),
    background: getProp("background"),
    target: fullscreen ? undefined : el,
    lock: getModifier("lock"),
    fullscreen,
  };
  // el dom元素对象 给他赋值INSTANCE_KEY属性为对象 对象属性  options和instance实例
  el[INSTANCE_KEY] = {
    options,
    instance: Loading(options),
  };
};

export const vLoading = {
  mounted(el, binding) {
    console.log(binding.value, "....");
    if (binding.value) {
      createInstance(el, binding);
    }
  },
  updated(el, binding) {
    if (binding.oldValue === binding.value) {
      return;
    }
    if (binding.value && !binding.oldValue) {
      // 从false到true 创建实例
      createInstance(el, binding);
      return;
    }
    // 实例close
    el[INSTANCE_KEY] && el[INSTANCE_KEY].instance.close();
  },
  unmounted() {
    if (el[INSTANCE_KEY]) {
      el[INSTANCE_KEY].instance.close();
      el[INSTANCE_KEY] = undefined;
    }
  },
};
