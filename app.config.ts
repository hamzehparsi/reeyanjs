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
        header:
          "flex items-center gap-1.5 p-4 sm:px-6 min-h-16 bg-khakestari rounded-xl rounded-b-none",
        footer: "bg-khakestari rounded-xl rounded-t-none",
      },
    },
    input: {
      slots: {
        root: "relative inline-flex items-center",
        base: [
          "w-full rounded-lg focus-visible:!ring-blue placeholder:text-xs focus:outline-none disabled:cursor-not-allowed disabled:opacity-75",
          "transition-colors",
        ],
        size: {
          sm: {
            trailingIcon: "size-10",
          },
        },
      },
    },
    switch: {
      slots: {
        root: "relative flex items-start",
        base: [
          "inline-flex items-center shrink-0 rounded-full border-2 border-transparent focus-visible:outline-2 focus-visible:outline-offset-2 data-[state=unchecked]:bg-accented",
          "transition-[background] duration-200",
        ],
        container: "flex items-center",
        thumb:
          "group pointer-events-none rounded-full bg-default shadow-lg ring-0 transition-transform duration-200 data-[state=unchecked]:translate-x-0 data-[state=unchecked]:rtl:-translate-x-0 flex items-center justify-center",
        icon: [
          "absolute shrink-0 group-data-[state=unchecked]:text-dimmed opacity-0 size-10/12",
          "transition-[color,opacity] duration-200",
        ],
        wrapper: "ms-2",
        label: "block font-medium text-default",
        description: "text-muted",
      },
      variants: {
        color: {
          primary: {
            base: "data-[state=checked]:bg-blue focus-visible:outline-primary",
            icon: "group-data-[state=checked]:text-primary",
          },
          secondary: {
            base: "data-[state=checked]:bg-secondary focus-visible:outline-secondary",
            icon: "group-data-[state=checked]:text-secondary",
          },
          success: {
            base: "data-[state=checked]:bg-success focus-visible:outline-success",
            icon: "group-data-[state=checked]:text-success",
          },
          info: {
            base: "data-[state=checked]:bg-info focus-visible:outline-info",
            icon: "group-data-[state=checked]:text-info",
          },
          warning: {
            base: "data-[state=checked]:bg-warning focus-visible:outline-warning",
            icon: "group-data-[state=checked]:text-warning",
          },
          error: {
            base: "data-[state=checked]:bg-error focus-visible:outline-error",
            icon: "group-data-[state=checked]:text-error",
          },
          neutral: {
            base: "data-[state=checked]:bg-inverted focus-visible:outline-inverted",
            icon: "group-data-[state=checked]:text-highlighted",
          },
        },
        size: {
          xs: {
            base: "w-7",
            container: "h-4",
            thumb:
              "size-3 data-[state=checked]:translate-x-3 data-[state=checked]:rtl:-translate-x-3",
            wrapper: "text-xs",
          },
          sm: {
            base: "w-8",
            container: "h-4",
            thumb:
              "size-3.5 data-[state=checked]:translate-x-3.5 data-[state=checked]:rtl:-translate-x-3.5",
            wrapper: "text-xs",
          },
          md: {
            base: "w-9",
            container: "h-5",
            thumb:
              "size-4 data-[state=checked]:translate-x-4 data-[state=checked]:rtl:-translate-x-4",
            wrapper: "text-sm",
          },
          lg: {
            base: "w-10",
            container: "h-5",
            thumb:
              "size-4.5 data-[state=checked]:translate-x-4.5 data-[state=checked]:rtl:-translate-x-4.5",
            wrapper: "text-sm",
          },
          xl: {
            base: "w-11",
            container: "h-6",
            thumb:
              "size-5 data-[state=checked]:translate-x-5 data-[state=checked]:rtl:-translate-x-5",
            wrapper: "text-base",
          },
        },
        checked: {
          true: {
            icon: "group-data-[state=checked]:opacity-100",
          },
        },
        unchecked: {
          true: {
            icon: "group-data-[state=unchecked]:opacity-100",
          },
        },
        loading: {
          true: {
            icon: "animate-spin",
          },
        },
        required: {
          true: {
            label: "after:content-['*'] after:ms-0.5 after:text-error",
          },
        },
        disabled: {
          true: {
            base: "cursor-not-allowed opacity-75",
            label: "cursor-not-allowed opacity-75",
            description: "cursor-not-allowed opacity-75",
          },
        },
      },
      defaultVariants: {
        color: "primary",
        size: "md",
      },
    },
    select: {
      slots: {
        base: [
          "relative text-xs group rounded-md inline-flex items-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-75",
          "transition-colors",
        ],
        leading: "absolute inset-y-0 start-0 flex items-center",
        leadingIcon: "shrink-0 text-dimmed",
        leadingAvatar: "shrink-0",
        leadingAvatarSize: "",
        trailing: "absolute inset-y-0 end-0 flex items-center",
        trailingIcon: "shrink-0 text-dimmed",
        value: "truncate pointer-events-none",
        placeholder: "truncate text-dimmed",
        arrow: "fill-default",
        content:
          "max-h-60 w-(--reka-select-trigger-width) bg-default shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-select-content-transform-origin) pointer-events-auto flex flex-col",
        viewport:
          "relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1",
        group: "p-1 isolate",
        empty: "py-2 text-center text-sm text-muted",
        label: "font-semibold text-highlighted",
        separator: "-mx-1 my-1 h-px bg-border",
        item: [
          "group relative text-xs w-full flex items-center select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50",
          "transition-colors before:transition-colors",
        ],
        itemLeadingIcon: [
          "shrink-0 text-dimmed group-data-highlighted:not-group-data-disabled:text-default",
          "transition-colors",
        ],
        itemLeadingAvatar: "shrink-0",
        itemLeadingAvatarSize: "",
        itemLeadingChip: "shrink-0",
        itemLeadingChipSize: "",
        itemTrailing: "ms-auto inline-flex gap-1.5 items-center",
        itemTrailingIcon: "shrink-0",
        itemLabel: "truncate",
      },
      variants: {
        buttonGroup: {
          horizontal:
            "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
          vertical:
            "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]",
        },
        size: {
          xs: {
            base: "px-2 py-1 text-xs gap-1",
            leading: "ps-2",
            trailing: "pe-2",
            leadingIcon: "size-4",
            leadingAvatarSize: "3xs",
            trailingIcon: "size-4",
            label: "p-1 text-[10px]/3 gap-1",
            item: "p-1 text-xs gap-1",
            itemLeadingIcon: "size-4",
            itemLeadingAvatarSize: "3xs",
            itemLeadingChip: "size-4",
            itemLeadingChipSize: "sm",
            itemTrailingIcon: "size-4",
          },
          sm: {
            base: "px-2.5 py-1.5 text-xs gap-1.5",
            leading: "ps-2.5",
            trailing: "pe-2.5",
            leadingIcon: "size-4",
            leadingAvatarSize: "3xs",
            trailingIcon: "size-4",
            label: "p-1.5 text-[10px]/3 gap-1.5",
            item: "p-1.5 text-xs gap-1.5",
            itemLeadingIcon: "size-4",
            itemLeadingAvatarSize: "3xs",
            itemLeadingChip: "size-4",
            itemLeadingChipSize: "sm",
            itemTrailingIcon: "size-4",
          },
          md: {
            base: "px-2.5 py-1.5 text-sm gap-1.5",
            leading: "ps-2.5",
            trailing: "pe-2.5",
            leadingIcon: "size-5",
            leadingAvatarSize: "2xs",
            trailingIcon: "size-5",
            label: "p-1.5 text-xs gap-1.5",
            item: "p-1.5 text-sm gap-1.5",
            itemLeadingIcon: "size-5",
            itemLeadingAvatarSize: "2xs",
            itemLeadingChip: "size-5",
            itemLeadingChipSize: "md",
            itemTrailingIcon: "size-5",
          },
          lg: {
            base: "px-3 py-2 text-xs gap-2",
            leading: "ps-3",
            trailing: "pe-3",
            leadingIcon: "size-5",
            leadingAvatarSize: "2xs",
            trailingIcon: "size-5",
            label: "p-2 text-xs gap-2",
            item: "p-2 text-xs gap-2",
            itemLeadingIcon: "size-5",
            itemLeadingAvatarSize: "2xs",
            itemLeadingChip: "size-5",
            itemLeadingChipSize: "md",
            itemTrailingIcon: "size-5",
          },
          xl: {
            base: "p-2.5 text-sm gap-2",
            leading: "ps-3",
            trailing: "pe-3",
            leadingIcon: "size-6",
            leadingAvatarSize: "xs",
            trailingIcon: "size-6",
            label: "p-2 text-xs gap-2",
            item: "p-2 text-sm gap-2",
            itemLeadingIcon: "size-6",
            itemLeadingAvatarSize: "xs",
            itemLeadingChip: "size-6",
            itemLeadingChipSize: "lg",
            itemTrailingIcon: "size-6",
          },
        },
        variant: {
          outline: "text-highlighted bg-default ring ring-inset ring-accented",
          soft: "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
          subtle: "text-highlighted bg-elevated ring ring-inset ring-accented",
          ghost:
            "text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
          none: "text-highlighted bg-transparent",
        },
        color: {
          primary: "",
          secondary: "",
          success: "",
          info: "",
          warning: "",
          error: "",
          neutral: "",
        },
        leading: {
          true: "",
        },
        trailing: {
          true: "",
        },
        loading: {
          true: "",
        },
        highlight: {
          true: "",
        },
        type: {
          file: "file:me-1.5 file:font-medium file:text-muted file:outline-none",
        },
      },
      compoundVariants: [
        {
          color: "primary",
          variant: ["outline", "subtle"],
          class:
            "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
        },
        {
          color: "primary",
          highlight: true,
          class: "ring ring-inset ring-primary",
        },
        {
          color: "neutral",
          variant: ["outline", "subtle"],
          class:
            "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted",
        },
        {
          color: "neutral",
          highlight: true,
          class: "ring ring-inset ring-inverted",
        },
        {
          leading: true,
          size: "xs",
          class: "ps-7",
        },
        {
          leading: true,
          size: "sm",
          class: "ps-8",
        },
        {
          leading: true,
          size: "md",
          class: "ps-9",
        },
        {
          leading: true,
          size: "lg",
          class: "ps-10",
        },
        {
          leading: true,
          size: "xl",
          class: "ps-11",
        },
        {
          trailing: true,
          size: "xs",
          class: "pe-7",
        },
        {
          trailing: true,
          size: "sm",
          class: "pe-8",
        },
        {
          trailing: true,
          size: "md",
          class: "pe-9",
        },
        {
          trailing: true,
          size: "lg",
          class: "pe-10",
        },
        {
          trailing: true,
          size: "xl",
          class: "pe-11",
        },
        {
          loading: true,
          leading: true,
          class: {
            leadingIcon: "animate-spin",
          },
        },
        {
          loading: true,
          leading: false,
          trailing: true,
          class: {
            trailingIcon: "animate-spin",
          },
        },
      ],
      defaultVariants: {
        size: "md",
        color: "primary",
        variant: "outline",
      },
    },
  },
});
