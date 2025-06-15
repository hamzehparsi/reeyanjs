<template>
  <div class="flex flex-col gap-2">
    <label :for="id" class="text-sm">{{ label }}</label>

    <!-- UI Input -->
    <UInput
      variant="soft"
      :id="id"
      v-model="internalValue"
      size="xl"
      class="custom-input w-full"
      :placeholder="placeholder"
    />

    <!-- Date Picker -->
    <date-picker
      v-model="internalValue"
      type="datetime"
      custom-input=".custom-input"
      format="jYYYY/jMM/jDD HH:mm"
      display-format="jYYYY/jMM/jDD HH:mm"
      auto-submit
      color="#2563eb"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  label: { type: String, default: 'تاریخ' },
  id: { type: String, default: 'persian-date' },
  placeholder: { type: String, default: 'تاریخ را وارد کنید' },
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue || '')

watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val
  }
)

watch(internalValue, (val) => {
  emit('update:modelValue', val)
})
</script>
