import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WeatherPro — Real-Time Weather Intelligence',
  description:
    'Search weather by city, coordinates, or landmark. 5-day forecasts, interactive maps, travel videos, and smart AI recommendations.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen`}>{children}</body>
    </html>
  );
}
