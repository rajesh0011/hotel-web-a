// app/[propertySlug]/rooms/layout.js
export async function generateMetadata({ params }) {
  const { propertySlug } = params;

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

    const title = roomsMeta?.metaTitle || "Spa | Amritara Hotels";
    const description = roomsMeta?.metaDescription || "";
    const keywords = roomsMeta?.metaKeywords || "";

    return {
      title,
      description,
      keywords,
      openGraph: { title, description },
    };
  } catch (err) {
    console.error("Spa page metadata fetch error:", err);
    return {
      title: "Spa | Amritara Hotels",
      description: "Spa | Amritara Hotels",
    };
  }
}

export default function SpaLayout({ children }) {
  return children;
}
