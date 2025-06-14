<script setup>
const props = defineProps({
  fields: {
    type: Array,
    required: true,
    default: () => [],
    validator: (value) => value.every(field => field.name && field.type)
  },
  initialValues: {
    type: Object,
    default: () => ({})
  },
  submitText: {
    type: String,
    default: 'ذخیره'
  }
});

const emit = defineEmits(["submit", "update:modelValue"]);

const formData = ref({});

// مقداردهی اولیه فرم
watch(() => [props.fields, props.initialValues], ([fields, initialValues]) => {
  if (!fields) return;

  const newFormData = {};
  fields.forEach((field) => {
    newFormData[field.name] = initialValues[field.name] !== undefined
      ? initialValues[field.name]
      : field.defaultValue !== undefined
        ? field.defaultValue
        : getEmptyValueForType(field.type, field.allowMultiple);
  });

  formData.value = newFormData;
}, { immediate: true, deep: true });

function getEmptyValueForType(type, allowMultiple = false) {
  const typeMap = {
    shortText: '',
    longText: '',
    number: null,
    date: '',
    select: '',
    richText: '',
    boolean: false,
    media: allowMultiple ? [] : null
  };
  return typeMap[type] ?? '';
}

function handleSubmit() {
  const cleanedData = {};

  Object.keys(formData.value).forEach(key => {
    const val = formData.value[key];
    const field = props.fields.find(f => f.name === key);

    if (field?.type === 'media') {
      if (field.allowMultiple && !Array.isArray(val)) {
        cleanedData[key] = [];
      } else if (!field.allowMultiple && val === '') {
        cleanedData[key] = null;
      } else {
        cleanedData[key] = val;
      }
    } else if (val !== null && val !== undefined) {
      cleanedData[key] = val;
    }
  });

  console.log('✅ handleSubmit: cleanedData', cleanedData);
  emit('submit', cleanedData);
}

const inputTypeMap = {
  number: 'number',
  date: 'date',
  default: 'text'
};
</script>

<template>
  <div class="bg-white p-7 rounded-lg">
    <form @submit.prevent="handleSubmit">
      <div 
        v-for="field in fields" 
        :key="field.name" 
        class="mb-6"
        :class="{'flex items-center': field.type === 'boolean'}"
      >
        <label 
          v-if="field.type !== 'boolean' && field.type !== 'media'" 
          :for="field.name" 
          class="block mb-2 text-sm font-medium text-gray-700"
        >
          {{ field.label || field.name }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>

        <!-- فیلد متنی کوتاه -->
        <ShortTextInput
          v-if="field.type === 'shortText'"
          v-model="formData[field.name]"
          :id="field.name"
          :placeholder="field.placeholder || field.label || field.name"
          :required="field.required"
        />

        <!-- فیلد متنی بلند -->
        <TextareaInput
          v-else-if="field.type === 'longText'"
          v-model="formData[field.name]"
          :id="field.name"
          :placeholder="field.placeholder || field.label || field.name"
          :required="field.required"
          :rows="field.rows || 4"
        />

        <!-- عدد -->
        <input
          v-else-if="field.type === 'number'"
          v-model.number="formData[field.name]"
          :id="field.name"
          :type="inputTypeMap.number"
          :placeholder="field.placeholder || field.label || field.name"
          :required="field.required"
          class="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-blue-500 focus:border-blue-500"
        />

        <!-- تاریخ -->
        <input
          v-else-if="field.type === 'date'"
          v-model="formData[field.name]"
          :id="field.name"
          :type="inputTypeMap.date"
          :required="field.required"
          class="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-blue-500 focus:border-blue-500"
        />

        <!-- لیست انتخابی -->
        <select
          v-else-if="field.type === 'select'"
          v-model="formData[field.name]"
          :id="field.name"
          :required="field.required"
          class="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-blue-500 focus:border-blue-500"
        >
          <option disabled :value="getEmptyValueForType('select')">
            {{ field.placeholder || 'انتخاب کنید' }}
          </option>
          <option 
            v-for="option in field.options || []" 
            :key="option.value" 
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <!-- ویرایشگر متن غنی -->
        <client-only v-else-if="field.type === 'richText'">
          <QuillEditor 
            v-model="formData[field.name]" 
            :placeholder="field.placeholder || field.label || field.name"
          />
        </client-only>

        <!-- سوئیچ بله/خیر -->
        <BooleanSwitch
          v-else-if="field.type === 'boolean'"
          v-model="formData[field.name]"
          :id="field.name"
          :label="field.label || field.name"
          :description="field.description || ''"
          class="my-4"
        />

        <!-- ورودی رسانه -->
        <MediaUploadInput
          v-else-if="field.type === 'media'"
          v-model="formData[field.name]"
          :label="field.label || 'انتخاب فایل'"
          :multiple="field.allowMultiple || false"
          :required="field.required"
        />

        <!-- نوع نامعتبر -->
        <div v-else class="text-red-500 text-sm">
          نوع فیلد پشتیبانی نمی‌شود: {{ field.type }}
        </div>

        <!-- توضیحات -->
        <p v-if="field.description" class="mt-1 text-sm text-gray-500">
          {{ field.description }}
        </p>
      </div>

      <button 
        type="submit" 
        class="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-lg mt-4 transition-colors"
      >
        {{ submitText }}
      </button>
    </form>
  </div>
</template>
