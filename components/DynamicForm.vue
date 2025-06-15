<script setup>
import { ref, watch, computed } from "vue";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday);

const props = defineProps({
  fields: {
    type: Array,
    required: true,
    default: () => [],
    validator: (value) => value.every((field) => field.name && field.type),
  },
  initialValues: {
    type: Object,
    default: () => ({}),
  },
  submitText: {
    type: String,
    default: "ذخیره",
  },
});

const emit = defineEmits(["submit", "update:modelValue"]);

const formData = ref({});

const sortedFields = computed(() => {
  return props.fields.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
});

const leftColumnFields = computed(() => {
  return sortedFields.value.filter((f) =>
    ["shortText", "longText", "richText", "media"].includes(f.type)
  );
});

const rightColumnFields = computed(() => {
  return sortedFields.value
    .filter((f) => ["number", "boolean", "date", "select"].includes(f.type))
    .sort((a, b) => {
      // اول تاریخ، سپس boolean، سپس بقیه
      const typeOrder = {
        date: 1,
        boolean: 2,
        number: 3,
        select: 4,
      };
      return (typeOrder[a.type] || 5) - (typeOrder[b.type] || 5);
    });
});

watch(
  () => [props.fields, props.initialValues],
  ([fields, initialValues]) => {
    if (!fields) return;

    const newFormData = {};
    fields.forEach((field) => {
      newFormData[field.name] =
        initialValues[field.name] !== undefined
          ? initialValues[field.name]
          : field.defaultValue !== undefined
          ? field.defaultValue
          : getEmptyValueForType(field.type, field.allowMultiple);
    });

    formData.value = newFormData;
  },
  { immediate: true, deep: true }
);

function getEmptyValueForType(type, allowMultiple = false) {
  const typeMap = {
    shortText: "",
    longText: "",
    number: null,
    date: "",
    select: "",
    richText: "",
    boolean: false,
    media: allowMultiple ? [] : null,
  };
  return typeMap[type] ?? "";
}

function handleSubmit() {
  const cleanedData = {};

  props.fields.forEach((field) => {
    const key = field.name;
    const val = formData.value[key];

    if (val !== null && val !== undefined && val !== "") {
      if (field.type === "date") {
        const m = dayjs(val, { jalali: true });
        if (m.isValid()) {
          cleanedData[key] = m.toDate();
        }
      } else if (field.type === "number") {
        cleanedData[key] = Number(val);
      } else {
        cleanedData[key] = val;
      }
    }
  });

  console.log("✅ Prepared payload:", cleanedData);
  emit("submit", cleanedData);
}
</script>

<template>
  <div class="bg-white p-7 rounded-lg">
    <form @submit.prevent="handleSubmit" class="flex items-start gap-6">
      <!-- ستون اول -->
      <div class="flex flex-col w-2/3 gap-2">
        <div
          v-for="field in leftColumnFields"
          :key="field.name"
          class="flex flex-col gap-2"
        >
          <label
            v-if="field.type !== 'boolean' && field.type !== 'media'"
            :for="field.name"
            class="block text-sm font-medium text-gray-700"
          >
            {{ field.label || field.name }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>

          <ShortTextInput
            v-if="field.type === 'shortText'"
            v-model="formData[field.name]"
            :id="field.name"
            :placeholder="field.placeholder || field.label || field.name"
            :required="field.required"
          />

          <TextareaInput
            v-else-if="field.type === 'longText'"
            v-model="formData[field.name]"
            :id="field.name"
            :placeholder="field.placeholder || field.label || field.name"
            :required="field.required"
            :rows="field.rows || 4"
          />

          <client-only v-else-if="field.type === 'richText'">
            <QuillEditor
              v-model="formData[field.name]"
              :placeholder="field.placeholder || field.label || field.name"
            />
          </client-only>

          <MediaUploadInput
            v-else-if="field.type === 'media'"
            v-model="formData[field.name]"
            :label="field.label || 'انتخاب فایل'"
            :multiple="field.allowMultiple || false"
            :required="field.required"
          />

          <p v-if="field.description" class="mt-1 text-sm text-gray-500">
            {{ field.description }}
          </p>
        </div>
      </div>

      <!-- ستون دوم -->
      <div class="flex flex-col w-1/3 gap-2">
        <div
          v-for="field in rightColumnFields"
          :key="field.name"
          class="flex flex-col gap-2"
        >
          <!-- تغییر شرط نمایش لیبل -->
          <label
            v-if="!['boolean', 'media', 'date'].includes(field.type)"
            :for="field.name"
            class="block text-sm font-medium text-gray-700"
          >
            {{ field.label || field.name }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>

          <PersianDateTimeInput
            v-if="field.type === 'date'"
            v-model="formData[field.name]"
            :id="field.name"
            :label="field.label || 'تاریخ'"
            :placeholder="field.placeholder || 'تاریخ را انتخاب کنید'"
            class="w-full"
          />

          <BooleanSwitch
            v-else-if="field.type === 'boolean'"
            v-model="formData[field.name]"
            :id="field.name"
            :label="field.label || field.name"
            :description="field.description || ''"
          />

          <input
            v-else-if="field.type === 'number'"
            v-model.number="formData[field.name]"
            :id="field.name"
            type="number"
            :placeholder="field.placeholder || field.label || field.name"
            :required="field.required"
            class="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-blue-500 focus:border-blue-500"
          />

          <select
            v-else-if="field.type === 'select'"
            v-model="formData[field.name]"
            :id="field.name"
            :required="field.required"
            class="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-blue-500 focus:border-blue-500"
          >
            <option disabled :value="getEmptyValueForType('select')">
              {{ field.placeholder || "انتخاب کنید" }}
            </option>
            <option
              v-for="option in field.options || []"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <p v-if="field.description" class="mt-1 text-sm text-gray-500">
            {{ field.description }}
          </p>
        </div>

        <!-- دکمه ارسال -->
        <button
          type="submit"
          class="bg-blue hover:bg-blue-700 text-white py-2.5 px-6 rounded-lg mt-4 transition-colors"
        >
          {{ submitText }}
        </button>
      </div>
    </form>
  </div>
</template>
