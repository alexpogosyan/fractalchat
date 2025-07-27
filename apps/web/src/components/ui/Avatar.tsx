"use client";

export default function Avatar({ initial }: { initial: string }) {
  return (
    <div className="cursor-pointer w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold select-none">
      {initial}
    </div>
  );
}
