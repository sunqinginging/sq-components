import { defineComponent, onBeforeMount } from "vue";
import { ref } from "vue";
import { initVirtual } from "./initVirtual.js";
import virtualItem from "./virtualItem.jsx";

export default defineComponent({
  name: "sq-virtual-scroll-list",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    dataKey: {
      type: String,
      default: "id",
    },
    estimateSize: {
      type: [String, Number],
    },
    dataComponent: {
      type: [Object, Function],
    },
    keeps: {
      type: Number,
      default: 30,
    },
  },
  setup(props) {
    // 定义数据的显示范围 通过设置上下的padding来实现滚动条
    // const range = ref({
    //   start: 0,
    //   end: 0,
    //   padFront: 0,
    //   padBehind: 0,
    // });
    let virtual;
    const range = ref(null);

    const update = (newRange) => {
      range.value = newRange;
    };

    const generateRenderComponent = () => {
      const slots = [];
      const { start, end } = range.value;
      const { dataComponent } = props;

      for (let i = start; i <= end; i++) {
        const item = props.data[i];
        const key = item[props.dataKey];
        // slots.push(<dataComponent key={key} item={item}></dataComponent>);

        slots.push(
          <virtualItem
            id={key}
            data={item}
            component={dataComponent}
            onItemResize={handleItemSize}
          ></virtualItem>
        );
      }

      return slots;
    };

    const handleItemSize = (id, size) => {
      virtual.saveItemsSize(id, size);
    };

    const getUniqueIdFromDataSource = () => {
      const { data, dataKey } = props;
      return data.map((item) => item[dataKey]);
    };

    const installVirtual = () => {
      virtual = initVirtual(
        {
          keeps: props.keeps, // 当前默认展示多少条
          buffer: Math.round(props.keeps / 3), // 缓冲区
          uniqueIds: getUniqueIdFromDataSource(),
          estimateSize: props.estimateSize,
        },
        update
      );
    };

    const virtualRef = ref(null);

    const handleScroll = () => {
      if (virtualRef.value) {
        virtual.handleScroll(virtualRef.value.scrollTop);
      }
    };

    onBeforeMount(() => {
      installVirtual();
    });
    return () => {
      const { padFront, padBehind } = range.value;
      // 先只考虑是竖向滚动
      const padStyle = {
        padding: `${padFront}px 0 ${padBehind}px 0`,
      };

      return (
        <div
          class="sq-virtual-scroll-list"
          onScroll={handleScroll}
          ref={virtualRef}
        >
          <div style={padStyle}>{generateRenderComponent()}</div>
        </div>
      );
    };
  },
});
