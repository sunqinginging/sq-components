import SqCollapse from "./Collapse.vue";
import SqCollapseItem from "./collapseItem.vue";

SqCollapse.install = (app) => {
  app.component(SqCollapse.name, SqCollapse);
};

SqCollapseItem.install = (app) => {
  app.component(SqCollapseItem.name, SqCollapseItem);
};

export default SqCollapse;
export { SqCollapseItem };
