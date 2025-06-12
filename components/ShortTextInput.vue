<template>
  <UInput
    :id="id"
    :model-value="modelValue"
    @update:model-value="updateValue"
    type="text"
    size="xl"
    :placeholder="placeholder"
    class="w-full focus:ring-2 focus:ring-blue-300 transition"
  />
</template>

<script setup>
const props = defineProps({
  modelValue: [String, Number, Boolean, Array, Object],
  id: String,
  placeholder: String
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (value) => {
  emit('update:modelValue', value);
};
</script>