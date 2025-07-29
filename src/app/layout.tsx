import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dota Hero Picker",
  description: "A hero suggestion app for Dota 2",
  manifest: "/manifest.json", // ✅ این خط حیاتی است
};
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
