import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Escola do Inter — Análise de Atletas",
  description:
    "Sistema de análise e desenvolvimento de jogadores · Escolinha credenciada Sport Club Internacional · Rio Grande/RS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/monograma.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
