"use client";

import Link from "next/link";
import React, { Suspense } from "react";

function ErrorContent() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-4xl font-bold text-red-600">Something went wrong</h1>
      
      <p className="text-center text-lg text-gray-700 max-w-md">
        An error occurred. Please try again.
      </p>

      <Link
        href="/"
        className="rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
      >
        Return home
      </Link>
    </main>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<ErrorContent />}>
      <ErrorContent />
    </Suspense>
  );
}
