import React, { useMemo } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import api from "utils/api";
import { useRouter } from "next/router";

const privateRoutes = ["/admin", "/store"];

function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isEnabled = useMemo(() => {
    return privateRoutes.find(
      (route: string) => router.pathname.indexOf(route) === 0
    );
  }, [router]);
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
    onError: (_err: any) => {},
    enabled: !!isEnabled,
  });

  if ((getSelf.isLoading || getSelf.isError) && isEnabled) {
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
