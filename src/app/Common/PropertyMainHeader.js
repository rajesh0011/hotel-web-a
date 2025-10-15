"use client";
import "../Styles/HeaderStyle.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Tally2, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const PropertyMainHeader = ({ id, type }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuConfig, setMenuConfig] = useState(null);
  const { propertySlug } = useParams();
  const { user } = useAuth();
  const filterBarRef = useRef(null);
  const isLoggedIn = !!user;

  // ✅ Fetch menu data when propertyId changes (NOT just propertySlug)
  useEffect(() => {
    const fetchPropertyMenu = async () => {
      try {
        if (!id) {
          console.warn("Property ID not available yet");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/menu?propertyId=${id}`
        );
        const result = await res.json();

        if (result.errorCode === "0" && result.data?.length > 0) {
          setMenuConfig(result.data[0]);
        } else {
          console.warn("No menu data found for property ID:", id);
        }
      } catch (err) {
        console.error("Error fetching property menu:", err);
      }
    };

    fetchPropertyMenu();
  }, [id]); // ✅ depend on id only

  // Sticky header scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handlePropertyBookNow = async () => {
    if (filterBarRef.current) {
      filterBarRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = filterBarRef.current.querySelector("input, select, button");
      if (firstInput) firstInput.focus();
    }
  };

  return (
    <header className="header-section">
      <nav className={`navbar navbar-expand-lg navbar-light ${isScrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div className="header-display-flex">
            <Link className="navbar-brand" href="/">
              <Image
                src="/img/logo.png"
                className="header-logo"
                alt="Amritara Hotels And Resorts"
                width={300}
                height={200}
              />
            </Link>

            <div className="navbarnav" id="navbarNav">
              <div className="display-flex">
                {isLoggedIn ? (
                  <div className="dropdown dropdown-for-logged-in-user">
                    <button
                      className="dropdown-toggle profile-btnn-top border-0 bg-transparent me-2"
                      type="button"
                      onClick={() => setOpen(!open)}
                      aria-expanded={open}
                    >
                      {user?.FirstName || "MY ACCOUNT"}
                    </button>
                    <ul className={`dropdown-menu ${open ? "show" : ""}`}>
                      <li>
                        <Link className="dropdown-item" href="/members/dashboard">
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="/logout">
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <Link className="me-3 header-btnn-top login-menu-header" href="/signin">
                    Login/Join
                  </Link>
                )}

                <Link
                  className="me-3 header-btnn-top book-menu-header"
                  href="#"
                  onClick={handlePropertyBookNow}
                >
                  Book Now
                </Link>

                <button
                  onClick={toggleSidebar}
                  className="sidebar-toggle border-0 bg-transparent ms-3"
                >
                  <Tally2 size={20} className="toggle-image-s" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar-menu ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <button onClick={toggleSidebar} className="close-btn">
            <X color="black" size={24} />
          </button>
        </div>

        <div className="sidebar-content">
          <ul className="sidebar-nav">
            <li>
              <Link href="/" onClick={toggleSidebar}>Home</Link>
              {/* <h1>type {type}</h1> */}
              
            </li>
            <li>
              <Link href="/hotels" onClick={toggleSidebar}>Our Hotels</Link>
            </li>

            {menuConfig && (
              <>
                <li>
                  <Link href={`/${propertySlug}/${type}-overview`} onClick={toggleSidebar}>
                    Overview
                  </Link>
                </li>

                {menuConfig.room && (
                  <li>
                    <Link href={`/${propertySlug}/hotel-rooms`} onClick={toggleSidebar}>
                      Stay
                    </Link>
                  </li>
                )}
                {menuConfig.dine && (
                  <li>
                    <Link href={`/${propertySlug}/restaurants`} onClick={toggleSidebar}>
                      Dine
                    </Link>
                  </li>
                )}
                {menuConfig.gallery && (
                  <li>
                    <Link href={`/${propertySlug}/hotel-gallery`} onClick={toggleSidebar}>
                      Gallery
                    </Link>
                  </li>
                )}
                {menuConfig.offer && (
                  <li>
                    <Link href={`/${propertySlug}/hotel-deals-offers`} onClick={toggleSidebar}>
                      Offers
                    </Link>
                  </li>
                )}
                {menuConfig.experience && (
                  <li>
                    <Link href={`/${propertySlug}/things-to-do`} onClick={toggleSidebar}>
                      Experiences
                    </Link>
                  </li>
                )}
                {menuConfig.spaWellness && (
                  <li>
                    <Link href={`/${propertySlug}/spa-wellness`} onClick={toggleSidebar}>
                      Spa & Wellness
                    </Link>
                  </li>
                )}
                { id === 6 && (
                  <li>
                    <Link href={`/${propertySlug}/virtual-tour`} onClick={toggleSidebar}>
                      Virtual Tours
                    </Link>
                  </li>
                )}
                <li>
                  <Link href={`/${propertySlug}/hotel-contact`} onClick={toggleSidebar}>
                    Contact Us
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default PropertyMainHeader;
