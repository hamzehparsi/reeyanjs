<!-- components\MediaUploadInput.vue -->
<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: [String, Array, Object], default: null },
  label: { type: String, default: "انتخاب فایل/تصویر" },
  multiple: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const showMediaControls = ref(false);
const selectedForSelection = ref([]);
const selectedMedia = ref([]);
const activeTab = ref("upload");
const uploadedFile = ref(null);
const isLoading = ref(false);
const mediaItems = ref([]);
// const toast = useToast();

// بارگذاری اولیه رسانه‌ها
async function fetchMediaItems() {
  isLoading.value = true;
  try {
    const response = await $fetch("/api/media", { method: "GET" });
    mediaItems.value = response.mediaItems || [];
  } catch (error) {
    console.error("❌ خطا در دریافت فایل‌ها:", error);
    // toast.add({ title: `خطا در دریافت فایل‌ها: ${error.data?.message || error.message}`, color: 'red' });
  } finally {
    isLoading.value = false;
  }
}

// همگام‌سازی modelValue با selectedForSelection
watch(
  () => [props.modelValue, mediaItems.value],
  ([newValue, mediaItems]) => {
    if (!mediaItems || mediaItems.length === 0) return; // منتظر بارگذاری mediaItems

    if (props.multiple && Array.isArray(newValue)) {
      selectedForSelection.value = newValue
        .map((id) => mediaItems.find((item) => item._id === id))
        .filter((item) => item !== undefined); // فقط موارد معتبر
    } else if (!props.multiple && newValue) {
      const media = mediaItems.find((item) => item._id === newValue);
      selectedForSelection.value = media ? [media] : [];
    } else {
      selectedForSelection.value = [];
    }
    selectedMedia.value = selectedForSelection.value; // همگام‌سازی selectedMedia
    console.log("watch: selectedForSelection", selectedForSelection.value);
  },
  { immediate: true, deep: true }
);

// آپلود فایل
async function handleFileUpload(event) {
  if (props.multiple) {
    uploadedFile.value = Array.from(event.target.files);
    console.log(
      "handleFileUpload: selected multiple files",
      uploadedFile.value
    );
  } else {
    uploadedFile.value = event.target.files[0];
    console.log("handleFileUpload: selected single file", uploadedFile.value);
  }
}

async function uploadFile() {
  if (
    !uploadedFile.value ||
    (Array.isArray(uploadedFile.value) && uploadedFile.value.length === 0)
  ) {
    // toast.add({ title: 'فایلی انتخاب نشده است', color: 'red' });
    return;
  }

  isLoading.value = true;
  const filesToUpload = Array.isArray(uploadedFile.value)
    ? uploadedFile.value
    : [uploadedFile.value];
  const uploadedMediaResponses = [];

  try {
    for (const file of filesToUpload) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await $fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      uploadedMediaResponses.push(response.media);
    }

    // toast.add({ title: 'فایل(ها) با موفقیت آپلود شد', color: 'green' });
    uploadedFile.value = null;

    if (props.multiple) {
      selectedForSelection.value = [
        ...selectedForSelection.value,
        ...uploadedMediaResponses,
      ];
    } else {
      selectedForSelection.value = [uploadedMediaResponses[0]];
    }
    selectedMedia.value = selectedForSelection.value;
    console.log("uploadFile: selectedForSelection", selectedForSelection.value);

    // ارسال فوری مقدار
    confirmSelection();

    await fetchMediaItems();
    activeTab.value = "library";
  } catch (error) {
    console.error("❌ خطا در آپلود فایل:", error);
    // toast.add({ title: `خطا در آپلود: ${error.data?.message || error.message}`, color: 'red' });
  } finally {
    isLoading.value = false;
  }
}

function selectMedia(media) {
  if (props.multiple) {
    const index = selectedForSelection.value.findIndex(
      (item) => item._id === media._id
    );
    if (index === -1) {
      selectedForSelection.value.push(media);
    } else {
      selectedForSelection.value.splice(index, 1);
    }
    selectedMedia.value = selectedForSelection.value;
    // ارسال فوری مقدار برای گالری
    const value = selectedForSelection.value
      .map((item) => item._id)
      .filter((id) => id);
    console.log("selectMedia: emitting value for gallery", value); // لاگ برای دیباگ
    emit("update:modelValue", value);
  } else {
    selectedForSelection.value = [media];
    selectedMedia.value = [media];
    console.log("selectMedia: emitting single media _id", media._id);
    emit("update:modelValue", media._id);
    showMediaControls.value = false;
  }
}

function isMediaSelected(media) {
  return selectedForSelection.value.some((item) => item._id === media._id);
}
function confirmSelection() {
  const value = props.multiple
    ? selectedForSelection.value.map((item) => item._id).filter((id) => id) // فقط _idهای معتبر
    : selectedForSelection.value[0]?._id || null;
  console.log("confirmSelection: emitting value", value); // لاگ برای دیباگ
  emit("update:modelValue", value);
  showMediaControls.value = false;
}

function removeSelectedMedia(index) {
  if (!props.multiple) {
    selectedMedia.value = [];
    selectedForSelection.value = [];
    emit("update:modelValue", null);
  } else if (Array.isArray(selectedMedia.value)) {
    selectedMedia.value.splice(index, 1);
    selectedForSelection.value = selectedMedia.value;
    emit(
      "update:modelValue",
      selectedMedia.value.map((item) => item._id)
    );
  }
}

onMounted(() => {
  fetchMediaItems();
});
</script>

<template>
  <div>
    <UButton
      block
      type="button"
      @click="showMediaControls = !showMediaControls"
      class="bg-blue text-white p-2.5 mt-3 rounded-lg hover:bg-blue-light duration-300 ease-in-out hover:text-blue cursor-pointer transition-colors"
    >
      <div class="flex items-center gap-2">
        <IconsImage class="size-6" />
        <span>{{ label }}</span>
      </div>
    </UButton>

    <div
      v-if="selectedMedia.length && props.multiple"
      class="mt-2 grid grid-cols-3 gap-2"
    >
      <div
        v-for="(media, index) in selectedMedia"
        :key="media._id || index"
        class="relative border border-slate-300 rounded-md p-1 flex flex-col items-center"
      >
        <img
          v-if="media.mimeType && media.mimeType.startsWith('image/')"
          :src="media.url"
          class="w-full h-24 object-cover rounded-md mb-1"
          alt="Selected media"
        />
        <span v-else class="text-xs text-center break-all">{{
          media.filename
        }}</span>
        <button
          type="button"
          @click="removeSelectedMedia(index)"
          class="absolute top-3 right-3 bg-red-500 text-white rounded-lg p-0.5 text-xs leading-none"
        >
          <IconsDeleteIcon class="p-0.5 size-6" />
        </button>
      </div>
    </div>
    <div
      v-else-if="selectedMedia.length && !props.multiple"
      class="mt-2 relative"
    >
      <template v-if="selectedMedia[0]?.url">
        <img
          v-if="
            selectedMedia[0].mimeType &&
            selectedMedia[0].mimeType.startsWith('image/')
          "
          :src="selectedMedia[0].url"
          class="w-full h-64 z-0 object-cover rounded-md"
          alt="Selected media"
        />
        <span v-else>{{ selectedMedia[0].filename }}</span>
        <button
          type="button"
          @click="removeSelectedMedia(0)"
          class="text-red-500 text-sm absolute left-5 top-5 z-10"
        >
          <IconsDeleteIcon class="bg-white p-1 rounded-lg text-red-500" />
        </button>
      </template>
      <span v-else
        >فایل انتخاب شده:
        {{ selectedMedia[0]?.filename || selectedMedia[0] }}</span
      >
    </div>

    <div
      v-if="showMediaControls"
      class="mt-4 border border-slate-300 rounded-lg overflow-hidden"
    >
      <div class="flex flex-col">
        <div class="w-full p-4 border-l border-gray-200 dark:border-gray-700">
          <UButton
            :variant="activeTab === 'upload' ? 'solid' : 'ghost'"
            block
            :class="`justify-start mb-2 p-3 transition-all duration-300 ease-in-out hover:bg-blue-light hover:text-blue ${
              activeTab === 'upload'
                ? 'bg-blue font-bold text-white'
                : 'bg-transparent'
            }`"
            @click="activeTab = 'upload'"
          >
            بارگذاری فایل
          </UButton>

          <UButton
            :variant="activeTab === 'library' ? 'solid' : 'ghost'"
            block
            :class="`justify-start p-3 transition-all duration-300 ease-in-out hover:bg-blue-light hover:text-blue ${
              activeTab === 'library'
                ? 'bg-blue font-bold text-white'
                : 'bg-transparent'
            }`"
            @click="activeTab = 'library'"
          >
            تصاویر موجود
          </UButton>
        </div>

        <div class="w-full p-4">
          <div v-if="activeTab === 'upload'">
            <h4 class="text-sm font-bold tracking-tighter mb-4">
              بارگذاری فایل جدید
            </h4>
            <div
              class="border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
              @click="$refs.fileInput.click()"
            >
              <input
                type="file"
                ref="fileInput"
                @change="handleFileUpload"
                :multiple="multiple"
                class="hidden"
              />
              <p
                v-if="uploadedFile && !Array.isArray(uploadedFile)"
                class="mt-2 text-sm bg-blue text-gray-700 dark:text-gray-300"
              >
                انتخاب شده: {{ uploadedFile.name }}
              </p>
              <p
                v-else-if="uploadedFile && Array.isArray(uploadedFile)"
                class="mt-2 text-sm text-gray-700 dark:text-gray-300"
              >
                انتخاب شده: {{ uploadedFile.length }} فایل
              </p>
            </div>
            <UButton
              class="mt-4"
              block
              :class="
                !uploadedFile ||
                (Array.isArray(uploadedFile) && uploadedFile.length === 0) ||
                isLoading
                  ? 'bg-blue px-4 py-2'
                  : 'bg-blue px-4 py-2'
              "
              @click="uploadFile"
              :loading="isLoading"
              :disabled="
                !uploadedFile ||
                (Array.isArray(uploadedFile) && uploadedFile.length === 0) ||
                isLoading
              "
            >
              آپلود
            </UButton>
          </div>
          <div v-if="activeTab === 'library'">
            <h4 class="text-sm tracking-tighter font-bold mb-4">
              کتابخانه موجود
            </h4>
            <div v-if="isLoading" class="text-center py-8">
              <p>در حال بارگذاری فایل‌ها...</p>
            </div>
            <div v-else-if="mediaItems.length === 0" class="text-center py-8">
              <p>هیچ فایلی یافت نشد.</p>
            </div>
            <div v-else class="grid grid-cols-3 gap-4">
              <div
                v-for="media in mediaItems"
                :key="media._id"
                class="relative border border-slate-300 rounded-lg overflow-hidden cursor-pointer"
                :class="{
                  'border-blue ring-2 ring-blue': isMediaSelected(media),
                }"
                @click="selectMedia(media)"
              >
                <img
                  v-if="media.mimeType && media.mimeType.startsWith('image/')"
                  :src="media.url"
                  class="w-full h-24 object-cover"
                  alt="Media item"
                />
                <div
                  v-else
                  class="w-full h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-700"
                >
                  <UIcon
                    name="i-heroicons-document"
                    class="w-16 h-16 text-gray-400"
                  />
                </div>
                <div class="p-2 text-xs text-slate-500 truncate">
                  {{ media.filename }}
                </div>
                <div
                  v-if="isMediaSelected(media)"
                  class="absolute top-1 left-1 bg-blue text-white rounded-xl p-0.5 text-xs"
                >
                  <IconsCheck class="p-0.5 rounded-lg text-white size-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="props.multiple"
        class="flex justify-end space-x-2 p-4 border-t border-slate-300"
      >
        <UButton color="gray" variant="ghost" @click="showMediaControls = false"
          >بستن</UButton
        >
        <UButton
          class="bg-blue px-4 py-2"
          @click="confirmSelection"
          :disabled="selectedForSelection.length === 0"
        >
          انتخاب ({{ selectedForSelection.length }})
        </UButton>
      </div>
    </div>
  </div>
</template>
