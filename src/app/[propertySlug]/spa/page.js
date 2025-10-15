import React from "react";
import SpaHotelClient from "./SpaHotelClient";

export default async function SpaPage({ params }) {
 const resolvedParams = await params;
  const { brand_slug, propertyId } = resolvedParams;

  return (
    <>
      <SpaHotelClient brand_slug={brand_slug} propertyId={propertyId} />   
     
    </>
  );
}
