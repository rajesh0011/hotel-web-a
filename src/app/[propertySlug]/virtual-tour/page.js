import React from "react";
import VirtualTour from "./VirtualTourClient";

export default async function ExperiencePage({ params }) {
 const resolvedParams = await params;
  const { brand_slug, propertyId } = resolvedParams;

  return (
    <>

    <VirtualTour propertyId={propertyId} brand_slug={brand_slug} />
      
    </>
  );
}
