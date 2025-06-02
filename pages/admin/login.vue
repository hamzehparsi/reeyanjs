<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
    <UCard class="w-full max-w-md space-y-4 p-6">
      <template #header>
        <h1 class="text-2xl font-bold text-center">ورود به پنل ادمین</h1>
      </template>

      <form @submit.prevent="login" class="space-y-4">
        <UInput
          v-model="username"
          placeholder="نام کاربری"
          icon="i-heroicons-user"
          size="lg"
          required
        />
        <UInput
          v-model="password"
          type="password"
          placeholder="رمز عبور"
          icon="i-heroicons-lock-closed"
          size="lg"
          required
        />

        <UButton type="submit" color="primary" size="lg" block>ورود</UButton>

        <UAlert v-if="message" color="red" icon="i-heroicons-exclamation-circle" variant="subtle">
          {{ message }}
        </UAlert>
      </form>
    </UCard>
  </div>
</template>

<script setup>
const username = ref('')
const password = ref('')
const message = ref('')

definePageMeta({
  middleware: ['auth-redirect'],
})

const login = async () => {
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })
    message.value = res.message
    navigateTo('/admin')
  } catch (err) {
    message.value = err?.data?.statusMessage || 'خطا در ورود'
  }
}
</script>
