<template>
  <QuillEditor
    v-model="content"
    :toolbar="toolbar"
    class="my-rich-editor"
  />
</template>

<script setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])

const content = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

const toolbar = [
  ['bold', 'italic', 'underline'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  ['link', 'image']
]
</script>
