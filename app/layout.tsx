import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Favicon from "@/components/custom/favicon";
import { Analytics } from "@vercel/analytics/react"

import { Button } from "@/components/ui/button";
import Logo from "@/components/custom/logo";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

import { ThemeProvider } from "@/components/theme-provider"

const satoshiSans = localFont({
  src: "./fonts/Satoshi-Variable.woff",
  variable: "--font-satoshi-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Vox Observer",
  description: "Transparency. Accountability. Truth.",
};

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
          className={`${satoshiSans} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="dark flex justify-between h-16 p-4">
              <Logo />
              <SignedOut>
                <SignInButton>
                  <Button variant="secondary">Login</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
            {children}
            <Analytics />
          </ThemeProvider>
        </body>

      </html>
    </ClerkProvider>
  );
}
