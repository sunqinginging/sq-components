import { defineComponent } from "vue";

export default defineComponent({
  name: "sq-tree-item-content",
  props: {
    slots: {
      type: Object,
    },
    node: {
      type: Object,
      required: true,
    },
  },
  setup: (props) => {
    return () => {
      return (
        <div>
          {props.slots.default &&
            props.slots.default({ node: props.node, data: props.node.rawNode })}
        </div>
      );
    };
  },
});
