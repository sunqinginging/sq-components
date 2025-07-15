import SqForm from "./Form.vue";
import SqFormItem from "./FormItem.vue";

SqForm.install = (app) => {
  app.component(SqForm.name, SqForm);
};

SqFormItem.install = (app) => {
  app.component(SqFormItem.name, SqFormItem);
};

export default SqForm;

export { SqFormItem };
