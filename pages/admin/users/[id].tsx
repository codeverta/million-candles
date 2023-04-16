import { Chip, Table, TableBody, TableCell, TableRow } from "@mui/material";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "utils/api";
import { useRouter } from "next/router";
import LoadingBackdrop from "components/mui/LoadingBackdrop";
import AdminLayout from "components/layout/AdminLayout";

function UserDetail() {
  const router = useRouter();
  const getUsers = useQuery({
    queryKey: ["users", "detail"],
    queryFn: () => {
      return api.get(`users/${router.query.id}`);
    },
  });

  if (getUsers.isError || getUsers.isLoading) {
    return <LoadingBackdrop />;
  }

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>Nama</TableCell>
          <TableCell>{getUsers.data.data.data.attributes.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Email</TableCell>
          <TableCell>{getUsers.data.data.data.attributes.email}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Status</TableCell>
          <TableCell>
            {getUsers.data.data.data.attributes.is_active ? (
              <Chip label="Aktif" color="primary" />
            ) : (
              <Chip label="Tidak Aktif" color="error" />
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

UserDetail.getLayout = (page: React.ReactNode) => {
  return <AdminLayout>{page}</AdminLayout>;
};

export default UserDetail;
