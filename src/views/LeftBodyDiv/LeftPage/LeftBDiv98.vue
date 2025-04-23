<template>
  <div class="lefymenu">
    <!-- 1 -->
    <div class="leftmenu1">
      <h3>体验对象</h3>
      <el-select v-model="value1" placeholder="对象" size="large" style="border:none;  margin-left: -10px; width: 180px">
        <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <!-- 2 -->
    <div class="leftmenu2">
      <h3>模型</h3>
      <el-select v-model="value2" placeholder="glm-4-plus" size="large"
        style="border:none; margin-left: -10px; width: 180px">
        <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <!-- 3 -->
    <div class="leftmenu3">
      <h3>多轮对话</h3><el-switch style="position: absolute;right: 10px;" v-model="value3" />
    </div>
    <hr style="border:1px solid #e0e0e0; margin-top: 10px;">
    <!-- 4 -->
    <h1>参数设置</h1>
    <div class="leftmenu4">
      <h3>system_prompt</h3>
      <el-input v-model="textarea" style="margin-left: -12px; width: 180px" :rows="2" type="textarea"
        placeholder="Please input" />
    </div>
    <!-- 5 -->
    <div class="leftmenu4">
      <h3>max_tokens </h3>
      <el-slider v-model="value4" :format-tooltip="formatTooltip" />
    </div>
    <!-- 6 -->
    <div class="leftmenu4">
      <h3>temperature </h3>
      <el-slider v-model="value5" :format-tooltip="formatTooltip" />
    </div>
    <!-- 7 -->
    <div class="leftmenu4">
      <h3>top_p </h3>
      <el-slider v-model="value6" :format-tooltip="formatTooltip" />
    </div>
    <hr style="border:1px solid #e0e0e0; margin-top: 10px;">

    <h1>工具调用</h1>
    <div class="leftmenu3">
      <h3>网页检索</h3><el-switch style="position: absolute;right: 10px;" v-model="value7" />
    </div>
    <div class="leftmenu3">
      <h3>知识库检索</h3><el-switch style="position: absolute;right: 10px;" v-model="value8" />
    </div>
    <div class="leftmenu3">
      <h3>函数调用</h3><el-switch style="position: absolute;right: 10px;" v-model="value9" />
    </div>

    <div class="leftmenu3">
      <h3>生成分享二维码</h3>
      <QRCodeShare :config="currentConfig" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import QRCodeShare from '../../../components/share/QRCodeShare.vue'

const value1 = ref('')
const value2 = ref('')
const value3 = ref(false)
const value4 = ref(100)
const value5 = ref(100)
const value6 = ref(100)
const value7 = ref(false)
const value8 = ref(false)
const value9 = ref(false)
const textarea = ref('')

const currentConfig = computed(() => ({
  model: value2.value,
  multiTurn: value3.value,
  systemPrompt: textarea.value,
  maxTokens: value4.value,
  temperature: value5.value / 100,
  topP: value6.value / 100,
  webSearch: value7.value,
  knowledgeBase: value8.value,
  functionCall: value9.value
}))

const options1 = [
  {
    value: '对象',
    label: '对象',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
const options2 = [
  {
    value: 'glm-4-plus',
    label: 'glm-4-plus',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
</script>

<style scoped>
.leftmenu4{
  margin-top: 15px;
}
h1{
  font-size: 12px;
  position: relative;
  color: rgb(140, 140, 140);
  font-weight: 600;
  margin-top: 20px;
  left: -10px;
}
.leftmenu3{
  margin-top: 10px;
  display: flex;
  justify-self: center;
  align-items: center;
  width: 150px;
  height: 40px;
}
.leftmenu2{
  margin-top: 20px;
}
h3{
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
  position: relative;
  left: -10px;
}
.lefymenu {
  width: 150px;
}
</style>
