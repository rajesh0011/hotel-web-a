"use client";

import { useBookingEngineContext } from "../cin_context/BookingEngineContext";
import React, { useEffect, useState, useMemo, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import axios from "axios";
import { createSignature } from "../../utilities/signature";

const styles = {
  input: {
    padding: "5px",
    fontSize: "12px",
    width: "250px",
  },
};

const DateRangePicker = () => {
  const {
    setSelectedDates,
    selectedStartDate,
    selectedEndDate,
    selectedPropertyId,setIsDateChanged
  } = useBookingEngineContext();
  const pricesMapRef = useRef({});
  const pricesMapRef2 = useRef({});
  const loadingRef = useRef(true);
  const flatpickrRef = useRef(null);
  const [pricesReady, setPricesReady] = useState(false);
 const defaultDesabledDate = useRef(null);
  const currentDate = useMemo(() => new Date(), []);
  const sixMonthsLater = useMemo(() => {
    const date = new Date();
    date.setMonth(currentDate.getMonth() + 6);
    return date;
  }, [currentDate]);
  const formatDateWithOffset = (date, offsetMinutes = 330) => {
    const d = new Date(date.getTime() + offsetMinutes * 60 * 1000);
    return d.toISOString().split("T")[0];
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

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  const formatDate2 = (date) => {
  const d = new Date(date); // convert string → Date
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
};

   useEffect(() => {
     const fetchPrices = async () => {
       if (!selectedPropertyId) return;

       loadingRef.current = true;
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
           "https://cindemo.cinuniverse.com/api/cin-api/rate-et",
           {
             method: "POST",
             headers: {
               "Content-Type": "application/json",
               "x-timestamp": timestamp,
               "x-signature": signature,
             },
            //  body: JSON.stringify({ selectedPropertyId, fromDateEt, toDateEt }),
            
             body: JSON.stringify(body),
           }
         );
         const data = await response?.json();
         const dayRate = data?.PropertyList?.[0]?.DayRate || {};
         const prices = {};
         const prices2 = {};
         for (const date in dayRate) {
           prices[date] = dayRate?.[date]?.Rate || 0;
           
           prices2[formatDate2(date)] = dayRate?.[date]?.Rate || 0;

         }
         pricesMapRef.current = prices;
         pricesMapRef2.current = prices2;
         const disabledDates = Object.entries(prices2)
    .filter(([date, price]) => price == "0" || price == 0 || price === "N/A") 
    .map(([date]) => date);
    defaultDesabledDate.current = disabledDates;
         setPricesReady(true);
       } catch (error) {
         console.error("Error fetching prices:", error);
       } finally {
         loadingRef.current = false;
         if (flatpickrRef?.current && flatpickrRef?.current != undefined && flatpickrRef?.current != null ) {
           flatpickrRef?.current?.redraw();
         }
       }
     };

     fetchPrices();
   }, [selectedPropertyId, fromDateEt, toDateEt]);

  useEffect(() => {
    const inputElement = document?.getElementById("dateRangePicker");
    if (!inputElement) return;
 const disabledDates = Object.entries(pricesMapRef2?.current)
    .filter(([date, price]) => price == "0" || price == "0" || price === "N/A") 
    .map(([date]) => date);
const instance = flatpickr(inputElement, {
  mode: "range",
  //dateFormat: "Y-m-d",
  dateFormat: "d-m-Y",
  minDate: fromDate,
  showMonths: 1,
  fixedHeight: true,
  showOutsideDays: false,
  position: "auto",
  //disable: defaultDesabledDate?.current ?? disabledDates,
  disable: [
  function (date) {
    const formatted = formatDate2(date); // "dd-mm-yyyy"
    const price = pricesMapRef2.current?.[formatted];
    return price === "N/A" || price === "0" || price === 0;
  },
],
  defaultDate:
    selectedStartDate && selectedEndDate
      ? [new Date(selectedStartDate), new Date(selectedEndDate)]
      : null,

  onChange: (selectedDates, dateStr, fp) => {
    if (selectedDates?.length === 1) {
      // ✅ When only check-in is selected → restrict checkout date
      fp.set("minDate", selectedDates?.[0]);
    }
    if (selectedDates?.length === 2) {
      let [startDate, endDate] = selectedDates;

      // ✅ Case 2: If same date is picked as check-in & check-out → shift checkout +1 day
      if (
        startDate &&
        endDate &&
        startDate.toDateString() === endDate.toDateString()
      ) {
        endDate = new Date(startDate);
        endDate.setDate(endDate?.getDate() + 1);
        fp.setDate([startDate, endDate], true); // update flatpickr
      }

      const startDateFormatted = formatDate(startDate);
      const endDateFormatted = formatDate(endDate);

      setIsDateChanged(true);

      let priceSum = 0;
      const tempDate = new Date(startDate);
      while (tempDate <= endDate) {
        const dateKey = formatDate(tempDate);
        if (pricesMapRef?.current?.[dateKey]) {
          priceSum += pricesMapRef?.current?.[dateKey];
        }
        tempDate.setDate(tempDate?.getDate() + 1);
      }

      setSelectedDates(startDateFormatted, endDateFormatted, priceSum);
    }
  },

  onClose: (selectedDates, dateStr, fp) => {
    if (selectedDates?.length === 1) {
      // ✅ Case 1: User closed after only check-in → auto set checkout = next day
      const startDate = selectedDates?.[0];
      const checkOutDate = new Date(startDate);
      checkOutDate.setDate(checkOutDate?.getDate() + 1);

      fp.setDate([startDate, checkOutDate], true);

      const startDateFormatted = formatDate(startDate);
      const endDateFormatted = formatDate(checkOutDate);

      setIsDateChanged(true);

      let priceSum = 0;
      const tempDate = new Date(startDate);
      while (tempDate <= checkOutDate) {
        const dateKey = formatDate(tempDate);
        if (pricesMapRef?.current?.[dateKey]) {
          priceSum += pricesMapRef?.current?.[dateKey];
        }
        tempDate.setDate(tempDate?.getDate() + 1);
      }

      setSelectedDates(startDateFormatted, endDateFormatted, priceSum);
    }
  },
  
      onDayCreate: (dObj, dStr, fp, dayElem) => {
        if (!dayElem?.dateObj) return;

        const date = formatDate(dayElem?.dateObj);
        const priceTag = document?.createElement("div");
        priceTag.className = "flatpickr-price";
        priceTag.style.fontSize = "10px";
        priceTag.style.position = "absolute";
        priceTag.style.bottom = "8px";
        priceTag.style.left = "50%";
        priceTag.style.transform = "translateX(-50%)";

        if (loadingRef?.current) {
          priceTag.innerHTML = `<div class="skeleton-loader"></div>`;
        } 
        // else if (pricesMapRef?.current[date] !== undefined) {
        //   priceTag.textContent = `${pricesMapRef?.current[date] == "0" ? "N/A" :pricesMapRef?.current[date]}`;
        // }
else if (pricesMapRef?.current?.[date] !== undefined) {
  if (pricesMapRef?.current?.[date] == "0" || pricesMapRef?.current?.[date] === "N/A") {
    priceTag.innerHTML = `<span class="na-text">N/A</span>`;
    dayElem.classList.add("flatpickr-disabled");
    dayElem.style.pointerEvents = "none";
   // dayElem.style.opacity = "0.4";
  } else {
    priceTag.textContent = pricesMapRef?.current?.[date];
  }
}

        dayElem.appendChild(priceTag);
      },
});



    flatpickrRef.current = instance;

    return () => {
      instance.destroy();
    };
  }, [selectedPropertyId,selectedStartDate, selectedEndDate]);

  return (
    <div style={styles.input} className="flatpicker-for-calender-date">
       {/* <style>
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
        `}
      </style>  */}
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
        id="dateRangePicker"
        placeholder="Please Select Date"
        style={styles.input}
        className="form-control"
        autoComplete="off"
      />
    </div>
  );
};

export default DateRangePicker;
