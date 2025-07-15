---
title: "Message消息提示"
titleTemplate: "SQ component UI"
aside: true
---

# Message 消息提示

## 基础用法

通过 createMessage 方法调用，创建一个实例，实例提供 destory 用于销毁实例。

<preview path="../../demo/message.vue" title="message消息提示" description="component description content"></preview>

## API

### Message 配置项

|   名称   |                说明                |          类型          | 默认值  |
| :------: | :--------------------------------: | :--------------------: | :-----: |
| message  |              消息文字              |         string         |   ""    |
|   type   |              消息类型              | success、info、warning | success |
| duration | 自动关闭间隔,赋值为 0 则不自动关闭 |     string、number     |   "0"   |
|  offset  |         多条消息之间的间隔         |     string、number     |   30    |

### Message 方法

调用 createMessage 会创建一个当前 Message 的实例，可以通过调用 destory 将其关闭并销毁实例。
| 名称 | 描述 | 类型|
|:--:|:--:|:--:|
|destory|关闭销毁当前的 Message| Fn|
