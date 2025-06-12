<script setup>
const route = useRoute()
const collectionName = route.params.collectionName
const id = route.params.id

definePageMeta({
  layout: "athenticate-content",
  middleware: ["auth-required"],
});
// 1. دریافت ساختار فیلدها
const { data: contentType } = await useFetch(
  `/api/content-types/by-name/${collectionName}`
)

// 2. دریافت داده موجود
const { data: existingData } = await useFetch(
  `/api/entries/${collectionName}/${id}`,
  {
    transform: (data) => {
      // تبدیل داده به فرمت مورد نیاز
      const transformed = { ...data }
      // تبدیل آرایه‌های ObjectId به رشته (اگر نیاز باشد)
      if (data.gallery) {
        transformed.gallery = data.gallery.map(item => item.toString())
      }
      return transformed
    }
  }
)

// 3. مقداردهی اولیه با watchEffect
const initialValues = ref({})

watchEffect(() => {
  if (contentType.value && existingData.value) {
    const values = {}
    contentType.value.fields.forEach(field => {
      // مقداردهی با اولویت: داده موجود → مقدار پیش‌فرض → مقدار خالی
      values[field.name] = existingData.value[field.name] !== undefined 
        ? existingData.value[field.name]
        : field.defaultValue !== undefined
          ? field.defaultValue
          : field.allowMultiple
            ? []
            : ''
    })
    initialValues.value = values
    console.log('مقادیر اولیه:', initialValues.value) // برای دیباگ
  }
})
</script>

<template>
  <div>
    <DynamicForm
      v-if="Object.keys(initialValues).length > 0 && contentType?.fields"
      :fields="contentType.fields"
      :initial-values="initialValues"
      submit-text="ذخیره تغییرات"
    />
    <div v-else class="text-center py-8">
      در حال بارگذاری فرم...
    </div>
  </div>
</template>