// app/[propertySlug]/hotel-deals-offers/layout.js
export async function generateMetadata({ params }) {
  const { propertySlug } = params;

  // base site URL (set in env). Fallback to a placeholder if not set.
  const baseUrl =
    "/";

  // ensure no trailing slash on base and build canonical including current slug
  const canonicalUrl = `${baseUrl.replace(/\/$/, "")}/${propertySlug}/hotel-deals-offers`;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`,
      { cache: "no-store" }
    );

    const { data, errorMessage } = await res.json();
    if (errorMessage !== "success") throw new Error("Failed to fetch property list");

    const propertyId = data.find((p) => p.propertySlug === propertySlug)?.propertyId;
    if (!propertyId) throw new Error("Property not found");

    const metaRes = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyMetaTags?propertyId=${propertyId}`,
      { cache: "no-store" }
    );

    const { data: metaData, errorMessage: metaError } = await metaRes.json();
    if (metaError !== "success") throw new Error("Failed to fetch metadata");

    const offersMeta = metaData.find((item) => item.pageType === "4");

    const title = offersMeta?.metaTitle || "Offers | Amritara Hotels";
    const description = offersMeta?.metaDescription || "Discover exclusive offers and packages.";
    const keywords = offersMeta?.metaKeywords || "";

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
      },
    };
  } catch (err) {
    console.error("Offers page metadata fetch error:", err);
    return {
      title: "Offers | Amritara Hotels",
      description: "Discover exclusive offers and packages at Amritara Hotels.",
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        url: canonicalUrl,
      },
    };
  }
}

export default function OffersLayout({ children }) {
  return children;
}
