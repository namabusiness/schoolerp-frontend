import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "School ERP — Enterprise SaaS Platform",
  description:
    "Multi-School SaaS ERP combining platform Super Admin control with all operational school flows in a high-contrast monochrome aesthetic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-zinc-950 antialiased font-sans selection:bg-zinc-200 selection:text-black">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
