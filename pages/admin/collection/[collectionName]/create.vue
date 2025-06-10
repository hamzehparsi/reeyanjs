<script setup>
const route = useRoute();
const router = useRouter();
const collectionName = route.params["collectionName"];
const toast = useToast();
definePageMeta({
  layout: "athenticate-content",
  middleware: ["auth-required"],
});

const { data: contentType } = await useFetch(
  `/api/content-types/by-name/${collectionName}`
);

const fields = contentType.value.fields;

async function submitHandler(data) {
  try {
    await $fetch(`/api/entries/${collectionName}`, {
      method: "POST",
      body: data,
    });

    // موفقیت: هدایت به لیست مطالب آن کالکشن
    router.push(`/admin/collection/${collectionName}`);
  } catch (error) {
    console.error("❌ خطا در ذخیره مطلب:", error);
    // در صورت نیاز: نمایش پیغام خطا به کاربر
  }
}
</script>

<template>
  <DynamicForm :fields="fields" @submit="submitHandler" />
</template>
