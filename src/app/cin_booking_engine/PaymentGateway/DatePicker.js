"use client";

import { useBookingEngineContext } from "../../cin_context/BookingEngineContext";
import React, { useEffect, useState, useMemo, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import axios from "axios";
import { createSignature } from "../../../utilities/signature";

const styles = {
  input: {
    padding: "5px",
    fontSize: "12px",
    width: "250px",
  },
};

const DatePicker = ({ selectedStartDate, selectedEndDate , onClose }) => {
  const { setSelectedDates, selectedPropertyId } = useBookingEngineContext();
  const [pricesMap, setPricesMap] = useState({});
  const dateInputRef = useRef(null);
    const pricesMapRef = useRef({});
  const pricesMapRef2 = useRef({});
 const defaultDesabledDate = useRef(null);
  const loadingRef = useRef(true);
  const flatpickrInstanceRef = useRef(null);
    const flatpickrRef = useRef(null);
  const fetchedRef = useRef(false);
  const currentDate = useMemo(() => new Date(), []);
  const sixMonthsLater = useMemo(() => {
    const date = new Date();
    date.setMonth(currentDate.getMonth() + 6);
    return date;
  }, [currentDate]);

  // const fromDate = useMemo(() => currentDate.toISOString().split("T")[0], [currentDate]);
  // const toDate = useMemo(() => sixMonthsLater.toISOString().split("T")[0], [sixMonthsLater]);
  const formatDateWithOffset = (date, offsetMinutes = 330) => {
    // clone the date
    const d = new Date(date.getTime() + offsetMinutes * 60 * 1000);
    return d.toISOString().split("T")[0];
  };

  // const fromDate = useMemo(
  //   () => formatDateWithOffset(currentDate, 330), // +5:30 = 330 minutes
  //   [currentDate]
  // );
  
  const formatDate2 = (date) => {
  const d = new Date(date); // convert string → Date
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
};
  const fromDateEt = useMemo(
    () => formatDateWithOffset(currentDate, 330), // +5:30 = 330 minutes
    [currentDate]
  );
  
  const toDateEt = useMemo(
    () => formatDateWithOffset(sixMonthsLater, 330),
    [sixMonthsLater]
  );
const fromDate = useMemo(() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;   // real Date object
}, []);
  const toDate = useMemo(
    () => formatDateWithOffset(sixMonthsLater, 330),
    [sixMonthsLater]
  );

  // Fetch price
  useEffect(() => {
    if (fetchedRef.current) return;
    loadingRef.current = true;
    fetchedRef.current = true;
    const fetchPrices = async () => {
      try {
        const timestamp = Date.now().toString();
        const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
        const signature = await createSignature(
          JSON.stringify(selectedPropertyId),
          timestamp,
          secret
        );
        
         const body = {
      selectedPropertyId: selectedPropertyId,
      fromDate: fromDateEt,
      toDate: toDateEt
      // product: "No",
    };
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/cin-api/rate-et`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-timestamp": timestamp,
              "x-signature": signature,
            },
            body: JSON.stringify(body),
          }
        );

        const data = await response.json();
        const dayRate = data?.PropertyList?.[0]?.DayRate || {};
        const prices = {};
         const prices2 = {};
        for (const date in dayRate) {
          prices[date] = dayRate[date]?.Rate || 0;
           prices2[formatDate2(date)] = dayRate[date]?.Rate || 0;
        }
        setPricesMap(prices);
         pricesMapRef.current = prices;
         pricesMapRef2.current = prices2;
         const disabledDates = Object.entries(prices2)
    .filter(([date, price]) => price == "0" || price == 0 || price == "N/A") 
    .map(([date]) => date);
    defaultDesabledDate.current = disabledDates;
      } catch (error) {
        console.error("Error fetching prices:", error);
      } finally {
        loadingRef.current = false;
        if (flatpickrRef?.current) {
           flatpickrRef?.current?.redraw();
         }
      }
    };

    fetchPrices();
  }, [selectedPropertyId, fromDateEt, toDateEt]);

  // Init Flatpickr
  useEffect(() => {
    if (!dateInputRef.current) return;

    flatpickrInstanceRef.current = flatpickr(dateInputRef.current, {
      mode: "range",
      //dateFormat: "Y-m-d",
      dateFormat: "d-m-Y",
      minDate: fromDate,
      showMonths: 1,
      static: true,
      fixedHeight: true,
      showOutsideDays: false,
      disable: [
        function (date) {
          const formatted = formatDate2(date); // "dd-mm-yyyy"
          const price = pricesMapRef2.current?.[formatted];
          return price == "N/A" || price === "0" || price === 0;
        },
      ],
      defaultDate:
        selectedStartDate && selectedEndDate
          ? [new Date(selectedStartDate), new Date(selectedEndDate)]
          : null,
      onChange: (selectedDates, dateStr, fp) => {
        if (selectedDates.length === 1) {
      // ✅ When only check-in is selected → restrict checkout date
      fp.set("minDate", selectedDates[0]);
    }
        if (selectedDates.length === 2) {
          let [startDate, endDate] = selectedDates;
          if (
            startDate &&
            endDate &&
            startDate.toDateString() === endDate.toDateString()
          ) {
            endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1);
            fp.setDate([startDate, endDate], true); // update flatpickr
          }
          const startDateFormatted = formatDate(startDate);
          const endDateFormatted = formatDate(endDate);
          let priceSum = 0;
          const tempDate = new Date(startDate);
          while (tempDate <= endDate) {
            const dateKey = formatDate(tempDate);
            if (pricesMap[dateKey]) {
              priceSum += pricesMap[dateKey];
            }
            tempDate.setDate(tempDate.getDate() + 1);
          }

          setSelectedDates(startDateFormatted, endDateFormatted, priceSum);
        }
      },
  onClose: (selectedDates, dateStr, fp) => {
    if (selectedDates.length === 1) {
      // ✅ User closed after only check-in date → auto-assign next day
      const startDate = selectedDates[0];
      const checkOutDate = new Date(startDate);
      checkOutDate.setDate(checkOutDate.getDate() + 1);

      fp.setDate([startDate, checkOutDate], true);

      const startDateFormatted = formatDate(startDate);
      const endDateFormatted = formatDate(checkOutDate);

      setIsDateChanged(true);

      let priceSum = 0;
      const tempDate = new Date(startDate);
      while (tempDate <= checkOutDate) {
        const dateKey = formatDate(tempDate);
        if (pricesMap[dateKey]) {
              priceSum += pricesMap[dateKey];
            }
        tempDate.setDate(tempDate.getDate() + 1);
      }

      setSelectedDates(startDateFormatted, endDateFormatted, priceSum);
    }
  },
      onDayCreate: (dObj, dStr, fp, dayElem) => {
        if (!dayElem?.dateObj) return;

        const date = formatDate(dayElem?.dateObj);
        const priceTag = document.createElement("div");
        priceTag.className = "flatpickr-price";
        priceTag.style.fontSize = "10px";
        priceTag.style.position = "absolute";
        priceTag.style.bottom = "8px";
        priceTag.style.left = "50%";
        priceTag.style.transform = "translateX(-50%)";

        if (loadingRef?.current) {
          priceTag.innerHTML = `<div class="skeleton-loader"></div>`;
        } 
        // else if (pricesMap[date] !== undefined) {
        //   priceTag.textContent = `${pricesMap[date] == "0" ? "N/A" :pricesMap[date]}`;
        // }
      else if (pricesMap[date] !== undefined) {
        if (pricesMap[date] == "0" || pricesMap[date] === "N/A") {
          priceTag.innerHTML = `<span class="na-text">N/A</span>`;
          dayElem.classList.add("flatpickr-disabled");
          dayElem.style.pointerEvents = "none";
         // dayElem.style.opacity = "0.4";
        } else {
          priceTag.textContent = pricesMap[date];
        }
      }
        dayElem.appendChild(priceTag);
      },
      onClose: () => {
        if (onClose) onClose();  // ✅ notify parent when closed
      }
    });

    flatpickrInstanceRef.current.open();

    flatpickrRef.current = flatpickrInstanceRef.current;
    return () => {
      flatpickrInstanceRef.current.destroy();
    };
  }, []);

  // Inject prices into calendar
  useEffect(() => {
    const fp = flatpickrInstanceRef.current;
    if (!fp || !fp.calendarContainer) return;
    const dayElements = fp.calendarContainer.querySelectorAll(".flatpickr-day");
    dayElements.forEach((dayElem) => {
      const date = dayElem.dateObj;
      if (!date) return;

      const dateKey = formatDate(date);
      const price = pricesMap[dateKey];

      if (price !== undefined) {
        const existingPriceTag = dayElem.querySelector(".flatpickr-price");
        if (existingPriceTag) existingPriceTag.remove();

        const priceTag = document.createElement("div");
        priceTag.className = "flatpickr-price";
        priceTag.style.fontSize = "10px";
        priceTag.style.position = "absolute";
        priceTag.style.bottom = "8px";
        priceTag.style.left = "50%";
        priceTag.style.transform = "translateX(-50%)";
        priceTag.textContent = `${price}`;
        
        if (loadingRef?.current) {
          priceTag.innerHTML = `<div class="skeleton-loader"></div>`;
        } 
        // else if (pricesMap[date] !== undefined) {
        //   priceTag.textContent = `${pricesMap[date] == "0" ? "N/A" :pricesMap[date]}`;
        // }
else if (pricesMap[date] !== undefined) {
  if (pricesMap[date] == "0" || pricesMap[date] == 0 || pricesMap[date] === "N/A") {
    priceTag.innerHTML = `<span class="na-text">N/A</span>`;
    dayElem.classList.add("flatpickr-disabled");
    dayElem.style.pointerEvents = "none";
   // dayElem.style.opacity = "0.4";
  } else {
    priceTag.textContent = pricesMap[date];
  }
}
        dayElem.appendChild(priceTag);
      }
    });
  }, [pricesMap]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div style={styles.input} className="flatpicker-for-calender-date">
      
      <style>
  {`
    .skeleton-loader {
      width: 40px;
      height: 10px;
      background: linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s linear infinite;
      border-radius: 4px;
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .na-text {
      color: red !important;
      font-weight: 600;
    }
  `}
</style>
      <input
        id="datePicker"
        ref={dateInputRef}
        placeholder="Please Select Date"
        className="form-control"
        style={{
          display: "none", // set to block if needed
        }}
      />
    </div>
  );
};

export default DatePicker;
