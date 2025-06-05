import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-4">
      <Image
        src="/logo.png"
        alt="FractalMap Logo"
        width={120}
        height={120}
        className="mb-6"
      />
      <h1 className="text-5xl font-bold mb-4">FractalMap</h1>
      <p className="text-xl text-center max-w-xl mb-8">
        A new way to build knowledge with AI
      </p>

      {/* Call-to-action buttons */}
      <div className="flex space-x-4">
        <Link
          href="/auth/signup"
          className="px-6 py-3 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Get Started
        </Link>
        <Link
          href="/auth/login"
          className="px-6 py-3 text-lg font-medium text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}
