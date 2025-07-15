import Message from "./Message.vue";
import { createMessage } from "./method";

Message.install = (app) => {
  app.component(Message.name, Message);
};

export default Message;

export { createMessage };
