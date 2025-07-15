---
title: "Tooltip文字提示"
aside: true
---

# Tooltip 文字提示

## 基础用法

通过使用[Floating UI 库](https://floating-ui.com/)二次封装而成。

<preview path="../../demo/tooltip.vue" title="tooltip文字提示"></preview>

## API

### Attribute

|    名称    |                            说明                            |                                类型                                 | 默认值 |
| :--------: | :--------------------------------------------------------: | :-----------------------------------------------------------------: | :----: |
|  content   |          显示的内容，可通过具名插槽 slot#content           |                               string                                |   --   |
| placement  |                     tooltip 出现的位置                     | 参考[Floating UI](https://floating-ui.com/docs/tutorial#placements) | bottom |
|  trigger   |                          触发方式                          |                            hover、click                             | click  |
|   manual   | 是否手动调用组件 expose 的 show 和 hide 方法来控制 tooltip |                               Boolean                               | false  |
| openDelay  |         打开 tooltip 的延迟时间,内部使用了防抖函数         |                               number                                |   0    |
| closeDelay |        关闭 tooltip 的延迟时间，内部使用了防抖函数         |                               number                                |   0    |
