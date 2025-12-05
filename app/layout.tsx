import type { Metadata } from 'next';
import './globals.css';
import '@/styles/effects/scanlines.css';
import '@/styles/effects/crt-curvature.css';
import '@/styles/effects/glow.css';
import '@/styles/effects/chromatic-aberration.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { ChatProvider } from '@/context/ChatContext';

export const metadata: Metadata = {
  title: 'Jakub Skwierawski | Developer Portfolio',
  description: 'Full Stack Developer specializing in blockchain and AI technologies',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
