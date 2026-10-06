import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 

export function isUuid(value: string) {
  if (!value || typeof value !== 'string') return false
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const mongoIdPattern = /^[0-9a-f]{24}$/i
  return uuidPattern.test(value) || mongoIdPattern.test(value)
}

export function isValidId(value: string) {
  return isUuid(value)
}