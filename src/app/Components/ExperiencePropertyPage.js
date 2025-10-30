"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ExperiencePropertyPage({ propertyId }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerData, setBannerData] = useState({});
  const [showFullText, setShowFullText] = useState(false);

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
  };

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/Experiance/GetExperiancesByProperty?propertyId=${propertyId}`
        );
        const json = await res.json();

        if (json?.errorCode === "0" && Array.isArray(json.data) && json.data.length > 0) {
          const banner = json.data[0];
          setBannerData({
            title: banner?.experiancesBannerTitle || "",
            desc: banner?.experiancesBannerDesc || "",
          });

          // collect all expDetails
          const allExperiences = json.data.flatMap((item) =>
            Array.isArray(item.expDetails) ? item.expDetails : []
          ).filter((exp) => String(exp.enabled).toLowerCase() === "e");

          setExperiences(allExperiences);
        } else {
          console.warn("No experiences found");
          setExperiences([]);
        }
      } catch (err) {
        console.error("Error fetching experiences:", err);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) fetchExperiences();
  }, [propertyId]);

  if (loading) return <p className="text-center py-4">Loading Experiences...</p>;
  if (!experiences.length) return <p className="text-center py-4">No experiences available.</p>;

  return (
    <section className="mt-3" data-aos="fade-up">
      <div className="global-heading-sec text-center">
        <div className="container">
          <h2 className="global-heading pt-4">{bannerData.title || "Experiences"}</h2>
          <p className="mb-2 whitespace-pre-line">
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
          </p>
        </div>
      </div>

        <div className="container">
                <section className="position-relative inner-banner-section-slider">
                  {experiences.length > 0 ? (
                    <Swiper
                      modules={[Navigation, Pagination, Autoplay]}
                      navigation
                      autoplay={{ delay: 4000 }}
                      loop
                      className="w-100 slider-banner-inner"
                    >
                      {experiences.map((exp, idx) => (
                        <SwiperSlide key={idx}>
                          <div className="row align-items-center position-relative mb-4" key={idx}>
                              {/* Image */}
                              <div
                                className={`col-md-12`}
                                style={{
                                  // backgroundImage: `url(${exp.expImages?.[0]?.experiancesImages || "/amritara-dummy-room.jpeg"})`,
                                  backgroundImage: `url("${encodeURI(exp.expImages?.[0]?.experiancesImages || "/amritara-dummy-room.jpeg")}")`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  minHeight: "400px",
                                  backgroundColor: "#f0f0f0",
                                }}
                              ></div>

                              {/* Text */}
                              <div className="col-md-12">
                                <div className="pushed-header text-center">
                                  <span className="header-1 text-center mt-3">{exp.experiancesTitle}</span>
                                  <span className="header-3 d-inline-block mt-2">
                                    {stripHtml(exp.experiancesDesc).length > 150 ? (
                                      <>
                                        {exp.showFullText
                                          ? stripHtml(exp.experiancesDesc)
                                          : stripHtml(exp.experiancesDesc).slice(0, 150) + "..."}
                                        <span
                                          onClick={() => {
                                            const newExps = [...experiences];
                                            newExps[idx].showFullText = !newExps[idx].showFullText;
                                            setExperiences(newExps);
                                          }}
                                          style={{
                                            cursor: "pointer",
                                            color: "#000",
                                            fontWeight: "600",
                                            display: "inline-block",
                                          }}
                                        >
                                          {exp.showFullText ? " ❮❮" : " ❯❯"}
                                        </span>
                                      </>
                                    ) : (
                                      stripHtml(exp.experiancesDesc)
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <Image
                      src="/images/banner_img.png"
                      alt="Default Banner"
                      width={1920}
                      height={1080}
                      className="w-100 object-cover"
                    />
                  )}
                </section>




       
        </div>
    </section>
  );
}
