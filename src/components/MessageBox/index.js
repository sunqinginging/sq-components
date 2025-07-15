import { MessageBox } from "./method";

MessageBox.install = (app) => {
  app.config.globalProperties.$msgBox = MessageBox;
  app.config.globalProperties.$alert = MessageBox.alert;
  app.config.globalProperties.$confirm = MessageBox.confirm;
};

export default MessageBox;
