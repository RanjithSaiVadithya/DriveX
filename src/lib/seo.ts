import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { env } from "@/lib/env";

interface BuildMetadataOptions {
  title: string | { absolute: string };
  description: string;
  path?: string;
  index?: boolean;
  ogImage?: string;
}

export function buildPageMetadata({
  title,
  description,
  path = "/",
  index = true,
  ogImage = siteConfig.ogImage,
}: BuildMetadataOptions): Metadata {
  const url = new URL(path, env.appUrl).toString();
  const imageUrl = ogImage.startsWith("http")
    ? ogImage
    : new URL(ogImage, env.appUrl).toString();
  const titleText = typeof title === "string" ? title : title.absolute;

  return {
    title,
    description,
    alternates: {
      canonical: index ? url : undefined,
    },
    openGraph: {
      title: titleText,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: siteConfig.locale,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description,
      images: [imageUrl],
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
  };
}

export function privatePageMetadata(
  title: string,
  description = "Private DriveX application area.",
): Metadata {
  return buildPageMetadata({
    title,
    description,
    index: false,
  });
}
