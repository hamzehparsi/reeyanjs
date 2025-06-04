export default defineAppConfig({
  ui: {
    colors: {
      primary: "blue",
      neutral: "zinc",
    },
    modal: {
      slots: {
        overlay: "fixed inset-0 bg-slate-700/25",
        content:
          "fixed bg-default divide-y divide-default flex flex-col focus:outline-none",
        header: "flex items-center gap-1.5 p-4 sm:px-6 min-h-16 bg-khakestari rounded-xl rounded-b-none",
        footer: "bg-khakestari rounded-xl rounded-t-none",
      },
    },
  },
});
