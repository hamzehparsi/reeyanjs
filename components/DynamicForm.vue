<script setup>
import { reactive, watch, toRefs } from "vue";

const props = defineProps({
  fields: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["submit"]);

const form = reactive({});

// مقداردهی اولیه فیلدها
watch(
  () => props.fields,
  (fields) => {
    fields.forEach((field) => {
      form[field.name] = "";
    });
  },
  { immediate: true }
);

function handleSubmit() {
  emit("submit", { ...form });
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div v-for="field in fields" :key="field.name" class="mb-4">
      <label :for="field.name" class="block mb-1">{{
        field.label || field.name
      }}</label>

      <input
        v-if="['text', 'shortText'].includes(field.type)"
        type="text"
        v-model="form[field.name]"
        :id="field.name"
        class="border p-2 w-full"
      />

      <textarea
        v-else-if="field.type === 'longText'"
        v-model="form[field.name]"
        :id="field.name"
        class="border p-2 w-full h-40"
      />
      <input
        v-else-if="field.type === 'number'"
        type="number"
        v-model.number="form[field.name]"
        :id="field.name"
        class="border p-2 w-full"
      />

      <input
        v-else-if="field.type === 'date'"
        type="date"
        v-model="form[field.name]"
        :id="field.name"
        class="border p-2 w-full"
      />

      <select
        v-else-if="field.type === 'select'"
        v-model="form[field.name]"
        :id="field.name"
        class="border p-2 w-full"
      >
        <option disabled value="">انتخاب کنید</option>
        <option
          v-for="option in field.options || []"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <div v-else>
        <em>نوع فیلد پشتیبانی نمی‌شود: {{ field.type }}</em>
      </div>
    </div>

    <button type="submit" class="bg-blue text-white py-2 px-4 rounded-lg">
      ذخیره
    </button>
  </form>
</template>
