/**
 * Date utility functions using environment variables for configuration
 */

// Get date format from environment variable with fallback
export const getDateFormat = () => {
  return process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";
};

// Get minimum birth year from environment variable with fallback
export const getMinBirthYear = () => {
  return parseInt(process.env.NEXT_PUBLIC_MIN_BIRTH_YEAR || "1900");
};

// Get locale from environment variable with fallback
export const getLocale = () => {
  return process.env.NEXT_PUBLIC_LOCALE || "en-US";
};

// Get current year
export const getCurrentYear = () => {
  return new Date().getFullYear();
};

// Generate years array for birth date picker
export const generateYearsArray = () => {
  const currentYear = getCurrentYear();
  const minYear = getMinBirthYear();
  const arr = [];
  for (let y = currentYear; y >= minYear; y--) {
    arr.push(y);
  }
  return arr;
};

// Format date using configured format
export const formatDate = (date) => {
  if (!date) return "";
  
  const { format } = require("date-fns");
  return format(date, getDateFormat());
};

// Check if date is in the future (for birth date validation)
export const isDateInFuture = (date) => {
  return date > new Date();
};

// Get month name in configured locale
export const getMonthName = (date) => {
  return date.toLocaleString(getLocale(), { month: "short" });
}; 