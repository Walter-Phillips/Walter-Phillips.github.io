import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const geistMono = Geist_Mono({subsets:['latin'],variable:'--font-mono'});

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Walter Phillips",
  description: "Walter Phillips - Personal Website",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark antialiased", geist.variable, geistMono.variable)}>
      <body className="mx-auto min-h-screen w-full max-w-3xl px-4 sm:px-8 md:px-10 lg:px-12">
        {children}
      </body>
    </html>
  );
}
