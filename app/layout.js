import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "Gym Manager CR - Sistema de Gestión de Gimnasios",
    template: "%s | Gym Manager CR",
  },
  description: "Sistema completo de gestión para gimnasios en Costa Rica. Administra miembros, pagos, check-ins y más.",
  keywords: ["gimnasio", "fitness", "costa rica", "gestión", "miembros", "admin"],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💪</text></svg>",
  },
  themeColor: "#2563eb",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-CR">
      <head>
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
