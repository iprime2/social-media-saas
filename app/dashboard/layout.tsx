import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main className="flex-1 p-6">{children}</main>
        </ThemeProvider>
    </div>
  );
}
