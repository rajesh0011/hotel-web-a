"use client";
import "../Styles/HeaderStyle.css";
import Link from 'next/link';
import Image from "next/image";
import { useEffect, useRef, useState } from 'react';
import { Tally2, X } from 'lucide-react';
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const PropertyMainHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { brandSlug, propertySlug } = useParams();
  const { user } = useAuth();
  const filterBarRef = useRef(null);
  const isLoggedIn = !!user;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePropertyBookNow = async () => {
    if (filterBarRef.current) {
      filterBarRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = filterBarRef.current.querySelector("input, select, button");
      if (firstInput) firstInput.focus();
    }
    //handleBookNow();
    if (typeof onClick === "function") {
      onClick();
    }
  };

  return (
    <>
      <header className="header-section">
        <nav className={`navbar navbar-expand-lg navbar-light ${isScrolled ? 'scrolled' : ''}`}>
          <div className="container">
            <div className="header-display-flex">
              <Link className="navbar-brand" href="/">
                <Image src="/img/logo.png" className="header-logo" alt="Amritara Hotels And Resorts" width={300} height={200} />
              </Link>

              <div className="navbarnav" id="navbarNav">
               
                <div className="display-flex">
                  {isLoggedIn ? (
                    <>
                      <div className="dropdown dropdown-for-logged-in-user">
                        <button
                          className="dropdown-toggle profile-btnn-top border-0 bg-transparent me-2"
                          type="button"
                          onClick={() => setOpen(!open)}
                          aria-expanded={open}
                        >
                          {user?.FirstName ? user.FirstName : "MY ACCOUNT"}
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
                    </>
                  ) : (
                    <>
                      <Link
                        className="me-3 header-btnn-top login-menu-header"
                        href="/signin"
                      >
                        Login/Join
                      </Link>
                    </>
                  )}

                  <Link
                    className="me-3 header-btnn-top book-menu-header"
                    href="#"
                    onClick={handlePropertyBookNow}
                  >
                    Book Now
                  </Link>

                  {/* Sidebar Toggle */}
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

        <div className={`sidebar-menu ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <button onClick={toggleSidebar} className="close-btn">
              <X color="black" size={24} />
            </button>
          </div>
          <div className="sidebar-content">
            <ul className="sidebar-nav">
              <li><Link href="/" onClick={toggleSidebar}>Home</Link></li>
              <li><Link href="/hotels" onClick={toggleSidebar}>Our Hotels</Link></li>

              {/* property menu starts here */}
              <li><Link href={`/${propertySlug}/hotel-overview`} onClick={toggleSidebar}>Overview</Link></li>
              <li><Link href={`/${propertySlug}/hotel-rooms`} onClick={toggleSidebar}>Stay</Link></li>
              <li><Link href={`/${propertySlug}/restaurants`} onClick={toggleSidebar}>Dine</Link></li>
              <li><Link href={`/${propertySlug}/hotel-deals-offers`} onClick={toggleSidebar}>Offers</Link></li>
              <li><Link href={`/${propertySlug}/hotel-gallery`} onClick={toggleSidebar}>Gallery</Link></li>
              <li><Link href={`/${propertySlug}/things-to-do`} onClick={toggleSidebar}>Experiences</Link></li>
              <li><Link href={`/${propertySlug}/hotel-contact`} onClick={toggleSidebar}>Contact Us</Link></li>
              {/* property menu ends here */}

            </ul>
          </div>
        </div>
      </header>

    </>
  );
};

export default PropertyMainHeader;
