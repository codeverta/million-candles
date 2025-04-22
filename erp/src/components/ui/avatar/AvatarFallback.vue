<script setup>
import { cn } from "@/lib/utils";
import { AvatarFallback } from "reka-ui";
import { computed } from "vue";

const props = defineProps({
  delayMs: { type: Number, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
});

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <AvatarFallback
    data-slot="avatar-fallback"
    v-bind="delegatedProps"
    :class="
      cn(
        'bg-muted flex size-full items-center justify-center rounded-full',
        props.class
      )
    "
  >
    <slot />
  </AvatarFallback>
</template>
