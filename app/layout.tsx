import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Favicon from "@/components/custom/favicon";
import { Analytics } from "@vercel/analytics/react"

import { Button } from "@/components/ui/button";
import Logo from "@/components/custom/logo";
import MenubarInit from "@/components/custom/menubar-init";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

import { ThemeProvider } from "@/components/theme-provider"

// Font Styles
const satoshiSans = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi-sans",
  weight: "100 900",
});

const syneSans = localFont({
  src: "./fonts/Syne-Variable.woff2",
  variable: "--font-syne-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata
export const metadata: Metadata = {
  title: "Vox Observer",
  description: "Transparency. Accountability. Truth.",
};

// Main Function
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider signInForceRedirectUrl="/dashboard">
      <html lang="en">
        <Favicon />
        <body
          className={`${satoshiSans.variable} ${syneSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="dark flex justify-between h-16 p-4">
              <div className="fixed top-0 left-0">
                <Logo />
              </div>
              <div className="fixed bottom-4 left-4">
                <MenubarInit />
              </div>
              <div className="fixed top-4 right-4">
                <SignedOut>
                  <SignInButton>
                    <Button variant="secondary">Login</Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
            {children}
            <Analytics />
          </ThemeProvider>
        </body>

      </html>
    </ClerkProvider>
  );
}
