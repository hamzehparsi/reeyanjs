<template>
  <UTextarea
    :id="id"
    v-model="inputValue"
    :placeholder="placeholder"
    :rows="rows"
    class="rounded-lg border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition w-full"
  />
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  modelValue: String,
  id: String,
  placeholder: String,
  rows: {
    type: Number,
    default: 5
  }
});
const emit = defineEmits(["update:modelValue"]);
const inputValue = computed({
  get: () => props.modelValue,
  set: val => emit("update:modelValue", val)
});
</script> 