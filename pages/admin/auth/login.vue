<template>
  <ClientOnly>
    <div class="w-md mx-auto text-center flex flex-col justify-center h-screen">
      <div class="p-7 bg-white">
        <Logo class="size-16 w-full flex justify-center" />
        <div class="mb-5 flex flex-col gap-2 mt-3">
          <h5 class="font-bold">خوش آمدید به سامانه مدیریت محتوای ریان</h5>
          <h6 class="text-xs">
            برای ورود نام کاربری و رمز عبور خود را وارد نمایید
          </h6>
        </div>
        <div class="flex flex-col gap-4" style="direction: rtl">
          <label class="text-xs text-right" for="username">نام کاربری</label>
          <UInput
            id="username"
            v-model="username"
            size="xl"
            variant="outline"
            placeholder="کد ملی خود را وارد بفرمایید"
            class="rounded-lg"
          />
          <label class="text-xs text-right" for="password">رمز عبور</label>

          <UInput
            v-model="password"
            placeholder="Password"
            size="xl"
            :type="show ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="show ? 'Hide password' : 'Show password'"
                :aria-pressed="show"
                aria-controls="password"
                @click="show = !show"
              />
            </template>
          </UInput>
          <div class="flex flex-col">
            <label class="text-xs text-slate-400 mt-2 mb-4">{{
              mathQuestion
            }}</label>
            <UInput
              v-model="userAnswer"
              size="xl"
              variant="outline"
              placeholder="پاسخ را وارد کنید"
              class="rounded-lg"
            />
          </div>

          <UButton
            @click="login"
            size="xl"
            class="mt-4 bg-blue hover:bg-blue-500 text-center text-white rounded-lg"
            block
            >ورود</UButton
          >
        </div>
        <NuxtLink
          class="mx-auto mt-3 w-full flex justify-center items-center space-x-2 space-x-reverse text-slate-400"
          to="/"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              color="currentColor"
            >
              <path
                d="M12 17h.009M20 8.5v5c0 3.771 0 5.657-1.172 6.828S15.771 21.5 12 21.5s-5.657 0-6.828-1.172S4 17.271 4 13.5v-5"
              />
              <path
                d="m22 10.5l-4.343-4.165C14.99 3.778 13.657 2.5 12 2.5S9.01 3.778 6.343 6.335L2 10.5"
              />
            </g>
          </svg>
        </NuxtLink>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
const username = ref("");
const show = ref(false);
const password = ref("");
const message = ref("");
const userAnswer = ref("");
const mathQuestion = ref("");
const correctAnswer = ref(0);
const auth_user = useAuth();

const generateMathQuestion = () => {
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  correctAnswer.value = num1 + num2;
  mathQuestion.value = `چند می‌شود ${num1} + ${num2}؟`;
};

generateMathQuestion();

definePageMeta({
  layout: "login",
  middleware: ["redirect-if-authenticated"],
});

const login = async () => {
  if (!username.value || !password.value) {
    toast.add({
      color: "error",
      title: "خطا",
      description: "شماره موبایل معتبر نیست.",
    });
    return;
  }

  if (parseInt(userAnswer.value) !== correctAnswer.value) {
    toast.add({
      color: "error",
      title: "خطا",
      description: "پاسخ سوال ریاضی صحیح نیست.",
    });
    generateMathQuestion();
    return;
  }
  try {
    const res = await $fetch("/api/auth/login", {
      method: "POST",
      body: { username: username.value, password: password.value },
    });

    auth_user.value = res.user;
    console.log(auth_user.value);

    message.value = res.message;
    navigateTo("/admin/dashboard");
  } catch (err) {
    message.value = err?.data?.statusMessage || "خطا در ورود";
  }
};
</script>
