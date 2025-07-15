import SqCheckbox from "./Checkbox.vue";
import SqCheckboxGroup from "./CheckboxGroup.vue";

SqCheckbox.install = (app) => {
  app.component(SqCheckbox.name, SqCheckbox);
};

SqCheckboxGroup.install = (app) => {
  app.component(SqCheckboxGroup.name, SqCheckboxGroup);
};

export default SqCheckbox;

export { SqCheckboxGroup };
