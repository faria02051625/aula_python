import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ambiental IA",
  description: "MVP SaaS para geracao e gestao de documentos ambientais."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
