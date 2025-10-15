"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VirtualTourPropertyPage({ propertyId }) {
  const [tours, setTours] = useState([]);

  // ✅ Static JSON data for virtual tours
  const virtualToursData = [
    {
      img: "/virtual/1.jpg",
      title: "An Overview from the Golf Course at Sunset",
      link: "https://kuula.co/share/NGKwW?logo=1&info=1&fs=1&vr=0&zoom=1&gyro=0&autorotate=0.02&thumbs=1",
    },
    {
      img: "/virtual/2.jpg",
      title: "View from the Entrance",
      link: "https://kuula.co/share/NGK2c?logo=1&info=1&fs=1&vr=0&zoom=1&gyro=0&autorotate=0.02&thumbs=1",
    },
    {
      img: "/virtual/3.jpg",
      title: "A closer view of the rooms/cottages and the swimming pool",
      link: "https://kuula.co/share/NGK3M?logo=1&info=1&fs=1&vr=0&zoom=1&gyro=0&autorotate=0.02&thumbs=1",
    },
    {
      img: "/virtual/4.jpg",
      title: "Harangi Backwaters",
      link: "https://kuula.co/share/NGK3L?logo=1&info=1&fs=1&vr=0&zoom=1&gyro=0&autorotate=0.02&thumbs=1",
    },
    {
      img: "/virtual/5.jpg",
      title: "Abbey Falls",
      link: "https://kuula.co/share/NGK23?logo=1&info=1&fs=1&vr=0&zoom=1&gyro=0&autorotate=0.02&thumbs=1",
    },
    {
      img: "/virtual/6.jpg",
      title: "Coffee Estates",
      link: "https://kuula.co/share/NGK35?logo=1&info=1&fs=1&vr=0&zoom=1&gyro=0&autorotate=0.02&thumbs=1",
    },
  ];

  // ✅ Load static data on mount
  useEffect(() => {
    setTours(virtualToursData);
  }, []);

  return (
    <section className="mt-3" data-aos="fade-up">
      <div className="global-heading-sec text-center">
        <div className="container">
          <h2 className="global-heading pt-4">Virtual Tours</h2>
        </div>
      </div>

      <div className="property-inner-zigzag-section">
        <div className="container">
          <div className="row">
            {tours.map((tour, idx) => (
              <div className="col-md-4 mb-4" key={idx}>
                <div className="img_shadow">
                  <img
                    src={tour.img}
                    alt={tour.title}
                    className="img-fluid w-100"
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                <div className="details_box_experience text-center mt-2">
                  <h5 className="head">
                    <span>{tour.title}</span>
                  </h5>
                  <Link
                    href={tour.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="Explore-More book-btn"
                    style={{
                      display: "inline-block",
                      marginTop: "6px",
                      backgroundColor: "#c19a5b",
                      fontWeight: "600",
                      textDecoration: "none",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: "4px",
                    }}
                  >
                    View Virtual Tour
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
