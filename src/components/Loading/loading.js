import {
  nextTick,
  reactive,
  createApp,
  toRefs,
  ref,
  proxyRefs,
  vShow,
  toRef,
} from "vue";
import { useZIndex } from "../../hooks/useZIndex";
import LoadingComponentConstructor from "./Loading.vue";

const { nextZIndex } = useZIndex(3000);

const LOADING_NUM_KEY = "sq-loading-num";
const RELATIVE_CLASS = "sq-loading-parent--relative";
const HIDDEN_CLASS = "sq-loading-parent--hidden";

// 单例模式 全屏loading
let fullscreenInstance;

const instanceMap = new Map();

const getLoadingNum = (target = document.body) => {
  return target.getAttribute(LOADING_NUM_KEY);
};

const addLoadingNum = (target = document.body) => {
  const num = getLoadingNum(target) ?? "0";
  target.setAttribute(LOADING_NUM_KEY, `${Number(num) + 1}`);
};

const removeLoadingNum = (target = document.body) => {
  target.removeAttribute(LOADING_NUM_KEY);
};

const subtractLoadingNum = (target = document.body) => {
  const num = getLoadingNum(target);
  if (num) {
    const newNum = Number(num) - 1;
    if (newNum == 0) {
      removeLoadingNum(target);
    } else {
      target.setAttribute(LOADING_NUM_KEY, `${newNum}`);
    }
  }
};

const addRelativeClass = (target = document.body) => {
  target.classList.add(RELATIVE_CLASS);
};

const removeRelativeClass = (target = document.body) => {
  target.classList.remove(RELATIVE_CLASS);
};

const addHiddenClass = (target = document.body) => {
  target.classList.add(HIDDEN_CLASS);
};

const removeHiddenClass = (target = document.body) => {
  target.classList.remove(HIDDEN_CLASS);
};

const addClass = (options, target) => {
  if (options.lock) {
    addHiddenClass(target);
  } else {
    removeHiddenClass(target);
  }

  addRelativeClass(target);
};

export const Loading = (options) => {
  const resolved = resolveOptions(options);
  if (resolved.fullscreen && fullscreenInstance) {
    return fullscreenInstance;
  }
  // 判断map是否已经保存当前tategt dom节点下的loading实例
  const target = resolved.parent ?? document.body;
  if (instanceMap.has(target)) {
    return target;
  }
  // 创建实例
  const instance = createLoadingComponent({
    ...resolved,
    closed: () => {
      resolved.closed && resolved.closed();
      // 将单例fullInstance重置
      if (resolved.fullscreen) {
        fullscreenInstance = undefined;
      }
    },
  });

  addClass(resolved, resolved.parent);

  addLoadingNum(resolved.parent);

  // 将实例的$el挂载到target
  resolved.parent.appendChild(instance.$el);

  nextTick(() => {
    instance.visible.value = true;
  });
  if (resolved.fullscreen) {
    fullscreenInstance = instance;
  }
  instanceMap.set(target, instance);

  return instance;
};

// 创建loading组件实例
const createLoadingComponent = (options) => {
  const afterLeaveFlag = ref(false);
  const data = reactive({
    ...options,
    visible: false,
  });

  const handleAfterLeave = () => {
    if (!afterLeaveFlag) {
      return;
    }
    destory();
  };

  const destory = () => {
    const target = data.parent;
    // 将绑定的attribute的num进行减法操作
    subtractLoadingNum(target);
    if (getLoadingNum(target)) {
      return;
    }
    // 如果num已经为0或者获取不到
    setTimeout(() => {
      // 去除样式
      removeRelativeClass(target);
      removeHiddenClass(target);
      // map里删除
      instanceMap.delete(target ?? document.body);
      vm.$el.parentNode.removeChild(vm.$el);
      // 卸载已挂载的实例
      app.unmount();
    }, 10);
  };

  // 定时器 用于在transition组件动画时间结束之后
  let afterLeaveTimer;

  const close = () => {
    if (options.beforeClose && !options.beforeClose()) {
      // 如果用户传值beforeClose 并且返回值为false 则阻止close
      return;
    }
    afterLeaveFlag.value = true;
    clearTimeout(afterLeaveTimer);
    afterLeaveTimer = setTimeout(() => {
      handleAfterLeave();
    }, 400);
    data.visible = false;
    options.closed && options.closed();
  };

  const setText = (text) => {
    data.text = text;
  };

  const app = createApp(LoadingComponentConstructor, {
    ...data,
    visible: toRef(data.visible),
    zIndex: data.fullscreen ? nextZIndex() : 0,
  });

  const vm = app.mount(document.createElement("div"));

  return {
    // 属性访问器
    get $el() {
      return vm.$el;
    },
    ...toRefs(data),
    handleAfterLeave,
    close,
    setText,
    vm,
  };
};

const isString = (data) => {
  return typeof data == "string";
};

const resolveOptions = (options) => {
  let target;

  if (isString(options.target)) {
    target = document.querySelector(options.target) ?? document.body;
  } else {
    target = options.target ?? document.body;
  }

  return {
    parent: target == document.body || options.body ? document.body : target,
    background: options.background ?? "rgba(0,0,0, 0.6)",
    spinner: options.spinner,
    text: options.text,
    fullscreen: target == document.body && (options.fullscreen ?? true),
    lock: options.lock ?? false,
    visible: options.visible ?? true,
    beforeClose: options.beforeClose,
    target,
    closed: options.closed,
  };
};
