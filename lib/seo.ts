import type { Metadata } from "next";

const siteName = "Mimaskollections";

const baseMetadata: Omit<Metadata, "title"> = {
  description:
    "Affordable luxury for everyday living. Shop home appliances, household essentials, souvenirs, and gifts with flexible payment plans in Nigeria.",
  keywords: [
    "affordable home appliances Nigeria",
    "household essentials online Nigeria",
    "buy now pay later Nigeria",
    "souvenir supply Nigeria",
    "gift items online Nigeria"
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName
  },
  twitter: {
    card: "summary_large_image"
  }
};

export function getHomepageMetadata(): Metadata {
  return {
    title: `${siteName} | Affordable Luxury for Everyday Living`,
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${siteName} | Affordable Luxury for Everyday Living`,
      description: baseMetadata.description as string
    },
    twitter: {
      ...baseMetadata.twitter,
      title: `${siteName} | Affordable Luxury for Everyday Living`,
      description: baseMetadata.description as string
    }
  };
}

export function getStaticPageMetadata(title: string, description: string): Metadata {
  return {
    title: `${siteName} | ${title}`,
    description,
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${siteName} | ${title}`,
      description
    },
    twitter: {
      ...baseMetadata.twitter,
      title: `${siteName} | ${title}`,
      description
    }
  };
}
