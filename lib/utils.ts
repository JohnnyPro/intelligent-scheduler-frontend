import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ApiErrorData } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  if (typeof date === "string") {
    return date
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date)
}

export function generateTimeSlots() {
  const slots = []
  for (let hour = 8; hour <= 20; hour++) {
    slots.push(`${hour}:00`)
    if (hour < 20) {
      slots.push(`${hour}:30`)
    }
  }
  return slots
}

export function generateWeekDays() {
  return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
}


export class ApiClientError extends Error {
  public status: number;
  public data: ApiErrorData;

  constructor(message: string, status: number, data: ApiErrorData = {}) {
    super(message);
    this.name = 'ApiClientError';

    this.status = status;
    this.data = data;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiClientError);
    }
  }
}
