"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import * as ReactDOM from "react-dom";
import Image from "next/image";
import Link from "next/link";

export default function CorporateOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  // 📦 Fetch offers data
  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/offers/GetCorporateOffers`
        );
        const data = await res.json();

        if (data.errorCode === "0" && Array.isArray(data.data)) {
          const corporateOffers = data.data.filter(
            (offer) => offer.isCorporate === "Y"
          );
          setOffers(corporateOffers);
        } else {
          setError("Failed to fetch offers");
        }
      } catch (err) {
        setError("Something went wrong while fetching offers");
      } finally {
        setLoading(false);
      }
    }

    fetchOffers();
  }, []);

  const handleKnowMore = (offer) => {
    setModalContent({
      title: offer.offerTitle || offer.offerName,
      description:
        offer.internalDescription ||
        offer.offerDesc ||
        "No detailed description available.",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">Loading offers...</div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  if (offers.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No corporate offers available.
      </div>
    );
  }

  return (
    <>
      <section className="corporate-offers-section section-padding bg-lred">
        <div className="container">
          <div className="global-heading-sec text-center">
            <h2 className="global-heading">Our Offers</h2>
          </div>

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={3}
            navigation
            pagination={false}
            breakpoints={{
              320: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {offers.map((offer) => {
              const imageUrl =
                offer.offersImages?.[0]?.offerImages ||
                "/img/offer-placeholder.jpg";

              return (
                <SwiperSlide key={offer.propertyOfferId}>
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
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>

      {/* Popup Modal */}
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
                  <p className="p-3">{modalContent.description}</p>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      <style jsx>{`
        .offer-card {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          background: #fff;
          height: 100%;
          transition: transform 0.3s ease;
        }
        .offer-card:hover {
          transform: translateY(-5px);
        }
        .offer-image-wrapper {
          width: 100%;
          height: 250px;
          overflow: hidden;
        }
        .offer-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .offer-content {
          padding: 1rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .offer-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .offer-desc {
          font-size: 0.95rem;
          color: #444;
          margin-bottom: 1rem;
        }
        .offer-actions {
          display: flex;
          gap: 10px;
        }
        .learn-more-btn,
        .book-now-btn {
          padding: 8px 14px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }
        .learn-more-btn {
          background-color: #000;
          color: #fff;
        }
        .learn-more-btn:hover {
          background-color: #333;
        }
        .book-now-btn {
          background-color: #e60023;
          color: #fff;
          text-decoration: none;
        }
        .book-now-btn:hover {
          background-color: #c3001c;
        }
        /* Popup Modal Styles */
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
}
