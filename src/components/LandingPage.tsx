import Image from "next/image";
import { Button } from "@/components/Button";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-4">
      <Image
        src="/logo.svg"
        alt="FractalChat Logo"
        width={120}
        height={120}
        className="mb-6"
      />
      <h1 className="text-5xl font-bold mb-4">FractalChat</h1>
      <p className="text-xl text-center max-w-xl mb-8">
        A new way to build knowledge with AI
      </p>

      {/* Call-to-action button */}
      <div className="flex justify-center">
        <Button href="/auth/signup" variant="solid" size="lg">
          Get Started
        </Button>
      </div>
    </main>
  );
}
