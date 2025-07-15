import { reactive, h, render } from "vue";
import MessageConstructor from "./Message.vue";
import { useZIndex } from "../../hooks/useZIndex";

// 多个message 按序排列 其实是将这个method文件做一个中转站
let seed = 0;
const instances = reactive([]);

export const createMessage = (props) => {
  let id = `message_${seed++}`;
  const container = document.createElement("div");
  // 需要一个销毁组件的方法
  const onDestoryed = () => {
    // 维护的实例数组里 也要删掉
    const idx = instances.findIndex((item) => item.id == id);
    if (idx > -1) {
      instances.splice(idx, 1);
    }
    // 当传值的虚拟dom节点为null 则表示卸载容器上的组件
    render(null, container);
  };

  const { nextZIndex } = useZIndex();

  const newProps = {
    ...props,
    onDestoryed,
    zIndex: nextZIndex(),
    id,
  };

  const vnode = h(MessageConstructor, newProps);
  render(vnode, container);
  // 挂载到document.body上
  document.body.appendChild(container.firstElementChild);

  const vm = vnode.component;

  // 手动销毁
  const manualDestory = () => {
    const idx = instances.findIndex((item) => item.id == id);
    console.log(idx);
    if (idx > -1) {
      console.log(instances[idx].vm);
      instances[idx].vm.exposed.visible.value = false;
    }
  };

  const instance = {
    id,
    props: newProps,
    vnode,
    vm,
    destory: manualDestory,
  };
  instances.push(instance);

  return instance;
};

export const getLastBottomOffset = (id) => {
  const idx = instances.findIndex((item) => item.id == id);
  if (idx <= 0) {
    return 0;
  }
  const prev = instances[idx - 1];
  return prev.vm.exposed.bottomOffset.value;
};
