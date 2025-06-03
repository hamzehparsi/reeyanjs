<template>
  <div class="bg-khakestari h-screen">
    <FixedMenu />
    <div class="fixed right-16 h-screen bg-white w-64 px-4 py-4">
      <div class="font-black tracking-tight w-full border-slate-200 border-b-1 pb-3">لیست محتوا</div>
    </div>
    <div class="px-24 py-8">
      <slot />
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
</script>

<style></style>
