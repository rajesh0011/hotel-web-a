"use client";
import React, { useRef } from "react";
import { Calendar, Search, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dynamic from "next/dynamic";
import Link from "next/link";
import useBook from "./useBook";
import useSelect from "./useSelect";

const Select = dynamic(() => import('react-select'), { ssr: false });

export default function BookNowForm({ isFormOpen, toggleForm }) {
  const checkInDatePickerRef = useRef(null);
  const checkOutDatePickerRef = useRef(null);

  const { rangeStart, setRangeStart, rangeEnd, selectEndDate, today1, adult, children } = useBook();
  const { options, selectedHotelUrl, hotelCode, handleSelectChange, defaultHotel } = useSelect();

  return (
    <>
      {/* Main Form */}
      <div
        className={`absolute z-[1] bottom-0 left-1/2 transform -translate-x-1/2 w-full shadow-lg transition-all duration-500 
          ${isFormOpen ? "translate-y-0 opacity-100 visible" : "translate-y-full opacity-0 invisible"}`}
      >
        <div className="header_booking_engine">
          <div className="row">
            <div className="header-search-select-option col-md-2">
              <label htmlFor="hotel-select">Hotel/City</label>
              {options.length > 0 && (
                <Select
                  className="form-control p-0 border-0"
                  id="hotel-select"
                  options={options}
                  onChange={handleSelectChange}
                  defaultValue={{
                    value: defaultHotel?.synxis_id || "", 
                    label: defaultHotel ? `${defaultHotel.hotel_name} (${defaultHotel.city_name})` : "Select a hotel or city"
                  }}
                />
              )}
            </div>
            
            <div className="datepicker-outer col-md-2">
              <label htmlFor="check-in">Check-in</label>
              <div className="datepicker-container">
                <DatePicker
                  selected={rangeStart}
                  minDate={today1}
                  className="form-control"
                  id="check-in"
                  onChange={setRangeStart}
                  ref={checkInDatePickerRef}
                />
                <span className="calendar-icon" onClick={() => checkInDatePickerRef.current.setOpen(true)}>
                  <Calendar size={20} />
                </span>
              </div>
            </div>

            <div className="datepicker-outer col-md-2">
              <label htmlFor="check-out">Check-out</label>
              <div className="datepicker-container">
                <DatePicker
                  selected={rangeEnd}
                  id="check-out"
                  className="form-control"
                  onChange={selectEndDate}
                  ref={checkOutDatePickerRef}
                />
                <span className="calendar-icon" onClick={() => checkOutDatePickerRef.current.setOpen(true)}>
                  <Calendar size={20} />
                </span>
              </div>
            </div>

            <div className="col-md-1">
              <Link 
                href={selectedHotelUrl ? `${selectedHotelUrl}/rooms?Rooms=1&CheckinDate=${rangeStart}&Adults_1=${adult()}&Children_1=${children()}&hotel=${hotelCode || ''}` : "#"}
                target="_blank"
                className="yellow-btn btn"
              >
                Check Availability
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div className="absolute z-[1] bottom-10 left-1/2 transform -translate-x-1/2">
        <button onClick={toggleForm} className="p-3 bg_green rounded-full">
          {isFormOpen ? <X size={30} color="white" /> : <Search size={30} color="white" />}
        </button>
      </div>
    </>
  );
}
