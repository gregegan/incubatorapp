import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/providers/ToastProvider";

export const metadata: Metadata = {
  title: "incubatorapp",
  description: "Sports betting competition platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {children}
            <Footer />
          </div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
