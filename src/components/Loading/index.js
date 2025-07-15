import { Loading } from "./loading";
import { vLoading } from "./directive";

export const SqLoading = {
  install: (app) => {
    app.directive(vLoadingvLoading);
  },
  name: "SqLoading",
  service: Loading,
  directive: vLoading,
};

export default SqLoading;
