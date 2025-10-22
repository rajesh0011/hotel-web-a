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

const NoImagePlaceholder = "/no_image1.jpg";

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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/Api/tracker/BookingWidged`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    const res = await response?.json();

    //console.log("res BookingWidged",res);
  }
  const fetchData = async () => {
    try {
      const [cityRes, propertyRes] = await Promise.all([
        axios.get((`${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetCityList`)),
        axios.get((`${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`)),
      ]);

      if (cityRes?.data?.data) {
        setCities(cityRes.data.data);
        if (cityRes.data.data.length > 0) {
          setSelectedCity(cityRes.data.data[0].cityId); // default first city
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
    if (!selectedCity || properties.length === 0) return;

    const hotelsForCity = properties.filter(
      (prop) => prop.cityId === selectedCity
    );
    setCityHotels(hotelsForCity);
  }, [selectedCity, properties]);

  useEffect(() => {
    let filtered = cityHotels;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (prop) =>
          prop.propertyName.toLowerCase().includes(lower) ||
          prop.shortDescription?.toLowerCase().includes(lower)
      );
    }

    setFilteredHotels(filtered);
  }, [cityHotels, searchTerm]);



  const getOverviewSlug = (p) => {
    const t = (p?.propertyType ?? "").toString().toLowerCase();

    // if your API sends names:
    if (t.includes("resort")) return "resort-overview";
    if (t.includes("hotel")) return "hotel-overview";
    return "property-overview"; // safe fallback
  };

  const handleBookNowClick2 = async () => {
    {
      postBookingWidged("", "", false, "Widget Open");
    }
    setOpen(!isOpen);
    setShowFilterBar(!showFilterBar);
  };
  return (
    <>
      <MainHeader onClick={handleBookNowClick2} />

<section className="booking-form-section booking-form-inner-property-pages">
                    <BookNowForm />
                  </section>
      {/* Hero Section */}
      <section className="hero-section-inner">
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
        {/* <div className="hero-bottom-part-ab">
        <Link href="#" onClick={(e) => {
              e.preventDefault();
              handleBookNowClick2();
            }} className="search-icon-banner">
          {isOpen ? <X /> :<Search />}
        </Link>
      </div>  */}
        <div className="inner-hero-content d-none">
          <div className="text-center">
            <Link href="#" onClick={(e) => {
              e.preventDefault();
              handleBookNowClick2();
            }} className="search-icon-banner">
              {isOpen ? <X /> : <Search />}
            </Link>
          </div>
        </div>

        {showFilterBar && ReactDOM.createPortal(
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
                onChange={(e) => setSelectedCity(Number(e.target.value))}
              >
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
                      <h5 className="card-title mt-3">{hotel.propertyName}</h5>
                      <p className="card-text two-line-text">
                        <span dangerouslySetInnerHTML={{
                          __html:
                            (hotel.shortDescription||
                              "No description available") + "...",
                        }} />
                      </p>
                        
                      
                      <div className="hotel-bottom-box-cta-n-content">
                        <div className="cta-buttons-box">

                          <Link href={{
                            pathname: `/${hotel.propertySlug}/${getOverviewSlug(hotel)}`,
                          }}
                            className="explore-more-btn"
                          >
                            Explore More
                          </Link>

                          {/* <Link href="#" className="book-now-btn">
                            Book Now
                          </Link> */}

                          <Link href={`https://bookings.amritara.co.in/?chainId=5971&propertyId=${hotel.staahBookingId}&_gl=1*1d9irrh*_gcl_au*MzgxMDEyODcxLjE3NTgyNjIxOTIuNzY2OTMwNzIwLjE3NTkzMTE2MjAuMTc1OTMxMTcyMA..*_ga*NzUyODI0NDE0LjE3NTgyNjIxOTI.*_ga_7XSGQLL96K*czE3NjA0NDUzOTUkbzQ4JGcxJHQxNzYwNDQ2NTA2JGo2MCRsMCRoODE1NTgwNjUw*_ga_DVBE6SS569*czE3NjA0NDUzOTQkbzQ1JGcxJHQxNzYwNDQ1NDY2JGo2MCRsMCRoOTgzMzg5ODY.`}
target="_blank" className="book-now-btn">Book Now</Link>

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
