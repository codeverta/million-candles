<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { useRoute } from "vue-router";
import DashboardLayout from "./layout/DashboardLayout.vue";
import { Toaster } from "@/components/ui/sonner";

const route = useRoute();
</script>

<template>
  <Toaster />
  <template v-if="route.path !== '/login'">
    <DashboardLayout />
  </template>
  <template v-else>
    <router-view />
  </template>
</template>
