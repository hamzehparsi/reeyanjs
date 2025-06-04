<script setup>
const auth_user = useAuth();
definePageMeta({
  layout: "athenticate",
  middleware: ["auth-required"],
});
</script>

<template>
  <div class="font-black text-xl tracking-tight">
    ســـلام <span>{{ auth_user?.username }}</span>
  </div>
  <div class="text-sm text-slate-500">به صفحه مدیریت محتوای ریان خوش آمدید</div>
</template>
