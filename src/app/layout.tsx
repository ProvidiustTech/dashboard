import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Providius – AI Customer Support",
  description: "Automate customer support with AI intelligence",

  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Blocking inline script — executes before React hydrates.
          Reads localStorage and immediately adds class="dark" to <html>
          to prevent a white flash on page load when dark mode is saved.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var c = document.cookie.split('; ').find(function(r) { return r.indexOf('providius-theme=') === 0; });
                  var t = c ? c.split('=')[1] : localStorage.getItem('providius-theme');
                  
                  var isDark = t === 'Dark' || ((t === 'System' || !t) && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) { console.error('Theme script error:', e); }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors font-degular duration-200" suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}