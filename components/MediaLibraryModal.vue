<script setup>
import { ref, onMounted } from 'vue';
// import { useToast } from '#app'; // اگر از Nuxt UI Toast استفاده می‌کنی

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'select']);

const activeTab = ref('upload'); // 'upload' or 'library'
const uploadedFile = ref(null);
const isLoading = ref(false);
const mediaItems = ref([]); // لیست فایل‌های موجود در کتابخانه
const selectedForSelection = ref([]); // فایل‌های انتخاب شده در مدال برای برگشت به فرم

const toast = useToast();

// --- Functions for Upload Tab ---
async function handleFileUpload(event) {
  uploadedFile.value = event.target.files[0];
}

async function uploadFile() {
  if (!uploadedFile.value) {
    toast.add({ title: 'فایلی انتخاب نشده است', color: 'red' });
    return;
  }

  isLoading.value = true;
  const formData = new FormData();
  formData.append('file', uploadedFile.value);

  try {
    const response = await $fetch('/api/media/upload', { // این Endpoint باید در سمت سرور پیاده‌سازی شود
      method: 'POST',
      body: formData,
    });
    toast.add({ title: 'فایل با موفقیت آپلود شد', color: 'green' });
    uploadedFile.value = null; // پاک کردن فایل انتخاب شده
    fetchMediaItems(); // رفرش کتابخانه بعد از آپلود
    activeTab.value = 'library'; // رفتن به تب کتابخانه
  } catch (error) {
    console.error('❌ خطا در آپلود فایل:', error);
    toast.add({ title: `خطا در آپلود: ${error.data?.message || error.message}`, color: 'red' });
  } finally {
    isLoading.value = false;
  }
}

// --- Functions for Library Tab ---
async function fetchMediaItems() {
  isLoading.value = true;
  try {
    const response = await $fetch('/api/media/media', { // این Endpoint باید در سمت سرور پیاده‌سازی شود
      method: 'GET',
    });
    mediaItems.value = response.data || []; // فرض می‌کنیم response.data یک آرایه از فایل‌هاست
  } catch (error) {
    console.error('❌ خطا در دریافت فایل‌ها:', error);
    toast.add({ title: `خطا در دریافت فایل‌ها: ${error.data?.message || error.message}`, color: 'red' });
  } finally {
    isLoading.value = false;
  }
}

function selectMedia(media) {
  if (props.multiple) {
    const index = selectedForSelection.value.findIndex(item => item._id === media._id);
    if (index === -1) {
      selectedForSelection.value.push(media);
    } else {
      selectedForSelection.value.splice(index, 1);
    }
  } else {
    selectedForSelection.value = [media]; // فقط یک فایل می‌تواند انتخاب شود
  }
}

function isMediaSelected(media) {
  return selectedForSelection.value.some(item => item._id === media._id);
}

function confirmSelection() {
  if (props.multiple) {
    emit('select', selectedForSelection.value);
  } else {
    emit('select', selectedForSelection.value[0]); // فقط اولین انتخاب را برگردان
  }
  selectedForSelection.value = []; // پاک کردن انتخاب‌ها بعد از تأیید
}

function closeModal() {
  selectedForSelection.value = []; // پاک کردن انتخاب‌ها هنگام بستن مدال
  emit('close');
}

// --- Lifecycle & Watchers ---
onMounted(() => {
  if (props.isOpen) {
    fetchMediaItems();
  }
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    fetchMediaItems();
    activeTab.value = 'library'; // همیشه با تب کتابخانه باز شود
  }
});
</script>

<template>
  <UModal v-model="props.isOpen" @close="closeModal" :ui="{ width: 'sm:max-w-4xl' }">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            کتابخانه رسانه
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
        </div>
      </template>

      <div class="flex">
        <div class="w-1/4 p-4 border-l border-gray-200 dark:border-gray-700">
          <UButton
            :variant="activeTab === 'upload' ? 'solid' : 'ghost'"
            block
            class="justify-start mb-2"
            @click="activeTab = 'upload'"
            icon="i-heroicons-arrow-up-tray"
          >
            بارگذاری فایل جدید
          </UButton>
          <UButton
            :variant="activeTab === 'library' ? 'solid' : 'ghost'"
            block
            class="justify-start"
            @click="activeTab = 'library'"
            icon="i-heroicons-photo"
          >
            کتابخانه موجود
          </UButton>
        </div>
        <div class="w-3/4 p-4">
          <!-- Upload Tab Content -->
          <div v-if="activeTab === 'upload'">
            <h4 class="text-lg font-medium mb-4">بارگذاری فایل جدید</h4>
            <div
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
              @click="$refs.fileInput.click()">
              <input type="file" ref="fileInput" @change="handleFileUpload" :multiple="multiple" class="hidden" />
              <p class="text-gray-500 dark:text-gray-400">فایل را اینجا بکشید و رها کنید یا برای انتخاب کلیک کنید.</p>
              <p v-if="uploadedFile" class="mt-2 text-sm text-gray-700 dark:text-gray-300">انتخاب شده: {{ uploadedFile.name }}</p>
            </div>
            <UButton class="mt-4" @click="uploadFile" :loading="isLoading" :disabled="!uploadedFile || isLoading">
              آپلود
            </UButton>
          </div>

          <!-- Library Tab Content -->
          <div v-if="activeTab === 'library'">
            <h4 class="text-lg font-medium mb-4">کتابخانه موجود</h4>
            <div v-if="isLoading" class="text-center py-8">
              <p>در حال بارگذاری فایل‌ها...</p>
            </div>
            <div v-else-if="mediaItems.length === 0" class="text-center py-8">
              <p>هیچ فایلی یافت نشد.</p>
            </div>
            <div v-else class="grid grid-cols-3 gap-4">
              <div v-for="media in mediaItems" :key="media._id"
                class="relative border rounded-lg overflow-hidden cursor-pointer"
                :class="{ 'border-blue-500 ring-2 ring-blue-500': isMediaSelected(media) }"
                @click="selectMedia(media)">
                <img v-if="media.mimeType && media.mimeType.startsWith('image/')" :src="media.url"
                  class="w-full h-32 object-cover" alt="Media item" />
                <div v-else class="w-full h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <UIcon name="i-heroicons-document" class="w-16 h-16 text-gray-400" />
                </div>
                <div class="p-2 text-sm truncate">{{ media.name }}</div>
                <div v-if="isMediaSelected(media)"
                  class="absolute top-1 left-1 bg-blue-500 text-white rounded-full p-1 text-xs">
                  <UIcon name="i-heroicons-check" class="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <UButton color="gray" variant="ghost" @click="closeModal">بستن</UButton>
          <UButton @click="confirmSelection" :disabled="selectedForSelection.length === 0">
            انتخاب ({{ selectedForSelection.length }})
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
