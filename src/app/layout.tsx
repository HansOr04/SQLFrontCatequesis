import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Sistema de Catequesis",
    template: "%s | Sistema de Catequesis"
  },
  description: "Sistema integral para la gestión de catequesis parroquial",
  keywords: [
    "catequesis",
    "parroquia", 
    "iglesia católica",
    "gestión",
    "certificados",
    "asistencia"
  ],
  authors: [
    {
      name: "Grupo 4",
    }
  ],
  creator: "Grupo 4",
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "es_EC",
    url: "/",
    title: "Sistema de Catequesis",
    description: "Sistema integral para la gestión de catequesis parroquial",
    siteName: "Sistema de Catequesis",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistema de Catequesis",
    description: "Sistema integral para la gestión de catequesis parroquial",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}