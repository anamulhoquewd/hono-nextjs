import type { Metadata } from "next";
import "./../styles/globals.css";
import { League_Spartan } from "next/font/google";

const spartan = League_Spartan({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-spartan",
});

export const metadata: Metadata = {
  title: "Catering Management",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spartan.variable} ${spartan.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}