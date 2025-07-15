import SqTooltip from "./Tooltip.vue";

SqTooltip.install = (app) => {
  app.component(SqTooltip.name, SqTooltip);
};

export default SqTooltip;
