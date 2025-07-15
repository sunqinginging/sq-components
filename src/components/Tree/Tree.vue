<template>
  <div style="width: 400px; height: 300px">
    <TreeItem
      v-for="item in flattenTree"
      :key="item.key"
      :item="item"
      :expanded="isExpanded(item)"
      @toggle="toggleExpand"
      :loadingKeys="loadingKeysSet"
      :showCheckbox="showCheckbox"
      :checked="isChecked(item)"
      :indeterminate="isIndeterminate(item)"
      @toggleCheck="toggleCheck"
    ></TreeItem>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, useSlots, provide } from "vue";
import TreeItem from "./TreeItem.vue";
import { treeContextKey } from "./types";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  keyField: {
    type: String,
    default: "key",
  },
  labelField: {
    type: String,
    default: "label",
  },
  childrenField: {
    type: String,
    default: "children",
  },
  // 默认展开的节点的key数组
  defaultExpandedKeys: {
    type: Array,
    default: () => [],
  },
  // 是否懒加载子节点，需与 load 方法结合使用
  lazy: {
    type: Boolean,
    default: false,
  },
  // 懒加载 加载子节点的方法
  load: {
    type: Function,
  },
  showCheckbox: {
    type: Boolean,
    default: false,
  },
  // 默认勾选的节点的 key 的数组
  defaultCheckedKeys: {
    type: Array,
    default: () => [],
  },
  // check-strictly
  // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
  checkStrictly: {
    type: Boolean,
    default: false,
  },
});

const tree = ref([]);

onMounted(() => {
  tree.value = createTree(props.data);
});

// 监听props的data 每次变化 格式化树形结构
watch(
  () => props.data,
  (newValue) => {
    tree.value = createTree(newValue);
  }
);

const createOptions = (keyField, labelField, childrenField) => {
  return {
    getKey: (node) => {
      return node[keyField];
    },
    getLabel: (node) => {
      return node[labelField];
    },
    getChildren: (node) => {
      return node[childrenField];
    },
  };
};

const treeOptions = createOptions(
  props.keyField,
  props.labelField,
  props.childrenField
);

// 创建Map key值为key value值为node 方便根据node的key查找对应的node
const treeNodeMap = new Map();

const createTree = (data, parent = null) => {
  const traversal = (data, parent = null) => {
    return data.map((node) => {
      const children = treeOptions.getChildren(node) || [];
      const treeNode = {
        key: treeOptions.getKey(node),
        label: treeOptions.getLabel(node),
        children: [],
        rawNode: node,
        level: parent ? parent.level + 1 : 0,
        isLeaf: node.isLeaf ?? children.length == 0,
        parentKey: parent ? parent.key : "",
      };
      if (children.length > 0) {
        treeNode.children = traversal(children, treeNode);
      }
      // 方便根据key值查找对应的node
      treeNodeMap.set(treeNode.key, treeNode);
      return treeNode;
    });
  };

  const result = traversal(data, parent);
  return result;
};

// 展开的key的节点数组
const expandedKeysSet = ref(new Set(props.defaultExpandedKeys));

// 拍平树结构
const flattenTree = computed(() => {
  let expandedKeys = expandedKeysSet.value;
  // 最终拍平的节点
  const flattenNodes = [];
  // 经过格式化后的树形数据 第一项默认肯定是展示的
  const nodes = tree.value;
  // 使用栈 来实现递归遍历
  const stack = [];
  // 因为stack 先进后出 所以遍历的时候 要倒叙
  for (let i = nodes.length - 1; i >= 0; i--) {
    stack.push(nodes[i]);
  }

  while (stack.length) {
    const node = stack.pop();
    if (!node) {
      continue;
    }
    flattenNodes.push(node);
    if (expandedKeys.has(node.key)) {
      // 如果展示的key数组里存在 他的children也需要展示

      const children = node.children;
      if (children) {
        for (let i = children.length - 1; i >= 0; i--) {
          stack.push(node.children[i]);
        }
      }
    }
  }
  return flattenNodes;
});
const isExpanded = (node) => {
  return expandedKeysSet.value.has(node.key);
};

// 展开 折叠
const collapse = (node) => {
  expandedKeysSet.value.delete(node.key);
};

const expand = (node) => {
  expandedKeysSet.value.add(node.key);

  if (props.lazy) {
    triggerLoading(node);
  }
};

const toggleExpand = (node) => {
  const expandedKeys = expandedKeysSet.value;
  // 限制lazy 懒加载的时候 不让进行展开折叠操作
  if (loadingKeysSet.value.has(node.key)) {
    return;
  }

  if (expandedKeys.has(node.key)) {
    collapse(node);
  } else {
    expand(node);
  }
};

// 维护一个当前正在异步请求懒加载的节点的set
const loadingKeysSet = ref(new Set());

const triggerLoading = (node) => {
  // 判断当前的children 是否已经有值 说明已经懒加载过了  判断当前是否是叶子结点
  if (node.children.length == 0 && !node.isLeaf) {
    const loadingKeys = loadingKeysSet.value;
    if (!loadingKeys.has(node.key)) {
      // 说明当前节点没正在懒加载
      loadingKeys.add(node.key);
      // 用户传入的load是一个返回promise的函数
      // 传给用户操作的值 是用户传入的原始的值
      props.load(node.rawNode).then((children) => {
        // 返回的是子节点children
        // 给用户的原生的值赋值
        node.rawNode[props.childrenField] = children;
        // 给格式化之后的node也赋值 这个需要格式化一下
        node.children = createTree(children, node);
        loadingKeys.delete(node.key);
      });
    }
  }
};

// 节点的选择
const checkedKeysSet = ref(new Set(props.defaultCheckedKeys));
const indeterminateKeysSet = ref(new Set());

const isChecked = (item) => {
  return checkedKeysSet.value.has(item.key);
};

const isIndeterminate = (item) => {
  return indeterminateKeysSet.value.has(item.key);
};

// check 自上而下更新
const toggleCheckSelfAndChildren = (node, checked) => {
  if (checked) {
    // 选中 则将其 可能是半选状态 半选set中去除
    indeterminateKeysSet.value.delete(node.key);
  }
  const checkedKeys = checkedKeysSet.value;
  if (checked) {
    checkedKeys.add(node.key);
  } else {
    checkedKeys.delete(node.key);
  }
  // 更新其子集
  if (!props.checkStrictly) {
    node.children.forEach((child) => {
      if (!child.disabled) {
        toggleCheckSelfAndChildren(child, checked);
      }
    });
  }
};

const findNode = (key) => {
  return treeNodeMap.get(key);
};

// 自下而上更新
const toggleCheckParent = (node, checked) => {
  if (node.parentKey) {
    const parentNode = findNode(node.parentKey);

    if (parentNode) {
      // 默认子集全被选中
      let allChekced = true;
      // 默认子集没被选中 半选也算
      let childChecked = false;

      const nodes = parentNode.children;
      for (let node of nodes) {
        if (checkedKeysSet.value.has(node.key)) {
          childChecked = true;
        } else if (indeterminateKeysSet.value.has(node.key)) {
          allChekced = false;
          childChecked = true;
        } else {
          allChekced = false;
        }
      }
      if (allChekced) {
        // 全选
        checkedKeysSet.value.add(parentNode.key);
        indeterminateKeysSet.value.delete(parentNode.key);
      } else if (childChecked) {
        checkedKeysSet.value.delete(parentNode.key);
        indeterminateKeysSet.value.add(parentNode.key);
      } else {
        checkedKeysSet.value.delete(parentNode.key);
        indeterminateKeysSet.value.delete(parentNode.key);
      }
      toggleCheckParent(parentNode);
    }
  }
};

const toggleCheck = (node, checked) => {
  // 自上而下更新
  toggleCheckSelfAndChildren(node, checked);
  // 自下而上更新
  if (!props.checkStrictly) {
    toggleCheckParent(node, checked);
  }
};

onMounted(() => {
  // 将默认选中的节点选中
  checkedKeysSet.value.forEach((key) => {
    toggleCheck(findNode(key), true);
  });
});

const slots = useSlots();

// 将自定义节点内容插槽 通过provide注入到下面的子节点
provide(treeContextKey, {
  slots: slots,
});
</script>
