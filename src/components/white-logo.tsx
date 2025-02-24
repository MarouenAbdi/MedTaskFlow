import { cn } from "@/lib/utils";
import { HeartPulse } from "lucide-react";

interface WhiteLogoProps {
  className?: string;
}

export function WhiteLogo({ className }: WhiteLogoProps) {
  return (
    <HeartPulse className={cn("h-[1.2em] w-[1.2em] text-white", className)} />
  );
}