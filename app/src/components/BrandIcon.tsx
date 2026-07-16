"use client";

export function BrandIcon({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M 4.5,4.2 C 8,4 12,4.3 16,3.8 C 15.8,5.2 16.2,6.5 15.8,7.8 C 12,7.6 8,7.9 4.2,7.5 C 4.5,6.2 4.2,5.2 4.5,4.2 Z" fill={color} />
      <path d="M 9.2,9.5 C 12.5,9.3 16,9.6 19.5,9.1 C 19.2,10.5 19.7,11.8 19.2,13.1 C 15.8,12.9 12.5,13.2 8.8,12.8 C 9,11.5 8.9,10.5 9.2,9.5 Z" fill={color} />
      <path d="M 1.8,14.8 C 7,14.6 12,14.9 17.5,14.4 C 17.2,15.8 17.7,17.1 17.2,18.4 C 12,18.2 7,18.5 1.2,18.1 C 1.5,16.8 1.4,15.8 1.8,14.8 Z" fill={color} />
    </svg>
  );
}
