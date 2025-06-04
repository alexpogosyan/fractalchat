import Image from "next/image";

export default function Home() {
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
      <p className="text-xl text-center max-w-xl">
        A new way to build knowledge with AI
      </p>
    </main>
  );
}
