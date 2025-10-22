"use client";
import ReactDOM from "react-dom";
import * as React from "react";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Calendar, Search, X } from "lucide-react";
import dynamic from "next/dynamic";
import toast, { Toaster } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./booking-style.css";

const Select = dynamic(() => import("react-select"), { ssr: false });

import useBook from "./useBook";
import { useForm } from "./FormContext";

export default function BookNowForm() {
  const [isRoomMenuOpen, setIsRoomMenuOpen] = useState(false);
  const { isFormOpen, setIsFormOpen } = useForm();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const pathname = usePathname();
  const [showPopupForm, setShowPopupForm] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const {
    rangeStart,
    setRangeStart,
    selectEndDate,
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

  const handleEnquirySubmit = async () => {
    const { name, email, mobile } = guestInfo;

    if (!name || !mobile) {
      toast.error("Name and Mobile are required");
      return;
    }

    const payload = {
      source_enquiry:
        selectedHotel.value === "jawai"
          ? "alivaa-jawai"
          : selectedHotel.value === "blue-magnets"
          ? "alivaa-blue-magnets"
          : "alivaa-lansdowne",
      name: name,
      phone: mobile,
      message: ``,
      checkin_date: formatDate(rangeStart),
      checkout_date: formatDate(rangeEnd),
      rooms: countroom.toString(),
      adults: adult().toString(),
      children: children().toString(),
      web_source: "alivaahotels.com",
    };

    try {
      const response = await fetch(
        "https://demo.cinuniverse.com/alivaa/be-enquiry.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success(data.message || "Enquiry submitted successfully");
        setShowPopupForm(false);
        setGuestInfo({ name: "", email: "", mobile: "" }); // clear form
      } else {
        toast.error(data.message || "Failed to submit enquiry");
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const hotelOptions = [
    {
      value: "",
      label: "Select Hotel",
      isDisabled: true,
    },
    {
      value: "gurugram1",
      label: "Alivaa Hotel, Gurugram",
      slug: "gurgaon-hotels",
      url: "https://bookings.alivaahotels.com/inst/#/home?propertyId=981NJ8TQ49ro3Z7RTrbLaPgGZCWk8ihVQvzMylYvu085aOhvZIjS2TE3NTc=&JDRN=Y&RoomID=184902,184903,185018,185019,184904,185017,185949",
    },
    {
      value: "gurugram2",
      label: "The Hoften Sukhvasa, Gurugram",
      slug: "gurugram-hotel",
      url: "https://bookings.alivaahotels.com/inst/#/home?propertyId=402NT4HhhBGbbpoRahFpDYw3nQ5NDM=&JDRN=Y&RoomID=210380,210381,210383,210384,210385",
    },
    {
      value: "mcleodganj",
      label: "Alivaa Hotel, Mcleodganj",
      slug: "mcleodganj",
      url: "https://alivaahotels.securedreservations.com/reservation?bID=6d7880d9-c05f-4be6-811f-eeb846d0c59d&cID=f1c6c3f5-04d5-4180-9895-7f3e3f6b240c&destination=id=185914d6-4ebc-48b5-b982-6e81e5eb35b0&type=2",
    },
    {
      value: "lansdowne",
      label: "Viceroy in Himalayas by Alivaa",
      slug: "lansdowne",
      url: "",
    },
    {
      value: "jawai",
      label: "Jawai Palash by Alivaa",
      slug: "jawai",
      url: "https://bookmystay.io/rooms/32794",
    },
    {
      value: "blue-magnets",
      label: "The Hoften Blue Magnets, Dalhousie",
      slug: "blue-magnets",
      url: "https://alivaahotels.securedreservations.com/reservation?bID=6d7880d9-c05f-4be6-811f-eeb846d0c59d&cID=f1c6c3f5-04d5-4180-9895-7f3e3f6b240c&destination=id=cee239fd-433d-4700-bd55-67795c3eca05&type=2",
    },

    {
      value: "lotwara-fort",
      label: "Alivaa Heritage Lotwara Fort",
      slug: "lotwara-fort",
      url: "",
    },
    {
      value: "lotus-court",
      label: "The Hoften Lotus Court, Noida",
      slug: "lotus-court",
      url: "https://alivaahotels.securedreservations.com/reservation?bID=6d7880d9-c05f-4be6-811f-eeb846d0c59d&cID=f1c6c3f5-04d5-4180-9895-7f3e3f6b240c&destination=id%3D134e7239-7681-4deb-96be-fecf3eabef63%26type%3D2",
    },
    {
      value: "sterling-plaza",
      label: "The Hoften Sterling Plaza, Bangalore",
      slug: "sterling-plaza",
      url: "https://alivaahotels.securedreservations.com/reservation?bID=6d7880d9-c05f-4be6-811f-eeb846d0c59d&cID=f1c6c3f5-04d5-4180-9895-7f3e3f6b240c&destination=id%3D00ea8ee2-067b-4b7f-b8d7-6c2d595f2ba2%26type%3D2",
    },
    {
      value: "hotels-in-amritsar",
      label: "Xenious Micro Amritsar",
      slug: "hotels-in-amritsar",
      url: "",
    },
    {
      value: "leaf-resorts-in-goa",
      label: "Xenious Cashew Leaf Resort, Goa",
      slug: "leaf-resorts-in-goa",
      url: "",
    },
    {
      value: "xenious_dharamshala",
      label: "Xenious Micro Dharamshala",
      slug: "xenious_dharamshala",
      url: "https://bookingsalivaahotels.securedreservations.com/reservation?bID=7b3fcece-9b92-46d0-b5b1-8ad7dc52ed77&cID=f1c6c3f5-04d5-4180-9895-7f3e3f6b240c&destination=id%3D131721%26type%3D1",
    },
  ];

  const checkInDatePickerRef = useRef(null);
  const checkOutDatePickerRef = useRef(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const isHomePage = pathname === "/";
  const [monthsToShow, setMonthsToShow] = useState(2);

  useEffect(() => {
    const updateMonthsToShow = () => {
      setMonthsToShow(window.innerWidth < 768 ? 1 : 2);
    };
    updateMonthsToShow();
    window.addEventListener("resize", updateMonthsToShow);
    return () => window.removeEventListener("resize", updateMonthsToShow);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    const lowerPath = pathname.toLowerCase();

    if (lowerPath.includes("jawai")) {
      setSelectedHotel(hotelOptions.find((opt) => opt.value === "jawai"));
    } else if (lowerPath.includes("mcleodganj")) {
      setSelectedHotel(hotelOptions.find((opt) => opt.value === "mcleodganj"));
    } else if (lowerPath.includes("gurgaon")) {
      setSelectedHotel(hotelOptions.find((opt) => opt.value === "gurugram1"));
    } else if (lowerPath.includes("gurugram")) {
      setSelectedHotel(hotelOptions.find((opt) => opt.value === "gurugram2"));
    } else if (lowerPath.includes("lansdowne")) {
      setSelectedHotel(hotelOptions.find((opt) => opt.value === "lansdowne"));
    } else if (lowerPath.includes("lotwara-fort")) {
      setSelectedHotel(
        hotelOptions.find((opt) => opt.value === "lotwara-fort")
      );
    } else if (lowerPath.includes("sterling-plaza")) {
      setSelectedHotel(
        hotelOptions.find((opt) => opt.value === "sterling-plaza")
      );
    } else if (lowerPath.includes("hotels-in-amritsar")) {
      setSelectedHotel(
        hotelOptions.find((opt) => opt.value === "hotels-in-amritsar")
      );
    } else if (lowerPath.includes("leaf-resorts-in-goa")) {
      setSelectedHotel(
        hotelOptions.find((opt) => opt.value === "leaf-resorts-in-goa")
      );
    } else if (lowerPath.includes("lotus-court")) {
      setSelectedHotel(hotelOptions.find((opt) => opt.value === "lotus-court"));
    } else if (lowerPath.includes("blue-magnets")) {
      setSelectedHotel(
        hotelOptions.find((opt) => opt.value === "blue-magnets")
      );
    } else if (lowerPath.includes("xenious_dharamshala")) {
      setSelectedHotel(
        hotelOptions.find((opt) => opt.value === "xenious_dharamshala")
      );
    }
  }, [pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isRoomMenuOpen && !event.target.closest(".rooms-child-outer-block")) {
        setIsRoomMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isRoomMenuOpen]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleCheckAvailability = () => {
    if (!selectedHotel) {
      toast.error("Please select a hotel");
      return;
    }
    if (!rangeStart || !rangeEnd) {
      toast.error("Please select both check-in and check-out dates");
      return;
    }

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    let bookingUrl = selectedHotel.url;
    const checkIn = formatDate(rangeStart);
    const checkOut = formatDate(rangeEnd);
    if (
      selectedHotel.value === "lansdowne" ||
      selectedHotel.value === "lotwara-fort" ||
      selectedHotel.value === "hotels-in-amritsar" ||
      selectedHotel.value === "leaf-resorts-in-goa"
    ) {
      setShowPopupForm(true); // show popup instead of opening URL
      return;
    }

    if (selectedHotel.value === "mcleodganj") {
      let guestParams = [];

      formRows.forEach((row, index) => {
        const roomIndex = index + 1;
        if (row.count1 > 0) {
          guestParams.push(`ac${roomIndex}=${row.count1}`);
        }
        if (row.count2 > 0) {
          guestParams.push(`cc${roomIndex}=${row.count2}`);
        }
      });

      const guestString = `[${guestParams.join(",")}]`;

      bookingUrl += `&checkInDate=${checkIn}&checkOutDate=${checkOut}&guest=${encodeURIComponent(
        guestString
      )}&roomPropertyID=185914d6-4ebc-48b5-b982-6e81e5eb35b0`;
    } else if (selectedHotel.value === "gurugram2") {
      bookingUrl += `&checkIn=${checkIn}&checkOut=${checkOut}&noofrooms=${countroom}`;
      formRows.forEach((row, index) => {
        bookingUrl += `&adult${index}=${row.count1}&child${index}=${row.count2}`;
      });
      bookingUrl += `&gsId=402NT4HhhBGbbpoRahFpDYw3nQ5NDM=&RoomID=210380,210381,210383,210384,210385&ap=1`;
    } else if (selectedHotel.value === "gurugram1") {
      bookingUrl += `&checkIn=${checkIn}&checkOut=${checkOut}&clientWidth=1280&noofrooms=${countroom}`;
      formRows.forEach((row, index) => {
        bookingUrl += `&adult${index}=${row.count1}&child${index}=${row.count2}`;
      });
      bookingUrl += `&gsId=981NJ8TQ49ro3Z7RTrbLaPgGZCWk8ihVQvzMylYvu085aOhvZIjS2TE3NTc=&RoomID=184902,184903,185018,185019,184904,185017,185949`;
    } else if (selectedHotel.value === "sterling-plaza") {
      bookingUrl += `&checkInDate=${checkIn}&checkOutDate=${checkOut}&clientWidth=1280&noofrooms=${countroom}`;
      bookingUrl +=
        `&guest=[` +
        `${formRows.map((row, index) => {
          return [].concat(
            `ac${index + 1}=${row.count1},cc${index + 1}=${row.count2}`
          );
        })}]`;
      bookingUrl += `&roomPropertyID=00ea8ee2-067b-4b7f-b8d7-6c2d595f2ba2`;
    } else if (selectedHotel.value === "blue-magnets") {
      bookingUrl += `&checkInDate=${checkIn}&checkOutDate=${checkOut}&clientWidth=1280&noofrooms=${countroom}`;
      bookingUrl +=
        `&guest=[` +
        `${formRows.map((row, index) => {
          return [].concat(
            `ac${index + 1}=${row.count1},cc${index + 1}=${row.count2}`
          );
        })}]`;
      bookingUrl += `&gsId=981NJ8TQ49ro3Z7RTrbLaPgGZCWk8ihVQvzMylYvu085aOhvZIjS2TE3NTc=&RoomID=184902,184903,185018,185019,184904,185017,185949&roomPropertyID=cee239fd-433d-4700-bd55-67795c3eca05`;
    } else if (selectedHotel.value === "lotus-court") {
      bookingUrl += `&checkInDate=${checkIn}&checkOutDate=${checkOut}&clientWidth=1280&noofrooms=${countroom}`;
      bookingUrl +=
        `&guest=[` +
        `${formRows.map((row, index) => {
          return [].concat(
            `ac${index + 1}=${row.count1},cc${index + 1}=${row.count2}`
          );
        })}]`;
      bookingUrl += `&roomPropertyID=134e7239-7681-4deb-96be-fecf3eabef63`;
    } else if (selectedHotel.value === "xenious_dharamshala") {
      bookingUrl += `&checkInDate=${checkIn}&checkOutDate=${checkOut}&clientWidth=1280&noofrooms=${countroom}`;
      bookingUrl +=
        `&guest=[` +
        `${formRows.map((row, index) => {
          return [].concat(
            `ac${index + 1}=${row.count1},cc${index + 1}=${row.count2}`
          );
        })}]`;
      bookingUrl += `&roomPropertyID=2e9dd77a-30b0-4b0d-a44c-3e18f8eb5acc`;
    } else if (selectedHotel.value === "jawai") {
      bookingUrl += `/${checkIn}/${checkOut}`;
      bookingUrl += formRows.map((row, index) => {
        return `/${row.count1}/${row.count2}`;
      });
      bookingUrl += `?utm_source=brandWebsite`;
    }

    window.open(bookingUrl, "_blank");
  };

  const handleHotelSelect = (option) => setSelectedHotel(option);
  const openCheckInCalendar = (e) => {
    e.stopPropagation();
    checkInDatePickerRef.current.setOpen(true);
  };
  const openCheckOutCalendar = (e) => {
    e.stopPropagation();
    checkOutDatePickerRef.current.setOpen(true);
  };
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
  // console.log(formRows);
  return (
    <>
      <Toaster position="bottom-right" />
      <div
        className={`header_booking_engine_container ${
          isFormOpen ? "show" : ""
        } ${isHomePage ? "home-page-class" : ""}`}
      >
        <div className="header_booking_engine">
          <div className="row justify-content-center">
            {/* Hotel Select */}
            <div className="header-search-select-option col-12 col-md-3">
              <label htmlFor="hotel-select">Hotel/City</label>
              <Select
                className="form-control p-0 border-0"
                id="hotel-select"
                options={hotelOptions}
                onChange={handleHotelSelect}
                value={selectedHotel}
              />
            </div>

            {/* Check-in */}
            <div className="datepicker-outer col-12 col-md-2">
              <label htmlFor="check-in">Check-in</label>
              <div className="datepicker-container">
                <DatePicker
                  selectsStart
                  selected={rangeStart}
                  dateFormat="dd/MM/yyyy"
                  onCalendarOpen={() => setIsCalendarOpen(true)}
                  onCalendarClose={() => setIsCalendarOpen(false)}
                  minDate={today1}
                  startDate={rangeStart}
                  // endDate={rangeEnd}
                  className="form-control pl-2"
                  id="check-in"
                  onChange={(date) => {
                    setRangeStart(date);
                    const nextDay = new Date(date);
                    nextDay.setDate(date.getDate() + 1);
                    setRangeEnd(nextDay);
                  }}
                  monthsShown={monthsToShow}
                  shouldCloseOnSelect={true}
                  ref={checkInDatePickerRef}
                />
                <span className="calendar-icon" onClick={openCheckInCalendar}>
                  <Calendar size={20} />
                </span>
              </div>
            </div>

            {/* Check-out */}
            <div className="datepicker-outer col-12 col-md-2">
              <label htmlFor="check-out">Check-out</label>
              <div className="datepicker-container">
                <DatePicker
                  selectsEnd
                  selected={rangeEnd}
                  dateFormat="dd/MM/yyyy"
                  onCalendarOpen={() => setIsCalendarOpen(true)}
                  onCalendarClose={() => setIsCalendarOpen(false)}
                  id="check-out"
                  endDate={rangeEnd}
                  className="form-control pl-2"
                  onChange={selectEndDate}
                  minDate={new Date(rangeStart.getTime() + 24 * 60 * 60 * 1000)}
                  monthsShown={monthsToShow}
                  shouldCloseOnSelect={true}
                  // minDate={rangeStart}
                  ref={checkOutDatePickerRef}
                />
                <span className="calendar-icon" onClick={openCheckOutCalendar}>
                  <Calendar size={20} />
                </span>
              </div>
            </div>

            {/* Rooms & Guests */}
            <div className="rooms-child-outer-block col-12 col-md-3 position-relative">
              <label htmlFor="rooms-childs-input">Please Select</label>
              <input
                type="text"
                id="rooms-childs-input"
                className="rooms-childs-input form-control"
                value={`Rooms: ${countroom} - Adults: ${adult()} - Children: ${children()}`}
                readOnly
                onClick={handleRoomMenuToggle}
              />
              {isRoomMenuOpen && (
                <div
                  className="showmoreT add-rooms-block"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div>
                    {formRows.map((row, index) => (
                      <div key={row.id} className="add-rooms-div">
                        <div className="room-name-or-remove">
                          <span>Room {index + 1}</span>
                          <button
                            className="yellow-btn rmv"
                            onClick={() => handleRemove(row.id)}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="row justify-content-center ms-0">
                          <div className="col-6">
                            <div className="form-group plus-min-style">
                              <p>Adult(s):</p>
                              <button
                                onClick={() =>
                                  handleDecrement(row.id, "count1")
                                }
                                disabled={row.count1 <= 1}
                              >
                                -
                              </button>
                              <span>{row.count1}</span>
                              <button
                                onClick={() =>
                                  handleIncrement(row.id, "count1")
                                }
                                disabled={row.count1 >= 2}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="form-group plus-min-style">
                              <p>Child(ren):</p>
                              <button
                                onClick={() =>
                                  handleDecrement(row.id, "count2")
                                }
                                disabled={row.count2 <= 0}
                              >
                                -
                              </button>
                              <span>{row.count2}</span>
                              <button
                                onClick={() =>
                                  handleIncrement(row.id, "count2")
                                }
                                disabled={row.count2 >= 2}
                              >
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

            {/* Submit */}
            <div className="col-12 col-md-2">
              <button
                className="yellow-btn btn"
                onClick={handleCheckAvailability}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`booking-search-bar-btn-div ${
          isHomePage ? "home-page-class1" : ""
        }`}
        style={{ zIndex: isCalendarOpen ? 0 : 10 }}
      >
        <button
          onClick={toggleBookingForm}
          className="booking-toggle-btn"
          aria-label={isFormOpen ? "Close booking form" : "Open booking form"}
          id="book-now-header"
        >
          {isFormOpen ? (
            <X size={20} color="black" />
          ) : (
            <span>Book Now</span>
          )}
        </button>
      </div>

      {showPopupForm &&
        ReactDOM.createPortal(
          <div className="popup-overlay">
            <div className="popup-form">
              <button
                className="close-btn"
                onClick={() => setShowPopupForm(false)}
              >
                ×
              </button>
              <h4 className="mb-4 text-center">Complete Your Booking</h4>

              <div className="popup-field">
                <label>Hotel</label>
                <input value={selectedHotel?.label} readOnly />
              </div>

              <div className="popup-field">
                <label>Check-in</label>
                <input value={formatDate(rangeStart)} readOnly />
              </div>

              <div className="popup-field">
                <label>Check-out</label>
                <input value={formatDate(rangeEnd)} readOnly />
              </div>

              <div className="popup-field">
                <label>Rooms & Guests</label>
                <input
                  value={`Rooms: ${countroom}, Adults: ${adult()}, Children: ${children()}`}
                  readOnly
                />
              </div>

              <div className="popup-field">
                <label>Name</label>
                <input
                  type="text"
                  value={guestInfo.name}
                  onChange={(e) =>
                    setGuestInfo({ ...guestInfo, name: e.target.value })
                  }
                  required
                  placeholder="Enter Name"
                />
                {guestInfo.name === "" &&
                  guestInfo.name !== undefined &&
                  guestInfo.submitted && (
                    <span style={{ color: "red", fontSize: "12px" }}>
                      Please enter your name
                    </span>
                  )}
              </div>
              <div className="popup-field">
                <label>Mobile</label>
                <input
                  type="tel"
                  value={guestInfo.mobile}
                  onChange={(e) =>
                    setGuestInfo({ ...guestInfo, mobile: e.target.value })
                  }
                  maxLength={10}
                  required
                  placeholder="Enter Mobile Number"
                />
                {guestInfo.mobile === "" &&
                  guestInfo.mobile !== undefined &&
                  guestInfo.submitted && (
                    <span style={{ color: "red", fontSize: "12px" }}>
                      Please enter your mobile number
                    </span>
                  )}
              </div>
              <div className="text-center">
                <button
                  className="jawai-booking-submit-btn"
                  onClick={async () => {
                    setGuestInfo((prev) => ({ ...prev, submitted: true }));
                    if (!guestInfo.name || !guestInfo.mobile) return;

                    const submitBtn = event.target;
                    submitBtn.textContent = "Processing...";
                    submitBtn.disabled = true;

                    try {
                      await handleEnquirySubmit();
                    } finally {
                      submitBtn.textContent = "Submit";
                      submitBtn.disabled = false;
                    }
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      <style jsx>
        {`
          .popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999999;
          }

          .popup-form {
            background: #fff;
            padding: 1rem;
            border-radius: 12px;
            width: 95%;
            max-width: 500px;
            position: relative;
            z-index: 999999999999999;
            border-bottom: 5px solid #002d62;
          }

          .popup-field {
            margin-bottom: 1rem;
            display: inline-block;
            width: 50%;
            padding: 0 10px;
          }

          .popup-field label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
          }

          .popup-field input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 6px;
          }

          .close-btn {
            position: absolute;
            top: 10px;
            right: 15px;
            background: transparent;
            border: none;
            font-size: 24px;
            cursor: pointer;
          }
          .jawai-booking-submit-btn {
            padding: 7px 15px;
            margin-top: 1em;
            border-radius: 4px;
            background-color: #002d62;
            border: 1px solid #000;
            color: #fff;
            border-radius: 4px !important;
            transition: background-color 0.3s ease;
            text-transform: uppercase;
            font-weight: 500;
            letter-spacing: 2px;
          }

          @media (max-width: 768px) {
            .popup-field input {
              font-size: 11px;
              padding: 6px;
            }
          }
        `}
      </style>
    </>
  );
}
