<template>
    <div class="flex flex-col gap-2">
      <label for="createdDate" class="text-sm">تاریخ</label>
  
      <!-- ورودی سفارشی UI -->
      <UInput
        variant="soft"
        id="createdDate"
        v-model="createdDate"
        size="xl"
        class="custom-input"
        placeholder="تاریخ"
      />
  
      <!-- تاریخ‌نگار شمسی با اتصال به ورودی بالا -->
      <date-picker
        v-model="createdDate"
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
//   import DatePicker from "vue3-persian-datetime-picker";
  const createdDate = ref('')
  </script>
  