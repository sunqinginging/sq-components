---
title: "快速开始"
titleTemplate: "SQ component UI"
aside: true
---

# 快速开始

## 完整引入

如果你对打包后的文件大小不是很在乎，那么使用完整导入会更方便。

```js
import { createApp } from "vue";
import SqElement from "sunqing-components";
// 引入组件库css样式
import "sunqing-components/dist/index.css";
import App from "./App.vue";

createApp(App).use(SqElement).mount("#app");
```

## 按需导入

```js
<script setup>
import { SqButton } from "sunqing-components";
</script>

<template>
  <sq-button type="success">点击</sq-button>
</template>
```
