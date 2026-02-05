import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoMarkProps {
  size?: number;
  className?: string;
  alt?: string;
}

export function LogoMark({ size = 28, className, alt = "HardWire" }: LogoMarkProps) {
  return (
    <Image
      src="/brand/hardwire-mark.svg"
      alt={alt}
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      priority
    />
  );
}
