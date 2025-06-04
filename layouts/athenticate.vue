<template>
  <div class="bg-khakestari h-screen">
    <FixedMenu />
    <div class="px-24 py-4">
      <!-- <div
        class="font-black tracking-tight w-full border-slate-200 border-b-1 pb-3 mb-4"
      >
        سیستم محتوای ریان
      </div> -->

      <slot />
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
</script>

<style></style>
