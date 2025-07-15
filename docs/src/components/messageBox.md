---
title: "Message Box消息弹出框"
titleTemplate: "SQ component UI"
aside: true
---

# MessageBox 消息弹出框

## 基础用法

<preview path="../../demo/messageBox.vue" title="message box消息弹出框" description="消息弹出框"></preview>

## API

### 配置项

|      属性名       |           说明           |                                           类型                                           | 默认值 |
| :---------------: | :----------------------: | :--------------------------------------------------------------------------------------: | :----: |
|       title       |           标题           |                                          string                                          |   ""   |
|      message      |         消息正文         |                                          string                                          |   ""   |
|    beforeClose    |     弹窗关闭前的回调     | 函数,参数:action(回调类型 confrim,cancel,close),state(messageBox 实例),doClose(确定关闭) |  null  |
| closeOnClickModal | 是否可以通过点击遮罩关闭 |                                         boolean                                          |  true  |
| confirmButtonText |    确定按钮的文本内容    |                                          string                                          |  确定  |
| showConfirmButton |     是否展示确定按钮     |                                         boolean                                          |  true  |
| cancelButtonText  |    取消按钮的文本内容    |                                          string                                          |  取消  |
| showCancelButton  |     是否展示取消按钮     |                                         boolean                                          | false  |
