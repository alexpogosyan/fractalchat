"use client";

import Link from "next/link";
import React from "react";

export default function ErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-4xl font-bold text-red-600">Something went wrong</h1>
      <p className="text-center text-lg text-gray-700 max-w-md">
        An unexpected error occurred while processing your request. Please try
        again or return to the homepage.
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
