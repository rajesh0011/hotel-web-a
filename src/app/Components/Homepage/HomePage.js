"use client";
import React, { useState, useRef, useEffect } from "react";
import Footer from "@/app/Common/Footer";
import dynamic from "next/dynamic";

const MainHeader = dynamic(() => import("../../Common/MainHeader"), { ssr: false });
const BannerSec = dynamic(() => import("./BannerSec"), { ssr: false });
const AboutSec = dynamic(() => import("./AboutSec"), { ssr: false });
const NestedSwiper = dynamic(() => import("./NestedSlider"), { ssr: false });
const NewOfferSlider = dynamic(() => import("./NewOfferSlider"), { ssr: false });
const ZonesList = dynamic(() => import("./ZonesList"), { ssr: false });
const UntoldStories = dynamic(() => import("./UntoldStories"), { ssr: false });
import * as ReactDOM from "react-dom";
import { X } from "lucide-react";
import { getUserInfo } from "../../../utilities/userInfo";
import FilterBar from "@/app/cin_booking_engine/Filterbar";
import { BookingEngineProvider } from "@/app/cin_context/BookingEngineContext";
import CorporateOffers from "./CorporateOffers";
import BookNowForm from "@/app/booking-engine-widget/BookNowForm";

export default function HomePage (){
  const [isOpen, setOpen] = useState(false);
  const [showFilterBar, setShowFilterBar] = useState(false);
  const filterBarRef = useRef(null);
  
  const [isOpenFilterBar, openFilterBar] = useState(false);
  const [staahPropertyId, setStaahPropertyId] = useState(null);
  const [cityDetails, setCityDetails] = useState(null);
  const handlePropertyBookNow = async (prperty) => {
    
    setOpen(!isOpen);
    setShowFilterBar(!showFilterBar);
    const label = prperty?.cityName;
    const value = prperty?.cityId;
    const property_Id = prperty?.staahPropertyId;
    setCityDetails({ label, value, property_Id });
    setStaahPropertyId(prperty?.staahPropertyId);
    
    if (filterBarRef.current) {
      filterBarRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = filterBarRef.current.querySelector("input, select, button");
      if (firstInput) firstInput.focus();
    }
  };
      async function postBookingWidged(rooms,mapping, isClose,ctaName,selectedPropertyId) {
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
         deviceType: resp?.deviceInfo?.deviceOS == "Unknown" ? resp?.deviceInfo?.platform : resp?.deviceInfo?.deviceOS,
         roomsName: rooms?.RoomName,
         packageName: mapping?.MappingName,
         isCartOpen: mapping?.MappingName ? "Y": "N",
         isCartEdit: "N",
         isCartClick: "N",
         isClose: isClose ? "Y" : "N",
        }
          //  const response = await fetch(
          //    `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/Api/tracker/BookingWidged`,
          //    {
          //      method: "POST",
          //      headers: {
          //        "Content-Type": "application/json",
          //      },
          //      body: JSON.stringify( payload ),
          //    }
          //  );
          //  const res = await response?.json();
     
         //console.log("res BookingWidged",res);
       }
const handleBookNowClick2 = async () => {
    {
      postBookingWidged("","", false,"Widget Open");
    }
    setOpen(!isOpen);
    setShowFilterBar(!showFilterBar);
  };
  
  return (
    <>
       
      <MainHeader onClick={handlePropertyBookNow}></MainHeader>
      {/* <section className="hero-section home-hero-section position-relative vh-100 overflow-hidden h-full flex items-center justify-center"> */}
     
     <section className="hero-section inner-gumlet-video overview-herosection overflow-hidden h-full items-center justify-center" ref={filterBarRef}>

       <div style={{position:"relative", aspectRatio:"16/9"}} className="home-banner-videeo-desk">
      <iframe 
            loading="lazy" title="Gumlet video player"
            src="https://play.gumlet.io/embed/68fc9a5e609b9e4625f33aae?background=true&autoplay=true&loop=true&disableControls=true"
            style={{border:"none", position: "absolute", top: "0", left: "0", height: "100%", width: "100%"}}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;">
          </iframe>
    </div>

    <div style={{position:"relative", aspectRatio:"674/1200"}} className="home-banner-videeo-mob">
      <iframe 
            loading="lazy" title="Gumlet video player"
            src="https://play.gumlet.io/embed/6900a9a55ecad45f6c86b2ac?background=true&autoplay=true&loop=true&disableControls=true"
            style={{border:"none", position: "absolute", top: "0", left: "0", height: "100%", width: "100%"}}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;">
          </iframe>
    </div>

      </section>

    {/* <section className="booking-form-section">
        <BookNowForm />
      </section> */}

      <section className="booking-form-section">
        <div
          className={`booking-search-bar-btn-div home-page-class`}
          style={{ zIndex: 10 }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              handlePropertyBookNow();
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
      <AboutSec></AboutSec>
      <NestedSwiper onClick={handlePropertyBookNow}></NestedSwiper>
      <UntoldStories onClick={handlePropertyBookNow}></UntoldStories>
      <ZonesList onClick={handlePropertyBookNow}></ZonesList>
      {/* <NewOfferSlider></NewOfferSlider> */}
      <CorporateOffers onClick={handlePropertyBookNow}></CorporateOffers>
    </>
  )
}

