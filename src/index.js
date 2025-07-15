/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
/* import font awesome icon component */
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
/* import specific icons */
import { fas } from "@fortawesome/free-solid-svg-icons";

import SqButton from "./components/Button";
import SqCollapse, { SqCollapseItem } from "./components/Collapse";
import SqMessage, { createMessage } from "./components/Message";
import SqCheckbox, { SqCheckboxGroup } from "./components/Checkbox";
import SqForm, { SqFormItem } from "./components/Form";
import SqInput from "./components/Input";
import SqTooltip from "./components/Tooltip";
import SqTree from "./components/Tree";
import SqMessageBox from "./components/MessageBox";
import SqLoading from "./components/Loading";

import "./styles/index.css";

/* add icons to the library */
library.add(fas);

const components = [
  SqButton,
  SqCollapse,
  SqCollapseItem,
  SqMessage,
  SqCheckbox,
  SqCheckboxGroup,
  SqForm,
  SqFormItem,
  SqInput,
  SqTooltip,
  SqTree,
  SqMessageBox,
  SqLoading,
];

// 完整引入 install方法
const install = (app) => {
  components.forEach((component) => {
    // app.component(component.name, component);
    app.use(component);
  });
};

// 按需导入
export {
  install,
  SqButton,
  SqCollapse,
  SqCollapseItem,
  SqMessage,
  createMessage,
  SqCheckbox,
  SqCheckboxGroup,
  SqForm,
  SqFormItem,
  SqInput,
  SqTooltip,
  SqTree,
  SqMessageBox,
  SqLoading,
};

export default {
  install,
};
