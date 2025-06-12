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
  console.log("data to submit:", data);
  const cleanedData = {};
  Object.keys(data).forEach((key) => {
    if (data[key] !== "" && data[key] !== null && data[key] !== undefined) {
      cleanedData[key] = Array.isArray(data[key]) ? [...data[key]] : data[key]; // استخراج آرایه
    }
  });
  console.log("cleaned data to submit:", cleanedData);
  try {
    const body = JSON.parse(JSON.stringify(cleanedData)); // سریال‌سازی دستی
    await $fetch(`/api/entries/${collectionName}`, {
      method: "POST",
      body: body,
    });
    router.push(`/admin/collection/${collectionName}`);
  } catch (error) {
    console.error("❌ خطا در ذخیره مطلب:", error.data.message);
    toast.add({
      title: "خطا در ذخیره",
      description: error.data.message,
      color: "red",
    });
  }
}

</script>

<template>
  <DynamicForm :fields="fields" @submit="submitHandler" />
</template>
