import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SidebarLayout from "@/components/sidebar";
import Footer from "@/components/footer";
import { AuthProvider } from "@/contexts/auth-context"; // <-- Added this import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinSight AI | Financial Filing Assistant",
  description:
    "AI-powered financial filing assistant for exploring SEC filings",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {" "}
          {/* Wrap everything inside AuthProvider */}
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarLayout>
              <div className="flex flex-col min-h-screen">
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </SidebarLayout>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
