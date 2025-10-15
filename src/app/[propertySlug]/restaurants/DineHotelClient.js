"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React, { useEffect, useState } from "react";
import Diningpageslider from "../../Components/Diningpageslider";
import Image from "next/image";
import { BookingEngineProvider } from "../../cin_context/BookingEngineContext";
import FilterBar from "../../cin_booking_engine/Filterbar";
import { X } from "lucide-react";
import PropertyMainHeader from "@/app/Common/PropertyMainHeader";

export default function DineHotelClient({ propertySlug }) {
  const [propertyData, setPropertyData] = useState(null);
  const [dineData, setDineData] = useState([]);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bannerImages, setBannerImages] = useState([]);

  // Keep these 3 distinct:
  const [staahPropertyId, setStaahPropertyId] = useState(null); // for booking engine
  const [cmsPropertyId, setCmsPropertyId] = useState(null);     // for EnquireNow API
  const [cityId, setCityId] = useState(null);                    // for EnquireNow API

  const [showFilterBar, setShowFilterBar] = useState(false);
  const [cityDetails, setCityDetails] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [isOpenFilterBar, openFilterBar] = useState(false);
  const [isOpen, setOpen] = useState(false);

  const handleBookNowClick = async () => {
    setOpen(!isOpen);
    openFilterBar(!isOpenFilterBar);
    setShowFilterBar(!showFilterBar);
  };

  const handleRoomBookNow = async (room) => {
    setRoomDetails(room);
    setShowFilterBar(true);
  };

  useEffect(() => {
    if (!propertySlug) return;

    const fetchPropertyIdFromSlug = async (slug) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`
        );
        const json = await res.json();
        if (json.errorMessage !== "success") {
          console.error("Property list fetch error:", json);
          return null;
        }
        const found = json.data.find(
          (p) => p.propertySlug?.toLowerCase() === slug.toLowerCase()
        );
        if (!found) return null;

        // Set all IDs
        setCityId(found.cityId ?? null);              // ✅ for EnquireNow
        setCmsPropertyId(found.propertyId ?? null);   // ✅ for EnquireNow
        setStaahPropertyId(found.staahPropertyId ?? null); // ✅ for booking engine

        // Ancillary city details for the booking bar
        setCityDetails({
          label: found.cityName,
          value: found.cityId,
          property_Id: found.staahPropertyId,
        });

        return found.propertyId || null; // this is the CMS property id used by Dine API below
      } catch (error) {
        console.error("Error fetching property list:", error);
        return null;
      }
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        const cmsId = await fetchPropertyIdFromSlug(propertySlug);
        if (!cmsId) {
          setDineData([]);
          setBanner(null);
          setLoading(false);
          return;
        }

        // Dine details use CMS propertyId
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/dine/GetDineByProperty?propertyId=${cmsId}`
        );
        const result = await res.json();

        const banners = result?.data || [];
        const firstBanner = banners[0] || null;
        setBanner(firstBanner);

        // Property images (also with CMS propertyId)
        const imageRes = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyByFilter?PropertyId=${cmsId}`
        );
        const dataJson = await imageRes.json();
        const propertyObj = dataJson?.data?.[0] || null;

        if (propertyObj) {
          setPropertyData(propertyObj);
          const imagesFromApi = propertyObj.images || [];
          const imageUrls = imagesFromApi.map((img) => img.propertyImage).filter(Boolean);
          setBannerImages(imageUrls);
        }

        const allDineDetails = banners.flatMap((b) => b.dineDetails || []) || [];
        setDineData(allDineDetails);
      } catch (error) {
        console.error("Error fetching property data:", error);
        setDineData([]);
        setBanner(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propertySlug]);

  if (loading) return <div>Loading hotel details...</div>;

  return (
    <>
      <PropertyMainHeader id={propertyData.propertyId} type={propertyData.propertyType} />

      <section className="position-relative inner-banner-section-slider d-none">
        {bannerImages.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            autoplay={{ delay: 4000 }}
            loop
            className="w-100 slider-banner-inner"
          >
            {bannerImages.map((imgUrl, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={imgUrl}
                  alt={`Banner ${index + 1}`}
                  width={1920}
                  height={1080}
                  className="w-100 object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Image
            src="/images/banner_img.png"
            alt="Default Banner"
            width={1920}
            height={1080}
            className="w-100 object-cover"
          />
        )}

        <div className="position-absolute bottom-0 start-0 w-100 bg-white shadow">
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 home-page-class`}
            style={{ zIndex: 10 }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                handleBookNowClick();
              }}
              className="p-2 bg-white flex items-center justify-center rounded-full"
            >
              {isOpen ? <X size={18} color="black" /> : "Book Now"}
            </button>
          </div>

          {showFilterBar && (
            <BookingEngineProvider>
              <FilterBar
                selectedProperty={parseInt(staahPropertyId)}   // ✅ Booking engine uses STAAH id
                cityDetails={cityDetails}
                roomDetails={roomDetails}
                openBookingBar={isOpenFilterBar}
                onClose={() => {
                  openFilterBar(false);
                  setOpen(false);
                  setShowFilterBar(false);
                }}
              />
            </BookingEngineProvider>
          )}
        </div>
      </section>
      {/* <h1>proprty id {propertyData.propertyId}</h1> */}

      <section className="Dining-Inner-Section inner-no-banner-sec">
        <div className="container">
          <div className="global-heading-sec text-center">
            <div className="row justify-content-center mb-2">
              <div className="col-md-9 md-offset-1">
                <h2 className="global-heading">
                  {banner?.dineBannerTitle || "Dining"}
                </h2>
              </div>
            </div>
          </div>

          {dineData.length > 0 ? (
            <div className="winter-sec">
              <div className="row">
                {/* ✅ Pass the correct IDs for the enquiry API */}
                <Diningpageslider
                  dineData={dineData}
                  cityId={cityId}
                  propertyId={cmsPropertyId}
                />
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No dining data found for this property.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
