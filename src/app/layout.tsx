import "./globals.css";
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
