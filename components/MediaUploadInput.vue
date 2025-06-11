<script setup>
import { ref, watch } from 'vue';
import MediaLibraryModal from '@/components/MediaLibraryModal.vue'; // در مرحله بعد می‌سازیم

const props = defineProps({
  modelValue: {
    type: [String, Array, Object], // می‌تواند شامل URL یک فایل یا آرایه‌ای از فایل‌ها باشد
    default: null,
  },
  label: {
    type: String,
    default: 'انتخاب فایل/تصویر',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const isModalOpen = ref(false);
const selectedMedia = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  selectedMedia.value = newValue;
}, { immediate: true });

function openMediaModal() {
  isModalOpen.value = true;
}

function handleMediaSelect(media) {
  // اگر multiple نباشد، فقط یک فایل انتخاب می‌شود
  if (!props.multiple) {
    selectedMedia.value = media;
    emit('update:modelValue', media);
  } else {
    // اگر multiple باشد، فایل‌های انتخاب شده را به آرایه اضافه یا حذف می‌کند
    if (Array.isArray(selectedMedia.value)) {
      // اگر فایل انتخاب شده قبلاً در لیست بود، آن را حذف کن (toggle)
      const existingIndex = selectedMedia.value.findIndex(item => item._id === media._id);
      if (existingIndex !== -1) {
        const newArray = [...selectedMedia.value];
        newArray.splice(existingIndex, 1);
        selectedMedia.value = newArray;
      } else {
        selectedMedia.value = [...selectedMedia.value, media];
      }
    } else {
      selectedMedia.value = [media];
    }
    emit('update:modelValue', selectedMedia.value);
  }
  isModalOpen.value = false;
}

function removeSelectedMedia(index) {
  if (!props.multiple) {
    selectedMedia.value = null;
    emit('update:modelValue', null);
  } else if (Array.isArray(selectedMedia.value)) {
    const newArray = [...selectedMedia.value];
    newArray.splice(index, 1);
    selectedMedia.value = newArray;
    emit('update:modelValue', newArray);
  }
}
</script>

<template>
  <div>
    <button type="button" @click="openMediaModal"
      class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
      {{ label }}
    </button>

    <div v-if="selectedMedia && !multiple" class="mt-2 flex items-center space-x-2">
      <template v-if="selectedMedia.url">
        <img v-if="selectedMedia.mimeType && selectedMedia.mimeType.startsWith('image/')" :src="selectedMedia.url"
          class="w-16 h-16 object-cover rounded-md" alt="Selected media" />
        <span v-else>{{ selectedMedia.name }}</span>
        <button type="button" @click="removeSelectedMedia" class="text-red-500 text-sm">حذف</button>
      </template>
      <span v-else>فایل انتخاب شده: {{ selectedMedia.name || selectedMedia }}</span>
    </div>

    <div v-if="selectedMedia && multiple && Array.isArray(selectedMedia)" class="mt-2 grid grid-cols-3 gap-2">
      <div v-for="(media, index) in selectedMedia" :key="media._id || index"
        class="relative border rounded-md p-1 flex flex-col items-center">
        <img v-if="media.mimeType && media.mimeType.startsWith('image/')" :src="media.url"
          class="w-20 h-20 object-cover rounded-md mb-1" alt="Selected media" />
        <span v-else class="text-xs text-center break-all">{{ media.name }}</span>
        <button type="button" @click="removeSelectedMedia(index)"
          class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none">
          &times;
        </button>
      </div>
    </div>


    <MediaLibraryModal
      :is-open="isModalOpen"
      :multiple="multiple"
      @close="isModalOpen = false"
      @select="handleMediaSelect"
    />
  </div>
</template>
