import React from "react";
import StoreLayout from "components/layout/StoreLayout";
import TransactionsTable from "components/molecules/TransactionsTable";

function Transactions() {
  return (
    <>
      <TransactionsTable />
    </>
  );
}

Transactions.getLayout = function (page: React.ReactNode) {
  return <StoreLayout>{page}</StoreLayout>;
};

export default Transactions;
