<template>
  <div>
    <h3>基础用法</h3>
    <Checkbox v-model="isChecked1">选我</Checkbox>
  </div>

  <div>
    <h3>禁用状态</h3>
    <p>通过设置disabled属性即可</p>
    <Checkbox v-model="isChecked2" :disabled="true">你点不了我啦</Checkbox>
  </div>

  <div>
    <h3>多选框组</h3>
    <p>
      CheckGroup双向绑定数组，通过设置vue对input的v-model的语法封装,多个复选框绑定到一个变量值
    </p>
    <p>每个checkbox需要设置当前此单选框的value值</p>
    <CheckboxGroup v-model="checkedList">
      <Checkbox label="苹果" value="apple"></Checkbox>
      <Checkbox label="香蕉" value="banana"></Checkbox>
    </CheckboxGroup>
  </div>

  <div>
    <h3>中间半选状态</h3>
    <p>属性indeterminate设置只是用于样式，逻辑通过用户自己设置。</p>
    <Checkbox
      v-model="isAllChecked"
      :indeterminate="isIndeterminate"
      @change="handleCheckedAllChange"
      >全选</Checkbox
    >
    <CheckboxGroup v-model="checkedCityList" @change="handleCityList">
      <Checkbox label="海南" value="hainan"></Checkbox>
      <Checkbox label="北京" value="beijing"></Checkbox>
    </CheckboxGroup>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CheckboxGroup from "@/components/Checkbox/CheckboxGroup.vue";
import Checkbox from "@/components/Checkbox/Checkbox.vue";

const isChecked1 = ref(true);
const isChecked2 = ref(true);
const checkedList = ref(["apple"]);

const isAllChecked = ref(false);
const isIndeterminate = ref(false);

const checkedCityList = ref([]);
const handleCityList = (data) => {
  console.log(data);
  const checkedCount = data.length;
  isAllChecked.value = checkedCount == 2;
  isIndeterminate.value = checkedCount > 0 && checkedCount < 2;
};

const handleCheckedAllChange = (value) => {
  checkedCityList.value = value ? ["hainan", "beijing"] : [];
  isIndeterminate.value = false;
};
</script>
