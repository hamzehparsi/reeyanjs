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
        <IconsAddNote
          @click="open = !open"
          class="text-slate-400 hover:bg-blue-light p-1 size-7 rounded-lg transition-all duration-300 ease-in-out cursor-pointer"
        />
      </div>
      <div>
        <div v-if="pending">⏳ در حال بارگذاری...</div>
        <div v-else-if="error">❌ خطا: {{ error }}</div>
        <div v-else class="w-full space-y-2">
          <NuxtLink
            v-for="item in contentTypes"
            :key="item.id"
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
        شما می‌توانید در این قسمت یک نوع محتوای جدید ایجاد نمایید
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
        <div class="flex gap-2 flex-col">
          <label class="text-xs text-right block mb-1" for="displayName"
            >شناسه API (جمع)</label
          >
          <UInput
            :model-value="pluralizedName"
            readonly
            variant="outline"
            placeholder="مثلاً: articles"
            class="rounded-lg text-xs text-teal-400"
            label="نام کالکشن (جمع)"
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
import { ref, computed, reactive } from 'vue';
import pluralize from 'pluralize';
import { useContentTypes } from '~/composables/useContentTypes';

const route = useRoute();
const open = ref(false);

// استفاده از composable برای مدیریت contentTypes
const { contentTypesState, fetchContentTypes } = useContentTypes();

// دسترسی به contentTypes، pending و error از state
const contentTypes = computed(() => contentTypesState.value.contentTypes);
const pending = computed(() => contentTypesState.value.pending);
const error = computed(() => contentTypesState.value.error);

// محاسبه نام جمع
const pluralizedName = computed(() => pluralize(formState.name.trim()));

const formState = reactive({
  name: '',
  displayName: '',
});

// ایجاد نوع محتوای جدید
async function createContentType() {
  try {
    await $fetch('/api/content-types', {
      method: 'POST',
      body: {
        name: formState.name.trim(),
        displayName: formState.displayName.trim(),
      },
    });
    await fetchContentTypes(); // رفرش لیست contentTypes
    formState.name = '';
    formState.displayName = '';
    open.value = false;
    navigateTo('/admin/content-types');
  } catch (err) {
    console.error('خطا در ایجاد نوع محتوا:', err);
  }
}

// دریافت اولیه contentTypes هنگام بارگذاری لِی‌اوت
await fetchContentTypes();
</script>

<style></style>