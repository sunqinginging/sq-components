import { beforeAll, describe, expect, test, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Collapse from "./Collapse.vue";
import { h } from "vue";
import CollapseItem from "./collapseItem.vue";
const onChange = vi.fn();
let wrapper;
let headers, contents;
let firstHeader, secondHeader, disabledHeader;
let firstContent, secondContent, disabledContent;
describe("Collapse", () => {
  beforeAll(() => {
    wrapper = mount(
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
    headers = wrapper.findAll(".sq-collapse-item__header");
    contents = wrapper.findAll(".sq-collapse-item__content");
    firstHeader = headers[0];
    secondHeader = headers[1];
    firstContent = contents[0];
    secondContent = contents[1];
    disabledContent = contents[2];
  });
  test("测试基础结构以及对应文本", () => {
    // 长度
    expect(headers.length).toBe(3);
    expect(contents.length).toBe(3);
    // 文本

    expect(firstHeader.text()).toBe("title a");
    expect(firstContent.isVisible()).toBeTruthy();
    expect(secondContent.isVisible()).toBeFalsy();
  });
  test("点击标题展开/关闭内容", async () => {
    // 行为 dom异步更新
    await firstHeader.trigger("click");
    expect(firstContent.isVisible()).toBeFalsy();
    await secondHeader.trigger("click");
    expect(secondContent.isVisible()).toBeTruthy();
  });
  test("发送正确的事件", async () => {
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledWith([]);
    expect(onChange).toHaveBeenLastCalledWith(["b"]);
  });
  test("disabled 的内容应该没有反应", async () => {
    disabledHeader = headers[2];
    // 将调用次数参数 全部清理掉
    onChange.mockClear();
    expect(disabledHeader.classes()).toContain("is-disabled");
    await disabledHeader.trigger("click");
    expect(disabledContent.isVisible()).toBeFalsy();
    expect(onChange).not.toHaveBeenCalled();
  });

  // test("basic collapse", async () => {
  //   const wrapper = mount(
  //     () => (
  //       <Collapse modelValue={["a"]} onChange={onChange}>
  //         <CollapseItem name="a" title="title a">
  //           content a
  //         </CollapseItem>
  //         <CollapseItem name="b" title="title b">
  //           content a
  //         </CollapseItem>
  //         <CollapseItem name="c" title="title c" disabled>
  //           content c
  //         </CollapseItem>
  //       </Collapse>
  //     ),
  //     {
  //       global: {
  //         stubs: [],
  //       },
  //       attachTo: document.body,
  //     }
  //   );
  //   const headers = wrapper.findAll(".sq-collapse-item__header");
  //   const contents = wrapper.findAll(".sq-collapse-item__content");
  //   // 长度
  //   expect(headers.length).toBe(3);
  //   expect(contents.length).toBe(3);
  //   // 文本
  //   const firstHeader = headers[0];
  //   const secondHeader = headers[1];

  //   expect(firstHeader.text()).toBe("title a");

  //   // 内容
  //   const firstContent = contents[0];
  //   const secondContent = contents[1];
  //   const disabledContent = contents[2];
  //   expect(firstContent.isVisible()).toBeTruthy();
  //   expect(secondContent.isVisible()).toBeFalsy();

  //   // 行为 dom异步更新
  //   await firstHeader.trigger("click");
  //   expect(firstContent.isVisible()).toBeFalsy();
  //   expect(onChange).toHaveBeenCalledWith([]);
  //   await secondHeader.trigger("click");
  //   expect(secondContent.isVisible()).toBeTruthy();
  //   expect(onChange).toHaveBeenLastCalledWith(["b"]);

  //   // disabled
  //   const disabledHeader = headers[2];
  //   // 将调用次数参数 全部清理掉
  //   onChange.mockClear();
  //   expect(disabledHeader.classes()).toContain("is-disabled");
  //   await disabledHeader.trigger("click");
  //   expect(disabledContent.isVisible()).toBeFalsy();
  //   expect(onChange).not.toHaveBeenCalled();
  // });
});
