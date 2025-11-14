import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PDF Merger - Merge, Preview & Edit PDFs",
  description: "Upload multiple PDFs, preview pages, reorder, delete unwanted pages, and download the merged result.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="pdfmerger">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
