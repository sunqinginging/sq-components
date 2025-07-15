<template>
  <div class="sq-calendar">
    <div class="sq-calendar__header">
      <div class="sq-calendar__title">{{ currentMonth }}月</div>
      <div class="sq-calendar__btn--group">
        <div @click="handleSelectDate('prev-month')">上个月</div>
        <div @click="handleSelectDate('today')">今天</div>
        <div @click="handleSelectDate('next-month')">下个月</div>
      </div>
    </div>

    <table class="sq-calendar-table">
      <thead>
        <tr>
          <th v-for="day in weekDays" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in rows">
          <td
            v-for="c in row"
            @click="handlePick(c)"
            class="sq-calendar-day"
            :class="getCellClass(c)"
          >
            {{ c.text }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { computed, ref } from "vue";
dayjs.locale("zh-cn");
defineOptions({
  name: "SqCalendar",
});

const props = defineProps({
  modelValue: {
    type: [String, Object],
  },
});

const emit = defineEmits(["update:modelValue"]);

const now = dayjs();
const date = computed(() => {
  return !props.modelValue ? now : dayjs(props.modelValue);
});

const firstDayOfWeek = dayjs().startOf("week").day();
console.log(firstDayOfWeek);

const weekMap = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];

const weekDays = computed(() => {
  return [
    ...weekMap.slice(firstDayOfWeek),
    ...weekMap.slice(0, firstDayOfWeek),
  ];
});

const rows = computed(() => {
  // 获取本月的第一天是星期几
  const firstDay = date.value.startOf("month").day();
  console.log(firstDay);
  const lastDay = date.value.subtract(1, "month").endOf("month").date();

  const count = firstDay - firstDayOfWeek;
  console.log(count);

  const prevMonthDays = Array.from({ length: count })
    .map((_, idx) => {
      return lastDay - count + 1 + idx;
    })
    .map((_) => {
      return {
        text: _,
        type: "prev",
      };
    });

  // 获取当前月 有多少天
  const days = date.value.daysInMonth();
  const currentMonthDays = Array.from({ length: days }).map((_, idx) => {
    return {
      text: idx + 1,
      type: "current",
    };
  });

  const list = [...prevMonthDays, ...currentMonthDays];
  let remaining = 42 - list.length;
  const nextMonthDays = Array.from({ length: remaining }).map((_, idx) => {
    return {
      text: idx + 1,
      type: "next",
    };
  });

  list.push(...nextMonthDays);

  return Array.from({ length: 6 }).map((_, idx) => {
    let start = 7 * idx;
    return list.slice(start, start + 7);
  });
});

// 快捷选择
const prevMonthDay = computed(() => {
  return date.value.subtract(1, "month").date(1);
});

const nextMonthDay = computed(() => {
  return date.value.add(1, "month").date(1);
});

const prevYearDay = computed(() => {
  return date.value.subtract(1, "year").date(1);
});

const nextYearDay = computed(() => {
  return date.value.add(1, "year").date(1);
});

const handleSelectDate = (type) => {
  const dateMap = {
    "prev-month": prevMonthDay.value,
    "next-month": nextMonthDay.value,
    "prev-year": prevYearDay.value,
    "next-year": nextYearDay.value,
    today: now,
  };
  const day = dateMap[type];

  pickDay(day);
};

const pickDay = (day) => {
  selectDay.value = day;
  emit("update:modelValue", day.toDate());
};

const formatDay = (text, type) => {
  // 如果点击的是上个月的日期 需要将当前展示的月设置为上个月的
  switch (type) {
    case "prev":
      return date.value.startOf("month").subtract(1, "month").date(text);
    case "current":
      return date.value.date(text);
    case "next":
      return date.value.startOf("month").add(1, "month").date(text);
  }
};

// 日历展示面板 点击单个日期
const handlePick = (item) => {
  const { text, type } = item;
  const day = formatDay(text, type);
  pickDay(day);
};

const selectDay = ref();

const getCellClass = ({ text, type }) => {
  const classList = [type];
  const date = formatDay(text, type);
  if (date.isSame(selectDay.value, "day")) {
    classList.push("is-selected");
  }
  if (date.isSame(now, "day")) {
    classList.push("is-today");
  }

  return classList;
};

const currentMonth = computed(() => {
  return date.value.month() + 1;
});
</script>
