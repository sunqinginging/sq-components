import { onMounted, onUnmounted } from "vue";

const useClickOutside = (elementRef, callback) => {
  const handler = (e) => {
    if (elementRef.value && e.target) {
      // 点击容器以及容器内部的元素 不执行callback
      if (!elementRef.value.contains(e.target)) {
        callback();
      }
    }
  };

  onMounted(() => {
    document.addEventListener("click", handler);
  });

  onUnmounted(() => {
    document.addEventListener("click", handler);
  });
};

export default useClickOutside;
