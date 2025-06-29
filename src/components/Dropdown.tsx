"use client";
import { useState, useEffect, useRef, ReactNode } from "react";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
}

export default function Dropdown({ trigger, children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)}>{trigger}</button>
      {open && (
        <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-30">
          {children}
        </div>
      )}
    </div>
  );
}
