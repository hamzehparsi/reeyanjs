<template>dashboard</template>
<script setup>
console.log(
  "Available middleware:",
  Object.keys(useNuxtApp().$router.options.middleware || {})
);

definePageMeta({
//   middleware: [""], // یا نام صحیح
});
</script>
