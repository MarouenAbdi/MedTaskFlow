import { cn } from "@/lib/utils";
import { HeartPulse } from "lucide-react";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <HeartPulse className={cn("h-[1.2em] w-[1.2em]", className)} />
  );
}