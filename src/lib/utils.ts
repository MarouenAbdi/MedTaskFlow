import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Global badge variants for medical record types
export const typeVariants = {
  consultation: "bg-[#4B5EAA]/10 text-[#4B5EAA] dark:bg-[#4B5EAA]/20 dark:text-[#4B5EAA]/80",
  examination: "bg-[#2D8C7F]/10 text-[#2D8C7F] dark:bg-[#2D8C7F]/20 dark:text-[#2D8C7F]/80",
  procedure: "bg-[#D97706]/10 text-[#D97706] dark:bg-[#D97706]/20 dark:text-[#D97706]/80",
  test: "bg-[#6B7280]/10 text-[#6B7280] dark:bg-[#6B7280]/20 dark:text-[#6B7280]/80",
  followup: "bg-[#059669]/10 text-[#059669] dark:bg-[#059669]/20 dark:text-[#059669]/80"
} as const;

// Global badge variants for medical record statuses
export const statusVariants = {
  notstarted: "bg-[#9CA3AF]/10 text-[#9CA3AF] dark:bg-[#9CA3AF]/20 dark:text-[#9CA3AF]/80",
  onhold: "bg-[#F59E0B]/10 text-[#F59E0B] dark:bg-[#F59E0B]/20 dark:text-[#F59E0B]/80",
  pending: "bg-[#3B82F6]/10 text-[#3B82F6] dark:bg-[#3B82F6]/20 dark:text-[#3B82F6]/80",
  completed: "bg-[#10B981]/10 text-[#10B981] dark:bg-[#10B981]/20 dark:text-[#10B981]/80"
} as const;

// Global badge variants for invoice statuses
export const invoiceStatusVariants = {
  paid: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-500/80",
  processing: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-500/80",
  waiting: "bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 dark:text-orange-500/80",
  cancelled: "bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-500/80"
} as const;