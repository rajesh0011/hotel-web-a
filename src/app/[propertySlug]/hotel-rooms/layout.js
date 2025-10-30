// app/[propertySlug]/hotel-rooms/layout.js
export async function generateMetadata({ params }) {
  const { propertySlug } = params;

  // Build canonical base (set NEXT_PUBLIC_BASE_URL in your env, e.g. https://example.com)
  const base =
    (process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "") // fallback to empty string if not set
      .replace(/\/$/, ""); // remove trailing slash if any
  const canonical = `${base}/${propertySlug}/hotel-rooms`;

  try {
    // Fetch property list
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`,
      { cache: "no-store" }
    );
    const { data, errorMessage } = await res.json();
    if (errorMessage !== "success") throw new Error("Failed to fetch property list");

    const propertyId = data.find((p) => p.propertySlug === propertySlug)?.propertyId;
    if (!propertyId) throw new Error("Property not found");

    // Fetch meta tags
    const metaRes = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyMetaTags?propertyId=${propertyId}`,
      { cache: "no-store" }
    );
    const { data: metaData, errorMessage: metaError } = await metaRes.json();
    if (metaError !== "success") throw new Error("Failed to fetch metadata");

    // Rooms page = pageType "2"
    const roomsMeta = metaData.find((item) => item.pageType === "2");

    const title = roomsMeta?.metaTitle || "Rooms | Amritara Hotels";
    const description = roomsMeta?.metaDescription || "";
    const keywords = roomsMeta?.metaKeywords || "";

    return {
      title,
      description,
      keywords,
      openGraph: { title, description, url: canonical },
      alternates: { canonical },
    };
  } catch (err) {
    console.error("Rooms page metadata fetch error:", err);
    return {
      title: "Rooms | Amritara Hotels",
      description: "Explore our rooms and suites.",
      openGraph: { title: "Rooms | Amritara Hotels", description: "Explore our rooms and suites.", url: canonical },
      alternates: { canonical },
    };
  }
}

export default function RoomsLayout({ children }) {
  return children;
}
