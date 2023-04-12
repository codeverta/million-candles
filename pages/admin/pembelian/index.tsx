import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "utils/api";
import { Backdrop, Chip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { getOrderStatus } from "utils/orders";
import { useRouter } from "next/router";
import EnhancedTableToolbar from "components/mui/EnhancedTableToolbar";
import EnhancedTableHead from "components/mui/EnhancedTableHead";
import { getRelationship } from "utils";
import EmptyData from "components/molecules/EmptyData";

interface Data {
  "no-resi": string;
  code: string;
  destination: string;
}

type Order = "asc" | "desc";

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data | "status";
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: "no-resi",
    numeric: false,
    disablePadding: true,
    label: "No Inv",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status",
  },
];

const ordersParams = {
  "page[size]": 15,
  include: "destination-users",
};

export default function Pembelian() {
  const router = useRouter();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<any>("calories");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["orders"],
    queryFn: () => {
      return api.get("orders", { ...ordersParams });
    },
  });

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = ({ order }: any) => {
    router.push(`/admin/orders/${order.id}`);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  if (query.isError || query.isLoading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (query.data.data.data.length == 0) {
    return <EmptyData />;
  }
  return (
    <div className="pb-16">
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar
            title="Pembelian"
            numSelected={selected.length}
          />
          <TableContainer>
            <Table aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={query.data.data.data.length}
                headCells={headCells}
              />
              <TableBody>
                {query.data.data.data.map((row: any, index: number) => {
                  const isItemSelected = isSelected(row.attributes.code);
                  const labelId = `{row.id}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      onClick={() => handleRowClick({ order: row })}
                    >
                      <TableCell
                        padding="checkbox"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleClick(event, row.attributes.code);
                        }}
                      >
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.attributes.code}
                      </TableCell>
                      {/* <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        className="whitespace-nowrap"
                      >
                        {row.attributes.buyer_name ? row.attributes.buyer_name : getRelationship(query.data.data, row, 'destination-users', 'users').attributes.email}
                      </TableCell> */}
                      <TableCell align="right">
                        <Chip
                          label={getOrderStatus(row).text}
                          color={getOrderStatus(row).color}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 15, 25]}
            component="div"
            count={query.data.data.meta.page.total ?? -1}
            rowsPerPage={rowsPerPage}
            page={query.data.data.meta.page.currentPage - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </div>
  );
}
