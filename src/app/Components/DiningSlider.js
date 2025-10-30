"use client";
import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import BookTableModal from "./BookTableModal";

const DiningSlider = ({ propertyId, hotelName, propertyData }) => {
  const API_URL = `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyDineBanner?propertyId=${propertyId}`;

  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerData, setBannerData] = useState({ title: "", desc: "" });
  const [brandSlug, setBrandSlug] = useState("");
  const [propertySlug, setPropertySlug] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
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

  // Fetch propertySlug
  useEffect(() => {
    const fetchPropertySlug = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyByFilter?PropertyId=${propertyId}`
        );
        const json = await res.json();
        if (json.errorCode === "0" && json.data.length > 0) {
          setPropertySlug(json.data[0].propertySlug);
        }
      } catch (error) {
        console.error("Error fetching property slug:", error);
      }
    };

    if (propertyId) {
      fetchPropertySlug();
    }
  }, [propertyId]);

  // Fetch Dining Data
  useEffect(() => {
    const fetchDining = async () => {
      try {
        const response = await fetch(API_URL);
        const json = await response.json();

        if (json?.errorCode === "0") {
          const dineItems = [];

          json.data.forEach((entry) => {
            const bg = entry.bannerImages?.[0]?.bannerImage || "/images/img-5.jpg";

            entry.dineDetails?.forEach((dine) => {
              const dineImageUrl = dine.dineImages?.[0]?.dineImage || "/images/img-5.jpg";

              dineItems.push({
                bg,
                thumb: dineImageUrl,
                title: dine.dineTitle,
                description: dine.dineDesc,
                timing: `${dine.openingHours} - ${dine.closingHours}`,
              });
            });
          });

          setSlides(dineItems);

          setBannerData({
            title: json.data[0]?.dineBannerTitle || "",
            desc: json.data[0]?.dineBannerDesc || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDining();
  }, [propertyId]);

  if (slides.length === 0) {
    return null;
  }

  const stripHtml = (html) => html.replace(/<[^>]+>/g, "");

  return (
    <>
      <section data-aos="fade-up" className="bg-lred cursor-hideMobile">
        <div className="container">
          <div className="row justify-content-center mb-4">
            <div className="col-md-9">
              <div className="global-heading-sec text-center">
                <h2 className="global-heading pt-5">Dining</h2>
              </div>
            </div>

            <div className="winter-sec">
              <Swiper
                navigation
                modules={[Navigation, Pagination]}
                pagination={{ clickable: true }}
                slidesPerView={1}
                onSwiper={setParentSwiper}
                className="overv-dine"
              >
                {slides.map((slide, index) => (
                  <SwiperSlide key={index}>
                    <div className="new-type-dine-sec py-4">
                      <div className="container pushed-wrapper">
                        <div className="row">
                          <div
                            className="pushed-image"
                            style={{
                              backgroundImage: `url("${encodeURI(
                                slide.thumb || "/amritara-dummy-room.jpeg"
                              )}")`,
                              backgroundColor: "#f0f0f0",
                              backgroundPosition: "center",
                            }}
                          ></div>

                          <div className="pushed-box-content">
                            <div className="pushed-header text-center mt-3">
                              <span className="header-1 d-block">{slide.title}</span>

                              {/* ✅ Responsive Description Section */}
                              <ResponsiveDescription slide={slide} stripHtml={stripHtml} />

                              {slide.timing && slide.timing.trim() && (
                                <span className="header-3 mt-2 d-block text-center">
                                  <strong>Timings:</strong> {slide.timing}
                                </span>
                              )}

                              <div className="flex mt-3 gap-2 justify-center">
                                {brandSlug && propertySlug && (
                                  <Link
                                    href={`/${brandSlug}/${propertySlug}/restaurants`}
                                    className="box-btn know-more"
                                  >
                                    EXPLORE MORE
                                  </Link>
                                )}
                                <button
                                  className="box-btn book-now"
                                  onClick={() => {
                                    setSelectedTitle(slide.title);
                                    setShowModal(true);
                                  }}
                                >
                                  BOOK A TABLE
                                </button>
                              </div>
                            </div>
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

      {/* Book Table Modal */}
      <BookTableModal
        show={showModal}
        onClose={() => setShowModal(false)}
        hotelName={selectedTitle}
        propertyData={propertyData}
      />
    </>
  );
};

/* ✅ Separate Component: Responsive Description */
const ResponsiveDescription = ({ slide, stripHtml }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const text = stripHtml(slide?.description || "");
  const shortText = text.slice(0, 150) + "...";

  if (!text) return null;

  return (
    <div style={{ position: "relative", marginTop: "8px" }}>
      {!isMobile ? (
        // Desktop: full text
        <span className="header-3 d-inline-block text-center">{text}</span>
      ) : (
        <>
          {/* Mobile: truncated + toggle */}
          <span
            className="header-3 d-inline-block text-center"
            style={{
              marginBottom: "10px",
              overflow: "hidden",
              transition: "all 0.3s ease",
              position: "relative",
            }}
          >
            {showFull ? text : shortText}

            {/* fade-out gradient */}
            {!showFull && (
              <span
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  width: "60px",
                  height: "100%",
                  
                }}
              ></span>
            )}
          </span>

          {/* toggle arrow */}
          <span
            onClick={() => setShowFull(!showFull)}
            style={{
              cursor: "pointer",
              color: "#000",
              fontWeight: "600",
              display: "inline-block",
              marginLeft: "4px",
              userSelect: "none",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#b76b00")}
            onMouseLeave={(e) => (e.target.style.color = "#000")}
          >
            {showFull ? " ❮❮" : " ❯❯"}
          </span>
        </>
      )}
    </div>
  );
};

export default DiningSlider;
