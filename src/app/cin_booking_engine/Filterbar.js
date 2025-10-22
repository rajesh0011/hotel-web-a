"use client";
import { useBookingEngineContext } from "../cin_context/BookingEngineContext";
import * as ReactDOM from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import "flatpickr/dist/themes/material_green.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { X } from 'lucide-react';
import RoomManager from "./RoomManager";
import DateRangePicker from "./Flatpicker";
import Select from "react-select";
const FilterBar = ({
  tokenKey,
  onClose
}) => {
  const {
    selectedRooms,
  } = useBookingEngineContext();
  const totalAdults = selectedRooms.reduce((sum, room) => sum + room.adults, 0);
  const totalChildren = selectedRooms.reduce(
    (sum, room) => sum + room.children,
    0
  );
  const totalRooms = selectedRooms.length;
  const [filters, setFilters] = useState({
    offer: "",
    query: "",
    dateRange: { start: "", end: "", totalPrice: 0 },
    guests: { adults: 1, children: 0, rooms: 1 },
  });
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showDownDiv, setShowDownDiv] = useState(true)
  const [promoCode, setPromoCode] = useState("");
  const [destination, setDestination] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isClassAddedBook, setIsClassAddedBook] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const [dropUp, setDropUp] = useState(false);
  const [propertyDropDown, setPropertyDropDown] = useState([]);
  const [cityDropDown, setCityDropDown] = useState([]);
  const [cityName, setCityName] = useState(null);
  const [newClassRoom, setNewClassRoom] = useState(false);
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsFocused(false);
    }
  };
  const hideBookingEngine = () => {
    setIsVisible(false);
    onClose();
  };
  const toggleBookNow = (id) => {
    setActiveHotel(id);
  };
  return (
    <>
      <section
        className={`booking-form-wrapper toggle-div ${!tokenKey && isVisible ? "visible" : "hidden"
          } ${newClassRoom ? "booking-widget-set" : ""}`}
      >
        <div
          id="booking-bar"
          className={`booking-bar ${isClassAddedBook && !isSmallScreen ? "fullscreen" : ""}`}
        >
          {isVisible && (
            <div className="hide-booking-engine hide-on-desktop-close-btn">
              {isSmallScreen && <span className="mt-3 pt-1 ps-2 " onClick={hideBookingEngine}>CLOSE </span>}
              {/* <FontAwesomeIcon icon={faXmark} /> */}
              {!isSmallScreen &&
                <span onClick={hideBookingEngine} className="hide-on-desktop-close-btn">
                  <span className="closeSpanForCloseBookingEngine">CLOSE</span> <X size={12} className="closeXForCloseBookingEngine"></X>
                </span>
              }
            </div>
          )}
          {(showDownDiv || !isSmallScreen) && (<div className="booking-bar-form">
            <div className={`col-3 main-bx-field filter-item position-relative ${isSmallScreen ? "m-7" : ""}`}>
              <Select
                options={cityDropDown}
                value={cityName}
                onChange={(selected) => {
                  setCityName(selected),
                    setIsEditClicked(false)
                }}
                placeholder="Select city..."
                isClearable
                className="form-control for-city-selectionn"
              />
            </div>
            <div className="col-2 main-bx-field filter-item position-relative">
              <input
                ref={inputRef}
                type="text"
                value={destination}
                onChange={handleDestinationChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="Select hotel"
                className="form-control"
                aria-label="Search Hotel/City"
                required
                autoComplete="off"
              />
              {isFocused && propertyDropDown.length > 0 && (
                <ul
                  className={`list-group position-absolute w-100 zindex-dropdown ${dropUp ? "drop-up" : ""
                    }`}
                  style={{
                    bottom: dropUp ? "100%" : "auto",
                    top: dropUp ? "auto" : "100%",
                    maxHeight: "350px",
                    overflowY: "auto",
                  }}
                >
                  {propertyDropDown.map((suggestion, index) => (
                    <li
                      key={index}
                      className="list-group-item"
                      onMouseDown={() => {
                        handleSuggestionClick(suggestion),
                          setIsEditClicked(false);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {suggestion.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="col-2 main-bx-field mb-3 mb-md-0 bdr-booking-bottom position-relative">
              <DateRangePicker onDateChange={handleDateChange} />
            </div>
            <div className="col-2 main-bx-field filter-item bdr-booking-bottom position-relative">
              <RoomManager onRoomChange={handleRoomChange} />
            </div>
            <div className="col-1 main-bx-field">
              <input
                type="text"
                name="promoCode"
                maxLength={20}
                value={promoCode}
                onChange={handlePromocodeChange}
                className="form-control"
                placeholder="Promo Code"
              />
            </div>
            <div
              id="search"
              className="col-2 search-icon hotel-search-btn-wrapper position-relative"
            >
              <button onClick={process.env.NEXT_PUBLIC_STAAH_REDIRECT == "redirect" ? handleSearchTh : handleSearch}>
                {/* <button onClick={handleSearchTh}>   */}
                <span className="this-search-for-mobile">Search</span>
                <span className="this-search-for-desk">BOOK NOW</span>
              </button>
            </div>
          </div>)}
        </div>
      </section>
    </>
  );
};
export default FilterBar;
