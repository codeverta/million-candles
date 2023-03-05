import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import StoreLayout from "components/layout/StoreLayout";
import React from "react";
import SearchInput from "components/mui/SearchInput";

function CreateOrder() {
  return (
    <div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <SearchInput />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

CreateOrder.getLayout = function (page: React.ReactNode) {
  return <StoreLayout>{page}</StoreLayout>;
};

export default CreateOrder;
