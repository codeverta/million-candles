import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency (IDR format)
 * @param {number|string} amount - The amount to format
 * @param {string} currency - The currency code (default: 'IDR')
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount, currency = "IDR") {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return "Rp 0";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

/**
 * Format a date to Indonesian format
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export function formatDate(date) {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(dateObj);
}

/**
 * Truncate a string if it's longer than the specified length
 * @param {string} str - The string to truncate
 * @param {number} length - Maximum length before truncating
 * @returns {string} - Truncated string with ellipsis if needed
 */
export function truncateText(str, length = 50) {
  if (!str || str.length <= length) {
    return str;
  }

  return str.substring(0, length) + "...";
}
