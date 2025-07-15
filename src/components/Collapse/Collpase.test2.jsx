import { describe, expect, test, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Collapse from "./Collapse.vue";
import { h } from "vue";
import CollapseItem from "./collapseItem.vue";

describe("Collapse", () => {
  test("basic collapse", async () => {
    const onChange = vi.fn();

    const wrapper = mount(
      () => (
        <Collapse modelValue={["a"]} onChange={onChange}>
          <CollapseItem name="a" title="title a">
            content a
          </CollapseItem>
          <CollapseItem name="b" title="title b">
            content a
          </CollapseItem>
          <CollapseItem name="c" title="title c" disabled>
            content c
          </CollapseItem>
        </Collapse>
      ),
      {
        global: {
          stubs: [],
        },
        attachTo: document.body,
      }
    );
    const headers = wrapper.findAll(".sq-collapse-item__header");
    const contents = wrapper.findAll(".sq-collapse-item__content");
    // 长度
    expect(headers.length).toBe(3);
    expect(contents.length).toBe(3);
    // 文本
    const firstHeader = headers[0];
    const secondHeader = headers[1];

    expect(firstHeader.text()).toBe("title a");

    // 内容
    const firstContent = contents[0];
    const secondContent = contents[1];
    const disabledContent = contents[2];
    expect(firstContent.isVisible()).toBeTruthy();
    expect(secondContent.isVisible()).toBeFalsy();

    // 行为 dom异步更新
    await firstHeader.trigger("click");
    expect(firstContent.isVisible()).toBeFalsy();
    expect(onChange).toHaveBeenCalledWith([]);
    await secondHeader.trigger("click");
    expect(secondContent.isVisible()).toBeTruthy();
    expect(onChange).toHaveBeenLastCalledWith(["b"]);

    // disabled
    const disabledHeader = headers[2];
    // 将调用次数参数 全部清理掉
    onChange.mockClear();
    expect(disabledHeader.classes()).toContain("is-disabled");
    await disabledHeader.trigger("click");
    expect(disabledContent.isVisible()).toBeFalsy();
    expect(onChange).not.toHaveBeenCalled();
  });
});
