<template>
  <div class="bg-khakestari h-screen">
    <FixedMenu class="z-10" />
    <div
      class="fixed right-16 h-screen bg-white w-64 px-4 py-4 z-0 flex flex-col justify-between"
    >
      <div
        class="font-semibold tracking-tight w-full border-slate-200 border-b-1 pb-3"
      >
        لیست محتوا
      </div>
      <div>
        <div
          class="w-full space-y-2"
          v-for="item in listOfContentTypes"
          :key="item.id"
        >
          <NuxtLink
            :to="`/admin/collection/${item.collectionName}`"
            :class="[
              'block hover:bg-slate-100 hover:text-slate-600 text-sm tracking-tighter w-full px-4 py-1.5 my-1 rounded-sm transition-all duration-300 ease-in-out',
              route.path.startsWith(`/admin/collection/${item.collectionName}`)
                ? 'bg-blue-light text-blue font-bold hover:!bg-blue-light hover:!text-blue'
                : 'text-blue-dark',
            ]"
          >
            {{ item.displayName }}
          </NuxtLink>
        </div>
      </div>
      <div>...</div>
    </div>
    <div class="px-24 py-8">
      <div class="mr-64">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const { data, pending, error } = await useFetch("/api/content-types");

// فقط آرایه محتواها رو استخراج می‌کنیم
const listOfContentTypes = computed(() => data.value?.contentTypes || []);
</script>

<style></style>
