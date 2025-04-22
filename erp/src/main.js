import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import api from "./lib/api";

api.init(import.meta.env.VITE_API_URL);
const app = createApp(App);
app.use(router);
app.mount("#app");
