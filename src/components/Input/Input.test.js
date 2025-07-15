import { mount } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import Input from "./Input.vue";

describe("input test", () => {
  test("支持 v-model", async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: "test",
        "onUpdate:modelValue": (e) => wrapper.setProps({ modelValue: e }),
      },
    });
    // 初始值
    const input = wrapper.get("input");
    expect(input.element.value).toBe("test");
    // 更新值
    await input.setValue("update");
    expect(wrapper.props("modelValue")).toBe("update");
    expect(input.element.value).toBe("update");
    // v-model异步更新
    await wrapper.setProps({ modelValue: "prop update" });
    expect(input.element.value).toBe("prop update");
  });
});
