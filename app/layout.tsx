import type { Metadata } from 'next';
import './globals.css';
import '@/styles/effects/scanlines.css';
import '@/styles/effects/crt-curvature.css';
import '@/styles/effects/glow.css';
import '@/styles/effects/chromatic-aberration.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { ChatProvider } from '@/context/ChatContext';
import ConsoleEasterEgg from '@/components/ConsoleEasterEgg';

export const metadata: Metadata = {
  title: 'Jakub Skwierawski | Developer Portfolio',
  description: 'Full Stack Developer specializing in blockchain and AI technologies',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const easterEggEnabled = process.env.NEXT_PUBLIC_ENABLE_EASTER_EGG === 'true';

  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ChatProvider>
            {easterEggEnabled && <ConsoleEasterEgg />}
            {children}
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
