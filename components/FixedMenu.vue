<template>
  <div class="fixed right-0 h-screen bg-white w-16 border-l-1 border-slate-200">
    <div class="flex flex-col justify-between h-screen p-2 relative z-50">
      <NuxtLink to="/" class="border-b border-slate-200 pb-3">
        <Logo class="size-10 w-full flex justify-center" />
      </NuxtLink>
      <div class="w-full flex justify-center">
        <div class="flex flex-col gap-4 relative">
          <NuxtLink to="/admin" class="group relative">
            <div
              class="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 bg-slate-900 w-auto rounded-lg text-white text-xs px-4 py-2 transition-all duration-300 ease-in-out pointer-events-none"
            >
              خانه
            </div>
            <IconsHome
              :class="[
                'size-8 p-1 rounded-lg hover:bg-blue-light transition-all duration-300 ease-in-out',
                route.path === '/admin'
                  ? 'bg-blue-light text-blue'
                  : 'text-blue-dark',
              ]"
            />
          </NuxtLink>
          <!-- محتوا -->
          <NuxtLink to="/admin/collection" class="relative group">
            <div
              class="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 bg-slate-900 text-white text-xs rounded-lg px-4 py-2 transition-all duration-300 ease-in-out pointer-events-none"
            >
              محتوا
            </div>
            <IconsContent
:class="[
                'size-8 p-1 rounded-lg hover:bg-blue-light transition-all duration-300 ease-in-out',
                route.path.startsWith('/admin/collection')
                  ? 'bg-blue-light text-blue'
                  : 'text-blue-dark',
              ]"
            />
          </NuxtLink>
          <!-- مدیریت نوع محتوا -->
          <NuxtLink to="/admin/content-types" class="relative group">
            <div
              class="absolute w-auto text-nowrap right-12 top-1/2 -translate-y-1/2 opacity-0 translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 bg-slate-900 text-white text-xs rounded-lg px-4 py-2 transition-all duration-300 ease-in-out pointer-events-none"
            >
              مدیریت انواع محتوا
            </div>
            <IconsContentBuilder
              :class="[
                'size-8 p-1 rounded-lg hover:bg-blue-light transition-all duration-300 ease-in-out',
                route.path.startsWith('/admin/content-types')
                  ? 'bg-blue-light text-blue'
                  : 'text-blue-dark',
              ]"
            />
          </NuxtLink>
        </div>
      </div>
      <div class="w-full flex justify-center">
        <div class="flex flex-col gap-3">
          <!-- Profile Link with Tooltip -->
          <NuxtLink to="/admin/auth/me" class="relative group">
            <div
              class="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 bg-slate-900 text-white text-xs rounded-lg px-4 py-2 transition-all duration-300 ease-in-out pointer-events-none"
            >
              پروفایل
            </div>
            <IconsProfile
              :class="[
                'size-8 p-1 rounded-lg hover:bg-blue-light transition-all duration-300 ease-in-out',
                route.path === '/admin/auth/me'
                  ? 'bg-blue-light text-blue'
                  : 'text-blue-dark',
              ]"
            />
          </NuxtLink>

          <!-- Logout Icon with Tooltip -->
          <!-- <div class="relative group cursor-pointer">
            <div
              class="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 bg-slate-900 text-white text-xs rounded-lg px-4 py-2 transition-all duration-300 ease-in-out pointer-events-none"
            >
              خروج
            </div>
            <IconsLogout
              :class="[
                'size-8 p-1 rounded-lg text-red-600 transition-all duration-300 ease-in-out hover:bg-red-100',
              ]"
            />
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
</script>
