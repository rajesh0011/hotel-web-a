"use client";

import React, {  useEffect, useState, useRef } from "react";
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
import BookNowForm from "@/app/booking-engine-widget/BookNowForm";
import * as ReactDOM from "react-dom";
import { ChevronRight, Search, X } from "lucide-react";
import { getUserInfo } from "../../../utilities/userInfo";
import FilterBar from "@/app/cin_booking_engine/Filterbar";
import { BookingEngineProvider } from "@/app/cin_context/BookingEngineContext";
export default function ClientOverviewPage({
  propertySlug: slugFromProps, propertyId: idFromProps, propertyName: nameFromProps,
}) {
  const { propertySlug: slugFromRoute } = useParams();

  const slug = slugFromProps ?? slugFromRoute;
  const [propertyId, setPropertyId] = useState(idFromProps ?? null);
  const [propertyName, setPropertyName] = useState(nameFromProps ?? null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullText, setShowFullText] = useState(false);
   const [isOpen, setOpen] = useState(false);
   const [showFilterBar, setShowFilterBar] = useState(false);
   const filterBarRef = useRef(null);  
   const [isOpenFilterBar, openFilterBar] = useState(false);
   const [staahPropertyId, setStaahPropertyId] = useState(null);
   const [cityDetails, setCityDetails] = useState(null);
   //  Booking tracking event
   async function postBookingWidged(
     rooms,
     mapping,
     isClose,
     ctaName,
     selectedPropertyId
   ) {
     const resp = await getUserInfo();
     const sessionId = sessionStorage?.getItem("sessionId");
     const payload = {
       ctaName: ctaName,
       urls: window.location.href,
       cityId: "0",
       propertyId: selectedPropertyId?.toString() || "0",
       checkIn: "",
       checkOut: "",
       adults: "0",
       children: "0",
       rooms: "0",
       promoCode: "",
       ip: resp?.ip,
       sessionId: sessionId,
       deviceName: resp?.deviceInfo?.deviceName,
       deviceType:
         resp?.deviceInfo?.deviceOS == "Unknown"
           ? resp?.deviceInfo?.platform
           : resp?.deviceInfo?.deviceOS,
       roomsName: rooms?.RoomName,
       packageName: mapping?.MappingName,
       isCartOpen: mapping?.MappingName ? "Y" : "N",
       isCartEdit: "N",
       isCartClick: "N",
       isClose: isClose ? "Y" : "N",
     };
 
    //  try {
    //    const response = await fetch(
    //      `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/Api/tracker/BookingWidged`,
    //      {
    //        method: "POST",
    //        headers: {
    //          "Content-Type": "application/json",
    //        },
    //        body: JSON.stringify(payload),
    //      }
    //    );
    //    await response.json();
    //  } catch (err) {
    //    console.error("Error posting booking widget:", err);
    //  }
   }
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
          setStaahPropertyId(found?.staahPropertyId);
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

  const handleBookNow = async (prperty) => {
    if(isOpen){
      postBookingWidged("","", false,"Widget Open");
    }else{
      postBookingWidged("","", true,"Widget Closed");
    }
    
    setOpen(!isOpen);
    setShowFilterBar(!showFilterBar);
    // const label = prperty?.cityName;
    // const value = prperty?.cityId;
    // const property_Id = prperty?.staahPropertyId;
    // setCityDetails({ label, value, property_Id });
    // setStaahPropertyId(prperty?.staahPropertyId);
    
    if (filterBarRef.current) {
      filterBarRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = filterBarRef.current.querySelector("input, select, button");
      if (firstInput) firstInput.focus();
    }
  };
  return (
    <>
      <PropertyMainHeader
        id={propertyData?.propertyId}
        type={propertyData?.propertyType}
        logo={propertyData?.propertyLogo}
         onClick={handleBookNow}
      />
      <div className="position-relative" ref={filterBarRef}>
     <section className="hero-section inner-gumlet-video overview-herosection overflow-hidden h-full items-center justify-center">
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
       {/* <section className="booking-form-section over-page-booking">
        <BookNowForm />
      </section> */}
      
      </div>
<section className="booking-form-section inner-main-booking-bar-sec">
        <div
          className={`booking-search-bar-btn-div home-page-class`}
          style={{ zIndex: 10 }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              handleBookNow();
            }}
            className="booking-toggle-btn"
          >
            {isOpen ? <X size={18} color="black" /> : "Book Now"}
          </button>
        </div>
        {isOpenFilterBar && ReactDOM.createPortal (
          <BookingEngineProvider>
            <FilterBar
              contentData={contentData}
              tokenKey={tokenKey}
              selectedProperty={0}
              openBookingBar={isOpenFilterBar}
              onClose={() => {
                openFilterBar(false);
                setOpen(false);
              }}
            />
          </BookingEngineProvider>,
          document.body
        )}

        {showFilterBar && ReactDOM.createPortal (
          <BookingEngineProvider>
            <FilterBar
              selectedProperty={parseInt(staahPropertyId)}
              cityDetails={cityDetails}
              openBookingBar={showFilterBar}
              onClose={(isReload) => {
                setOpen(false);
                setShowFilterBar(false);
                if (isReload) {
                window.location.reload();
              }
              }}
            />
          </BookingEngineProvider>,
          document.body
        )}
      </section>
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
                  {propertyData?.description.length > 400 ? (
                    <>
                      {showFullText
                        ? propertyData?.description.replace(/<[^>]+>/g, "")
                        : propertyData?.description.replace(/<[^>]+>/g, "").slice(0, 400) + "..."}
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


      <AccommodationSlider propertyId={propertyData.propertyId} BeId={propertyData.staahBookingId} setShowModal={setShowModal} setSelectedRoom={setSelectedRoom}
      // onSubmit={handleRoomBookNow}
       onSubmit={handleBookNow}
      />

      <GalleryModal showModal={showModal} setShowModal={setShowModal} roomData={selectedRoom} />

      <DiningSlider propertyId={propertyData.propertyId} propertyData={propertyData} />

      {/* <EventWedding propertyId={propertyData.propertyId} /> */}

      <LatestOffers propertyId={propertyData.propertyId} BeId={propertyData.staahBookingId} onSubmit={handleBookNow}/>

      <OverExp propertyId={propertyData.propertyId} />

      <PropertyGalleryOverview propertyId={propertyData.propertyId}></PropertyGalleryOverview>

      {/* <PropertyTestimonials propertyId={propertyData.propertyId}></PropertyTestimonials> */}

      <PropertyFaq propertyId={propertyData.propertyId} />
      <style jsx>{`
        .innerPageShadow {
            box-shadow: none !important;
        }

      `}</style>
    </>
  );
}
