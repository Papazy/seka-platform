import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateForInput = (dateString: string | Date): string => {
  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;

    if (isNaN(date.getTime())) {
      console.warn("Invalid date for input:", dateString);
      return "";
    }

    // Method 1: Using timezone offset (simple)
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
  } catch (error) {
    console.error("Error formatting date for input:", error);
    return "";
  }
};

export const parseInputDateToISO = (inputValue: string): string => {
  try {
    if (!inputValue) return "";

    // datetime-local input value is in format: YYYY-MM-DDTHH:mm
    // This represents local time, so we create Date object which will be in local timezone
    const localDate = new Date(inputValue);

    if (isNaN(localDate.getTime())) {
      console.warn("Invalid input date value:", inputValue);
      return "";
    }

    // Convert to ISO string (UTC)
    return localDate.toISOString();
  } catch (error) {
    console.error("Error parsing input date:", error);
    return "";
  }
};
