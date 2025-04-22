<script setup>
import { cn } from "@/lib/utils";
import { Primitive } from "reka-ui";

const props = defineProps({
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false, default: "a" },
  class: { type: null, required: false },
});
</script>

<template>
  <Primitive
    data-slot="breadcrumb-link"
    :as="as"
    :as-child="asChild"
    :class="cn('hover:text-foreground transition-colors', props.class)"
  >
    <slot />
  </Primitive>
</template>
