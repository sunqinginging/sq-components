import { ref, defineComponent, onMounted, onUpdated } from "vue";

export default defineComponent({
  name: "sq-virtual-item",
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    id: {
      type: [String, Number],
    },
    component: {
      type: [Object, Function],
      // required: true
    },
  },

  emits: ["itemResize"],

  setup(props, { emit }) {
    const root = ref(null);

    const dispatchEvent = () => {
      emit("itemResize", props.id, root.value.offsetHeight);
    };

    // 组件挂载完毕 或者 每次更新完毕 向父组件传递自身的高度
    onMounted(() => {
      dispatchEvent();
    });

    onUpdated(() => {
      dispatchEvent();
    });

    return () => {
      const { component: Comp, id, data } = props;

      return (
        Comp && (
          <div key={id} ref={root}>
            <Comp item={data}></Comp>
          </div>
        )
      );
    };
  },
});
