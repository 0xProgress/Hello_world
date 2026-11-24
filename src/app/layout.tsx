import { links, person } from "@/content/profile";
import type { Metadata } from "next";
import { DM_Mono, Fraunces } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["WONK", "opsz"],
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(links.website),
  title: {
    default: `${person.handle} | ${person.name}`,
    template: `%s | ${person.handle}`,
  },
  description: person.metaDescription,
  authors: [{ name: person.name, url: links.github }],
  creator: person.name,
  publisher: person.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: links.website,
    siteName: person.handle,
    title: `${person.handle} | ${person.name}`,
    description:
      "CS student in Lagos building small tools that punch above their weight. Open source CLI tools and developer utilities.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${person.name} — ${person.handle}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${person.handle} | ${person.name}`,
    description:
      "CS student in Lagos building small tools that punch above their weight. Open source CLI tools and developer utilities.",
    images: ["/og-image.png"],
    creator: `@${person.handle}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: links.website,
  },
  category: "technology",
};

const themeInitScript = `
(function() {
  try {
    var root = document.documentElement;
    var storedTheme = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = storedTheme === 'dark' || (!storedTheme && prefersDark);
    root.classList.toggle('dark', isDark);
    root.style.colorScheme = isDark ? 'dark' : 'light';

    var storedVibe = localStorage.getItem('vibe');
    var validVibes = { editorial: true, terminal: true, blueprint: true };
    root.dataset.vibe = validVibes[storedVibe] ? storedVibe : 'editorial';
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-vibe="editorial"
      suppressHydrationWarning
      className={`${fraunces.variable} ${dmMono.variable}`}
    >
      <head>
        <link rel="me" href={links.github} />
        <link rel="me" href={links.x} />
      </head>
      <body className="antialiased font-sans">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
