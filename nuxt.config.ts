// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/icon", "@nuxt/ui"],
  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
  },
  plugins: ["~/plugins/dayjs.js"],

  css: ["~/assets/css/main.css", "~/assets/css/style.css"],
  app: {
    head: {
      htmlAttrs: {
        dir: "rtl",
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
