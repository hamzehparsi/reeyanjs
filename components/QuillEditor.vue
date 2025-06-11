<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { QuillyEditor } from "vue-quilly";
import { Delta, Range } from "quill/core";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import katex from "katex";
import "katex/dist/katex.min.css";

// مقداردهی katex به window
onMounted(() => {
  (window as any).katex = katex;
});

const editor = ref<InstanceType<typeof QuillyEditor>>();
const model = ref<string>(""); // مقدار اولیه مدل
const editorDelta = ref<Delta>(); // تغییرات دلتا
const editorRange = ref<Range>(); // محدوده انتخاب

let quill: Quill | null = null;

const options = ref({
  theme: "snow",
  modules: {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ header: "1" }, { header: "2" }, "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "formula"],
      ["clean"],
    ],
  },
  placeholder: "متن خود را اینجا وارد کنید...",
  readOnly: false,
});

// همگام‌سازی model با modelValue
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

watch(
  () => props.modelValue,
  (newValue) => {
    model.value = newValue;
  }
);

onMounted(() => {
  quill = editor.value?.initialize(Quill)!;
  model.value = props.modelValue; // مقدار اولیه را از props بگیرید
});

// رویدادهای ویرایشگر
const onModelValueChange = (value: string) => {
  model.value = value; // به‌روزرسانی مدل
  emit("update:modelValue", value);
};
const onTextChange = ({ delta }: { delta: Delta }) =>
  (editorDelta.value = delta);
const onSelectionChange = ({ range }: { range: Range }) =>
  (editorRange.value = range);

// تعریف emits
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <QuillyEditor
    ref="editor"
    v-model="model"
    :options="options"
    @update:model-value="onModelValueChange"
    @text-change="onTextChange"
    @selection-change="onSelectionChange"
  />
</template>
<style>
.ql-snow .ql-picker-label::before {
  padding-right: 20px;
}
.ql-editor {
  text-align: right;
}
.ql-editor ol {
  padding-right: 1.5em;
  padding-left: 0;
}
.ql-editor .ql-ui {
  right: -20px;
}
.ql-toolbar.ql-snow + .ql-container.ql-snow {
    border-top: 0;
    box-shadow: none;
    border: 1px #ddd solid;
    border-radius: 0 0 10px 10px;
    border-top: 0;
}
.ql-toolbar.ql-snow {
  border-radius: 5px;
}
</style>
