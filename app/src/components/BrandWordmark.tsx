"use client";

import { BrandIcon } from "./BrandIcon";

export function BrandWordmark({ className = "text-xl", iconSize = "w-6 h-6" }: { className?: string; iconSize?: string }) {
  return (
    <div className={`flex items-center gap-2 select-none font-sans font-black tracking-[0.2em] uppercase text-ink ${className}`}>
      <BrandIcon className={iconSize} />
      <span className="flex items-center">
        <span>R</span>
        <span className="inline-flex flex-col justify-between w-[0.55em] h-[0.62em] mx-[0.1em] self-center">
          <span className="h-[22%] w-full bg-current rounded-sm"></span>
          <span className="h-[22%] w-full bg-current rounded-sm"></span>
          <span className="h-[22%] w-full bg-current rounded-sm"></span>
        </span>
        <span>DACT</span>
      </span>
    </div>
  );
}
