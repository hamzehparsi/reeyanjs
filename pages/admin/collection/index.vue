<script setup>
definePageMeta({
  layout: "athenticate-content",
  middleware: ["auth-required"],
})

// const { data, pending, error } = await useFetch('/api/content-types')

// // فقط آرایه محتواها رو استخراج می‌کنیم
// const listOfContentTypes = computed(() => data.value?.contentTypes || [])
</script>

<template>
  <!-- <div class="p-4">
    <h1 class="text-xl font-bold mb-4">مدل‌های محتوا</h1>

    <div v-if="pending">در حال بارگذاری...</div>
    <div v-else-if="error">خطا در دریافت داده‌ها</div>

    <ul v-else class="space-y-2">
      <li
        v-for="type in listOfContentTypes"
        :key="type._id"
        class="p-4 border rounded hover:bg-gray-50 transition"
      >
        <NuxtLink :to="`/admin/collection/${type.name}`" class="text-blue-600 hover:underline">
          {{ type.displayName }} ({{ type.name }})
        </NuxtLink>
      </li>
    </ul>
  </div> -->
</template>
