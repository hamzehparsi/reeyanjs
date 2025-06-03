<script setup>
const auth_user = useAuth();

definePageMeta({
  middleware: ['auth-required']
});
</script>

<template>
  <!-- <div>sa</div> -->
  <div>{{ auth_user?.username }}</div>
</template>
