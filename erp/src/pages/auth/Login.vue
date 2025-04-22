<script lang="ts">
export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image.";
export const iframeHeight = "800px";
export const containerClass = "w-full h-full p-4 lg:p-0";
</script>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "vue-sonner";
import axios from "axios";
import router from "@/router";

const isLoading = ref(false);
const formData = reactive({
  email: "",
  password: "",
});

const loginError = ref("");

async function handleLogin() {
  isLoading.value = true;
  loginError.value = "";

  try {
    const response = await axios.post(
      "/auth/login",
      {
        data: {
          type: "users",
          attributes: {
            email: formData.email,
            password: formData.password,
          },
          meta: {
            device_name: navigator.userAgent || "Mozilla",
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.me));
      localStorage.setItem("roles", JSON.stringify(data.roles));
      localStorage.setItem("permissions", JSON.stringify(data.permissions));

      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.me.name}!`,
        variant: "success",
      });

      router.push({
        name: "Home",
      });
    } else {
      const errorMessage =
        data.errors?.[0]?.detail ||
        "Login failed. Please check your credentials.";
      loginError.value = errorMessage;

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  } catch (error: any) {
    console.error("Login error:", error);
    const errorMessage =
      error.response?.data?.errors?.[0]?.detail ||
      "Network error. Please try again later.";
    loginError.value = errorMessage;

    toast.toast({
      title: "Connection Error",
      description: errorMessage,
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div
    class="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]"
  >
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">Login</h1>
          <p class="text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <form @submit.prevent="handleLogin" class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              v-model="formData.email"
              placeholder="m@example.com"
              required
              autocomplete="email"
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
              <a
                href="/forgot-password"
                class="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              v-model="formData.password"
              required
              autocomplete="current-password"
            />
          </div>

          <div v-if="loginError" class="text-red-500 text-sm mt-1">
            {{ loginError }}
          </div>

          <Button type="submit" class="w-full" :disabled="isLoading">
            <span v-if="isLoading" class="mr-2">
              <!-- Simple loading spinner -->
              <svg
                class="animate-spin h-4 w-4 mr-1 inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {{ isLoading ? "Logging in..." : "Login" }}
          </Button>
          <Button variant="outline" type="button" class="w-full">
            Login with Google
          </Button>
        </form>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <a href="/register" class="underline"> Sign up </a>
        </div>
      </div>
    </div>
    <div class="hidden bg-muted lg:block">
      <img
        src="https://picsum.photos/1920/1080"
        alt="Cover"
        class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </div>
</template>
