<script setup>
definePageMeta({
  layout: "athenticate-content",
  middleware: ["auth-required"],
});
const route = useRoute();
</script>

<template>
  <div class="flex items-center justify-between">
    collection {{ route.params.collectionname }}
  </div>
</template>
