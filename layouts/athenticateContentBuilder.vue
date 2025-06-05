<template>
  <div class="bg-khakestari h-screen">
    <FixedMenu class="z-10" />
    <div
      class="fixed right-16 h-screen bg-white w-64 px-4 py-4 z-0 flex flex-col justify-between"
    >
      <div
        class="flex items-center justify-between w-full border-slate-200 border-b-1 pb-4 pt-1"
      >
        <span class="font-semibold tracking-tighter">لیست انواح محتوا</span>
        <IconsAddNote @click="open = !open" class="text-blue-dark size-5" />
      </div>
      <div class="">
        <div
          class="w-full space-y-2"
          v-for="item in contentTypes"
          :key="item.id"
        >
          <NuxtLink
            :to="`/admin/content-types/${item.id}`"
            :class="[
              'block hover:bg-slate-100 hover:text-slate-600 text-sm tracking-tighter w-full px-4 py-1.5 my-1 rounded-sm transition-all duration-300 ease-in-out',
              route.path === `/admin/content-types/${item.id}`
                ? 'bg-blue-light text-blue font-bold hover:!bg-blue-light hover:!text-blue'
                : 'text-blue-dark',
            ]"
          >
            {{ item.name }}
          </NuxtLink>
        </div>
      </div>
      <div>...</div>
    </div>
    <div class="px-24 py-5">
      <div class="mr-64">
        <slot />
      </div>
    </div>
  </div>
  <UModal
    :ui="{
      modal: {
        slots: {
          overlay: 'fixed inset-0 bg-elevated/75',
          content:
            'fixed bg-default divide-y divide-default flex flex-col focus:outline-none',
          header: 'bg-blue',
        },
      },
    }"
    v-model:open="open"
  >
    <template #title>
      <div class="flex items-center gap-2">
        <div class="bg-blue text-xs text-white rounded-sm px-2 py-1">CT</div>
        <div class="text-lg tracking-tighter font-bold">
          اضافه کردن نوع محتوای جدید
        </div>
      </div>
    </template>
    <template #description>
      <div class="text-xs tracking-tighter text-slate-400">
        شما می توانید در این قسمت یک نوع محتوای جدید ایجاد نمایید
      </div>
    </template>
    <template #body>
      <div class="space-y-4">
        <div class="flex gap-2 flex-col">
          <label class="text-xs text-right block mb-1" for="name"
            >نام مدل (انگلیسی)</label
          >
          <UInput
            id="name"
            v-model="formState.name"
            size="xl"
            variant="outline"
            placeholder="مثلاً: article"
            class="rounded-lg placeholder:!text-xs placeholder:!text-teal-400"
            required
          />
        </div>
        <div class="flex gap-2 flex-col">
          <label class="text-xs text-right block mb-1" for="displayName"
            >عنوان قابل نمایش (فارسی)</label
          >
          <UInput
            id="displayName"
            v-model="formState.displayName"
            size="xl"
            variant="outline"
            placeholder="مثلاً: مقاله"
            class="rounded-lg placeholder:!text-xs placeholder:!text-teal-400"
            required
          />
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex justify-between items-center w-full">
        <UButton
          @click="createContentType"
          class="bg-blue-light tracking-tighter px-4 py-2 text-blue font-semibold hover:bg-white border border-blue-nice"
          color="neutral"
          >ثبت نوع محتـوا</UButton
        >
        <UButton
          label="انصراف"
          color="neutral"
          variant="outline"
          class="bg-white px-4 py-2 text-slate-500 hover:bg-white border border-blue-nice"
          @click="close"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup>
const open = ref(false);
const route = useRoute();
const { data, pending, error, refresh } = await useFetch(
  "/api/content-types",
  {}
);

const formState = reactive({
  name: "",
  displayName: "",
});

async function createContentType() {
  try {
    await $fetch("/api/content-types", {
      method: "POST",
      body: {
        name: formState.name.trim(),
        displayName: formState.displayName.trim(),
      },
    });
    refresh();
    formState.name = "";
    formState.displayName = "";
    open.value = false;
    navigateTo("/admin/content-types");
  } catch (err) {
    console.log(err);
  }
}
const contentTypes = computed(() => {
  return (
    data.value?.contentTypes?.map((item) => ({
      id: item._id,
      name: item.displayName,
    })) || []
  );
});
onMounted(async () => {
  if (route.query.refresh) {
    // گرفتن لیست جدید
    const { data } = await useFetch("/api/content-types");
    const contentTypes = computed(() => {
      return (
        data.value?.contentTypes?.map((item) => ({
          id: item._id,
          name: item.displayName,
        })) || []
      );
    });
  }
});
</script>

<style></style>
