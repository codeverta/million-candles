// src/services/financial-api.js
import axios from "axios";

export const financialApi = {
  // Transactions
  getTransactions(params = {}) {
    return axios.get("/financial-transactions", { params });
  },

  createTransaction(data) {
    return axios.post("/financial-transactions", data);
  },

  updateTransaction(id, data) {
    return axios.put(`/financial-transactions/${id}`, data);
  },

  deleteTransaction(id) {
    return axios.delete(`/financial-transactions/${id}`);
  },

  getTransaction(id) {
    return axios.get(`/financial-transactions/${id}`);
  },

  // Summary & Reports
  getSummary(params = {}) {
    return axios.get("/summary", { params });
  },

  // Bank Accounts
  getBankAccounts() {
    return axios.get("/bank-accounts");
  },

  // Dropdown Data (Categories, Bank Accounts, Orders)
  getDropdownData() {
    return axios.get("/dropdown-data");
  },

  createBankAccount(accountData) {
    return axios.post("/bank-accounts", accountData);
  },
};

export default financialApi;
