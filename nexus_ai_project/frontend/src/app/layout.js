'use client';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Nexus AI – Your Digital Twin &amp; Life Decision Simulator</title>
        <meta name="description" content="Create your AI twin that mimics you and simulate life decisions to predict outcomes. Your AI clone helping you choose your future." />
        <meta name="keywords" content="AI, digital twin, life simulator, decision making, artificial intelligence" />
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
