<template>
  <SqForm :model="formData" :rules="rules" ref="formRef">
    <SqFormItem label="姓名" prop="name">
      <Input v-model="formData.name"></Input>
    </SqFormItem>
    <SqFormItem label="手机号" prop="phone">
      <Input v-model="formData.phone"></Input>
    </SqFormItem>

    <div style="display: flex; align-items: center">
      <div @click="handleSubmit">校验</div>
      <div @click="handleReset">重置</div>
    </div>
  </SqForm>
</template>

<script setup>
import { reactive, ref } from "vue";
import SqForm from "@/components/Form/Form.vue";
import SqFormItem from "@/components/Form/FormItem.vue";
import Input from "@/components/Input/Input.vue";

const formData = reactive({
  name: "初始名字",
  phone: "18212345678",
});

const rules = reactive({
  name: [
    {
      required: true,
      message: "请输入姓名",
      trigger: "change",
    },
    {
      min: 1,
      max: 6,
      message: "字数在1-6个之间",
      trigger: "blur",
    },
  ],
  phone: [
    {
      required: true,
      message: "请输入手机号",
      trigger: "change",
    },
    {
      min: 11,
      max: 11,
      message: "字数必须11位",
    },
    {
      // type: "regexp",
      pattern:
        /^1(3\d|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
      message: "请输入正确格式的手机号",
      trigger: "blur",
    },
  ],
});

const formRef = ref(null);

const handleSubmit = () => {
  if (formRef.value) {
    formRef.value.validate();
  }
};

const handleReset = () => {
  if (formRef.value) {
    formRef.value.resetFields(["name"]);
  }
};
</script>
