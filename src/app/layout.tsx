import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bluefields — Acompanhamento de Startups",
  description:
    "Painel interno do time Bluefields para acompanhar progresso, riscos e próximos passos das startups aceleradas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
