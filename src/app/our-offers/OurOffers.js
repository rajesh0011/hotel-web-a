"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronRight, Search, X } from "lucide-react";
import offstyle from "../Components/Homepage/offers.module.css";
import { useEffect, useState, useRef } from "react";
import * as ReactDOM from "react-dom";
import { getUserInfo } from "../../utilities/userInfo";
import FilterBar from "@/app/cin_booking_engine/Filterbar";
import { BookingEngineProvider } from "@/app/cin_context/BookingEngineContext";
import MainHeader from "../Common/MainHeader";

const OurOffers = () => {
  const ImageHeight = {
    height: "300px",
    width: "100%",
    objectFit: "cover",
  };

  const [offers, setOffers] = useState([]);
  const [modalContent, setModalContent] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [showFilterBar, setShowFilterBar] = useState(false);
  const filterBarRef = useRef(null);

  // 📦 Booking tracking event
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

    try {
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
      await response.json();
    } catch (err) {
      console.error("Error posting booking widget:", err);
    }
  }

  // 📍 Open booking widget
  const handleBookNowClick = async () => {
    await postBookingWidged("", "", false, "Widget Open");
    setOpen(!isOpen);
    setShowFilterBar(!showFilterBar);
  };

  // 📍 Handle modal
  const handleKnowMore = (offer) => {
    setModalContent({
      title: offer.offerTitle || offer.offerName,
      description:
        offer.internalDescription ||
        offer.offerDesc ||
        "No description available.",
    });
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  // 🧠 Fetch corporate offers from API
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/offers/GetCorporateOffers`
        );
        const result = await response.json();

        if (result.errorCode === "0" && Array.isArray(result.data)) {
          // ✅ Filter corporate offers only
          const corporateOffers = result.data.filter(
            (offer) => offer.isCorporate === "Y"
          );
          setOffers(corporateOffers);
        } else {
          setOffers([]);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, []);

  return (
    <>
      <MainHeader onClick={handleBookNowClick} />

      {/* HERO SECTION */}
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

        <div className="inner-hero-content">
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
          )}
      </section>

      {/* OFFERS SECTION */}
      <section className="corporate-offers-section section-padding bg-lred">
      <div className={offstyle.mainhotelbox}>
        {offers.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            No corporate offers available.
          </p>
        ) : (
          <div className="container">
            <div className="global-heading-sec text-center mt-2 mb-3">
              <h2 className="global-heading">Our Offers</h2>
            </div>
                      <div className="row justify-content-center">
          {offers.map((offer) => {
              const imageUrl =
                offer.offersImages?.[0]?.offerImages || "/img/offer-placeholder.jpg";

              return (

                      
                        <div className="col-md-4" key={offer.propertyOfferId}>
                          <div className="corporate-page-offer-box">

                          <div className="offer-card">
                    {/* <div className="offer-image-wrapper">
                      <Image
                        src={imageUrl}
                        alt={offer.offerTitle || "Offer Image"}
                        width={400}
                        height={250}
                        className="offer-image"
                      />
                    </div> */}
                    <div className="offer-content">
                      <h4 className="offer-title">
                        {offer.offerTitle || offer.offerName}
                      </h4>
                      <p className="offer-desc two-line-text">
                        <span>
                          {offer?.offerDesc || ""}
                        </span>
                        
                      </p>
                      <div className="winter-box-btn mt-1">
                        <button className="box-btn book-now">
                          Book Now
                        </button>
                        <button
                          className="box-btn know-more"
                          onClick={() => handleKnowMore(offer)}
                        >
                          Know More
                        </button>
                        
                      </div>
                    </div>
                  </div>

                           
                          </div>
                        </div>


              )}            )}

                      </div>
                      </div>


          
        )}
      </div>
      </section>

      {/* MODAL */}
      {isModalOpen &&
        ReactDOM.createPortal(
          <div
            className="modal fade show new-type-popup"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body">
                  <h6 className="modal-title" id="offerModalLabel">
                    {modalContent.title}
                  </h6>
                  <button
                    type="button"
                    className="btn-close modal-close-btn-in-body"
                    onClick={handleCloseModal}
                    aria-label="Close"
                  >
                    x
                  </button>
                  <p>{modalContent.description}</p>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      <style jsx>{`
        .new-type-popup {
          backdrop-filter: blur(10px);
        }
        .new-type-popup .btn-close {
          background: #000 !important;
          border: none;
          color: white;
          font-size: 1rem;
          line-height: 1rem;
          height: 30px;
          width: 30px;
          position: absolute;
          top: 10px !important;
          right: 10px !important;
          cursor: pointer;
          opacity: 1;
        }
      `}</style>
    </>
  );
};

export default OurOffers;
