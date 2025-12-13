'use client';

import { useEffect } from 'react';

/**
 * Console Easter Egg Component
 * Displays subtle prompt after 3 seconds of opening console
 */
export default function ConsoleEasterEgg() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const delay = parseInt(process.env.NEXT_PUBLIC_CONSOLE_DELAY_MS as string || '3000');
    let consoleOpened = false;
    let promptShown = false;

    // Detect console opening (DevTools detection)
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      const orientation = widthThreshold ? 'vertical' : 'horizontal';

      if (!(heightThreshold && widthThreshold) && ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)) {
        if (!consoleOpened) {
          consoleOpened = true;
          setTimeout(showPrompt, delay);
        }
      }
    };

    // Alternative detection: log something and check timing
    let checkTimer: number;
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: function () {
        if (!consoleOpened) {
          consoleOpened = true;
          setTimeout(showPrompt, delay);
        }
        return 'easter-egg';
      },
    });

    const showPrompt = () => {
      if (promptShown) return;
      promptShown = true;

      // Clear console first
      console.clear();

      // ASCII art banner
      console.log('%c╔════════════════════════════════════════╗', 'color: #00ff41; font-family: monospace;');
      console.log('%c║  🔍 Hmm... a curious developer?      ║', 'color: #00ff41; font-family: monospace;');
      console.log('%c╚════════════════════════════════════════╝', 'color: #00ff41; font-family: monospace;');
      console.log('');
      console.log('%cType: %cdev.curious()', 'color: #888;', 'color: #00ff41; font-weight: bold;');

      // Make dev object available globally
      (window as any).dev = {
        curious: function () {
          console.clear();
          console.log('%c> Initializing...', 'color: #00ff41;');
          console.log('%c> Checking credentials...', 'color: #00ff41;');
          console.log('');

          setTimeout(() => {
            console.log('%cYou seem technically inclined.', 'color: #fff;');
            console.log('%cWant to see what\'s really happening under the hood?', 'color: #fff;');
            console.log('');
            console.log('%cType: %cdev.access()', 'color: #888;', 'color: #00ff41; font-weight: bold;');
          }, 1000);
        },
        access: async function () {
          console.clear();
          console.log('%c> Generating secure token...', 'color: #00ff41;');

          // Show progress bar
          const frames = ['[          ]', '[██        ]', '[████      ]', '[██████    ]', '[████████  ]', '[██████████]'];
          let i = 0;
          const progressInterval = setInterval(() => {
            console.clear();
            console.log('%c> Generating secure token...', 'color: #00ff41;');
            console.log(`%c${frames[i]} ${Math.min((i + 1) * 20, 100)}%`, 'color: #00ff41;');
            i++;
            if (i >= frames.length) {
              clearInterval(progressInterval);
              grantAccess();
            }
          }, 200);
        },
      };

      const grantAccess = async () => {
        console.log('%c> Access granted!', 'color: #00ff41; font-weight: bold;');
        console.log('');
        console.log('%cRedirecting to Developer Panel...', 'color: #fff;');

        // Log console access
        try {
          await fetch('/api/guardian/console-access', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error('Failed to log access:', error);
        }

        // Redirect after 1 second
        setTimeout(() => {
          window.location.href = '/guardian/level1';
        }, 1000);
      };
    };

    // Start detection
    checkTimer = window.setInterval(detectDevTools, 1000);
    console.log(element); // Trigger getter

    return () => {
      if (checkTimer) clearInterval(checkTimer);
    };
  }, []);

  return null; // This component doesn't render anything
}
