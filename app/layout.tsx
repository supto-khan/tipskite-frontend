import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { ExtensionWarningSuppressor } from "@/components/ExtensionWarningSuppressor";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TipsKite — Support Creators You Love",
    template: "%s | TipsKite",
  },
  description:
    "The easiest way for creators in Bangladesh to accept tips, memberships, and support via bKash, Nagad, Rocket, and Bank Transfer.",
  keywords: ["TipsKite", "creator support", "tip", "Bangladesh", "bKash", "Nagad", "membership"],
  authors: [{ name: "TipsKite Team" }],
  openGraph: {
    siteName: "TipsKite",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${lexend.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // 1. Suppress all window runtime errors from chrome extensions (e.g. M_ID, executors/200.js)
                  window.addEventListener('error', function(event) {
                    var filename = event.filename || '';
                    var msg = event.message || '';
                    if (
                      filename.indexOf('chrome-extension:') !== -1 ||
                      filename.indexOf('moz-extension:') !== -1 ||
                      msg.indexOf('M_ID') !== -1 ||
                      msg.indexOf('bis_skin_checked') !== -1
                    ) {
                      event.preventDefault();
                      event.stopPropagation();
                      event.stopImmediatePropagation();
                      return true;
                    }
                  }, true);

                  window.addEventListener('unhandledrejection', function(event) {
                    var reason = event.reason ? (event.reason.stack || event.reason.message || '') : '';
                    if (reason.indexOf('chrome-extension:') !== -1 || reason.indexOf('M_ID') !== -1) {
                      event.preventDefault();
                      event.stopPropagation();
                      return true;
                    }
                  }, true);

                  // 2. Suppress console warnings & errors about extensions & bis_skin_checked
                  var origError = console.error;
                  var origWarn = console.warn;
                  var shouldSuppress = function(args) {
                    for (var i = 0; i < args.length; i++) {
                      var a = args[i];
                      var str = typeof a === 'string' ? a : (a && typeof a.toString === 'function' ? a.toString() : '');
                      if (
                        str.indexOf('bis_skin_checked') !== -1 ||
                        str.indexOf('M_ID') !== -1 ||
                        str.indexOf('chrome-extension://') !== -1 ||
                        str.indexOf('executors/200.js') !== -1
                      ) return true;
                    }
                    return false;
                  };

                  console.error = function() {
                    if (shouldSuppress(arguments)) return;
                    origError.apply(console, arguments);
                  };
                  console.warn = function() {
                    if (shouldSuppress(arguments)) return;
                    origWarn.apply(console, arguments);
                  };

                  // 3. Theme initialization
                  var savedTheme = localStorage.getItem('theme');
                  var theme = savedTheme;
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <ExtensionWarningSuppressor />
        {children}
      </body>
    </html>
  );
}
