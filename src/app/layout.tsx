// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from './authProvider';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const metadata = {
  title: 'My Mantine app',
  description: 'I have followed setup instructions carefully',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <AuthProvider>
        <MantineProvider>{children}</MantineProvider>
        </AuthProvider>
      </body>
    </html>
  );
}   