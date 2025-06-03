<template>
<div class="fixed right-0 h-screen bg-white w-16 border-l-1 border-slate-200">
      <div class="flex flex-col justify-between h-screen p-2">
        <div class="border-b border-slate-200 pb-3">
          <Logo class="size-8 w-full flex justify-center" />
        </div>
        <div class="w-full flex justify-center">
          <div class="flex flex-col gap-4">
            <NuxtLink to="/admin">
              <IconsHome
                :class="[
                  'size-8 p-1 rounded-lg', // کلاس‌های پیش‌فرض
                  route.path === '/admin'
                    ? 'bg-blue-light text-blue'
                    : 'text-blue-dark',
                ]"
              />
            </NuxtLink>
            <NuxtLink to="/admin/content">
              <IconsContent
                :class="[
                  'size-8 p-1 rounded-lg', // کلاس‌های پیش‌فرض
                  route.path === '/admin/content'
                    ? 'bg-blue-light text-blue'
                    : 'text-blue-dark',
                ]"
              />
            </NuxtLink>
          </div>
        </div>
        <div class="w-full flex justify-center">
          <NuxtLink to="/admin/auth/me">
            <IconsProfile
              :class="[
                'size-8 p-1 rounded-lg', // کلاس‌های پیش‌فرض
                route.path === '/admin/auth/me'
                  ? 'bg-blue-light text-blue'
                  : 'text-blue-dark',
              ]"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
</template>

<script setup>
const route = useRoute();
</script>