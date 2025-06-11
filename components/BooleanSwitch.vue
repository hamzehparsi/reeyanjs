<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "",
  }
});
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <USwitch
    v-model="props.modelValue"
    :label="label"
    :description="description"
    :id="id"
    @update:model-value="val => emit('update:modelValue', val)"
  />
</template>
