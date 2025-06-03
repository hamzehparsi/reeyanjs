<script setup>
const auth_user = useAuth();

definePageMeta({
  layout: "athenticate",
  middleware: ["auth-required"],
});
</script>

<template>
  <!-- <div>sa</div> -->
  <div>{{ auth_user?.username }}</div>
</template>
