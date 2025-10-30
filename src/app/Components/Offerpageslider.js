"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function Offerpagesslider({ offers, setParentSwiper }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!offers || offers.length === 0) return null;

  return (
    <div className="roomacomo hotellist new-hotel-lists position-relative property-ooffer-sliderr">
      {/* Swiper Slider */}
      <Swiper
        modules={[Navigation, Pagination]}
        
        slidesPerView={2}
        spaceBetween={20}
        navigation={false}
        onSwiper={setParentSwiper}
        pagination={{clickable: true}}
        breakpoints={{
          0: { slidesPerView: 1 },
          576: { slidesPerView: 1.2 },
          768: { slidesPerView: 2 },
          992: { slidesPerView: 2 },
        }}
        style={{ padding: "0 60px" }} // add space for arrows
        className="offer-swiper"
      >
        {offers.map((offer, index) => {
          const imageUrl =
            offer.offersImages && offer.offersImages.length > 0
              ? offer.offersImages[0].offerImages
              : "/images/room/premium_room.png";

          const title = offer.offerTitle || offer.offerName || "Offer";
          const rawText = offer.offerDesc || offer.internalDescription || "";
          const text = rawText.replace(/<[^>]+>/g, "");

          return (
            <SwiperSlide key={offer.propertyOfferId || index}>
              <div className="h-100">
                <div className="winter-box-content-box property-offer-card-box property-offreer-box-min-hight">
                  {/* <img
                    src={imageUrl}
                    alt={title}
                    className="w-100 mb-2"
                    style={{ height: 220, objectFit: "cover", borderRadius: "10px" }}
                  /> */}
                  <h3 className="winter-box-heading text-start">{title}</h3>
                  <p className="display-block mt-2">
                    {text.length > 100 ? (
                      <>
                        {expandedIndex === index ? text : text.slice(0, 100) + "..."}
                        <span
                          onClick={() =>
                            setExpandedIndex(expandedIndex === index ? null : index)
                          }
                          style={{ cursor: "pointer", color: "#000", fontWeight: "600" }}
                        >
                          {expandedIndex === index ? " ❮❮" : " ❯❯"}
                        </span>
                      </>
                    ) : (
                      text
                    )}
                  </p>
                  
                  <div className="hotel-slider-box-content mt-2 d-flex justify-align-content-start align-content-center">
                    <div className="hotel-box-content mt-0">
                      <button className="box-btn know-more me-0 my-0">Explore</button>
                    </div>
                    <div className="hotel-box-content mt-0">
                      <button className="box-btn book-now">Book Now</button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
