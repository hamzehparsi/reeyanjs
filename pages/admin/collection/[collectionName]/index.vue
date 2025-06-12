<script setup>
const route = useRoute();
definePageMeta({
  layout: "athenticate-content",
  middleware: ["auth-required"],
});
const collectionName = route.params.collectionName;

const { data, pending, error } = await useFetch(
  `/api/content-types/by-name/${collectionName}`
);
const { data: collections } = await useFetch("/api/collection/collections");
const { data: items, refresh } = await useFetch(`/api/collection/${collectionName}`);
console.log("lenght", items.value.length);

const deleteOpen = ref(false);
const deleteContentId = ref(null);

function confirmDelete(contentId) {
  deleteOpen.value = true;
  deleteContentId.value = contentId;
}
async function deleteContent() {
  try {
    if (!deleteContentId.value) return;

    await $fetch(`/api/entries/${collectionName}/${deleteContentId.value}`, {
      method: "DELETE",
      // body را حذف کنید چون id در URL قرار دارد
    });

    deleteOpen.value = false;
    deleteContentId.value = null;
    refresh();
  } catch (err) {
    console.error("خطا در حذف فیلد:", err);
    // نمایش پیام خطا به کاربر
  }
}
</script>

<template>
  <div class="flex items-center justify-between pr-2">
    <div class="flex items-center gap-1 divide-x divide-gray-400">
      <div v-if="data" class="flex items-center gap-1 pl-4 font-black text-lg">
        <span>لیست</span>
        <span>{{ data.displayName }}</span>
      </div>
      <div v-if="data" class="flex items-center gap-1 pr-4">
        <div class="flex items-center gap-1 text-slate-400">
          <span>{{collections.find((c) => c.name === collectionName)?.count ?? 0}}</span>

          <div class="text-sm flex items-center gap-1">
            <span>{{ data.displayName }}</span>
            <span>درج شده</span>
          </div>
        </div>
      </div>
    </div>
    <NuxtLink v-if="data?.fields.length" :to="`/admin/collection/${collectionName}/create`"
      class="flex items-center gap-1 bg-blue px-4 py-2 rounded-lg text-white">
      <span>+</span>
      <span>درج <span>{{ data.displayName }}</span></span>
    </NuxtLink>
  </div>
  <div v-if="items.length > 0"
    class="mt-4 bg-white rounded-xl px-7 py-4">
    <div v-if="(collections.find((c) => c.name === collectionName)?.count ?? 0) > 0">
      <ul class="divide-y divide-gray-200">
        <li v-for="item in items" :key="item._id">
          <div class="py-2 my-2 flex justify-between items-center">
            <div>{{ item.title }}</div>
            <div class="flex items-center gap-2">
              <span>
                <IconsEditIcon class=" size-7 p-1 rounded-lg text-blue-dark hover:bg-blue-light hover:text-blue transition-all
                duration-300 ease-in-out" />
              </span>
              <span>
                <IconsDeleteIcon @click="confirmDelete(item._id)" class=" size-7 p-1 rounded-lg text-blue-dark hover:bg-red-100 hover:text-red-500 transition-all
                duration-300 ease-in-out" />
              </span>
            </div>
          </div>
        </li>
      </ul>

      <!-- مودال حذف را خارج از حلقه v-for قرار دهید -->

    </div>
    <div v-else class="bg-white rounded-xl flex h-96 w-full justify-center flex-col">
      <IconsNoField class="size-42 mx-auto" />
      <div v-if="data" class="text-sm text-blue-dark -mt-8 text-center flex flex-col items-center gap-3">
        <span class="text-xs">هنوز هیچ {{ data.displayName }} ثبت نشده است
        </span>
        <NuxtLink :to="`/admin/collection/${collectionName}/create`"
          class="bg-blue-light flex items-center gap-2 rounded-md text-sm tracking-tighter px-4 py-2 text-blue font-semibold hover:bg-white border transition-all duration-300 ease-in-out border-blue-nice">
          <IconsAddNote class="size-5" />
          <span class="pt-1 text-xs"> اضافه کردن {{ data.displayName }} </span>
        </NuxtLink>
      </div>
    </div>
  </div>
  <!-- modal: حذف فیلد -->
  <UModal :ui="{
    modal: {
      slots: {
        overlay: 'fixed inset-0 bg-elevated/75',
        content:
          'fixed bg-default divide-y divide-default flex flex-col focus:outline-none',
        header: 'bg-blue',
      },
    },
  }" v-model:open="deleteOpen">
    <template #title>
      <div class="flex items-center gap-2">
        <div class="bg-red-500 text-xs text-white rounded-sm px-2 py-1">
          Dell
        </div>
        <div class="text-lg tracking-tighter font-bold">حذف محتوا</div>
      </div>
    </template>
    <template #description>
      <div class="text-xs tracking-tighter text-slate-400">
        شما می‌توانید در این قسمت یک مطلب را حذف نمایید
      </div>
    </template>
    <template #body>
      <div class="tracking-tighter">آیا از حذف این محتوا اطمینان دارید؟</div>
    </template>
    <template #footer="{ close }">
      <div class="flex justify-between items-center w-full">
        <UButton @click="deleteContent()"
          class="bg-red-50 tracking-tighter px-4 py-2 text-red-500 font-semibold hover:bg-white border border-red-200"
          color="neutral">
          حذف محتوا
        </UButton>
        <UButton label="انصراف" color="neutral" variant="outline"
          class="bg-white px-4 py-2 text-slate-500 hover:bg-white border border-blue-nice"
          @click="deleteOpen = !deleteOpen" />
      </div>
    </template>
  </UModal>
</template>