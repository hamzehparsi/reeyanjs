import Vue3PersianDatetimePicker from "vue3-persian-datetime-picker";
// import 'vue3-persian-datetime-picker/src/picker/assets/scss/style.scss';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("DatePicker", Vue3PersianDatetimePicker);
});
