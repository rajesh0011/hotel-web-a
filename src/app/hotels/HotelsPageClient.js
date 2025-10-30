"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Search, X } from "lucide-react";
import axios from "axios";
import MainHeader from "../Common/MainHeader";
import "../Styles/inner-hero.css";
import Image from "next/image";
import * as ReactDOM from "react-dom";
import { getUserInfo } from "../../utilities/userInfo";
import FilterBar from "@/app/cin_booking_engine/Filterbar";
import { BookingEngineProvider } from "@/app/cin_context/BookingEngineContext";
import BookNowForm from "../booking-engine-widget/BookNowForm";
import NoImagePlaceholder from '../../../public/no_image1.jpg'

// const NoImagePlaceholder = "/no_image1.jpg";

export default function HotelsPageClient() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const [properties, setProperties] = useState([]);
  const [cityHotels, setCityHotels] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [showFilterBar, setShowFilterBar] = useState(false);
  const filterBarRef = useRef(null);
  const [propertyId, setPropertyId] = useState(null);
  const [cityDetails, setCityDetails] = useState(null);
  const [isOpenFilterBar, openFilterBar] = useState(false);
  const [staahPropertyId, setStaahPropertyId] = useState(null);
  const [isFilterBarWithPropertyId, openFilterBarWithPropertyId] =
    useState(false);
  async function postBookingWidged(rooms, mapping, isClose, ctaName, selectedPropertyId) {
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
      isCartOpen: mapping?.MappingName ? "Y" : "N",
      isCartEdit: "N",
      isCartClick: "N",
      isClose: isClose ? "Y" : "N",
    }
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/Api/tracker/BookingWidged`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(payload),
    //   }
    // );
    // const res = await response?.json();

    //console.log("res BookingWidged",res);
  }
  const fetchData = async () => {
    try {
      const [cityRes, propertyRes] = await Promise.all([
        axios.get((`${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetCityList`)),
        axios.get((`${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`)),
      ]);

      if (cityRes?.data?.data) {
        
        setCityDetails({
          label: cityRes.data.data.cityName || "",
          value: cityRes.data.data.cityId || "",
          property_Id: cityRes.data.data.staahPropertyId || null,
        });
        setCities(cityRes.data.data);
        if (cityRes.data.data.length > 0) {
          setSelectedCity(null); // default first city
        }
      }

      if (propertyRes?.data?.data) {
        setProperties(propertyRes.data.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
  if (properties.length === 0) return;

  // Create a shallow copy of the properties array before sorting
  const sortedProperties = [...properties].sort((a, b) => {
    const cityA = a.cityName?.toLowerCase() || ''; // Default to an empty string if cityName is missing
    const cityB = b.cityName?.toLowerCase() || '';
    if (cityA < cityB) {
      return -1;  // Sort a before b
    }
    if (cityA > cityB) {
      return 1;   // Sort b before a
    }
    return 0;  // If both cities are the same, leave them unchanged
  });
  
    console.log('Sorted Properties:', sortedProperties);

  // If no city is selected, show all hotels
  if (!selectedCity) {
    setFilteredHotels(sortedProperties);
  } else {
    // Otherwise, filter hotels based on selected city and then sort them
    const hotelsForCity = sortedProperties.filter(
      (prop) => prop.cityId === selectedCity
    );
    setFilteredHotels(hotelsForCity);
  }
}, [selectedCity, properties]);



  const getOverviewSlug = (p) => {
    const t = (p?.propertyType ?? "").toString().toLowerCase();

    // if your API sends names:
    if (t.includes("resort")) return "resort-overview";
    if (t.includes("hotel")) return "hotel-overview";
    return "property-overview"; // safe fallback
  };

  // const handleBookNowClick2 = async () => {
  //   {
  //     postBookingWidged("", "", false, "Widget Open");
  //   }
  //   setOpen(!isOpen);
  //   setShowFilterBar(!showFilterBar);
  // };
  
  const handleBookNowClick = async () => {
    if(isOpen){
      postBookingWidged("","", true,"Widget Closed");
    }else{
      postBookingWidged("","", false,"Widget Open");
    }
    
    if (filterBarRef.current) {
      filterBarRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = filterBarRef.current.querySelector("input, select, button");
      if (firstInput) firstInput.focus();
    }
    setOpen(!isOpen);
    openFilterBar(!isOpenFilterBar);
    setShowFilterBar(!showFilterBar);
  };
 
  const handleBookNowSlider = async (dataBookNow) => {
    if(isOpen){
      postBookingWidged("","", false,"Widget Open");
    }else{
      postBookingWidged("","", true,"Widget Closed");
    }
    setOpen(!isOpen);
    const label = dataBookNow?.cityName;
    const value = dataBookNow?.cityId;
    const property_Id = dataBookNow?.staahPropertyId;
    setCityDetails({ label, value, property_Id });
    setStaahPropertyId(dataBookNow?.staahPropertyId);
    openFilterBarWithPropertyId(!isFilterBarWithPropertyId);
  };
  return (
    <>
      <MainHeader onClick={handleBookNowSlider} />
      {/* <MainHeader onClick={handleBookNowClick2} /> */}

{/* <section className="booking-form-section booking-form-inner-property-pages">
                    <BookNowForm />
                  </section> */}
      {/* Hero Section */}
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
      <section className="booking-form-section">
         <div
                  className={`booking-search-bar-btn-div home-page-class`}
                  style={{ zIndex: 10 }}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleBookNowSlider();
                    }}
                    className="booking-toggle-btn"
                  >
                    {isOpen ? <X size={18} color="black" /> : "Book Now"}
                  </button>
                </div>
          {isFilterBarWithPropertyId && ReactDOM.createPortal(
              <BookingEngineProvider>
              <FilterBar
                selectedProperty={parseInt(staahPropertyId)}
                cityDetails={cityDetails}
                openBookingBar={isFilterBarWithPropertyId}
                //propertyPageUrl={propertyPageUrl}
                onClose={() => {
                  openFilterBarWithPropertyId(false);
                  setOpen(false);
                }}
              />
            </BookingEngineProvider>,
              document.body
          )}
        {showFilterBar && ReactDOM.createPortal(
            <BookingEngineProvider>
              <FilterBar
                selectedProperty={0}
                openBookingBar={showFilterBar}
                onClose={() => {
                  setShowFilterBar(false);
                  setOpen(false);
                }}
              />
            </BookingEngineProvider>,
          document.body
        )}
      </section>

      {/* Intro Section */}
      <section className="about-us-page section-padding">
        <div className="container">
          <div className="heading-style">
            <h1 className="mb-4 text-center global-heading">Our Hotels</h1>
          </div>
          <div className="row align-items-center">
            <div className="col-md-12 text-center">
              <h4 className="h5 mb-3">
                At Amritara Hotels, we invite you on an extraordinary journey
                where every moment is crafted to perfection.
              </h4>
              <p className="text-center">
                Discover the best luxury hotels in India, offering heritage,
                comfort, and top amenities. Book your stay with Amritara now!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters + List */}
      <section className="hotel-list-box mb-5 our-hotels-page">
        <div className="container">
          {/* City Select */}
          <div className="row justify-content-center mb-4">
            <div className="col-md-6">
              <label className="ps-2">Select City</label>
              <select
                  className="form-select"
                  value={selectedCity || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedCity(value ? Number(value) : null);
                  }}
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city.cityId} value={city.cityId}>
                      {city.cityName}
                    </option>
                  ))}
                </select>
            </div>
          </div>

          {/* Hotels List */}
          <div className="row justify-content-center">
            {(showAll ? filteredHotels : filteredHotels.slice(0, 4)).map(
              (hotel) => (
                <div key={hotel.propertyId} className="col-md-6 mb-4">
                  <div className="hotel-card h-100 border-0 ">
                    <div className="hotel-card-body">
                      <Image
                        // src={NoImagePlaceholder}
                        src={hotel?.images?.[0]?.propertyImage || NoImagePlaceholder}
                        alt={hotel.propertyName}
                        className="card-img-top"
                        width={800}
                        height={250}
                        style={{ objectFit: "cover" }}
                      />
                      {console.log("NoImagePlaceholder", hotel?.images?.[0]?.propertyImage)}
                      <h5 className="card-title mt-3">{hotel.propertyName} - {hotel.cityName}</h5>
                      <p className="card-text two-line-text">
                        <span dangerouslySetInnerHTML={{
                          __html:
                            (hotel.shortDescription||
                              "No description available") + "...",
                        }} />
                      </p>
                        
                      
                      <div className="hotel-bottom-box-cta-n-content">
                        <div className="cta-buttons-box d-flex align-content-center">

                          <Link href={{
                            pathname: `/${hotel.propertySlug}/${getOverviewSlug(hotel)}`,
                          }}
                            className="box-btn know-more"
                          >
                            Explore More
                          </Link>

                          {/* <Link href="#" className="book-now-btn">
                            Book Now
                          </Link> */}

                          <Link
                          href="#"
                          //  href={`https://bookings.amritara.co.in/?chainId=5971&propertyId=${hotel.staahBookingId}&_gl=1*1d9irrh*_gcl_au*MzgxMDEyODcxLjE3NTgyNjIxOTIuNzY2OTMwNzIwLjE3NTkzMTE2MjAuMTc1OTMxMTcyMA..*_ga*NzUyODI0NDE0LjE3NTgyNjIxOTI.*_ga_7XSGQLL96K*czE3NjA0NDUzOTUkbzQ4JGcxJHQxNzYwNDQ2NTA2JGo2MCRsMCRoODE1NTgwNjUw*_ga_DVBE6SS569*czE3NjA0NDUzOTQkbzQ1JGcxJHQxNzYwNDQ1NDY2JGo2MCRsMCRoOTgzMzg5ODY.`}
                            // target="_blank" 
                            className="box-btn book-now"
                            onClick={()=>{handleBookNowSlider(hotel)}} >Book Now</Link>

                          {/* <button
  className="book-now-btn"
  onClick={() => {
    if (hotel?.staahBookingId) {
      const bookingUrl = `https://bookings.amritara.co.in/?chainId=5971&propertyId=${hotel.staahBookingId}&_gl=1*1d9irrh*_gcl_au*MzgxMDEyODcxLjE3NTgyNjIxOTIuNzY2OTMwNzIwLjE3NTkzMTE2MjAuMTc1OTMxMTcyMA..*_ga*NzUyODI0NDE0LjE3NTgyNjIxOTI.*_ga_7XSGQLL96K*czE3NjA0NDUzOTUkbzQ4JGcxJHQxNzYwNDQ2NTA2JGo2MCRsMCRoODE1NTgwNjUw*_ga_DVBE6SS569*czE3NjA0NDUzOTQkbzQ1JGcxJHQxNzYwNDQ1NDY2JGo2MCRsMCRoOTgzMzg5ODY.`;
      window.open(bookingUrl, "_blank"); // opens in new tab
    } else {
      alert("Booking not available for this property.");
    }
  }}
>
  Book Now
</button> */}
                        </div>
                        <div className="price-content-hotel-boxx">
                          <p className="price-starts-hotel">Starting From</p>
                          <p className="price-starts-rate-here">INR <strong>{hotel.staahPropertyPrice}</strong>/Night </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}

            {filteredHotels.length > 4 && (
              <div className="col-md-12 text-center mt-3">
                <button
                  className="primary-btns"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "View Less" : "View More"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
