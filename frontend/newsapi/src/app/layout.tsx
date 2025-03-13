import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";


export const metadata: Metadata = {
  title: "News List",
  description: "Your news plug",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
