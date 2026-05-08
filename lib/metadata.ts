import { Metadata } from "next";

export const baseMetadata = {
  name: "Chhuon Makara Roth",
  title: "Chhuon Makara Roth - Full Stack Developer",
  description:
    "Portfolio of Makara, a full-stack developer specializing in modern web technologies including React, Next.js, TypeScript, and Node.js.",
  keywords:
    "Makara, Chhuon Makara Roth, full-stack developer, React, Next.js, TypeScript, Node.js, web development, Cambodia developer, portfolio",
  author: "Chhuon Makara Roth",
  siteUrl: "https://www.chhuonmakararoth.site",
};

export const siteNavigationItems = [
  {
    name: "Projects",
    url: `${baseMetadata.siteUrl}/projects/`,
    description: "Full-stack web development projects by Chhuon Makara Roth.",
  },
  {
    name: "About",
    url: `${baseMetadata.siteUrl}/about/`,
    description: "Professional background, skills, education, and experience.",
  },
  {
    name: "Services",
    url: `${baseMetadata.siteUrl}/services/`,
    description:
      "Web development, mobile development, API, UI/UX, and consulting services.",
  },
  {
    name: "Contact",
    url: `${baseMetadata.siteUrl}/contact/`,
    description: "Contact Chhuon Makara Roth for projects and collaboration.",
  },
  {
    name: "Blogs",
    url: `${baseMetadata.siteUrl}/blogs/`,
    description: "Articles and insights about web development and technology.",
  },
];

export function generateMetadata({
  title,
  description,
  path = "",
  image = "/og-image.jpg",
  type = "website",
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
} = {}): Metadata {
  const fullTitle = title
    ? `${title} | ${baseMetadata.title}`
    : baseMetadata.title;
  const fullDescription = description || baseMetadata.description;
  // Ensure consistent trailing slash handling
  const normalizedPath =
    path === "" ? "/" : path.endsWith("/") ? path : `${path}/`;
  const fullUrl = `${baseMetadata.siteUrl}${normalizedPath}`;

  return {
    title: fullTitle,
    description: fullDescription,
    applicationName: baseMetadata.name,
    keywords: baseMetadata.keywords,
    authors: [{ name: baseMetadata.author }],
    creator: baseMetadata.author,
    publisher: baseMetadata.author,

    // Add metadataBase to resolve social media images
    metadataBase: new URL(baseMetadata.siteUrl),

    // Open Graph
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: baseMetadata.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "en_US",
      type: type,
    },

    // Twitter
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [image],
    },

    // Additional SEO
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

    // Canonical URL
    alternates: {
      canonical: fullUrl,
    },

    // App-specific
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
    },

    // Verification
    verification: {
      google: "E2xuGpkJrX7W9CRPK1KB7_Dnkbu2XFdAFBg_ZPB3u2k",
      other: {
        "ahrefs-site-verification":
          "f43fe6af70c9d1572d89e0196a750c104ea2d87416d7ec4a5c88fbdb4f4667de",
      },
    },

    // Additional metadata
    category: "Technology",
  };
}

export function generateStructuredData(
  type:
    | "person"
    | "website"
    | "siteNavigation"
    | "article"
    | "breadcrumb"
    | "webpage",
  data: any,
) {
  const baseStructuredData = {
    "@context": "https://schema.org",
  };

  switch (type) {
    case "person":
      return {
        ...baseStructuredData,
        "@type": "Person",
        "@id": `${baseMetadata.siteUrl}/#person`,
        name: "Chhuon Makara Roth",
        alternateName: ["Makara Roth", "Chhuon MakaraRoth"],
        jobTitle: "Full Stack Developer",
        description:
          "Full-stack developer specializing in modern web technologies",
        url: baseMetadata.siteUrl,
        image: `${baseMetadata.siteUrl}/avatars/roth.jpg`,
        mainEntityOfPage: `${baseMetadata.siteUrl}/`,
        sameAs: [
          "https://github.com/ch-Makara-roth",
          "https://www.linkedin.com/in/chhuon-makararoth-b66700262/",
        ],
        knowsAbout: [
          "JavaScript",
          "React",
          "Next.js",
          "TypeScript",
          "Node.js",
          "Web Development",
          "Full Stack Development",
        ],
        ...data,
      };

    case "website":
      return {
        ...baseStructuredData,
        "@type": "WebSite",
        "@id": `${baseMetadata.siteUrl}/#website`,
        name: baseMetadata.name,
        alternateName: baseMetadata.title,
        url: baseMetadata.siteUrl,
        description: baseMetadata.description,
        inLanguage: "en",
        publisher: {
          "@id": `${baseMetadata.siteUrl}/#person`,
        },
        ...data,
      };

    case "siteNavigation":
      return {
        ...baseStructuredData,
        "@type": "ItemList",
        "@id": `${baseMetadata.siteUrl}/#site-navigation`,
        name: "Main navigation",
        itemListElement: siteNavigationItems.map((item, index) => ({
          "@type": "SiteNavigationElement",
          position: index + 1,
          name: item.name,
          description: item.description,
          url: item.url,
        })),
        ...data,
      };

    case "article":
      return {
        ...baseStructuredData,
        "@type": "Article",
        headline: data.title,
        description: data.description,
        author: {
          "@type": "Person",
          name: baseMetadata.author,
        },
        publisher: {
          "@type": "Person",
          name: baseMetadata.author,
        },
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        ...data,
      };

    case "breadcrumb":
      return {
        ...baseStructuredData,
        "@type": "BreadcrumbList",
        itemListElement: data.items.map((item: any, index: number) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.item,
        })),
        ...data,
      };

    case "webpage":
      return {
        ...baseStructuredData,
        "@type": "WebPage",
        name: data.name,
        description: data.description,
        url: data.url,
        ...data,
      };

    default:
      return baseStructuredData;
  }
}
