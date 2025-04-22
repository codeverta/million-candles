<script setup>
import NavMain from "@/components/NavMain.vue";
import NavUser from "@/components/NavUser.vue";
import TeamSwitcher from "@/components/TeamSwitcher.vue";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SquareTerminal,
  Wallet,
} from "lucide-vue-next";

const props = defineProps({
  side: { type: String, required: false },
  variant: { type: String, required: false },
  collapsible: { type: String, required: false, default: "icon" },
  class: { type: null, required: false },
});

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: SquareTerminal,
      isActive: false,
    },
    {
      title: "Inventory",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Stock Levels",
          url: "#",
        },
        {
          title: "Suppliers",
          url: "#",
        },
        {
          title: "Categories",
          url: "#",
        },
      ],
    },
    {
      title: "Stock Movements",
      url: "/stock-movements",
      icon: SquareTerminal,
      isActive: false,
    },
    {
      title: "Finance",
      url: "/finance",
      icon: Wallet,
      isActive: false,
    },
    {
      title: "HRMS",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Salary Rate Management",
          url: "/hrms/salary-rate-management",
        },
        {
          title: "Salary Detail",
          url: "/hrms/salary-detail",
        },
        {
          title: "Salary Calculation",
          url: "/hrms/salary-calculation",
        },
        {
          title: "Attendance",
          url: "/hrms/attendance",
        },
      ],
    },
    // {
    //   title: 'Settings',
    //   url: '#',
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: 'General',
    //       url: '#',
    //     },
    //     {
    //       title: 'Team',
    //       url: '#',
    //     },
    //     {
    //       title: 'Billing',
    //       url: '#',
    //     },
    //     {
    //       title: 'Limits',
    //       url: '#',
    //     },
    //   ],
    // },
  ],
  projects: [
    {
      name: "Warehouse Management",
      url: "#",
      icon: Frame,
    },
    {
      name: "Financial Analysis",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Employee Engagement",
      url: "#",
      icon: Map,
    },
  ],
};
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <TeamSwitcher :teams="data.teams" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
      <!-- <NavProjects :projects="data.projects" /> -->
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
