"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import * as ReactDOM from "react-dom";
import { BookingEngineProvider } from "@/app/cin_context/BookingEngineContext";
import FilterBar from "@/app/cin_booking_engine/Filterbar";
import { X } from "lucide-react";
import PropertyMainHeader from "@/app/Common/PropertyMainHeader";
import VirtualTourPropertyPage from "@/app/Components/VirtualTourPropertyPage";

export default function VirtualTour() {
  const { brandSlug, propertySlug } = useParams();
  const [type, setPropertyType] = useState(null);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [propertyId, setPropertyId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);

  const [bannerImages, setBannerImages] = useState([]);
      const [propertyData, setPropertyData] = useState(null);

  const [showFilterBar, setShowFilterBar] = useState(false);
  const [cityDetails, setCityDetails] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [isOpenFilterBar, openFilterBar] = useState(false);
  const [staahPropertyId, setStaahPropertyId] = useState(null);
  const [isOpen, setOpen] = useState(false);
  
   
      async function postBookingWidged(rooms,mapping, isClose,ctaName,selectedPropertyId) {
       const resp = await getUserInfo();
         const sessionId = sessionStorage?.getItem("sessionId");
         const payload = {
         ctaName: ctaName,
         urls: window.location.href,
         cityId: 0,
         propertyId: selectedPropertyId ? parseInt(selectedPropertyId) :0,
         checkIn: "",
         checkOut: "",
         adults: 0,
         children: 0,
         rooms: 0,
         promoCode: "",
         ip: resp?.ip,
         sessionId: sessionId,
         deviceName: resp?.deviceInfo?.deviceName,
         deviceType: resp?.deviceInfo?.deviceOS == "Unknown" ? resp?.deviceInfo?.platform : resp?.deviceInfo?.deviceOS,
         roomsName: rooms?.RoomName,
         packageName: mapping?.MappingName,
         isCartOpen: mapping?.MappingName ? "Y": "N",
         isCartEdit: "N",
         isCartClick: "N",
         isClose: isClose ? "Y" : "N",
        }
           const response = await fetch(
             `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/Api/tracker/BookingWidged`,
             {
               method: "POST",
               headers: {
                 "Content-Type": "application/json",
               },
               body: JSON.stringify( payload ),
             }
           );
           const res = await response?.json();
     
         //console.log("res BookingWidged",res);
       }
  const handleBookNowClick = async () => {
    
    if(isOpen){
      postBookingWidged("","", true,"Widget Closed");
    }else{
      postBookingWidged("","", false,"Widget Open");
    }
    setOpen(!isOpen);
    openFilterBar(!isOpenFilterBar);
    setShowFilterBar(!showFilterBar);
  };
  const handleRoomBookNow = async (room) => {
    
    if(isOpen){
      postBookingWidged("","", true,"Widget Closed");
    }else{
      postBookingWidged("","", false,"Widget Open");
    }
    setOpen(!isOpen);
    setRoomDetails(room);
    openFilterBar(!isOpenFilterBar);
    setShowFilterBar(!showFilterBar);
  };
  const handleAccordionClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Step 1: Fetch propertyId by slug
  useEffect(() => {
    if (!propertySlug) return;

    const fetchPropertyIdFromSlug = async (slug) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`
        );
        const json = await res?.json();
        if (json.errorMessage !== "success") {
          console.error("Property list fetch error:", json);
          return null;
        }
        const found = json.data.find((p) => p.propertySlug === slug);

        const label = found?.cityName;
        const value = found?.cityId;
        const property_Id = found?.staahPropertyId;
        const type = found?.propertyType;

        // ✅ City + staah for booking engine
        setPropertyType(type);
        setCityDetails({ label, value, property_Id });
        // setPropertyId(found?.propertyId);
        // setStaahPropertyId(found?.staahPropertyId);
        return found?.propertyId || null;
      } catch (error) {
        console.error("Error fetching property list:", error);
        return null;
      }
    };

    const loadPropertyId = async () => {
      setLoading(true);
      const id = await fetchPropertyIdFromSlug(propertySlug);
      setPropertyId(id);
      setLoading(false);
    };

    loadPropertyId();
  }, [propertySlug]);

 useEffect(() => {
  if (!propertyId) return;

 const fetchExperienceBannerImages = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyExperiancesBanner?propertyId=${propertyId}`,
        { cache: "no-store" }
      );
      const json = await res.json();

      if (json.errorMessage === "success" && Array.isArray(json.data)) {
        // Collect images from expBannerImages + expDetails.expImages
        const images =
          json.data.flatMap((banner) => {
            const bannerImgs = banner.expBannerImages?.map((img) => img.experiancesImages) || [];
            const detailImgs = banner.expDetails?.flatMap((exp) =>
              exp.expImages?.map((img) => img.experiancesImages) || []
            ) || [];
            return [...bannerImgs, ...detailImgs];
          }) || [];

        setBannerImages(images);
      } else {
        setBannerImages([]);
      }
    } catch (error) {
      console.error("Error fetching experience banner images:", error);
      setBannerImages([]);
    } finally {
      setLoading(false);
    }
  };
  

  fetchExperienceBannerImages();

}, [propertyId]);


  return (
    <>
      {/* <PropertyHeader
        brand_slug={brandSlug}
        id={propertyId}
        onSubmit={handleBookNowClick}
      /> */}
      <PropertyMainHeader id={propertyId || "6"} type={type || "resort"}></PropertyMainHeader>

     


      <section className="position-relative">
        <div className="position-absolute top-100 start-0 w-100 bg-white shadow">
          {isOpenFilterBar &&
            ReactDOM.createPortal(
              <section className="filter-bar-hotels-cin">
                <BookingEngineProvider>
                  <FilterBar
                selectedProperty={parseInt(cityDetails.property_Id)}
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
              </section>,
              document.body
            )}
        
        </div>
      </section>


      <section className="inner-no-banner-sec">
        <div className="container-fluid">
          <div className="winter-sec">
            <div className="row">
              { propertyId && <VirtualTourPropertyPage
                propertyId={propertyId}
                setShowModal={setShowModal}
                setSelectedRoom={setSelectedRoom}
                onSubmit={handleRoomBookNow}
              />}
              
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
