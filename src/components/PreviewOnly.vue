<!-- eslint-disable vue/block-lang -->
<script setup>
import { ref, defineProps } from 'vue';
import { MdPreview, MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';

const id = 'preview-only';
// const text = ref('# Hello Editor');
const scrollElement = document.documentElement;

// 文章内容
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <MdPreview :editorId="id" :modelValue="props.content" />
  <MdCatalog :editorId="id" :scrollElement="scrollElement" />
</template>
