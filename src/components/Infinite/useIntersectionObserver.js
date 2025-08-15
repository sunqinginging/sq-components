import { onMounted, onUnmounted, ref } from "vue";

export function useIntersectionObserver(
  target,
  options = {
    threshold: 0.1,
  }
) {
  const isIntersecting = ref(false);
  let observer = null;

  const observe = () => {
    if (!target.value) {
      return;
    }
    observer = new IntersectionObserver(([entry]) => {
      isIntersecting.value = entry.isIntersecting;
    }, options);
    observer.observe(target.value);
  };

  const stop = () => {
    observer.disconnect();
    observer = null;
  };

  onUnmounted(stop);

  return {
    stop,
    isIntersecting,
    observe,
  };
}
