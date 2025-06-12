<script setup>
const route = useRoute();
const id = route.params.id;
const open = ref(false);
const deleteOpen = ref(false);
const selectedFieldId = ref(null);
const editOpen = ref(false);
const editingField = ref(null);
const contentTypeEditOpen = ref(false);
const contentTypesState = useState('contentTypes');
// import { useContentTypes } from '~/composables/useContentTypes';
const contentTypeEditForm = reactive({
  displayName: "",
});
function openEditContentTypeModal() {
  contentTypeEditForm.displayName = contentType.value.displayName || "";
  contentTypeEditOpen.value = true;
}

const editForm = reactive({
  name: "",
  label: "",
  type: "",
  optionsString: "",
  allowMultiple: false, // برای ویرایش
});
function confirmDelete(fieldId) {
  selectedFieldId.value = fieldId;
  deleteOpen.value = true;
}
function openEditModal(field) {
  editingField.value = field;
  editForm.name = field.name;
  editForm.label = field.label;
  editForm.type = field.type;
  editForm.optionsString = (field.options || []).join(", ");
  editForm.allowMultiple = field.allowMultiple || false;
  editOpen.value = true;
}
async function submitEditField() {
  const payload = {
    name: editForm.name.trim(),
    label: editForm.label.trim(),
    type: editForm.type,
    options: ["select", "multiSelect", "media"].includes(editForm.type)
      ? editForm.optionsString.split(",").map((o) => o.trim())
      : undefined,
    allowMultiple: editForm.type === "media" ? editForm.allowMultiple : undefined,
  };

  await $fetch(
    `/api/content-types/${route.params.id}/fields/${editingField.value._id}`,
    {
      method: "PUT",
      body: payload,
    }
  );

  editOpen.value = false;
  refresh();
}
const { fetchContentTypes } = useContentTypes();

async function submitEditContentType() {
  try {
    await $fetch(`/api/content-types/${id}`, {
      method: 'PUT',
      body: {
        displayName: contentTypeEditForm.displayName.trim(),
      },
    });

    contentTypeEditOpen.value = false;
    refresh(); // رفرش داده‌های صفحه فعلی
    await fetchContentTypes(); // رفرش لیست contentTypes در state مشترک
  } catch (error) {
    console.error('خطا در ویرایش نوع محتوا', error);
  }
}

const { data, pending, error, refresh } = await useFetch(
  `/api/content-types/${id}`
);
const formState = reactive({
  name: "",
  label: "",
  type: "shortText",
  optionsString: "",
  allowMultiple: false, // برای انتخاب چند فایل
});

const fieldTypes = [
  { label: "متن کوتاه", value: "shortText" },
  { label: "متن بلند", value: "longText" },
  { label: "ویرایشگر متنی", value: "richText" },
  { label: "رسانه", value: "media" },
  { label: "برچسب‌ها", value: "tags" },
  { label: "بولی", value: "boolean" },
  { label: "عدد", value: "number" },
  { label: "تاریخ", value: "date" },
  { label: "انتخاب تکی", value: "select" },
  { label: "انتخاب چندتایی", value: "multiSelect" },
];
async function submitField() {
  const payload = {
    name: formState.name.trim(),
    label: formState.label.trim(),
    type: formState.type,
    options: ["select", "multiSelect", "media"].includes(formState.type)
      ? formState.optionsString.split(",").map((o) => o.trim())
      : undefined,
    allowMultiple: formState.type === "media" ? formState.allowMultiple : undefined,
  };
  console.log('Payload being sent:', payload); // دیباگ payload
  await $fetch(`/api/content-types/${route.params.id}/fields`, {
    method: "POST",
    body: payload,
  });

  open.value = false;
  refresh();
  formState.name = "";
  formState.label = "";
  formState.type = "shortText";
  formState.optionsString = "";
  formState.allowMultiple = false;
}

definePageMeta({
  layout: "athenticate-content-builder",
  middleware: ["auth-required"],
});

const contentType = computed(() => data.value?.contentType || {});

async function deleteField(fieldId) {
  try {
    await $fetch(`/api/content-types/${route.params.id}/fields/${fieldId}`, {
      method: "DELETE",
      body: fieldId,
    });
    deleteOpen.value = false;
    refresh();
  } catch (err) {
    console.error("خطا در حذف فیلد:", err);
  }
}
</script>

<template>
  <div class="space-y-4">
    <div v-if="pending">⏳ در حال بارگذاری...</div>
    <div v-else-if="error">❌ خطا: {{ error.message }}</div>
    <div v-else>
      <div class="flex justify-between items-center w-full">
        <div class="flex flex-col gap-1 pr-3">
          <h1 class="text-xl font-bold tracking-tighter">
            {{ contentType.displayName }}
          </h1>
          <span class="text-xs text-blue-dark">{{ contentType?.collectionName }}</span>
        </div>
        <div class="flex items-center gap-3">
          <button @click="open = !open"
            class="bg-blue-light flex items-center gap-2 rounded-md text-sm tracking-tighter px-4 py-2 text-blue font-semibold hover:bg-white border transition-all duration-300 ease-in-out border-blue-nice">
            <IconsAddNote class="size-5" />
            <span class="pt-1 text-xs"> اضافه کردن فیلد </span>
          </button>
          <button @click="openEditContentTypeModal"
            class="bg-white flex items-center gap-2 rounded-md text-sm tracking-tighter px-4 py-2 text-blue font-semibold hover:bg-white border transition-all duration-300 ease-in-out border-blue-nice">
            <IconsEditIcon class="size-4" />
            <span class="pt-1 text-xs">ویرایش</span>
          </button>
        </div>
      </div>

      <div class="bg-white mt-6 rounded-xl flex p-7 w-full justify-center flex-col">
        <div v-if="contentType.fields?.length">
          <div class="divide-y-2 divide-blue-light">
            <div v-for="(field, index) in contentType.fields" :key="index">
              <div class="py-2 my-2 flex justify-between items-center">
                <div>{{ field.name }} - {{ field.type }}</div>
                <div class="flex items-center gap-2">
                  <span @click="openEditModal(field)">
                    <IconsEditIcon
                      class="size-7 p-1 rounded-lg text-blue-dark hover:bg-blue-light hover:text-blue transition-all duration-300 ease-in-out" />
                  </span>
                  <span @click="confirmDelete(field._id)">
                    <IconsDeleteIcon
                      class="size-7 p-1 rounded-lg text-blue-dark hover:bg-red-100 hover:text-red-500 transition-all duration-300 ease-in-out" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="bg-white rounded-xl flex h-96 w-full justify-center flex-col">
          <IconsNoField class="size-42 mx-auto" />
          <span class="text-sm text-blue-dark text-center">
            اولین فیلد خود را به این نوع محتوا اضافه کنید
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- modal: اضافه کردن فیلد -->
  <UModal :ui="{
    modal: {
      slots: {
        overlay: 'fixed inset-0 bg-elevated/75',
        content:
          'fixed bg-default divide-y divide-default flex flex-col focus:outline-none',
        header: 'bg-blue',
      },
    },
  }" v-model:open="open">
    <template #title>
      <div class="flex items-center gap-2">
        <div class="bg-blue text-xs text-white rounded-sm px-2 py-1">Field</div>
        <div class="text-lg tracking-tighter font-bold">
          افزودن فیلد جدید به نوع محتوا
        </div>
      </div>
    </template>
    <template #description>
      <div class="text-xs tracking-tighter text-slate-400">
        لطفاً اطلاعات فیلد را وارد نمایید
      </div>
    </template>
    <template #body>
      <div class="space-y-4">
        <!-- name -->
        <div class="flex gap-2 flex-col">
          <label class="text-xs text-right block mb-1" for="name">نام فیلد (انگلیسی)</label>
          <UInput id="name" v-model="formState.name" size="xl" variant="outline" placeholder="مثلاً: title"
            class="rounded-lg placeholder:!text-xs placeholder:!text-teal-400" required />
        </div>

        <!-- label -->
        <div class="flex gap-2 flex-col">
          <label class="text-xs text-right block mb-1" for="label">برچسب نمایشی (فارسی)</label>
          <UInput id="label" v-model="formState.label" size="xl" variant="outline" placeholder="مثلاً: عنوان"
            class="rounded-lg placeholder:!text-xs placeholder:!text-teal-400" required />
        </div>

        <!-- type -->
        <div class="flex gap-2 flex-col">
          <label class="text-xs text-right block mb-1" for="type">نوع فیلد</label>
          <USelect id="type" v-model="formState.type" size="xl" :items="fieldTypes" option-attribute="label"
            value-attribute="value" class="rounded-lg" />
        </div>

        <!-- options (select/multiSelect) -->
        <div v-if="['select', 'multiSelect'].includes(formState.type)" class="flex gap-2 flex-col">
          <label class="text-xs text-right block mb-1" for="options">گزینه‌ها (با ویرگول جدا کنید)</label>
          <UInput id="options" v-model="formState.optionsString" size="xl" variant="outline"
            placeholder="مثلاً: فعال, غیرفعال" class="rounded-lg placeholder:!text-xs placeholder:!text-teal-400" />
        </div>
        <!-- تنظیمات فیلد مدیا -->
        <div v-if="formState.type === 'media'" class="flex gap-2 flex-col">

          <UCheckbox label="اجازه انتخاب چند فایل" id="allowMultiple" v-model="formState.allowMultiple" />
        </div>
      </div>
    </template>
    <template #footer="{ close }">
      <div class="flex justify-between items-center w-full">
        <UButton @click="submitField"
          class="bg-blue-light tracking-tighter px-4 py-2 text-blue font-semibold hover:bg-white border border-blue-nice"
          color="neutral">
          افزودن فیلد
        </UButton>
        <UButton label="انصراف" color="neutral" variant="outline"
          class="bg-white px-4 py-2 text-slate-500 hover:bg-white border border-blue-nice" @click="open = !open" />
      </div>
    </template>
  </UModal>

  <!-- modal: حذف فیلد -->
  <UModal :ui="{
    modal: {
      slots: {
        overlay: 'fixed inset-0 bg-elevated/75',
        content:
          'fixed bg-default divide-y divide-default flex flex-col focus:outline-none',
        header: 'bg-blue',
      },
    },
  }" v-model:open="deleteOpen">
    <template #title>
      <div class="flex items-center gap-2">
        <div class="bg-red-500 text-xs text-white rounded-sm px-2 py-1">
          Dell
        </div>
        <div class="text-lg tracking-tighter font-bold">حذف فیلد</div>
      </div>
    </template>
    <template #description>
      <div class="text-xs tracking-tighter text-slate-400">
        شما می‌توانید در این قسمت یک نوع فیلد را حذف نمایید
      </div>
    </template>
    <template #body>
      <div class="tracking-tighter">آیا از حذف این فیلد اطمینان دارید؟</div>
    </template>
    <template #footer="{ close }">
      <div class="flex justify-between items-center w-full">
        <UButton @click="deleteField(selectedFieldId)"
          class="bg-red-50 tracking-tighter px-4 py-2 text-red-500 font-semibold hover:bg-white border border-red-200"
          color="neutral">
          حذف فیلد
        </UButton>
        <UButton label="انصراف" color="neutral" variant="outline"
          class="bg-white px-4 py-2 text-slate-500 hover:bg-white border border-blue-nice"
          @click="deleteOpen = !deleteOpen" />
      </div>
    </template>
  </UModal>
  <!-- modal: ویرایش فیلد -->
  <UModal v-model:open="editOpen">
    <template #title>
      <div class="flex items-center gap-2">
        <div class="bg-blue text-xs text-white rounded-sm px-2 py-1">Edit</div>
        <div class="text-lg font-bold">ویرایش فیلد</div>
      </div>
    </template>
    <template #body>
      <div class="space-y-4">
        <!-- مشابه فیلدهای مدال افزودن -->
        <div class="flex flex-col gap-2">
          <label class="text-xs">نام فیلد</label>
          <UInput v-model="editForm.name" />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs">برچسب نمایشی</label>
          <UInput v-model="editForm.label" />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-xs">نوع فیلد</label>
          <USelect v-model="editForm.type" :items="fieldTypes" option-attribute="label" value-attribute="value" />
        </div>

        <div v-if="['select', 'multiSelect'].includes(editForm.type)" class="flex flex-col gap-2">
          <label class="text-xs">گزینه‌ها (با ویرگول جدا کنید)</label>
          <UInput v-model="editForm.optionsString" />
        </div>
        <div v-if="formState.type === 'media'" class="flex gap-2 flex-col">
          <label class="text-xs text-right block mb-1" for="allowMultiple">اجازه انتخاب چند فایل</label>
          <UCheckbox id="allowMultiple" v-model="formState.allowMultiple" />
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex justify-between items-center w-full">
        <UButton @click="submitEditField"
          class="bg-blue-light tracking-tighter px-4 py-2 text-blue font-semibold hover:bg-white border border-blue-nice">
          ذخیره تغییرات
        </UButton>
        <UButton @click="editOpen = !editOpen" variant="outline"
          class="bg-white px-4 py-2 !text-slate-400 hover:bg-white border !border-blue-nice">
          انصراف
        </UButton>
      </div>
    </template>
  </UModal>
  <!-- modal ویرایش خود نوع محتوا -->
  <UModal v-model:open="contentTypeEditOpen">
    <template #title>
      <div class="flex items-center gap-2">
        <div class="bg-blue text-xs text-white rounded-sm px-2 py-1">Edit</div>
        <div class="text-lg font-bold">ویرایش نوع محتوا</div>
      </div>
    </template>

    <template #body>
      <div class="space-y-4">
        <div class="flex flex-col gap-2">
          <label class="text-xs">نام نمایشی نوع محتوا</label>
          <UInput v-model="contentTypeEditForm.displayName" />
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex justify-between items-center w-full">
        <UButton @click="submitEditContentType"
          class="bg-blue-light tracking-tighter px-4 py-2 text-blue font-semibold hover:bg-white border border-blue-nice">
          ذخیره تغییرات
        </UButton>
        <UButton label="انصراف" color="neutral" variant="outline"
          class="bg-white px-4 py-2 text-slate-500 hover:bg-white border border-blue-nice"
          @click="contentTypeEditOpen = !contentTypeEditOpen" />
      </div>
    </template>
  </UModal>
</template>
