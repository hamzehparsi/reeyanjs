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
  try {
    await $fetch(`/api/entries/${collectionName}`, {
      method: "POST",
      body: data,
    });
    
    router.push(`/admin/collection/${collectionName}`);
  } catch (error) {
    console.error("❌ خطا در ذخیره مطلب:", error.data.message);
  }
}

</script>

<template>
  <DynamicForm :fields="fields" @submit="submitHandler" />
</template>
