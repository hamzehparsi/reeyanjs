<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="login" class="bg-white p-8 rounded shadow w-full max-w-md space-y-4">
      <h1 class="text-xl font-bold">ورود به پنل ادمین</h1>
      <input v-model="username" placeholder="نام کاربری" class="w-full p-2 border rounded" />
      <input v-model="password" type="password" placeholder="رمز عبور" class="w-full p-2 border rounded" />
      <button class="w-full bg-green-600 text-white p-2 rounded">ورود</button>
      <p v-if="message" class="text-red-600 mt-2">{{ message }}</p>
    </form>
  </div>
</template>

<script setup>
const username = ref('')
const password = ref('')
const message = ref('')

definePageMeta({
  middleware: ["auth-redirect"], // یا نام صحیح
});
const login = async () => {
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })
    message.value = res.message
    navigateTo('/admin') // مسیر بعد از ورود موفق
  } catch (err) {
    message.value = err.data.statusMessage || 'خطا در ورود'
  }
}
</script>
