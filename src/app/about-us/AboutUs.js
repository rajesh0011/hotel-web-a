"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "../Styles/inner-hero.css"
import { ChevronRight, Search, X  } from 'lucide-react';
import offstyle from "../Components/Homepage/offers.module.css";
import { useEffect, useState, useRef} from "react";
import * as ReactDOM from "react-dom";
import { getUserInfo } from "../../utilities/userInfo";
import FilterBar from "@/app/cin_booking_engine/Filterbar";
import { BookingEngineProvider } from "@/app/cin_context/BookingEngineContext";
import MainHeader from "../Common/MainHeader";
import BookNowForm from "../booking-engine-widget/BookNowForm";

const AboutUs = () => {
    const [isOpen, setOpen] = useState(false);
    const [showFilterBar, setShowFilterBar] = useState(false);
    const filterBarRef = useRef(null);
  const [isOpenFilterBar, openFilterBar] = useState(false);
  const [staahPropertyId, setStaahPropertyId] = useState(null);
  const [cityDetails, setCityDetails] = useState(null);
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
const handleBookNowClick = async () => {
    {
      postBookingWidged("","", false,"Widget Open");
    }
    setOpen(!isOpen);
    setShowFilterBar(!showFilterBar);
  };

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
    {/* <MainHeader onClick={handleBookNowClick}></MainHeader> */}
    <MainHeader onClick={handleBookNow}></MainHeader>

    
    <section className="hero-section-inner" ref={filterBarRef}>
        <video autoPlay loop muted playsInline className="w-100 inner-hero-image" thumbnail="/img/banner-thumbnail.png"
            poster="/img/banner-thumbnail.png"
          >
            <source src="/img/amritara-new-banner-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        {/* <Image src="/img/popular-1.jpeg" alt="About Us Hero Image" height={500} width={1500} className="w-100 inner-hero-image" /> */}
        {/* <div className="inner-hero-content d-none">
            <div className="text-center">
                <Link href="#" onClick={(e) => {
              e.preventDefault();
              handleBookNowClick();
            }} className="search-icon-banner">
          {isOpen ? <X /> :<Search />}
        </Link>
            </div>
        </div> */}
    </section>

    {/* <section className="booking-form-section booking-form-inner-property-pages">
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
                        <h1 className="mb-4 text-center global-heading">ABOUT AMRITARA HOTELS & RESORTS</h1>
                    </div>
                    
        
                <div className="row align-items-center mb-5">
                    
                    <div className="col-md-6 order-lg-2">
                        <h4 className="h5 mb-3">At Amritara Hotels, we invite you on an extraordinary journey where every moment is crafted to perfection.</h4>
                        <p className='text-justify'>
                            Experience the unparalleled hospitality of Amritara Hotels and Resorts, with 28 luxurious 
                            properties in all 4 zones spanning across 24 cities in 11 states, including Jammu & Kashmir, 
                            Punjab, Himachal Pradesh, Uttarakhand, Rajasthan, Sikkim, Kerala, Goa, Uttar Pradesh, 
                            and Karnataka.
                        </p>
                        <p className='text-justify'>
                            From the serene landscapes of the Himalayas to the vibrant beaches of Goa, 
                            each destination offers a unique journey, ensuring unforgettable stays and cherished memories.
                            Begin a new chapter in your journey with Amritara Hotels, where every stay is a gateway to
                            unforgettable experiences.
                        </p>
                   
                    </div>
                    <div className="col-md-6 ">
                    <Image height={500} width={800}
                        src="/img/amritara-about-img.jpg"
                        alt="Luxury Stay"
                        className="img-fluid rounded shadow-sm"
                    />
                    </div>
                </div>
        
                <div className="row align-items-center">
                    
                    <div className="col-md-6">
                        <div className='heading-style'>
                            <h2 className="global-heading">Our Story</h2>
                        </div>
                        
                        <p className='text-justify'>
                            &ldquo;Amritara&rdquo; derives its origins from Sanskrit. &lsquo;Amrit&rsquo; means  pure, the nectar of gods or holy water and &lsquo;Tara&rsquo; means stars or celestial bodies. Amritara promises an experience for the mature, adventurous traveller. Our leisure travel offerings are geared toward rejuvenating, real-life experiences for our guests.
                        </p>
                    </div>
                    <div className="col-md-6">
                    <Image height={500} width={800}
                        src="/img/amritara-about-img.jpg"
                        alt="Luxury Stay"
                        className="img-fluid rounded shadow-sm"
                    />
                    </div>
                </div>
                </div>
            </section>
      
    </>
  );
};

export default AboutUs;
