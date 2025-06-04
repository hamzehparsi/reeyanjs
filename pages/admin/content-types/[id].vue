<script setup>
const route = useRoute();
const id = route.params.id;

const { data, pending, error, refresh } = await useFetch(
  `/api/content-types/${id}`
);

definePageMeta({
  layout: "athenticate-content-builder",
  middleware: ["auth-required"],
});
const contentType = computed(() => data.value?.contentType || {});
</script>

<template>
  <div class="space-y-4">
    <div v-if="pending">⏳ در حال بارگذاری...</div>
    <div v-else-if="error">❌ خطا: {{ error.message }}</div>
    <div v-else>
      <div class="flex justify-between items-center w-full">
        <div class="flex flex-col gap-1 pr-3">
          <h1 class="text-xl font-bold">{{ contentType.displayName }}</h1>
          <span class="text-xs text-blue-dark">{{ contentType._id }}</span>
        </div>
        <button
          class="bg-blue-light flex items-center gap-2 rounded-md text-sm tracking-tighter px-4 py-2 text-blue font-semibold hover:bg-white border transition-all duration-300 ease-in-out border-blue-nice"
        >
        <IconsAddNote class="size-5" />
          <span class="pt-1"> اضافه کردن فیلد </span>
        </button>
      </div>
      <!-- لیست فیلدهای این نوع محتوا -->
      <div class="mt-6">
        <div v-if="contentType.fields?.length">
          <ul class="list-disc pr-5 space-y-1">
            <li v-for="(field, index) in contentType.fields" :key="index">
              {{ field.name }} - ({{ field.type }})
            </li>
          </ul>
        </div>
        <div
          v-else
          class="bg-white rounded-xl flex h-96 w-full justify-center flex-col"
        >
          <IconsNoField class="size-42 mx-auto" />
          <span class="text-sm text-blue-dark text-center"
            >اولین فیلد خود را به این نوع محتوا اضافه کنید</span
          >
        </div>
      </div>

      <!-- دکمه افزودن فیلد جدید -->
      <!-- <div class="mt-4">
        <NuxtLink
          :to="`/admin/content-types/${id}/add-field`"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          افزودن فیلد جدید
        </NuxtLink>
      </div> -->
    </div>
  </div>
</template>
