import React from 'react';
import './globals.css';
import { ThemeProvider } from 'next-themes';

export const metadata = {
  title: 'Plug TV - Watch Free. Discover More.',
  description: 'Plug TV — A legal directory of publicly embeddable and official live TV channels.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class">
          <div className="min-h-screen flex flex-col">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
