function debounce(
  fn,
  wait = 0,
  options = {
    leading: false,
  }
) {
  let timer = null;
  let isInvoke = false;
  const _debounce = function (...args) {
    if (timer) {
      clearTimeout(timer);
    }

    if (options.leading && !isInvoke) {
      // 开始触发的时候 就执行
      fn.apply(this, args);
      isInvoke = true;
      return;
    }

    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
      isInvoke = false;
    }, wait);
  };

  _debounce.cancel = function () {
    timer && clearTimeout(timer);
    timer = null;
    isInvoke = false;
  };

  return _debounce;
}

export { debounce };
