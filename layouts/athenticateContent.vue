<template>
  <div class="bg-khakestari h-screen">
    <FixedMenu class="z-10" />
    <div class="fixed right-16 h-screen bg-white w-64 px-4 py-4 z-0">
      <div
        class="font-black tracking-tight w-full border-slate-200 border-b-1 pb-3"
      >
        لیست محتوا
      </div>
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
</script>

<style></style>
