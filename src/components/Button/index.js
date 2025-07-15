import SqButton from "./Button.vue";

SqButton.install = (app) => {
  app.component(SqButton.name, SqButton);
};

export default SqButton;
