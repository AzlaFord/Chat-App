
export const getDateFormat = () => {
  return process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";
};

export const getMinBirthYear = () => {
  return parseInt(process.env.NEXT_PUBLIC_MIN_BIRTH_YEAR || "1900");
};

export const getLocale = () => {
  return process.env.NEXT_PUBLIC_LOCALE || "en-US";
};

export const getCurrentYear = () => {
  return new Date().getFullYear();
};

export const generateYearsArray = () => {
  const currentYear = getCurrentYear();
  const minYear = getMinBirthYear();
  const arr = [];
  for (let y = currentYear; y >= minYear; y--) {
    arr.push(y);
  }
  return arr;
};

export const formatDate = (date) => {
  if (!date) return "";
  
  const { format } = require("date-fns");
  return format(date, getDateFormat());
};

export const isDateInFuture = (date) => {
  return date > new Date();
};

export const getMonthName = (date) => {
  return date.toLocaleString(getLocale(), { month: "short" });
}; 