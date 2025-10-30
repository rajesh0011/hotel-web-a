"use client";
import { useRef, useEffect, useState } from "react";
import { getPropertyList } from "../../../lib/api/getPropertyList"; // fetches property list
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import styles from "./zone.module.css";
import Link from "next/link";

export default function ZoneTabs({ zones ,onClick}) {
  const [activeZone, setActiveZone] = useState(() => zones?.[0]?.zoneId || null);

  const [properties, setProperties] = useState([]);
  
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
    

  useEffect(() => {
    if (activeZone) {
      getPropertyList().then((res) => {
        const filtered =
          res?.data?.filter((p) => p.zoneId === activeZone) || [];
        setProperties(filtered);
      });
    }
  }, [activeZone]);

  useEffect(() => {
    if (zones?.length > 0 && !activeZone) {
      setActiveZone(zones[0].zoneId);
    }
  }, [zones, activeZone]);

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
    <>
      <section className="DiscoverSectionForZone mt-3 position-relative cursor-hideMobile">
        <div className="container">
          <div className="global-heading-sec text-center">
            <h2 className="global-heading">Discover</h2>
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
            </div>
          <div className="pt-2 pb-4">
            {/* Zone Tabs */}
            <ul className={`nav nav-tabs ${styles.ZonetabHome}`}>
              {zones.map((zone) => (
                <li className="nav-item" key={zone.zoneId}>
                  <button
                    className={`nav-link ${activeZone === zone.zoneId
                        ? `active ${styles.ActiveTab}`
                        : styles.InActiveTab
                      }`}
                    onClick={() => setActiveZone(zone.zoneId)}
                  >
                    {zone.zoneName}
                  </button>

                </li>
              ))}
            </ul>

            {/* Zone Properties */}
            <div
              className={`tab-content border border-top-0 discover-property-section ${styles.TabContent}`}
            >
              {properties.length > 0 ? (
                <Swiper
                  spaceBetween={50}
                  slidesPerView={3}
                  modules={[Navigation, Pagination]}
                  pagination={{
                    clickable : true
                  }}
                  onSwiper={setParentSwiper}
                  navigation={false}
                  loop={true}
                  breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    991: { slidesPerView: 3 },
                  }}
                >
                  {properties.map((property) => (
                    <SwiperSlide key={property.propertyId}>
                      <div className={styles.TabCardWrapper}>
                        <div className={`${styles.TabCard} no-shadowMobile`}>
                          <div className={styles.NoImgBg}>
                            <Image
                              src={
                                property?.images[0]?.propertyImage ||
                                "/no_image1.jpg"
                              } // adjust key if needed
                              height={300}
                              width={500}
                              alt={property.propertyTitle}
                              className={styles.TabCardImg}
                            />
                          </div>
                          <h5 className={styles.TabCardTitle}>
                            {property.propertyTitle}
                          </h5>

                          <div className="winter-box-content main-new-hotel-box">
                        <div className="hotel-box-content hotel-left-side-box">
                          <div className="winter-box-btn">
                            <Link 
                              href="#"
                              onClick={()=>{handleBookNowSlider(property)}}
                              // href={`https://bookings.amritara.co.in/?chainId=5971&propertyId=${property.staahBookingId}&_gl=1*1d9irrh*_gcl_au*MzgxMDEyODcxLjE3NTgyNjIxOTIuNzY2OTMwNzIwLjE3NTkzMTE2MjAuMTc1OTMxMTcyMA..*_ga*NzUyODI0NDE0LjE3NTgyNjIxOTI.*_ga_7XSGQLL96K*czE3NjA0NDUzOTUkbzQ4JGcxJHQxNzYwNDQ2NTA2JGo2MCRsMCRoODE1NTgwNjUw*_ga_DVBE6SS569*czE3NjA0NDUzOTQkbzQ1JGcxJHQxNzYwNDQ1NDY2JGo2MCRsMCRoOTgzMzg5ODY.`}
                              // target="_blank" 
                              className="box-btn book-now">Book Now</Link>
                            <Link
                              href={{ pathname: `/${property.propertySlug}/${getOverviewSlug(property)}`, }}
                              className="box-btn know-more"
                            >
                              Visit Hotel
                            </Link>
                          </div>
                        </div>

                        <div className="hotel-box-content hotel-right-side-box">
                          <p className="text-xs text-gray-600 price-show f-new-10 text-end">
                            Starting from
                          </p>
                          <p className="font-semibold text-lg price-show">
                            INR {property.staahPropertyPrice}
                            <small className="f-new-10">/Night</small>
                          </p>
                        </div>
                      </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <p className="text-muted">No properties found for this zone.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
