<template>
  <SqUpload
    multiple
    :beforeUpload="handleBeforeUpload"
    action="http://localhost:8888/users/avatar"
    name="avatar"
    method="post"
    :onSuccess="handleSuccess"
    :onProgress="handleProgressChange"
    :onError="handleError"
  >
    <SqButton>点击上传</SqButton>
  </SqUpload>
</template>

<script setup>
import SqButton from "@/components/Button/Button.vue";
import SqUpload from "@/components/Upload/Upload.vue";

const handleBeforeUpload = (rawFile) => {
  return true;
};

const handleSuccess = (res, file) => {
  // console.log(res, file);
  alert("上传成功");
};

const handleProgressChange = (evt, file) => {
  // console.log(evt.percentage, file);
};

const handleError = (err) => {
  // console.log(err);
};
</script>
