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
  { path: "/", name: "Home", component: Dashboard },
  { path: "/login", name: "Login", component: Login },
  {
    path: "/stock-movements",
    name: "StockMovements",
    component: StockMovements,
  },
  { path: "/finance", name: "Finance", component: Finance },
  {
    path: "/hrms/salary-rate-management",
    name: "SalaryRateManagement",
    component: SalaryRateManagementPage,
  },
  {
    path: "/hrms/salary-detail",
    name: "SalaryDetail",
    component: SalaryDetailPage,
  },
  {
    path: "/hrms/salary-calculation",
    name: "SalaryCalculation",
    component: SalaryCalculationPage,
  },
  {
    path: "/hrms/attendance",
    name: "Attendance",
    component: AttendancePage,
  },
];

const router = createRouter({
  history: createWebHistory("/dashboard/"),
  routes,
});

export default router;
