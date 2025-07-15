<template>
  <button @click="open">show message</button>
</template>

<script setup>
import { onMounted } from "vue";
import { createMessage } from "@/components/Message/method";

// onMounted(() => {
//   const messageInstance = createMessage({
//     message: "哈哈 111",
//   });
//   createMessage({
//     message: "哈哈 222",
//     duration: 1000,
//   });

//   setTimeout(() => {
//     messageInstance.destory();
//   }, 5000);
// });
console.log("????");
const open = () => {
  const messageInstance = createMessage({
    message: "哈哈 111",
  });
};
</script>
