<script setup>
import { reactive, watch, toRefs } from "vue";
import ShortTextInput from "@/components/ShortTextInput.vue";
import TextareaInput from "@/components/TextareaInput.vue";
import QuillEditor from "@/components/QuillEditor.vue";
import BooleanSwitch from "@/components/BooleanSwitch.vue";
import MediaUploadInput from "@/components/MediaUploadInput.vue";

const props = defineProps({
  fields: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(["submit", "update:modelValue"]);

const form = reactive({});

// مقداردهی اولیه فیلدها
watch(
  () => props.fields,

  (fields) => {
    console.log('Fields in DynamicForm:', fields);
    fields.forEach((field) => {
      form[field.name] = field.type === 'boolean' ? false : "";
    });
  },
  { immediate: true }
);

function handleSubmit() {
  emit("submit", { ...form });
}

function handleModelValueUpdate(newValue) {
  emit("update:modelValue", newValue);
}

watch(
  () => props.modelValue,
  (val) => {
    // مقدار را به ویرایشگر ست کن
  }
)
</script>

<template>
  <div class="bg-white p-7 rounded-lg">
    <form @submit.prevent="handleSubmit">
      <div v-for="field in fields" :key="field.name" class="">
        <label v-if="field.type !== 'boolean'" :for="field.name" class="block my-4 text-xs">{{
          field.label || field.name
        }}</label>

        <ShortTextInput v-if="field.type === 'shortText'" v-model="form[field.name]" :id="field.name"
          :placeholder="field.label || field.name" />

        <TextareaInput v-else-if="field.type === 'longText'" v-model="form[field.name]" :id="field.name"
          :placeholder="field.label || field.name" />
        <input v-else-if="field.type === 'number'" type="number" v-model.number="form[field.name]" :id="field.name"
          class="border p-2 w-full" />

        <input v-else-if="field.type === 'date'" type="date" v-model="form[field.name]" :id="field.name"
          class="border p-2 w-full" />

        <select v-else-if="field.type === 'select'" v-model="form[field.name]" :id="field.name"
          class="border p-2 w-full">
          <option disabled value="">انتخاب کنید</option>
          <option v-for="option in field.options || []" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>

        <client-only v-else-if="field.type === 'richText'">
          <QuillEditor v-model="form[field.name]" />
        </client-only>

        <BooleanSwitch class="my-4" v-else-if="field.type === 'boolean'" v-model="form[field.name]" :id="field.name"
          :label="field.label || field.name" :description="field.description || ''" />

        <MediaUploadInput v-else-if="field.type === 'media'" v-model="form[field.name]"
          :label="field.label || 'انتخاب فایل'" :multiple="field.allowMultiple || false" />

        <div v-else>
          <em>نوع فیلد پشتیبانی نمی‌شود: {{ field.type }}</em>
        </div>
      </div>

      <button type="submit" class="bg-blue text-white py-2 px-4 rounded-lg mt-4">
        ذخیره
      </button>
    </form>
  </div>
</template>
