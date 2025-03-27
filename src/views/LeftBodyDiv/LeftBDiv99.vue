<template>
   <div class="lefymenu">
    <div
      class="leftmenu1"
      v-for="question in questions"
      :key="question.id"
      :class="{ active: activeId === question.id }"
      @click="handleMenuClick(question.id)"
    >
      <span>{{ question.id }}.</span>{{ question.title }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuestionStore } from "../../store/qusetion.js"
const questions = ref([
  {
    id:1,
    title: '题目:Vue基础知识',
    content: '下列关于Vue的说法正确的是？',
    options: [
      'Vue是一个基于JavaScript的框架',
      'Vue使用单向数据流',
      'Vue由Facebook团队维护',
      'Vue不支持TypeScript'
    ],
    correct: 0
  },
  {
     id:2,
    title: '题目:Vue基础知识',
    content: '下列关于Vue的说法正确的是？',
    options: [
      'Vue是一个基于JavaScript的框架',
      'Vue使用单向数据流',
      'Vue由Facebook团队维护',
      'Vue不支持TypeScript'
    ],
    correct: 0
  },
])
const store = useQuestionStore()
const activeId = ref(null)
const handleMenuClick = (id) => {
  activeId.value = id
  store.setSelectedQuestionId(activeId.value)
}

</script>
<style scoped>
.leftmenu1:hover{
  background-color: #f5f5f5;
  border-radius: 25px;
}
.leftmenu1 img{
  margin-top: 10px;
  margin-left: 20px;
  float: left;
}
.leftmenu1{
  width: 100%;
  position: relative;
  border-radius: 25px;
  margin-top: 10px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #757a8c;
}
.lefymenu{
  width: 100%;
}
</style>
