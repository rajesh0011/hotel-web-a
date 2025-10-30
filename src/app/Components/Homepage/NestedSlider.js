"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./nested-slider.css";
import Link from "next/link";

export default function NestedSwiper({onClick}) {
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState({});
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

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const catRes = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetDisplayCategoryList`
        );
        const catData = await catRes.json();
        if (catData.errorCode === "0") {
          setCategories(catData.data);
        }
      } catch (err) {
        console.error("API Error:", err);
      }
    }

    fetchCategories();
  }, []);

  // Fetch properties for each category dynamically
  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);

        const newProperties = {}; // Store properties by category ID
        for (const category of categories) {
          const categoryId = category.displayCategoryId;
          const propRes = await fetch(
            `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyByFilter?CategoryId=${categoryId}`
          );
          const propData = await propRes.json();

          if (propData.errorCode === "0") {
            newProperties[categoryId] = propData.data;
          }
        }
        
        setProperties(newProperties); // Update state with properties grouped by category ID
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (categories.length > 0) {
      fetchProperties();
    }
  }, [categories]);

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  const getOverviewSlug = (p) => {
    const t = (p?.propertyType ?? "").toString().toLowerCase();

    // if your API sends names:
    if (t.includes("resort")) return "resort-overview";
    if (t.includes("hotel")) return "hotel-overview";
    return "property-overview"; // safe fallback
  };

  const handleBookNowSlider = async (dataBookNow) => {
    onClick(dataBookNow);
  };
  return (
    <div className="main-nested-slider mx-auto our-collection-section section-padding">
      <div className="container">
        <h3 className="main-section-title global-heading">Our Collection</h3>
        <div className="parent-control-button p-prev-button">
          <button
            ref={parentPrevRef}
            className="p-3 bg-gray-800 text-white rounded-full shadow-lg"
          >
            ❮
          </button>
        </div>
        <div className="parent-control-button p-next-button">
          <button
            ref={parentNextRef}
            className="p-3 bg-gray-800 text-white rounded-full shadow-lg"
          >
            ❯
          </button>
        </div>

        {/* Parent Swiper for Categories */}
        <Swiper
          pagination={{ clickable: true }}
          loop={true}
          modules={[Navigation]}
          onSwiper={setParentSwiper}
          spaceBetween={20}
          slidesPerView={1}
          centeredSlides={false}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 1.3 },
            1024: { slidesPerView: 1.3 },
          }}
          className="parent-swiper main-parent-slider main-parent-slider-experience"
        >
          {categories.map((category, index) => {
            // Fetch properties for this category from the state
            const categoryProperties = properties[category.displayCategoryId] || [];

            return (
              <SwiperSlide
                key={category.displayCategoryId}
                className="bg-gray-100 rounded-xl relative"
              >
                <h3 className="text-2xl font-bold mb-3 experience-category-title">
                  {category.displayCategory}
                </h3>

                {/* Child Swiper for Properties */}
                <Swiper
                  pagination={{ clickable: true }}
                  navigation={true}
                  loop={true}
                  modules={[Navigation]}
                  spaceBetween={10}
                  slidesPerView={1}
                  className="child-swiper main-child-slider"
                >
                  {categoryProperties.length > 0 ? (
                    categoryProperties.map((hotel) => (
                      <SwiperSlide key={hotel.propertyId} className="child-slider-rel">
                        <div className="nested-no-image">
                          <Image
                            height={600}
                            width={600}
                            src={hotel?.images?.[0]?.propertyImage || "/img/popular-1.jpeg"}
                            alt={hotel.propertyName || hotel.propertyTitle || "Property"}
                            className="w-full h-36 object-cover rounded-md mb-2 child-image w-100"
                          />
                        </div>

                        <div className="child-slider-content">
                          <div className="child-slider-content-btm">
                            <div className="child-slider-content-btm-left">
                              <h3 className="child-sl-title">{hotel.propertyName}</h3>
                              <div className="next-boxx-parent-div">
                                <div className="left-nested-boxx">
                                  <Link
                                    href="#"
                                    // href={`https://bookings.amritara.co.in/?chainId=5971&propertyId=${hotel.staahBookingId}&_gl=1*1d9irrh*_gcl_au*MzgxMDEyODcxLjE3NTgyNjIxOTIuNzY2OTMwNzIwLjE3NTkzMTE2MjAuMTc1OTMxMTcyMA..*_ga*NzUyODI0NDE0LjE3NTgyNjIxOTI.*_ga_7XSGQLL96K*czE3NjA0NDUzOTUkbzQ4JGcxJHQxNzYwNDQ2NTA2JGo2MCRsMCRoODE1NTgwNjUw*_ga_DVBE6SS569*czE3NjA0NDUzOTQkbzQ1JGcxJHQxNzYwNDQ1NDY2JGo2MCRsMCRoOTgzMzg5ODY.`}
                                    // target="_blank"
                                    className="child-sl-btn"
                                    onClick={()=>{handleBookNowSlider(hotel)}}
                                  >
                                    Book Now
                                  </Link>
                                  <Link
                                    href={{
                                      pathname: `/${hotel.propertySlug}/${getOverviewSlug(hotel)}`,
                                    }}
                                    className="visit-hotel-nested"
                                  >
                                    Visit Hotel
                                  </Link>
                                </div>
                                <div className="right-nested-box">
                                  <div className="child-slider-content-btm-right-left">
                                    <p className="child-sl-price">
                                      <b>Starting From</b>
                                    </p>
                                    <p className="child-sl-price">
                                      INR {hotel.staahPropertyPrice ?? "—"}/Night
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide className="no-data-found-slider flex items-center justify-center h-40 bg-gray-200 text-gray-700 rounded-md ">
                      No Properties found for this category
                    </SwiperSlide>
                  )}
                </Swiper>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
