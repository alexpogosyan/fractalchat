import { LinkButton, Button } from "@/components/ui/button";
import Image from "next/image";
import { signInAnonymously } from "@/app/auth/actions";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="flex justify-end items-center p-6 gap-4">
        <LinkButton href="/auth/signin" variant="ghost" size="sm">
          Log In
        </LinkButton>
        <LinkButton href="/auth/signup" size="sm">
          Sign Up
        </LinkButton>
      </header>

      {/* Main content */}
      <main className="flex flex-col items-center justify-center px-4 pt-16 pb-32">
        <Image
          src="/logo.svg"
          alt="Fractalchat Logo"
          width={80}
          height={80}
          className="mb-6"
        />
        <h1 className="text-5xl font-bold mb-4">Fractalchat</h1>
        <p className="text-lg text-center max-w-xl mb-8 text-gray-600">
          A new way to build knowledge with AI
        </p>

        <form action={signInAnonymously}>
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Try Without Account
          </Button>
        </form>
      </main>
    </div>
  );
}
