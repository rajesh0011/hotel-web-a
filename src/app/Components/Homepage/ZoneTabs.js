"use client";
import { useEffect, useState } from "react";
import { getPropertyList } from "../../../lib/api/getPropertyList"; // fetches property list
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import styles from "./zone.module.css";
import Link from "next/link";

export default function ZoneTabs({ zones }) {
  const [activeZone, setActiveZone] = useState(() => zones?.[0]?.zoneId || null);

  const [properties, setProperties] = useState([]);

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

  return (
    <>
      <section className="DiscoverSectionForZone mt-5">
        <div className="container-fluid">
          <div className="global-heading-sec text-center">
            <h2 className="global-heading">Discover</h2>
          </div>
          <div className="pt-2 pb-4">
            {/* Zone Tabs */}
            <ul className={`nav nav-tabs ${styles.ZonetabHome}`}>
              {zones.map((zone) => (
                <li className="nav-item" key={zone.zoneId}>
             <button
  className={`nav-link ${
    activeZone === zone.zoneId
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
              className={`tab-content border border-top-0 ${styles.TabContent}`}
            >
              {properties.length > 0 ? (
                <Swiper
                  spaceBetween={20}
                  slidesPerView={3}
                  modules={[Navigation]}
                  navigation
                  loop={true}
                  breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 2 },
                    991: { slidesPerView: 4 },
                  }}
                >
                  {properties.map((property) => (
                    <SwiperSlide key={property.propertyId}>
                      <div className={styles.TabCardWrapper}>
                        <div className={styles.TabCard}>
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
                          <div className={styles.TabContentBtn}>
                            <Link
                              href={{
    pathname: `/${property.propertySlug}/${getOverviewSlug(property)}`,
    // query: { id: hotel.propertyId, name: hotel.propertyName },
  }}
                              className="explore-more-btn"
                            >
                              Explore
                            </Link>
                            {/* <Link
                              href={property.booking_url || "#"}
                              className="book-now-btn"
                              target="_blank"
                            >
                              Book Now
                            </Link> */}

                            <button
  className="book-now-btn"
  onClick={() => {
    if (property?.staahBookingId) {
      const bookingUrl = `https://bookings.amritara.co.in/?chainId=5971&propertyId=${property.staahBookingId}&_gl=1*1d9irrh*_gcl_au*MzgxMDEyODcxLjE3NTgyNjIxOTIuNzY2OTMwNzIwLjE3NTkzMTE2MjAuMTc1OTMxMTcyMA..*_ga*NzUyODI0NDE0LjE3NTgyNjIxOTI.*_ga_7XSGQLL96K*czE3NjA0NDUzOTUkbzQ4JGcxJHQxNzYwNDQ2NTA2JGo2MCRsMCRoODE1NTgwNjUw*_ga_DVBE6SS569*czE3NjA0NDUzOTQkbzQ1JGcxJHQxNzYwNDQ1NDY2JGo2MCRsMCRoOTgzMzg5ODY.`;
      window.open(bookingUrl, "_blank"); // opens in new tab
    } else {
      alert("Booking not available for this property.");
    }
  }}
>
  Book Now
</button>
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
