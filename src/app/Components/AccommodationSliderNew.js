"use client";

import React, { useRef, useEffect, useState } from "react";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";


export default function AccommodationSliderNew({
  propertyId,
  setShowModal,
  setSelectedRoom,
  onSubmit,
  BeId,
}) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerData, setBannerData] = useState({});
  const [showFullText, setShowFullText] = useState(false);

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



  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/rooms/GetRoomsByProperty?propertyId=${propertyId}`
        );
        const json = await res.json();

        if (
          json?.errorCode === "0" &&
          Array.isArray(json.data) &&
          json.data.length > 0
        ) {
          const banner = json.data[0];
          setBannerData({
            title: banner?.roomBannerTitle || "",
            desc: banner?.roomBannerDesc || "",
          });

          const allRooms = json.data
            .flatMap((item) =>
              Array.isArray(item.roomsInfo) ? item.roomsInfo : []
            )
            .filter((room) => String(room.enabled).toLowerCase() === "e");

          setRooms(allRooms);
        } else {
          console.warn("No data found in API");
          setRooms([]);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) fetchRooms();
  }, [propertyId]);

  if (loading) return <p className="text-center py-4">Loading rooms...</p>;
  if (!rooms.length)
    return <p className="text-center py-4">No rooms available.</p>;

  const handleViewRates = (room) => {
    onSubmit(room);
  };

  return (
    <section className="mt-3 position-relative cursor-hideMobile" data-aos="fade-up">
      <div className="global-heading-sec text-center">
        <div className="container">
          <h1 className="global-heading pt-4">{bannerData.title}</h1>

            <div className="parent-control-button p-prev-button Offers-slider-prev">
            <button
              ref={parentPrevRef}
              className="p-3 bg-gray-800 text-white rounded-full shadow-lg"
            >
              ❮
            </button>
          </div>
          <div className="parent-control-button p-next-button Offers-slider-next">
            <button
              ref={parentNextRef}
              className="p-3 bg-gray-800 text-white rounded-full shadow-lg"
            >
              ❯
            </button>
          </div>

          {/* <p className="mb-2 whitespace-pre-line">
            {bannerData?.desc?.length > 150 ? (
              <>
                {showFullText
                  ? bannerData?.desc
                  : bannerData?.desc.slice(0, 150) + "..."}
                <span
                  onClick={() => setShowFullText(!showFullText)}
                  style={{
                    cursor: "pointer",
                    color: "#000",
                    fontWeight: "600",
                  }}
                >
                  {showFullText ? " ❮❮" : " ❯❯"}
                </span>
              </>
            ) : (
              bannerData?.desc
            )}
          </p> */}
        </div>
      </div>

 <div className="container pushed-wrapper cursor-hideMobile">
            <div className="winter-sec property-room-page-sec">
          <div className="relative px-4 md:px-16 py-12 overflow-hidden roombtn">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={10}
              slidesPerView={2}
              loop={true}
              pagination={{clickable: true}}
              navigation={false}
              
              onSwiper={setParentSwiper}
              breakpoints={{
                320: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 2 },
              }}
              className="relative"
            >
              {rooms.length > 0 && rooms.map((room, index) => (
                <SwiperSlide key={index} className="cityexpr1">
                  <div className="winter-box hotel-box room-image-on-room">
                    {/* Image Swiper for room images */}
                    <Swiper
                      modules={[Pagination, Autoplay]}
                      autoplay={{ delay: 5000, disableOnInteraction: false }}
                      pagination={{ clickable: true }}
                      className="room-image-swiper mb-3"
                    >
                      {(room.roomImages && room.roomImages.length > 0
                        ? room.roomImages
                        : [{ roomImage: "/amritara-dummy-room.jpeg" }]
                      ).map((img, imgIdx) => (
                        <SwiperSlide key={imgIdx}>
                          <div className="no-image-box">
                             <Image
                            // src="/amritara-dummy-room.jpeg"
                            src={img.roomImage || "/amritara-dummy-room.jpeg"}
                            alt={room.roomName}
                            width={600}
                            height={500}
                            quality={100}
                            className="w-100 object-cover"
                          />
                          </div>
                         
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <div className="accommodation-box-content">
                      <div className="hotel-box-content mt-0">
                        <h3 className="winter-box-heading mt-3">{room.roomName}</h3>
                        <p className="winter-box-text text-with-rd-mr text-style-none one-line-text">
                          <span>{(room.roomDesc || "").replace(/<[^>]+>/g, "").slice(0, 80)}...</span>
                          {/* <button
                            className="read-more-btnn text-style-none "
                            onClick={() => {
                              setSelectedRoom(room);
                              setShowModal(true);
                            }}
                          >
                             read more
                          </button> */}
                        </p>
                        {/* Example price field if available */}
                        {/* <p className="f-20-new acc-price mt-4">
                          ₹ {room.price || "N/A"}{" "}
                          <span className="f-12-new inr-text mt-0">
                            INR/Night
                          </span>
                        </p> */}
                        <div className="d-flex mt-3">
                          <button
                            className="box-btn know-more"
                            onClick={() => {
                              setSelectedRoom(room);
                              setShowModal(true);
                            }}
                          >
                           View more
                          </button>
                          {/* <Link
                            href="#"
                            className="box-btn book-now button-secondary"
                            onClick={(e) => {
                              e.preventDefault();
                              handleViewRates(room);
                            }}
                          >
                            Book Now
                          </Link> */}

                           <Link href={`https://bookings.amritara.co.in/?chainId=5971&propertyId=${BeId}&_gl=1*1d9irrh*_gcl_au*MzgxMDEyODcxLjE3NTgyNjIxOTIuNzY2OTMwNzIwLjE3NTkzMTE2MjAuMTc1OTMxMTcyMA..*_ga*NzUyODI0NDE0LjE3NTgyNjIxOTI.*_ga_7XSGQLL96K*czE3NjA0NDUzOTUkbzQ4JGcxJHQxNzYwNDQ2NTA2JGo2MCRsMCRoODE1NTgwNjUw*_ga_DVBE6SS569*czE3NjA0NDUzOTQkbzQ1JGcxJHQxNzYwNDQ1NDY2JGo2MCRsMCRoOTgzMzg5ODY.`}
target="_blank" className="box-btn book-now">Book Now</Link>

                          {/* <button
  className="box-btn book-now button-secondary"
  onClick={() => {
    if (BeId) {
      const bookingUrl = `https://bookings.amritara.co.in/?chainId=5971&propertyId=${BeId}&_gl=1*1d9irrh*_gcl_au*MzgxMDEyODcxLjE3NTgyNjIxOTIuNzY2OTMwNzIwLjE3NTkzMTE2MjAuMTc1OTMxMTcyMA..*_ga*NzUyODI0NDE0LjE3NTgyNjIxOTI.*_ga_7XSGQLL96K*czE3NjA0NDUzOTUkbzQ4JGcxJHQxNzYwNDQ2NTA2JGo2MCRsMCRoODE1NTgwNjUw*_ga_DVBE6SS569*czE3NjA0NDUzOTQkbzQ1JGcxJHQxNzYwNDQ1NDY2JGo2MCRsMCRoOTgzMzg5ODY.`;
      window.open(bookingUrl, "_blank"); // opens in new tab
    } else {
      alert("Booking not available for this property.");
    }
  }}
>
  Book Now
</button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          </div>
          
          </div>
    </section>
  );
}
