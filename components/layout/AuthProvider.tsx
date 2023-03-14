import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import api from "utils/api";
import { useRouter } from "next/router";

const publicRoutes = ["/", "/address", "/product", "/about"];

function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const getSelf = useQuery({
    queryKey: ["self"],
    queryFn: () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        throw new Error("Unauthenticated");
      }
      return api.get("auth/self");
    },
    onError: (err) => {
      console.log({ err });
    },
    onSuccess: (res) => {},
    enabled: !publicRoutes.includes(router.pathname),
    refetchOnWindowFocus: false,
  });

  if (
    (getSelf.isLoading || getSelf.isError) &&
    !publicRoutes.includes(router.pathname)
  ) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return <>{children}</>;
}

export default AuthProvider;
