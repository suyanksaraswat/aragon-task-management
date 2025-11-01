import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TRPCProvider from "@/app/_trpc/Provider";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Aragon Task Management",
    template: "%s | Aragon Task Management"
  },
  description: "Manage your tasks efficiently with Aragon Task Management.",
  keywords: ["task management", "tasks", "productivity"],
  authors: [{ name: "Aragon Task Management" }],
  creator: "Aragon Task Management",
  publisher: "Aragon Task Management",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Aragon Task Management",
    description: "Manage your tasks efficiently with Aragon Task Management.",
    siteName: "Aragon Task Management",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aragon Task Management",
    description: "Manage your tasks efficiently with Aragon Task Management.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <TRPCProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </TRPCProvider>
    </AuthProvider>
  );
}
