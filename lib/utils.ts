import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
