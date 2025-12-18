import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Speechix – AI That Speaks Like You",
  description: "AI voice cloning and text-to-speech platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}

