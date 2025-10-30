"use client";
import ReactDOM from "react-dom";
import * as React from "react";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useMemo } from "react";
import { Calendar, Search, X } from "lucide-react";
import dynamic from "next/dynamic";
import toast, { Toaster } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./booking-style.css";

const Select = dynamic(() => import("react-select"), { ssr: false });

import useBook from "./useBook";
import { useForm } from "./FormContext";

const BOOKING_BASE = "https://bookings.amritara.co.in/?chainId=5971&propertyId=";
const PROPERTY_API =  `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/property/GetPropertyList`;


export default function BookNowForm() {
  const [isRoomMenuOpen, setIsRoomMenuOpen] = useState(false);
  const { isFormOpen, setIsFormOpen } = useForm();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const pathname = usePathname();

  const {
    rangeStart,
    setRangeStart,
    selectEndDate, // not used now but kept if other parts depend on it
    rangeEnd,
    setRangeEnd,
    today1,
    formRows,
    children,
    adult,
    countroom,
    handleIncrement,
    handleDecrement,
    addNewRow,
    handleRemove,
  } = useBook();

  // dynamic data
  const [loading, setLoading] = useState(false);
  const [allProps, setAllProps] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [hotelOptions, setHotelOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);

  // single date range ref
  const dateRangePickerRef = useRef(null);

  const isHomePage = pathname === "/";
  const [monthsToShow, setMonthsToShow] = useState(2);

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const minCheckout = useMemo(() => {
    const base = rangeStart || today1;
    const next = new Date(base);
    next.setDate(base.getDate() + 1);
    return next;
  }, [rangeStart, today1]);

  useEffect(() => {
    const updateMonthsToShow = () => setMonthsToShow(window.innerWidth < 768 ? 1 : 2);
    updateMonthsToShow();
    window.addEventListener("resize", updateMonthsToShow);
    return () => window.removeEventListener("resize", updateMonthsToShow);
  }, []);

  // fetch properties
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(PROPERTY_API, { method: "GET", headers: { "Content-Type": "application/json" }, cache: "no-store" });
        const json = await res.json();
        if (json.errorCode !== "0") throw new Error(json.errorMessage || "Failed to load properties");

        const usable = (json.data || []).filter(
          (p) => p.enabled === "E" && p.isPublished === "E" && p.staahBookingId
        );
        setAllProps(usable);

        const cityMap = new Map();
        usable.forEach((p) => {
          if (!cityMap.has(p.cityId)) cityMap.set(p.cityId, { id: p.cityId, name: p.cityName });
        });
        const cities = Array.from(cityMap.values())
          .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
          .map((c) => ({ value: c.id, label: c.name }));
        setCityOptions(cities);

        // Preselect via URL (propertySlug or citySlug)
        const lowerPath = (pathname || "").toLowerCase();
        const matchProp =
          usable.find((p) => lowerPath.includes((p.propertySlug || "").toLowerCase())) ||
          usable.find((p) => lowerPath.includes((p.citySlug || "").toLowerCase()));
        if (matchProp) {
          const cityOpt = cities.find((c) => c.value === matchProp.cityId) || null;
          setSelectedCity(cityOpt);

          const hotelsForCity = usable
            .filter((p) => p.cityId === matchProp.cityId)
            .sort((a, b) => (a.propertyName || "").localeCompare(b.propertyName || ""))
            .map((p) => ({ value: p.propertyId, label: p.propertyName, data: p }));
          setHotelOptions(hotelsForCity);

          const hotelOpt =
            hotelsForCity.find((h) => h.data?.propertySlug === matchProp.propertySlug) ||
            hotelsForCity[0] ||
            null;
          setSelectedHotel(hotelOpt);
        }
      } catch (e) {
        console.error(e);
        toast.error(e?.message || "Unable to load hotels right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pathname]);

  // City → Hotels cascade
  useEffect(() => {
    if (!selectedCity) {
      setHotelOptions([]);
      setSelectedHotel(null);
      return;
    }
    const hotels = allProps
      .filter((p) => p.cityId === Number(selectedCity.value))
      .sort((a, b) => (a.propertyName || "").localeCompare(b.propertyName || ""))
      .map((p) => ({ value: p.propertyId, label: p.propertyName, data: p }));

    setHotelOptions(hotels);
    setSelectedHotel(hotels[0] || null);
  }, [selectedCity, allProps]);

  // close room menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isRoomMenuOpen && !event.target.closest(".rooms-child-outer-block")) setIsRoomMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isRoomMenuOpen]);

  const toggleBookingForm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFormOpen(!isFormOpen);
    if (isRoomMenuOpen) setIsRoomMenuOpen(false);
  };

  const handleRoomMenuToggle = (e) => {
    e.stopPropagation();
    setIsRoomMenuOpen(!isRoomMenuOpen);
  };

  const handleCitySelect = (opt) => setSelectedCity(opt);
  const handleHotelSelect = (opt) => setSelectedHotel(opt);

  const openDateRange = (e) => {
    e.stopPropagation();
    if (dateRangePickerRef.current?.setOpen) dateRangePickerRef.current.setOpen(true);
  };

  const handleCheckAvailability = () => {
    if (!selectedCity) return toast.error("Please select a city");
    if (!selectedHotel?.data) return toast.error("Please select a hotel");
    if (!rangeStart || !rangeEnd) return toast.error("Please pick your dates");

    // Optional: enforce at least 1 night
    if (rangeEnd <= rangeStart) return toast.error("Checkout must be after check-in");

    const staahBookingId = selectedHotel.data.staahBookingId;
    if (!staahBookingId) return toast.error("Selected hotel is missing booking configuration.");

    const url = `${BOOKING_BASE}${encodeURIComponent(staahBookingId)}`;
    window.open(url, "_blank");
  };

  // composed display value for the single field (optional)
  const dateDisplay =
    rangeStart && rangeEnd
      ? `${new Date(rangeStart).toLocaleDateString("en-GB")} - ${new Date(rangeEnd).toLocaleDateString("en-GB")}`
      : "";

  return (
    <>
      <Toaster position="bottom-right" />

      <div className={`header_booking_engine_container ${isFormOpen ? "show" : ""} ${isHomePage ? "home-page-class" : ""}`}>
         <button
          onClick={toggleBookingForm}
          className="booking-toggle-btn search-cross-booking"
          aria-label={isFormOpen ? "Close booking form" : "Open booking form"}
          id="book-now-header"
        >
          {/*<Search size={20} color="white" /> */}
          {isFormOpen ? <X size={20} color="white" /> :
           <Search size={20} color="white" />
          // <span>Book Now</span>
           }
        </button>
        <div className="header_booking_engine">
          <div className="row justify-content-center">
            {/* City */}
            <div className="booking-input header-search-select-option col-12 col-md-3">
              {/* <label htmlFor="city-select">City</label> */}
              <Select
                className="form-control p-0 border-0"
                id="city-select"
                options={cityOptions}
                onChange={handleCitySelect}
                value={selectedCity}
                isLoading={loading}
                placeholder={loading ? "Loading cities..." : "Select City"}
                noOptionsMessage={() => (loading ? "Loading..." : "No cities available")}
              />
            </div>

            {/* Hotel (depends on City) */}
            <div className="booking-input header-search-select-option col-12 col-md-3 hotel-depand-city">
              {/* <label htmlFor="hotel-select">Hotel</label> */}
              <Select
                className="form-control p-0 border-0"
                id="hotel-select"
                options={hotelOptions}
                onChange={handleHotelSelect}
                value={selectedHotel}
                isDisabled={!selectedCity || loading}
                placeholder={!selectedCity ? "Select Hotel" : "Select Hotel"}
                noOptionsMessage={() => (!selectedCity ? "Select Hotel" : "No hotels in this city")}
                getOptionLabel={(opt) => opt.label}
                getOptionValue={(opt) => String(opt.value)}
              />
            </div>

            {/* Dates (single range field) */}
            <div className="booking-input datepicker-outer col-12 col-md-2">
              {/* <label htmlFor="date-range">Dates</label> */}
              <div className="datepicker-container">
                <DatePicker
                  selectsRange
                  startDate={rangeStart}
                  endDate={rangeEnd}
                  onChange={(dates) => {
                    const [start, end] = dates;
                    setRangeStart(start || null);
                    setRangeEnd(end || null);
                  }}
                  minDate={today1}
                  monthsShown={monthsToShow}
                  shouldCloseOnSelect={true} // close after selecting both
                  onCalendarOpen={() => setIsCalendarOpen(true)}
                  onCalendarClose={() => setIsCalendarOpen(false)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select date range"
                  id="date-range"
                  className="form-control pl-2"
                  ref={dateRangePickerRef}
                />
                {/* <span className="calendar-icon" onClick={openDateRange}>
                  <Calendar size={20} />
                </span> */}
              </div>
              {/* Optional: show chosen range below on mobile */}
              {/* <small className="text-muted">{dateDisplay}</small> */}
            </div>

            {/* Rooms & Guests */}
            <div className="booking-input rooms-child-outer-block col-12 col-md-2 position-relative">
              {/* <label htmlFor="rooms-childs-input">Rooms & Guests</label> */}
              <input
                type="text"
                id="rooms-childs-input"
                className="rooms-childs-input form-control"
                value={`Rooms: ${countroom} - Adults: ${adult()} - Children: ${children()}`}
                readOnly
                onClick={handleRoomMenuToggle}
              />
              {isRoomMenuOpen && (
                <div className="showmoreT add-rooms-block" onClick={(e) => e.stopPropagation()}>
                  <div>
                    {formRows.map((row, index) => (
                      <div key={row.id} className="add-rooms-div">
                        <div className="room-name-or-remove">
                          <span>Room {index + 1}</span>
                          <button className="yellow-btn rmv" onClick={() => handleRemove(row.id)}>
                            X
                          </button>
                        </div>
                        <div className="row justify-content-center ms-0">
                          <div className="col-6">
                            <div className="form-group plus-min-style">
                              <p>Adult(s):</p>
                              <button onClick={() => handleDecrement(row.id, "count1")} disabled={row.count1 <= 1}>
                                -
                              </button>
                              <span>{row.count1}</span>
                              <button onClick={() => handleIncrement(row.id, "count1")} disabled={row.count1 >= 2}>
                                +
                              </button>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="form-group plus-min-style">
                              <p>Child(ren):</p>
                              <button onClick={() => handleDecrement(row.id, "count2")} disabled={row.count2 <= 0}>
                                -
                              </button>
                              <span>{row.count2}</span>
                              <button onClick={() => handleIncrement(row.id, "count2")} disabled={row.count2 >= 2}>
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button onClick={addNewRow} className="yellow-btn btn">
                      Add Room
                    </button>
                  </div>
                </div>
              )}
            </div>

             <div className="booking-input datepicker-outer col-12 col-md-1 promo-code-input">
                <input type="text" className="rooms-childs-input form-control" placeholder="Promo Code" />   
             </div>

            {/* Submit */}
            <div className="col-12 col-md-1 ps-0 d-flex align-items-end">
              <button className="yellow-btn btn w-100" onClick={handleCheckAvailability} disabled={loading}>
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle FAB */}
      <div
        className={`booking-search-bar-btn-div ${isHomePage ? "home-page-class" : ""}`}
        style={{ zIndex: isCalendarOpen ? 0 : 10 }}
      >
        <button
          onClick={toggleBookingForm}
          className="booking-toggle-btn"
          aria-label={isFormOpen ? "Close booking form" : "Open booking form"}
          id="book-now-header"
        >
          {isFormOpen ? <X size={20} color="white" /> :
           <span>Book Now</span>
          // <Search size={20} color="white" />
           }
        </button>
      </div>
    </>
  );
}
