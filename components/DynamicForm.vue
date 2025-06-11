<script setup>
import { reactive, watch, toRefs } from "vue";
import ShortTextInput from "@/components/ShortTextInput.vue";
import RichTextEditor from "@/components/RichTextEditor.vue";
import TextareaInput from "@/components/TextareaInput.vue";

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
      <label :for="field.name" class="block mb-2 text-xs">{{
        field.label || field.name
      }}</label>

      <ShortTextInput
        v-if="field.type === 'shortText'"
        v-model="form[field.name]"
        :id="field.name"
        :placeholder="field.label || field.name"
      />

      <TextareaInput
        v-else-if="field.type === 'longText'"
        v-model="form[field.name]"
        :id="field.name"
        :placeholder="field.label || field.name"
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

      <client-only v-else-if="field.type === 'richText'">
        <RichTextEditor v-model="form[field.name]" />
      </client-only>

      <div v-else>
        <em>نوع فیلد پشتیبانی نمی‌شود: {{ field.type }}</em>
      </div>
    </div>

    <button type="submit" class="bg-blue text-white py-2 px-4 rounded-lg">
      ذخیره
    </button>
  </form>
</template>
