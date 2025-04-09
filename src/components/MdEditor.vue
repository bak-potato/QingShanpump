<!-- eslint-disable vue/block-lang -->
<script setup>
import { ref, defineEmits, defineProps, onMounted } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

// 文字内容
const text = ref('')
// 排除的工具
const toolbarsExclude = [
  'github', 'htmlPreview', 'catalog', 'save', 'previewOnly',
]

//
const emit = defineEmits(['modelValue'])
const aaa = () => {
  emit('modelValue', text.value)
  // console.log(text.value)

}
const props = defineProps({
  constEdit: {
    type: String,
    default: ''
  }
})
onMounted(() => {
  constup()
})
function constup() {
  setTimeout(() => {
    text.value = props.constEdit
  }, 500)
}
</script>

<template>
  <MdEditor v-model="text" :toolbarsExclude="toolbarsExclude" @onBlur="aaa" />
</template>
