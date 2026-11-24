import { links, person } from "@/content/profile";
import type { Metadata } from "next";
import { DM_Mono, Fraunces } from "next/font/google";
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
  metadataBase: new URL(`https://${person.handle}.is-a.dev`),
  title: {
    default: `${person.handle} | ${person.name}`,
    template: `%s | ${person.handle}`,
  },
  description: person.shortBio,
  authors: [{ name: person.name, url: links.github }],
  creator: person.copyrightName,
  publisher: person.copyrightName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `https://${person.handle}.is-a.dev`,
    siteName: person.handle,
    title: `${person.handle} | ${person.name}`,
    description: person.shortBio,
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
    description: person.shortBio,
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
    canonical: `https://${person.handle}.is-a.dev`,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    alternateName: person.handle,
    url: `https://${person.handle}.is-a.dev`,
    image: `https://${person.handle}.is-a.dev/og-image.png`,
    jobTitle: "Open Source Developer",
    description: person.shortBio,
    address: {
      "@type": "PostalAddress",
      addressLocality: person.city,
      addressCountry: person.country,
    },
    sameAs: [links.github, links.x, `https://${person.handle}.is-a.dev`],
    knowsAbout: person.focus.split(" · "),
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Lagos State University of Education",
      alternateName: "LASUED",
    },
  };

  const waitforJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "waitfor",
    alternateName: "waitfor CLI",
    url: "https://github.com/0xProgress/waitfor",
    downloadUrl: "https://github.com/0xProgress/waitfor/releases",
    installUrl: "https://github.com/0xProgress/waitfor#install",
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "CLI Tool",
    operatingSystem: "Linux, macOS",
    programmingLanguage: "Go",
    description:
      "Block until a condition is true, or tell you exactly why it wasn't. A Go CLI that polls ports, HTTP endpoints, files, processes, and shell commands — and on timeout tells you exactly what was wrong.",
    featureList: [
      "TCP port readiness checks",
      "HTTP endpoint health checks",
      "File existence and size checks",
      "Process readiness checks",
      "Arbitrary shell command checks",
      "Parallel multi-condition checks with waitfor all",
      "Machine-readable JSON output",
      "CI/CD native with meaningful exit codes",
    ],
    keywords: "cli, go, golang, devops, ci-cd, healthcheck, devtools",
    license: "https://github.com/0xProgress/waitfor/blob/main/LICENSE",
    codeRepository: "https://github.com/0xProgress/waitfor",
    softwareVersion: "latest",
    author: {
      "@type": "Person",
      name: person.name,
      alternateName: person.handle,
      url: `https://${person.handle}.is-a.dev`,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <html lang="en" className={`${fraunces.variable} ${dmMono.variable}`}>
      <head>
        {/* Identity verification */}
        <link rel="me" href={links.github} />
        <link rel="me" href={links.x} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(waitforJsonLd) }}
        />
      </head>
      <body className="bg-stone-950 text-stone-50 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
