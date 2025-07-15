<template>
  <div @click="handleClick">
    <slot />
    <input
      ref="inputRef"
      type="file"
      :name="name"
      :accept="accept"
      :multiple="multiple"
      @change="handleChange"
      class="sq-upload__ipt"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { genId } from "./method";
import { httpRequest } from "./ajax";
import { sliceUpload } from "./slice";
const props = defineProps({
  fileList: {
    type: Array,
  },
  // 请求 URL
  action: {
    type: String,
    default: "",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: "file",
  },
  accept: {
    type: String,
    default: "",
  },
  // method 设置上传请求方法
  method: {
    type: String,
    default: "post",
  },
  // 设置上传的请求头部
  headers: {
    type: Object,
    default: () => {},
  },
  data: {
    type: Object,
    default: () => {},
  },
  onPreview: {
    type: Function,
  },
  // 若返回false或者返回 Promise 且被 reject，则停止上传。
  beforeUpload: {
    type: Function,
  },
  beforeRemove: {
    type: Function,
  },
  // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
  onChange: {
    type: Function,
  },
  onRemove: {
    type: Function,
  },
  onProgress: {
    type: Function,
  },
  onSuccess: {
    type: Function,
  },
  onError: {
    type: Function,
  },
  slice: {
    type: Boolean,
    default: true,
  },
});
const inputRef = ref(null);

const handleChange = (event) => {
  const files = event.target.files;

  for (let i = 0; i < files.length; i++) {
    const rawFile = files[i];
    rawFile.uid = genId();
    upload(rawFile);
  }
};

const upload = async (rawFile) => {
  // 输入框清空
  inputRef.value.value = "";
  let result = await props.beforeUpload(rawFile);
  if (result === false) {
    return; // 返回false 也停止上传
  }
  if (props.slice) {
    // 大文件切片上传
    sliceUpload(rawFile);
  } else {
    const { method, fileList, name, action, headers, data } = props;
    httpRequest({
      method,
      fileList,
      name,
      action,
      headers,
      data,
      file: rawFile,
      onError: (err) => {
        props.onError(err, rawFile);
      },
      onSuccess: (res) => {
        props.onSuccess(res, rawFile);
      },
      onProgress: (e) => {
        props.onProgress(e, rawFile);
      },
    });
  }
};

const handleClick = () => {
  inputRef.value.value = "";
  inputRef.value.click();
};
</script>
