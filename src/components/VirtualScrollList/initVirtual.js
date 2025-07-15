const CALCULATE_TYPE = {
  INIT: "INIT",
  FIXED: "FIXED",
  DYNAMIC: "DYNAMIC",
};

export const initVirtual = (param, update) => {
  let calculateType = CALCULATE_TYPE.INIT;
  let fixedSizeValue = 0;
  let rangeAvg = 0;
  const range = {
    start: 0,
    end: 0,
    padFront: 0,
    padBehind: 0,
  };

  const isCalculateFixed = () => {
    return calculateType == CALCULATE_TYPE.FIXED;
  };

  const getEstimateSize = () => {
    return isCalculateFixed() ? fixedSizeValue : rangeAvg || param.estimateSize;
  };

  const getIndexOffset = (idx) => {
    if (!idx) {
      return 0;
    }
    let offset = 0;
    for (let i = 0; i < idx; i++) {
      let indexSize = sizes.get(param.uniqueIds[i]);
      offset += typeof indexSize == "number" ? indexSize : getEstimateSize();
    }

    return offset;
  };

  const getPadFront = () => {
    // 准确计算上偏移量
    if (isCalculateFixed()) {
      return getEstimateSize() * range.start;
    } else {
      // 将滚动后的元素累加
      return getIndexOffset(range.start);
    }
    // return param.estimateSize * range.start;
    // return getEstimateSize() * range.start;
  };

  const getPadBehind = () => {
    const lastIndex = param.uniqueIds.length - 1;
    // return (lastIndex - range.end) * param.estimateSize;
    return (lastIndex - range.end) * getEstimateSize();
  };

  const updateRange = (start, end) => {
    range.start = start;
    range.end = end;
    range.padFront = getPadFront();
    range.padBehind = getPadBehind();

    update({ ...range });
  };

  // 计算边界值
  const checkRange = (start, end) => {
    const total = param.uniqueIds.length;
    const { keeps } = param;
    if (total < keeps) {
      // 总数就小于 虚拟列表的每页默认展示条数
      start = 0;
      end = total - 1;
    } else if (end - start < keeps - 1) {
      // 滑到最后 保证start的值 是end的值 减去keeps的值
      start = end - keeps - 1;
    }
    updateRange(start, end);
  };

  checkRange(0, param.keeps - 1);

  // 记录上次滚动的值
  let offsetValue = 0;

  const getEndByStart = (start) => {
    const endResult = start + param.keeps - 1;
    const end = Math.min(endResult, param.uniqueIds.length - 1);
    return end;
  };

  const getScrollOvers = () => {
    // return Math.floor(offsetValue / getEstimateSize());
    if (isCalculateFixed()) {
      // 固定高度
      return Math.floor(offsetValue / getEstimateSize());
    } else {
      // 动态高度 使用二分查找
      let low = 0;
      let high = param.uniqueIds.length - 1;
      let middle = 0;
      let middleOffset = 0;
      while (low <= high) {
        middle = low + Math.floor(high - low) / 2;
        middleOffset = getIndexOffset(middle);
        if (middleOffset == offsetValue) {
          return middle;
        } else if (middleOffset < offsetValue) {
          low = middle + 1;
        } else if (middleOffset > offsetValue) {
          high = middle - 1;
        }
      }
      // 找不到 则去当前low的索引位置
      return low > 0 ? --low : 0;
    }
  };

  const handleFront = () => {
    // 当前鼠标滚动的距离 除以 大概的每个的高度
    let covers = getScrollOvers();
    if (covers > range.start) {
      // 假设现在是从第三十个开始的 keeps是30 然后假设当前covers已经滚过40个 那么就不需要更新range
      return;
    }
    // 计算开始值 需要减去缓冲区
    // 需要判断一下 缓冲区减去之后小于0 假设现在start是8 缓冲区是10 相减-2  需要math.max
    let start = Math.max(covers - param.buffer, 0);
    checkRange(start, getEndByStart(start));
  };

  // 处理鼠标向后滚动
  const handleBehind = () => {
    let covers = getScrollOvers();
    if (covers < range.start + param.buffer) {
      return;
    }
    checkRange(covers, getEndByStart(covers));
  };

  const handleScroll = (offset) => {
    // 判断鼠标滚动的方向
    let direction = offset < offsetValue ? "FRONT" : "BEHIND";
    offsetValue = offset;
    if (direction == "FRONT") {
      handleFront();
    } else if (direction == "BEHIND") {
      handleBehind();
    }
  };

  const sizes = new Map();

  // 记录所有item的高度
  const saveItemsSize = (id, size) => {
    sizes.set(id, size);
    // 固定 或者 是动态高度
    if (calculateType == CALCULATE_TYPE.INIT) {
      // 第一个元素初始化完毕
      fixedSizeValue = size;
      calculateType = CALCULATE_TYPE.FIXED; // 设置完固定高度
    } else if (
      calculateType == CALCULATE_TYPE.FIXED &&
      fixedSizeValue !== size
    ) {
      // 后续子组件元素 只要出现一个size不等于固定高度 则设置完动态高度
      calculateType = CALCULATE_TYPE.DYNAMIC;
      fixedSizeValue = 0;
    }

    if (calculateType == CALCULATE_TYPE.DYNAMIC) {
      // 动态高度 根据已经加载的数据 求平均值
      // 根据当前展示的dom数据 来计算滚动条的值
      if (sizes.size < Math.min(param.keeps, param.uniqueIds.length)) {
        rangeAvg = Math.round(
          [...sizes.values()].reduce((acc, val) => acc + val, 0) / sizes.size
        );
      }
    }
  };

  return { handleScroll, saveItemsSize };
};
