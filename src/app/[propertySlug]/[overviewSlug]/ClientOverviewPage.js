"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import PropertyMainHeader from "@/app/Common/PropertyMainHeader";
import AccommodationSlider from "@/app/Components/AccommodationSlider";
import GalleryModal from "@/app/Components/GalleryModal";
import DiningSlider from "@/app/Components/DiningSlider";
import LatestOffers from "@/app/Components/LatestOffers";
import OverExp from "@/app/Components/OverExp";
import PropertyGalleryOverview from "@/app/Components/PropertyGalleryOverview";
import PropertyTestimonials from "@/app/Components/PropertyTestimonials";
import PropertyFaq from "../PropertyFaq";

export default function ClientOverviewPage({
  propertySlug: slugFromProps, propertyId: idFromProps, propertyName: nameFromProps,
}) {
  const { propertySlug: slugFromRoute } = useParams();

  const slug = slugFromProps ?? slugFromRoute;
  const [propertyId, setPropertyId] = useState(idFromProps ?? null);
  const [propertyName, setPropertyName] = useState(nameFromProps ?? null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [cityDetails, setCityDetails] = useState(null);
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
 
  useEffect(() => {
    if (!slug || propertyId) return;

    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`
        );
        const json = await res.json();
        const found = json?.data?.find((p) => p.propertySlug === slug);
        if (found) {
          setPropertyId(found.propertyId);
          setPropertyName((prev) => prev ?? found.propertyName);
          setCityDetails({
            label: found.cityName || "",
            value: found.cityId || "",
            property_Id: found.staahPropertyId || null,
          });
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [slug, propertyId]);

  useEffect(() => {
    if (!slug) return;
    if (cityDetails) return;

  }, [slug, cityDetails]);

  useEffect(() => {
    if (!propertyId) return;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyByFilter?PropertyId=${propertyId}`
        );
        const json = await res.json();
        setPropertyData(json?.data?.[0] ?? null);
      } catch (e) {
        console.error(e);
        setPropertyData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [propertyId]);

  if (loading) return <div>Loading hotel details...</div>;
  if (!propertyData) return <div>No property data found.</div>;

  return (
    <>
      <PropertyMainHeader
        // propertySlug={propertySlug}
        id={propertyData.propertyId}
      />
      <section className="hero-section inner-gumlet-video position-relative overflow-hidden h-full flex items-center justify-center">
  <div style={{ position: "relative", aspectRatio: "16/9" }}>
    {(() => {
      const fallbackVideoId = "68e7a50001fefe1a9aadc00d";
      const videoId =
        propertyData?.videoId && propertyData.videoId !== "0"
          ? propertyData.videoId
          : fallbackVideoId;

      return (
        <iframe
          loading="lazy"
          title="Gumlet video player"
          src={`https://play.gumlet.io/embed/${videoId}?background=true&autoplay=true&loop=true&disableControls=true`}
          style={{
            border: "none",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;"
        ></iframe>
      );
    })()}
  </div>
</section>

{/* <h1>video id: {propertyData?.videoId || "fallback (68e7a50001fefe1a9aadc00d)"} </h1> */}


      <section className="position-relative banner-section d-none">
        {propertyData.images && propertyData.images.length > 0 ? (
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="w-100 h-[100vh]"
          >
            {propertyData.images.map((img, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={
                    // img.propertyImage ||
                    "/default-image.jpg"}
                  alt={`Banner Image`}
                  width={1920}
                  height={500}
                  className="w-full h-[20vh] object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div>No images available</div>
        )}

      </section>

      <section className="overview-about-page-sec">
        <div className="container-fluid p-0">
          <div className="global-heading-sec text-center">
            <div className="row justify-content-center mb-0">
              <div className="col-md-9 md-offset-1">
                <h1 className="global-heading">
                  {propertyData?.propertyTitle || "Amritara Hotels & Resorts"}
                </h1>
                {/* <p className="mb-0">{propertyData?.description}</p> */}
                <p className="mb-0">
                  {propertyData?.description.length > 200 ? (
                    <>
                      {showFullText
                        ? propertyData?.description.replace(/<[^>]+>/g, "")
                        : propertyData?.description.replace(/<[^>]+>/g, "").slice(0, 200) + "..."}
                      <span
                        onClick={() => setShowFullText(!showFullText)}
                        style={{
                          cursor: "pointer",
                          color: "#000",
                          fontWeight: "600",
                        }}
                      >
                        {showFullText ? " read less" : " read more"}
                      </span>
                    </>
                  ) : (
                    propertyData?.description.replace(/<[^>]+>/g, "")
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <AccommodationSlider propertyId={propertyData.propertyId} setShowModal={setShowModal} setSelectedRoom={setSelectedRoom}
      // onSubmit={handleRoomBookNow}
      />

      <GalleryModal showModal={showModal} setShowModal={setShowModal} roomData={selectedRoom} />

      <DiningSlider propertyId={propertyData.propertyId} propertyData={propertyData} />

      {/* <EventWedding propertyId={propertyData.propertyId} /> */}

      <LatestOffers propertyId={propertyData.propertyId} />

      <OverExp propertyId={propertyData.propertyId} />

      <PropertyGalleryOverview propertyId={propertyData.propertyId}></PropertyGalleryOverview>

      <PropertyTestimonials propertyId={propertyData.propertyId}></PropertyTestimonials>

      <PropertyFaq propertyId={propertyData.propertyId} />

    </>
  );
}
