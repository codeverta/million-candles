<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { useRoute } from "vue-router";
import DashboardLayout from "./layout/DashboardLayout.vue";

const route = useRoute();
</script>

<template>
  <template v-if="route.path !== '/dashboard/login'">
    <DashboardLayout />
  </template>
  <template v-else>
    <router-view />
  </template>
</template>
