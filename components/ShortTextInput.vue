<template>
  <UInput
    :id="id"
    v-model="inputValue"
    type="text"
    size="lg"
    :placeholder="placeholder"
    class="w-full focus:ring-2 focus:ring-blue-300 transition"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: String,
  id: String,
  placeholder: String
});
const emit = defineEmits(["update:modelValue"]);

const inputValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
});
</script>

<script>
export default {
  emits: ["update:modelValue"]
}
</script>
