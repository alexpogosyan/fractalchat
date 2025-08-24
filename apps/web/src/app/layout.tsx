import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { getUser } from "./auth/actions";
import Sidebar from "@/components/Sidebar";
import { headers } from "next/headers";
import App from "@/components/app";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fractalchat",
  description: "A new way to build knowledge with AI",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getUser(); // server-side auth check

  const headersList = await headers();
  const pathname = headersList.get("x-current-path") ?? "";
  const hideSidebar =
    !user || pathname.startsWith("/auth") || pathname.startsWith("/error");

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <App />
      </body>
    </html>
  );
}
