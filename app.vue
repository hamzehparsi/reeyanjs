<template>
  <UApp
    :locale="fa_ir"
    :toaster="{ position: 'bottom-center', expand: true, duration: 5000 }"
  >
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
<script setup>
import { fa_ir } from "@nuxt/ui/locale";
</script>
