<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form
      @submit.prevent="setup"
      class="bg-white p-8 rounded shadow w-full max-w-md space-y-4"
    >
      <h1 class="text-xl font-bold">ساخت ادمین اصلی</h1>
      <input
        v-model="username"
        placeholder="نام کاربری"
        class="w-full p-2 border rounded"
      />
      <input
        v-model="password"
        placeholder="رمز عبور"
        type="password"
        class="w-full p-2 border rounded"
      />
      <button class="w-full bg-blue-600 text-white p-2 rounded">
        ایجاد Super Admin
      </button>
      <p v-if="message" class="text-green-600 mt-2">{{ message }}</p>
    </form>
  </div>
</template>

<script setup>
const username = ref("");
const password = ref("");
const message = ref("");

definePageMeta({
  middleware: ["auth-redirect"], // یا نام صحیح
});
const setup = async () => {
  try {
    const res = await $fetch("/api/auth/register", {
      method: "POST",
      body: { username: username.value, password: password.value },
    });
    message.value = res.message;
  } catch (err) {
    message.value = err.data.message || "خطا در ساخت";
  }
};
</script>
