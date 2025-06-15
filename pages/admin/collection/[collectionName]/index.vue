<script setup>
const route = useRoute();
const router = useRouter();
const toast = useToast();

definePageMeta({
  layout: "athenticate-content",
  middleware: ["auth-required"],
});

const collectionName = route.params.collectionName;

// Fetch data
const {
  data: contentType,
  pending,
  error,
} = await useFetch(`/api/content-types/by-name/${collectionName}`);
const { data: collections } = await useFetch("/api/collection/collections");
const { data: items, refresh } = await useFetch(
  `/api/collection/${collectionName}`
);

// State
const deleteOpen = ref(false);
const selectedItemToDelete = ref(null);
const globalFilter = ref("");
const sorting = ref([
  {
    id: "date", // تغییر از createdAt به date
    desc: true,
  },
]);

const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
});

// Computed
const filteredItems = computed(() => {
  if (!items.value || !items.value.length) return [];
  if (!globalFilter.value) return items.value;
  return items.value.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(globalFilter.value.toLowerCase())
    )
  );
});

const sortedItems = computed(() => {
  if (!sorting.value.length) return filteredItems.value;

  const sorted = [...filteredItems.value];
  const { id, desc } = sorting.value[0];

  return sorted.sort((a, b) => {
    const aVal = new Date(a[id]);
    const bVal = new Date(b[id]);

    if (desc) return bVal - aVal;
    return aVal - bVal;
  });
});

const paginatedItems = computed(() => {
  const start = pagination.value.pageIndex * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return sortedItems.value.slice(start, end);
});
import dayjs from "dayjs";

// Columns definition
const columns = [
  {
    accessorKey: "title",
    header: "عنوان",
    cell: ({ row }) =>
      h("div", { class: "text-wrap min-w-96 leading-6" }, row.original.title),
  },
  {
    accessorKey: "date", // تغییر از createdAt به date
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(resolveComponent("UButton"), {
        color: "neutral",
        variant: "ghost",
        label: "تاریخ",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5 font-bold",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) =>
      dayjs(row.original.date).calendar("jalali").format("YYYY/MM/DD"),
  },
  {
    id: "action",
    header: "عملیات",
    cell: ({ row }) =>
      h("div", { class: "flex gap-4 text-center mx-auto" }, [
        h(resolveComponent("UButton"), {
          class:
            "bg-transparent border border-slate-200 px-6 py-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600",
          onClick: () => handleEdit(row.original._id),
          label: "ویرایش",
        }),
        h(resolveComponent("UButton"), {
          class:
            "bg-transparent border border-red-200 px-6 py-2 rounded-full text-red-600 hover:bg-red-600 hover:text-white",
          onClick: () => confirmDeleteModal(row.original._id),
          label: "حذف",
        }),
      ]),
  },
];

// Methods
const handleEdit = (itemId) => {
  router.push(`/admin/collection/${collectionName}/${itemId}/edit`);
};

const confirmDeleteModal = (itemId) => {
  selectedItemToDelete.value = itemId;
  deleteOpen.value = true;
};

async function deleteContent() {
  try {
    if (!selectedItemToDelete.value) {
      toast.add({
        color: "error",
        title: "خطا",
        description: "شناسه محتوا برای حذف معتبر نیست.",
        icon: "hugeicons:exclamation-square-01",
      });
      deleteOpen.value = false;
      selectedItemToDelete.value = null;
      return;
    }

    await $fetch(
      `/api/entries/${collectionName}/${selectedItemToDelete.value}`,
      {
        method: "DELETE",
      }
    );

    toast.add({
      color: "success",
      title: "موفق",
      description: `محتوا با موفقیت حذف شد`,
      icon: "hugeicons:checkmark-square-03",
    });

    deleteOpen.value = false;
    selectedItemToDelete.value = null;
    refresh();
  } catch (err) {
    toast.add({
      color: "error",
      title: "خطا",
      description: "خطا در حذف محتوا",
    });
    console.error("Error deleting content:", err);
  }
}
</script>

<template>
  <div class="flex items-center justify-between pr-2">
    <div class="flex items-center gap-1 divide-x divide-gray-400">
      <div
        v-if="contentType"
        class="flex items-center gap-1 pl-4 font-black text-lg"
      >
        <span>لیست</span>
        <span>{{ contentType.displayName }}</span>
      </div>
      <div v-if="contentType" class="flex items-center gap-1 pr-4">
        <div class="flex items-center gap-1 text-slate-400">
          <span v-if="collections?.find((c) => c.name === collectionName)">
            {{ collections.find((c) => c.name === collectionName)?.count ?? 0 }}
          </span>

          <div class="text-sm flex items-center gap-1">
            <span>{{ contentType.displayName }}</span>
            <span>درج شده</span>
          </div>
        </div>
      </div>
    </div>
    <NuxtLink
      :to="`/admin/collection/${collectionName}/create`"
      class="flex items-center gap-1 bg-blue px-4 py-2 rounded-lg text-white"
    >
      <span>+</span>
      <span
        >درج <span>{{ contentType.displayName }}</span></span
      >
    </NuxtLink>
  </div>
  <div class="flex items-center gap-4 mt-4">
    <UInput
      v-model="globalFilter"
      class="max-w-sm mb-4 !ring-transparent"
      size="xl"
      variant="outline"
      placeholder="جستجو ..."
      :ui="{ base: '!ring-transparent' }"
    />
  </div>
  <div v-if="paginatedItems.length > 0" class="bg-white rounded-xl px-7 py-4">
    <div class="w-full flex flex-col">
      <ClientOnly>
        <UTable
          v-model:sorting="sorting"
          :data="paginatedItems"
          :columns="columns"
          class="w-full"
        />
      </ClientOnly>
      <div class="flex justify-center pt-4 mt-4">
        <UPagination
          v-model="pagination.pageIndex"
          :page-count="Math.ceil(filteredItems.length / pagination.pageSize)"
          :total="filteredItems.length"
          :items-per-page="pagination.pageSize"
          @update:page="(page) => (pagination.pageIndex = page - 1)"
          firstIcon="i-lucide-chevrons-right"
          prevIcon="i-lucide-arrow-right"
          nextIcon="i-lucide-arrow-left"
          lastIcon="i-lucide-chevrons-left"
        />
      </div>
    </div>
  </div>
  <div
    v-else
    class="bg-white rounded-xl flex h-96 w-full justify-center flex-col"
  >
    <IconsNoField class="size-42 mx-auto" />
    <div
      v-if="contentType"
      class="text-sm text-blue-dark -mt-8 text-center flex flex-col items-center gap-3"
    >
      <span class="text-xs"
        >هنوز هیچ {{ contentType.displayName }} ثبت نشده است
      </span>
      <NuxtLink
        :to="`/admin/collection/${collectionName}/create`"
        class="bg-blue-light flex items-center gap-2 rounded-md text-sm tracking-tighter px-4 py-2 text-blue font-semibold hover:bg-white border transition-all duration-300 ease-in-out border-blue-nice"
      >
        <IconsAddNote class="size-5" />
        <span class="pt-1 text-xs">
          اضافه کردن {{ contentType.displayName }}
        </span>
      </NuxtLink>
    </div>
  </div>
  <UModal
    :ui="{
      modal: {
        slots: {
          overlay: 'fixed inset-0 bg-elevated/75',
          content:
            'fixed bg-default divide-y divide-default flex flex-col focus:outline-none',
          header: 'bg-blue',
        },
      },
    }"
    v-model:open="deleteOpen"
  >
    <template #title>
      <div class="flex items-center gap-2">
        <div class="bg-red-500 text-xs text-white rounded-sm px-2 py-1">
          Dell
        </div>
        <div class="text-lg tracking-tighter font-bold">حذف محتوا</div>
      </div>
    </template>
    <template #description>
      <div class="text-xs tracking-tighter text-slate-400">
        شما می‌توانید در این قسمت یک مطلب را حذف نمایید
      </div>
    </template>
    <template #body>
      <div class="tracking-tighter">آیا از حذف این محتوا اطمینان دارید؟</div>
    </template>
    <template #footer="{ close }">
      <div class="flex justify-between items-center w-full">
        <UButton
          @click="deleteContent()"
          class="bg-red-50 tracking-tighter px-4 py-2 text-red-500 font-semibold hover:bg-white border border-red-200"
          color="neutral"
        >
          حذف محتوا
        </UButton>
        <UButton
          label="انصراف"
          color="neutral"
          variant="outline"
          class="bg-white px-4 py-2 text-slate-500 hover:bg-white border border-blue-nice"
          @click="deleteOpen = !deleteOpen"
        />
      </div>
    </template>
  </UModal>
</template>

<style>
:root {
  --ui-primary: #4441da;
}
</style>
