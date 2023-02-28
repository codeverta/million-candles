import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import api from "utils/api";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const getSelf = useQuery({
    queryKey: ["self"],
    queryFn: () => {
      return api.get("auth/self");
    },
  });

  if (getSelf.isLoading || getSelf.isError) {
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
