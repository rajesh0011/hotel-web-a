"use client";
import React, {useRef, useEffect, useState } from "react";
import * as ReactDOM from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";


export default function LatestOffers({ propertyId, onSubmit, BeId }) {
  const [offers, setOffers] = useState([]);
  const [modalContent, setModalContent] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [parentSwiper, setParentSwiper] = useState(null);
  const parentPrevRef = useRef(null);
  const parentNextRef = useRef(null);

  useEffect(() => {
    if (parentSwiper) {
      parentSwiper.params.navigation.prevEl = parentPrevRef.current;
      parentSwiper.params.navigation.nextEl = parentNextRef.current;
      parentSwiper.navigation.init();
      parentSwiper.navigation.update();
    }
  }, [parentSwiper]);

  // ✅ Fetch offers by propertyId
  useEffect(() => {
    if (!propertyId) return;

    fetch(
      `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/offers/GetOffersByProperty?propertyId=${propertyId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (
          data?.errorCode === "0" &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          // API returns data[], each has offersInfo[]
          const offersList = data.data.flatMap((item) => item.offersInfo || []);
          setOffers(offersList);
        } else {
          setOffers([]); // no offers
        }
      })
      .catch((err) => {
        console.error("Error fetching offers:", err);
        setOffers([]);
      })
      .finally(() => setLoading(false));
  }, [propertyId]);

  const handleBookNow = (property) => {
    if (onSubmit) onSubmit(property);
  };

  const handleKnowMore = (offer) => {
    setModalContent({
      title: offer.offerTitle || offer.offerName,
      description: offer.offerDesc || "No description available.",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 🚫 Don't render if still loading or no offers
  if (loading) return null;
  if (offers.length === 0) return null;

  return (
    <>
      <section className="sec-padding position-relative cursor-hideMobile" data-aos="fade-up">
        <div className="container">
          <div className="global-heading-sec text-center">
            <div className="row justify-content-center mb-2">
              <div className="col-md-9 md-offset-1">
                <h2 className="global-heading">Our Offers</h2>
              </div>
            </div>
          </div> 

           <div className="parent-control-button p-prev-button untold-stories-prev">
              <button
                ref={parentPrevRef}
                className="p-3 bg-gray-800 text-white rounded-full shadow-lg"
              >
                ❮
              </button>
            </div>
            <div className="parent-control-button p-next-button untold-stories-next">
              <button
                ref={parentNextRef}
                className="p-3 bg-gray-800 text-white rounded-full shadow-lg"
              >
                ❯
              </button>
            </div>

            
          <div className="winter-sec">
            <div className="row">
              <div>
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={20}
                  slidesPerView={1}
                  onSwiper={setParentSwiper}
                  navigation={false}
                  pagination={{clickable: true}}
                  breakpoints={{
                    500: { slidesPerView: 1 },
                    767: { slidesPerView: 2 },
                    1000: { slidesPerView: 3 },
                  }}
                  className="n-hotel-slider offer-section-overview-page px-3"
                >
                  {offers.map((offer, index) => {
                    const imageUrl =
                      offer.offersImages?.[0]?.offerImages ||
                      "/images/event/event-img1.png";

                    return (
                      <SwiperSlide key={offer.propertyOfferId || index} className="py-3">
                        {/* Offer Image */}
                        {/* <div className="winter-box shadow hotel-box mt-2 no-image-bg">
                          <Image
                            src={imageUrl}
                            alt={offer.offerTitle || "Offer"}
                            className="w-100 primary-radius"
                            width={264}
                            height={220}
                            quality={75}
                          />
                        </div> */}

                        {/* Offer Content */}
                        <div className="winter-box-content-box property-offer-card-box property-offreer-box-min-hight">
                          <div className="winter-box-content">
                            <div className="hotel-box-content">
                              <h3 className="winter-box-heading mb-2 offer-box-heding no-cursor">
                                {offer.offerTitle || offer.offerName}
                              </h3>
                            </div>
                            <p className="display-block one-line-text">
                              {/* <span
                                dangerouslySetInnerHTML={{
                                  __html:
                                    offer.offerDesc?.slice(0, 100) ||
                                    "No description available.",
                                }}
                              /> */}
                              <span>
                                {offer.offerDesc
                                  ? offer.offerDesc.replace(/<[^>]*>/g, '').slice(0, 100)
                                  : "No description available."}
                              </span>
                            </p>
                            <div className="winter-box-btn">
                             
                              {/* <button
                                className="box-btn book-now"
                                onClick={() => handleBookNow(offer)}
                              >
                                Book Now
                              </button> */}

                              <Link
                              href="#"
                              onClick={() => handleBookNow(offer)}
                              //  href={`https://bookings.amritara.co.in/?chainId=5971&propertyId=${BeId}&_gl=1*1d9irrh*_gcl_au*MzgxMDEyODcxLjE3NTgyNjIxOTIuNzY2OTMwNzIwLjE3NTkzMTE2MjAuMTc1OTMxMTcyMA..*_ga*NzUyODI0NDE0LjE3NTgyNjIxOTI.*_ga_7XSGQLL96K*czE3NjA0NDUzOTUkbzQ4JGcxJHQxNzYwNDQ2NTA2JGo2MCRsMCRoODE1NTgwNjUw*_ga_DVBE6SS569*czE3NjA0NDUzOTQkbzQ1JGcxJHQxNzYwNDQ1NDY2JGo2MCRsMCRoOTgzMzg5ODY.`}
                              //  target="_blank" 
                               className="box-btn book-now py-2"
                               >Book Now</Link>

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

                {/* Modal */}
                {isModalOpen &&
                  ReactDOM.createPortal(
                    <div
                      className="modal fade show new-type-popup"
                      style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)",
                      }}
                      tabIndex="-1"
                      aria-labelledby="offerModalLabel"
                      aria-hidden="false"
                    >
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-body">
                            <h6 className="modal-title" id="offerModalLabel">
                              {modalContent.title}
                            </h6>
                            <button
                              type="button"
                              className="btn-close"
                              onClick={handleCloseModal}
                              aria-label="Close"
                            >
                              x
                            </button>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: modalContent.description,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .new-type-popup {
          backdrop-filter: blur(10px);
        }
        .new-type-popup .btn-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #000;
          height: 30px;
          width: 30px;
          position: absolute;
          top: 0px;
          right: 10px;
          cursor: pointer;
        }
        .new-type-popup .modal-body p {
          padding-left: 1rem;
          padding-right: 1rem;
        }
        .new-type-popup .modal-body {
          padding-bottom: 1rem;
        }
      `}</style>
    </>
  );
}
