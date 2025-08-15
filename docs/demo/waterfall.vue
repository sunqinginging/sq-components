<template>
  <div style="height: 500px">
    <SqInfinite v-model="loading" :isFinished="isFinished" @load="handleLoad">
      <SqWaterfall :data="list" nodeKey="id" :column="4">
        <template #default="{ item, width }">
          <div style="width: 100%">
            <img :src="item.img" alt="" style="max-width: 100%; height: auto" />
          </div>
        </template>
      </SqWaterfall>
    </SqInfinite>
  </div>
</template>

<script setup>
import SqWaterfall from "@/components/Waterfall/Waterfall.vue";
import SqInfinite from "@/components/Infinite/Infinite.vue";
import { ref } from "vue";

const loading = ref(false);
const isFinished = ref(false);
const handleLoad = () => {
  mockGetList();
};

const query = {
  page: 1,
  size: 20,
};

const mockGetList = async () => {
  if (isFinished.value) {
    return;
  }
  if (list.value.length > 0) {
    query.page += 1;
  }
  let res = await mockRequest(query);
  if (query.page == 1) {
    list.value = res;
  } else {
    list.value.push(...res);
  }
  if (list.value.length > 88) {
    isFinished.value = true;
  }
  loading.value = false;
};

const mockRequest = (query) => {
  let list = [];
  for (let i = 0; i < query.size; i++) {
    let imgIndex = Math.floor(Math.random() * 5);
    let imgUrl = imgList[imgIndex].img;
    let item = {
      id: (query.page - 1) * query.size + i + 1,
      title: `哈哈哈${(query.page - 1) * query.size + i + 1}`,
      img: imgUrl,
    };
    list.push(item);
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(list);
    }, 1000);
  });
};

const imgList = [
  {
    id: 1,
    title: "哈哈哈哈啊哈哈哈哈呵呵呵呵呵呵呵呵呵呵",
    img: "http://gips0.baidu.com/it/u=3822353666,2757632348&fm=3028&app=3028&f=JPEG&fmt=auto?w=720&h=1280",
  },
  {
    id: 2,
    title: "这都是写什么啊奇奇怪怪的",
    img: "http://gips2.baidu.com/it/u=2055042668,1190219470&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280",
  },
  {
    id: 3,
    title: "哈哈哈哈啊哈哈哈哈呵呵呵呵呵呵呵呵呵呵",
    img: "https://img2.baidu.com/it/u=1547325541,3385284539&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=800",
  },
  {
    id: 4,
    title: "哈哈哈哈啊哈哈哈哈呵呵呵呵呵呵呵呵呵呵",
    img: "https://img2.baidu.com/it/u=667247897,766454330&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500",
  },
  {
    id: 5,
    title: "哈哈哈哈啊哈哈哈哈呵呵呵呵呵呵呵呵呵呵",
    img: "https://q2.itc.cn/q_70/images03/20250717/1abfdcfb6d2547478bd09d882df9e3a9.jpeg",
  },
  {
    id: 6,
    title: "哈哈哈哈啊哈哈哈哈呵呵呵呵呵呵呵呵呵呵",
    img: "https://img1.baidu.com/it/u=4115776297,3737578267&fm=253&app=138&f=JPEG?w=1423&h=800",
  },
  {
    id: 7,
    title: "哈哈哈哈啊哈哈哈哈呵呵呵呵呵呵呵呵呵呵",
    img: "https://img0.baidu.com/it/u=15396030,1143539239&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500",
  },
];

const list = ref([]);
</script>
