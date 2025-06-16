<script setup>
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
  return sortedFields.value.filter(
    (f) =>
      ["shortText", "longText", "richText", "tags"].includes(f.type) ||
      (f.type === "media" && f.allowMultiple)
  );
});

const rightColumnFields = computed(() => {
  return sortedFields.value
    .filter(
      (f) =>
        ["number", "boolean", "date", "select", "multiSelect"].includes(
          f.type
        ) ||
        (f.type === "media" && !f.allowMultiple)
    )
    .sort((a, b) => {
      const typeOrder = {
        date: 1,
        boolean: 2,
        number: 3,
        select: 4,
        media: 5,
      };
      return (typeOrder[a.type] || 6) - (typeOrder[b.type] || 6);
    });
});
const m = useNuxtApp().$moment;
import moment from "moment-jalaali";

watch(
  () => [props.fields, props.initialValues],
  ([fields, initialValues]) => {
    if (!fields) return;

    const newFormData = {};
    fields.forEach((field) => {
      let value =
        initialValues[field.name] !== undefined
          ? initialValues[field.name]
          : field.defaultValue !== undefined
          ? field.defaultValue
          : getEmptyValueForType(field.type, field.allowMultiple);
      console.log("Raw date value:", value);

      // تبدیل تاریخ میلادی به شمسی
      if (field.type === "date" && value) {
        try {
          value = m(value).format("jYYYY/jMM/jDD HH:mm");
          console.log("📅 Converted to Jalali:", value);
        } catch (e) {
          value = "";
        }
      }

      newFormData[field.name] = value;

      console.log("Formatted Jalali:", value);
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
    tags: [],
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
        const m = moment(val, "jYYYY/jMM/jDD HH:mm", true);
        if (m.isValid()) {
          cleanedData[key] = m.toDate(); // تبدیل به تاریخ میلادی برای ذخیره
        } else {
          cleanedData[key] = null; // یا مقدار پیش‌فرض در صورت نامعتبر بودن
        }
      } else if (field.type === "number") {
        cleanedData[key] = Number(val);
      } else {
        cleanedData[key] = val;
      }
    }
  });

  emit("submit", cleanedData);
}
const router = useRouter();
</script>

<template>
  <!-- قالب بدون تغییر باقی می‌ماند -->
  <div class="bg-white p-7 rounded-lg">
    <form @submit.prevent="handleSubmit" class="flex items-start gap-6">
      <!-- ستون چپ -->
      <div class="flex flex-col w-2/3 gap-4">
        <!-- فیلدهای متنی کوتاه و بلند -->
        <div
          v-for="field in leftColumnFields.filter((f) =>
            ['shortText', 'longText'].includes(f.type)
          )"
          :key="field.name"
          class="flex flex-col gap-2"
        >
          <label
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

          <p v-if="field.description" class="mt-1 text-sm text-gray-500">
            {{ field.description }}
          </p>
        </div>

        <!-- ویرایشگر متن پیشرفته -->
        <div
          v-for="field in leftColumnFields.filter((f) => f.type === 'richText')"
          :key="field.name"
          class="flex flex-col gap-2"
        >
          <label
            :for="field.name"
            class="block text-sm font-medium text-gray-700"
          >
            {{ field.label || field.name }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>

          <client-only>
            <QuillEditor
              v-model="formData[field.name]"
              :placeholder="field.placeholder || field.label || field.name"
            />
          </client-only>

          <p v-if="field.description" class="mt-1 text-sm text-gray-500">
            {{ field.description }}
          </p>
        </div>

        <!-- فیلد تگ‌ها -->
        <div
          v-for="field in leftColumnFields.filter((f) => f.type === 'tags')"
          :key="field.name"
          class="flex flex-col gap-2"
        >
          <label
            :for="field.name"
            class="block text-sm font-medium text-gray-700"
          >
            {{ field.label || field.name }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>

          <UInputTags
            v-model="formData[field.name]"
            :placeholder="field.placeholder || 'تگ جدید را وارد کنید'"
            :ui="{
              base: 'w-full',
              inner: {
                input: {
                  base: 'rtl text-right',
                },
              },
              tag: {
                base: 'bg-blue-100 text-blue-800',
                remove: 'text-blue-600 hover:text-blue-800',
              },
            }"
          />

          <p v-if="field.description" class="mt-1 text-sm text-gray-500">
            {{ field.description }}
          </p>
        </div>

        <!-- گالری تصاویر -->
        <div
          v-for="field in leftColumnFields.filter((f) => f.type === 'media')"
          :key="field.name"
          class="flex flex-col gap-2 mt-4"
        >
          <label class="block text-sm font-medium text-gray-700">
            {{ field.label || "گالری تصاویر" }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>

          <MediaUploadInput
            v-model="formData[field.name]"
            :label="field.label || 'آپلود تصاویر'"
            :multiple="true"
            :required="field.required"
            accept="image/*"
            class="gallery-uploader"
          />

          <p v-if="field.description" class="mt-1 text-sm text-gray-500">
            {{ field.description }}
          </p>
        </div>
      </div>

      <!-- ستون راست -->
      <div class="flex flex-col w-1/3 gap-2">
        <!-- فیلد عددی -->
        <div
          v-for="field in rightColumnFields.filter((f) => f.type === 'number')"
          :key="field.name"
          class="flex flex-col gap-2"
        >
          <label
            :for="field.name"
            class="block text-sm font-medium text-gray-700"
          >
            {{ field.label || field.name }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>

          <input
            v-model.number="formData[field.name]"
            :id="field.name"
            type="number"
            :placeholder="field.placeholder || field.label || field.name"
            :required="field.required"
            class="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-blue-500 focus:border-blue-500"
          />

          <p v-if="field.description" class="mt-1 text-sm text-gray-500">
            {{ field.description }}
          </p>
        </div>

        <!-- فیلد تاریخ -->
        <ClientOnly>
          <div
            v-for="field in rightColumnFields.filter((f) => f.type === 'date')"
            :key="field.name"
            class="flex flex-col gap-2"
          >
            <PersianDateTimeInput
              v-model="formData[field.name]"
              :id="field.name"
              :label="field.label || 'تاریخ'"
              :placeholder="field.placeholder || 'تاریخ را انتخاب کنید'"
              class="w-full"
            />

            <p v-if="field.description" class="mt-1 text-sm text-gray-500">
              {{ field.description }}
            </p>
          </div>
        </ClientOnly>

        <!-- فیلد انتخاب -->
        <div
          v-for="field in rightColumnFields.filter((f) =>
            ['select', 'multiSelect'].includes(f.type)
          )"
          :key="field.name"
          class="flex flex-col gap-2"
        >
          <label
            :for="field.name"
            class="block text-sm font-medium text-gray-700"
          >
            {{ field.label || field.name }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>

          <SelectBoxInput
            v-model="formData[field.name]"
            :id="field.name"
            :items="field.options || []"
            :placeholder="field.placeholder || 'انتخاب کنید'"
            :required="field.required"
            :multiple="field.multiple"
          />

          <p v-if="field.description" class="mt-1 text-sm text-gray-500">
            {{ field.description }}
          </p>
        </div>

        <!-- حالت انتشار -->
        <div
          v-for="field in rightColumnFields.filter((f) => f.type === 'boolean')"
          :key="field.name"
          class="flex flex-col gap-2 mt-2"
        >
          <BooleanSwitch
            v-model="formData[field.name]"
            :id="field.name"
            :label="field.label || 'حالت انتشار'"
            :description="field.description || ''"
          />
        </div>

        <!-- تصویر کاور -->
        <div
          v-for="field in rightColumnFields.filter((f) => f.type === 'media')"
          :key="field.name"
          class="flex flex-col gap-2 mt-2"
        >
          <label class="block text-sm font-medium text-gray-700">
            {{ field.label || "تصویر کاور" }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>

          <MediaUploadInput
            v-model="formData[field.name]"
            :label="field.label || 'آپلود تصویر کاور'"
            :multiple="false"
            :required="field.required"
            accept="image/*"
            class="cover-image-uploader -mb-2"
          />

          <p v-if="field.description" class="mt-1 text-sm text-gray-500">
            {{ field.description }}
          </p>
        </div>

        <div class="flex flex-col">
          <!-- دکمه ارسال -->
          <button
            type="submit"
            class="bg-blue hover:bg-blue-700 text-white py-2.5 px-6 rounded-lg mt-4 transition-colors"
          >
            {{ submitText }}
          </button>
          <NuxtLink
            @click="$router.back()"
            class="bg-khakestari text-center hover:bg-slate-200 cursor-pointer text-slate-600 py-2.5 px-6 rounded-lg mt-4 transition-colors"
            >انصراف</NuxtLink
          >
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
