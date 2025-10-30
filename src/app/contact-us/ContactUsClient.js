"use client";

import Image from 'next/image';
import Link from 'next/link';

import "swiper/css";
import "swiper/css/navigation";
import "../Styles/inner-hero.css"
import MainHeader from "../Common/MainHeader";
import { useEffect, useState, useRef } from "react";
import { getUserInfo } from "../../utilities/userInfo";
import ContactUsMain from '../Components/ContactUsMain';
import FilterBar from '../cin_booking_engine/Filterbar';
import { BookingEngineProvider } from '../cin_context/BookingEngineContext';
import { ChevronRight, Search, X } from "lucide-react";
import * as ReactDOM from "react-dom";

const ContactUsClient = () => {
  
    const [isOpen, setOpen] = useState(false);
    const [showFilterBar, setShowFilterBar] = useState(false);
    const filterBarRef = useRef(null);  
    const [isOpenFilterBar, openFilterBar] = useState(false);
    const [staahPropertyId, setStaahPropertyId] = useState(null);
    const [cityDetails, setCityDetails] = useState(null);
  
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
  
      // try {
      //   const response = await fetch(
      //     `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/Api/tracker/BookingWidged`,
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify(payload),
      //     }
      //   );
      //   await response.json();
      // } catch (err) {
      //   console.error("Error posting booking widget:", err);
      // }
    }
  const handleBookNow = async (prperty) => {
    if(isOpen){
      postBookingWidged("","", false,"Widget Open");
    }else{
      postBookingWidged("","", true,"Widget Closed");
    }
    
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
  return (
    <>
    <MainHeader onClick={handleBookNow}></MainHeader>
    <section className="hero-section-inner" ref={filterBarRef}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-100 inner-hero-image"
          poster="/img/banner-thumbnail.png"
        >
          <source src="/img/amritara-new-banner-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* <div className="inner-hero-content">
          <div className="text-center">
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleBookNowClick();
              }}
              className="search-icon-banner"
            >
              {isOpen ? <X /> : <Search />}
            </Link>
          </div>
        </div>

        {showFilterBar &&
          ReactDOM.createPortal(
            <section className="filter-bar-hotels-cin">
              <BookingEngineProvider>
                <FilterBar
                  selectedProperty={0}
                  openBookingBar={showFilterBar}
                  onClose={() => {
                    setShowFilterBar(false);
                    setOpen(false);
                  }}
                />
              </BookingEngineProvider>
            </section>,
            document.body
          )} */}
      </section>
    <section className="booking-form-section">
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
    <section className="about-us-page section-padding">
        <div className="container">
            <div className='heading-style'>
                <h1 className="mb-4 text-center global-heading">Amritara Hotels & Resorts</h1>
                {/* <span className='line-1'></span>
                <span className='line-2'></span> */}
            </div>
        </div>
        <ContactUsMain></ContactUsMain>
    </section>
    </>
  );
};
export default ContactUsClient;