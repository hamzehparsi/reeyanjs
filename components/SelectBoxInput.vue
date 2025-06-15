<script setup>
import { computed } from "vue";
import { USelect } from "#components";

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array, null],
    default: null,
  },
  items: {
    type: Array,
    default: () => [],
  },
  id: String,
  placeholder: {
    type: String,
    default: "انتخاب کنید",
  },
  required: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <USelect
    v-model="selectedValue"
    :items="items"
    option-attribute="label"
    value-attribute="value"
    :placeholder="placeholder"
    :required="required"
    :multiple="multiple"
    class="w-full"
    size="xl"
  />
</template>
