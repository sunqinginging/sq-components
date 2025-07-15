<template>
  <!-- <div @click="handleClick">调用</div> -->
  <SqButton @click="handleClick(1)">alert消息提示</SqButton>
  <SqButton @click="handleClick(2)">confirm确认消息</SqButton>
</template>

<script setup>
import { MessageBox } from "@/components/MessageBox/method.js";
import SqButton from "@/components/Button/Button.vue";

const handleClick = (type) => {
  if (type == 1) {
    MessageBox.alert("单独alert的标题", "title和message作为前两个参数传递", {
      callback: () => {
        console.log("回调函数");
      },
    });
  } else {
    MessageBox({
      title: "messagebox的标题",
      message: "在开发的样子",
    });
  }
};
</script>
