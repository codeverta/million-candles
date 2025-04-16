// router/index.js
import { createRouter, createWebHistory } from "vue-router";

// Example pages
import Dashboard from "@/pages/dashboard/index.vue";
import Login from "@/pages/auth/Login.vue";
import StockMovements from "@/pages/stock-movements/index.vue";
import Finance from "@/pages/finance/index.vue";
import SalaryRateManagementPage from "@/pages/hrms/SalaryRateManagementPage.vue";
import SalaryDetailPage from "@/pages/hrms/SalaryDetailPage.vue";
import SalaryCalculationPage from "@/pages/hrms/SalaryCalculationPage.vue";
import AttendancePage from "@/pages/hrms/AttendancePage.vue";

const routes = [
  { path: "/dashboard", name: "Home", component: Dashboard },
  { path: "/dashboard/login", name: "Login", component: Login },
  {
    path: "/dashboard/stock-movements",
    name: "StockMovements",
    component: StockMovements,
  },
  { path: "/dashboard/finance", name: "Finance", component: Finance },
  {
    path: "/dashboard/hrms/salary-rate-management",
    name: "SalaryRateManagement",
    component: SalaryRateManagementPage,
  },
  {
    path: "/dashboard/hrms/salary-detail",
    name: "SalaryDetail",
    component: SalaryDetailPage,
  },
  {
    path: "/dashboard/hrms/salary-calculation",
    name: "SalaryCalculation",
    component: SalaryCalculationPage,
  },
  {
    path: "/dashboard/hrms/attendance",
    name: "Attendance",
    component: AttendancePage,
  },
];

const router = createRouter({
  history: createWebHistory("/dashboard/"),
  routes,
});

export default router;
