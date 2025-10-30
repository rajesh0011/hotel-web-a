"use client";
import axios from "axios";
import { useBookingEngineContext } from "../cin_context/BookingEngineContext";
import * as ReactDOM from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
//import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import "flatpickr/dist/themes/material_green.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { X, Edit, Pencil, User2Icon } from 'lucide-react';
import { Check } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Tags } from "lucide-react";


import {
  faSearch,
  faPlane,
  faDiamond,
  faMaximize,
  faPeopleGroup,
  faXmark,
  faTrain,
  faMapMarked,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import RoomManager from "./RoomManager";

import DateRangePicker from "./Flatpicker";
import WizardSidebar from "./PaymentGateway/WizardForm";
import "./booking.css";
import { createSignature } from "../../utilities/signature";
import { getUserInfo } from "../../utilities/userInfo";
//import { useForm } from "app/booking-engine-widget/FormContext";
import Login from "./Users/Login";
import SignUp from "./Users/SignUp";
import Link from "next/link";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Map, MapIcon, Search } from "lucide-react";
//import { useSearchParams } from "next/navigation";
import Select from "react-select";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import CombinedWizardSidebar from "./PaymentGateway/CombinedWizard";
import { useForm } from "../../app/booking-engine-widget/FormContext";
//import { waitUntilRefTrue } from "../common/waitUntilRefTrue";
const dummyImage = "/no_image.jpg";
const baseurl = `#`;
//import { createPortal } from "react-dom";
//import useBook from "app/booking-engine-widget/useBook";

const FilterBar = ({
  contentData,
  tokenKey,
  selectedProperty,
  cityDetails,
  openBookingBar,
  roomDetails,
  onClose
}) => {
  const {
    setSelectedPropertyId,
    selectedPropertyId,
    setSelectedPropertyName,
    setSelectedPropertyPhone,
    setFilteredRooms,
    selectedRoom,
    setSelectedRoom,
    setSelectedRoomRate,
    setPropertyId,
    setCancellationPolicyState,
    selectedRoomDetails,
    setSelectedRoomDetails,
    totalPrice,
    selectedStartDate,
    selectedEndDate,
    setTotalPrice,
    currentStep,
    setCurrentStep,
    selectedRateDataList,
    selectedSetRateDataList,
    rateResponse,
    setRateResponse,
    addOnsresponse,
    setAddOnsResponse,
    promoCodeContext,
    setPromoCodeContext,
    setSelectedStartDate,
    setSelectedEndDate,
    setTermsAndConditions,
    setProperty,
    loggedUserDetails,
    setLoggedUserDetails,
    setIsAddOnns,
    setAddonList,
    keyData,
    isMemberRate,
    setIsMemberRate,
    defaultOffer, setDefaultOffer,
    selectedRooms,isTokenKey, setTokenKey,
        cancellationPolicyPackage,
        setCancellationPolicyPackage,
        isDateChanged, setIsDateChanged,
        offerTagIndex, setOfferTagIndex,
       storedIndex, setStoredIndex,
    totalTax, setTotalTax,
    isStayStepOpen, setIsStayStepOpen,
    totalRoomsBasePrice, setTotalRoomsBasePrice
  } = useBookingEngineContext();
const { cityDropDown, properties } = useForm();
  const totalAdults = selectedRooms.reduce((sum, room) => sum + room.adults, 0);
  const totalChildren = selectedRooms.reduce(
    (sum, room) => sum + room.children,
    0
  );
  const totalRooms = selectedRooms.length;

const containerPackRef = useRef(null);
  const [filters, setFilters] = useState({
    offer: "",
    query: "",
    dateRange: { start: "", end: "", totalPrice: 0 },
    guests: { adults: 1, children: 0, rooms: 1 },
  });
   const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [showDownDiv,setShowDownDiv] = useState(true)
  const [promoCode, setPromoCode] = useState("");
  const [destination, setDestination] = useState("");
  const [filteredProperties, setFilteredProperties] = useState([]);
  //const [contentProperties, setContentProperties] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [propertyList, setPropertyList] = useState([]);
  const [isClassAddedBook, setIsClassAddedBook] = useState(false);
  const [activeHotel, setActiveHotel] = useState(null);
  const [visibleOfferRoomId, setVisibleOfferRoomId] = useState(null);
  const [selectedRoomOffers, setSelectedRoomOffers] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isHandleSearched, setHandleSearched] = useState(false);
  const [isCloseWizard, setCloseWizard] = useState(false);
  const inputRef = useRef(null);
  
  //const { isFormOpen, setIsFormOpen } = useForm();
  const [isOpenSignUp, setIsOpenSignUp] = useState(false);
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState(false);

  const [isRateFetched, setIsRateFetched] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [propertyDropDown, setPropertyDropDown] = useState([]);
  //const [cityDropDown, setCityDropDown] = useState([]);
  const [cityName, setCityName] = useState(null);
  const [selectedHotelName, setSelectedHotelName] = useState([]);
  const [cmsPropertyId, setCMSPropertyId] = useState(null);
  const [isHandleBookNow, setHandleBookNow] = useState(false);
  const [newClassRoom, setNewClassRoom] = useState(false);
  const [initialTime, setInitialTime] = useState(null);

  const [showBookingLoader, setShowBookingLoader] = useState(false);
  // let roomsData = ""; 
  // let mappingData =""; 
  // let isCloseData = false;
  // let ctaNameData = ""; 
  // let apiNameData = "";  
  // let apiUrlData = "";  
  // let apiStatusData = ""; 
  // let apiErrorCodeData = "";  
  // let apiMessageData = "";
//  const filterBarRef = useRef(null);
//  const [packageCancellationPolicy, setPackageCancellationPolicy] = useState([]);
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    mobilePrifix: "",
    mobileNo: "",
    emailId: "",
    city: "",
    stateCode: "",
    country: "",
    privacyPolicyAcceptance: "",
    password: "",
    confirmPassword: "",
    promoCode: "",
  });

  const [activeView, setActiveView] = useState("category");
  const [activeCategory, setActiveCategory] = useState("hotel");
  const [galleryCategory, setGalleryCategory] = useState("hotel");
  const [currentSlide, setCurrentSlide] = useState(1);
  const swiperRef = useRef(null);

  const [viewMoreRoom, setViewMoreRoom] = useState(null);
  const [showRoomsModal, setShowRoomsModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryImages, setCategoryImages] = useState([]);
  const [propertyImages, setPropertyImages] = useState([]);

  const [propertyData, setPropertyData] = useState(null);
  const [brandMap, setBrandMap] = useState({});
  const [propertyPageUrl, setpropertyPageUrl] = useState(null);
  const [isLoaderOverlay, setLoaderOverlay] = useState(false);
  const [noProperty, setNoProperty] = useState(false);
  const [selectedPropertyBookingId, setSelectedPropertyBookingId] = useState(false);
   const [isPromoCodeChanged, setPromoCodeChanged] = useState(false);
   const [isEditClicked, setIsEditClicked] = useState(false);
  const [isCallWizard, isSetCallWizard] = useState(false);
  const [isSelectLoader, setSelectLoader] = useState(false);
  
  const [showFinalCart, setShowFinalCart] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [rateGuid, setRateGuid] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [toastError, setToastError] = useState("");
  const [toastMessages, setToastMessages] = useState([]);
  const propertyValueRef = useRef(null);
  const contentProperties = useRef(null);
  const rateDataRef = useRef(null);
  const bothReadyRef = useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const replaceKeys = ["book-now", "select-package", "pay-now", "search"];
  const collectionProperties = [52676, 53383, 54638, 53537, 24046, 21604, 
    23394, 21758, 26634, 23795, 7205, 54547, 7840, 55899];
  
  const [isTimeOutInventory, setTimeOutInventory] = useState(false);


   useEffect(() => {
        // Dynamically import Bootstrap's JavaScript on the client side
        require('bootstrap/dist/js/bootstrap.bundle.min.js');
      }, []);
      
  //const [isTimeOutContent, setTimeOutContent] = useState(false);
  
  const isTimeOutContent = useRef(false);
   function getTwoUniqueRandoms(min, max) {
  const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
  let num2;
  do {
    num2 = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (num2 === num1);
  return [num1, num2];
}

const [number1, number2] = getTwoUniqueRandoms(3, 10);

function replaceAction(newAction) {
    const params = new URLSearchParams(searchParams.toString());
    let replaced = false;

    // remove any existing action keys
    replaceKeys.forEach(key => {
      if (params.has(key)) {
        params.delete(key);
        replaced = true;
      }
    });

    // if no params OR replaced → add the new action
    if ([...params.keys()].length === 0 || replaced) {
      params.set(newAction, "");
    } else if (!params.has(newAction)) {
      // if other queries exist but no action → add it
      params.set(newAction, "");
    }

    // cleanup so `action=` becomes just `action`
    const query = params.toString().replace(/=(&|$)/g, "$1");

    router.replace(`${pathname}?${query}`);
  }
  const handleSearchTh = (property) => {

  const baseUrl = "https://www.swiftbook.io/inst/#home";
 const fixp = "MzU1NEBXZWIyNQ==";
    function buildRedirectUrl({
      propertyId,
      checkIn,
      checkOut,
      currency,
      rooms,
      source,
      utm
    }) {
      const params = new URLSearchParams({
        propertyId,
        JDRN: "Y",
        checkIn,
        checkOut,
        currency,
        noofrooms: rooms.length.toString(),
        source,
        utm_source: utm.source,
        utm_medium: utm.medium,
        utm_campaign: utm.campaign,
        m_currency: currency,
       //fixp: property ? "" : fixp
        fixp
      });
    
      // add adults/children for each room
      rooms.forEach((room, index) => {
        params.append(`adult${index}`, room.adults);
        params.append(`child${index}`, room.children);
      });
    
      return `${baseUrl}?${params.toString()}`;
    }
    
    if(selectedRoom?.length >= 1){
      const rooms = selectedRoom.map(room => ({
        adults: room.adults,   
        children: room.children
      }));
      const url2Rooms = buildRedirectUrl({
      propertyId: selectedPropertyBookingId,
      checkIn: fromDate,
      checkOut: toDate,
      currency: "INR",
      source: "localuniversal",
      utm: { source: "GoogleListing", medium: "free", campaign: "GoogleListing" },
      rooms,
      //fixp: property ? "" : fixp
      fixp
    });
    if(selectedPropertyBookingId > 0){
    window.location.href = url2Rooms;
    hideBookingEngine();
    }
    else{
      setNoProperty(true);
    }
    }
    }
  //const [sessionId, setSessionId] = useState(null);
  useEffect(() => {
  if (toastMessages.length > 0) {
    toast.error(toastMessages?.[0], { position: "top-right", duration: 3000 });
    setToastMessages([]); // clear after showing
  }
}, [toastMessages]);
useEffect(() => {
    if (window.location.hash) {
      router.replace(window.location.pathname);
      // keeps query params intact if needed
      // router.replace(window.location.pathname + window.location.search);
    }
  }, [router]);
  useEffect(() => {
    function checkScreenSize() {
      setIsSmallScreen(window.innerWidth < 768); // Change 768 to your breakpoint
    }

    // Set initial value
    checkScreenSize();

    // Listen to window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const openGallery = (idx, category) => {
    setActiveCategory(idx);
    setGalleryCategory(category);
    setActiveView("gallery");
    setCurrentSlide(1);
  };
  function encodeBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  const formatDate = (date) => {
    if (!date) return;
    return new Date(date).toISOString().split("T")[0];
  };
  const getDateDifferenceInDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffInMs = endDate - startDate;
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // convert ms to days
  };

  const fromDate = formatDate(selectedStartDate);
  const toDate = formatDate(selectedEndDate);
  //const promoCode = "";
  
const [numberOfNights,setNumberOfNights] = useState(getDateDifferenceInDays(fromDate, toDate));

  useEffect(() => {
    if (openBookingBar) {
      showBookingEngine();
    } else {
      hideBookingEngine();
    }
  }, [openBookingBar]);

useEffect(() => {
  if (!availableRooms || availableRooms.length === 0) return;

  const calculateFinalCart = async () => {
const roomWithMinRate = availableRooms?.reduce((lowest, current) => {
  const ratePlan = current?.RatePlans?.[0];
  if (!ratePlan) return lowest;

  const firstRateKey = Object.keys(ratePlan?.Rates || {})[0];
  const currentRate = parseFloat(
    ratePlan?.Rates?.[firstRateKey]?.OBP?.["1"]?.RateAfterTax || "0"
  );

  if (!lowest) {
    return { room: current, rate: currentRate };
  }

  return currentRate < lowest.rate
    ? { room: current, rate: currentRate }
    : lowest;
}, null);

    const calculateNumberOfDays = () => {
      if (!selectedStartDate || !selectedEndDate) return 1;
      const start = new Date(selectedStartDate);
      const end = new Date(selectedEndDate);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const numberOfDays = calculateNumberOfDays();

    const calculateBasePrice = () => {
      const totalRoomRate = (() => {
        if (!selectedRoom || selectedRoom.length === 0) return 0;

        const rates = selectedRoom.map((r) => parseFloat(r?.packageRate) || null);
        const filledRates = [];
        let lastKnownRate = null;

        for (let i = 0; i < rates.length; i++) {
          let currentRate = rates[i];
          if (currentRate) {
            lastKnownRate = currentRate;
            filledRates.push(currentRate);
          } else {
            if (i === 0) {
              const firstRate = rates.find((r) => r !== null);
              filledRates.push(firstRate || 0);
              lastKnownRate = firstRate || 0;
            } else {
              filledRates.push(lastKnownRate || 0);
            }
          }
        }

        let sum = filledRates.reduce((sum, r) => sum + r, 0);
        if (sum === 0 && roomWithMinRate?.rate) {
          sum = roomWithMinRate.rate * selectedRoom.length;
        }
        return sum;
      })();

      return totalRoomRate * numberOfDays;
    };

    const calculateTotalWithTax = () => {
      const basePrice = calculateBasePrice();
      return totalTax + (basePrice || 0);
    };

    const finalAmount = calculateTotalWithTax();
    setShowFinalCart(finalAmount);
  };

  calculateFinalCart();
}, [availableRooms, selectedRoom, selectedStartDate, selectedEndDate, totalTax]);

const checkIfBothReady = async (propertyId,guid,response, data ) =>{
   if(propertyId == "ECONNABORTED"){
  
       isTimeOutContent.current = true;
   }
  let roomsData = "";
  let mappingData = "";
  let isCloseData = false;
  let apiStatusData = "";
  let apiErrorCodeData = "";
  let apiMessageData = guid;
  let apiNameData = "rate";
  let apiUrlData = `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/cin-api/rate`;
  if (contentProperties.current && rateDataRef.current && !bothReadyRef.current) {
        bothReadyRef.current = true;
     // rateDataRef.current = product?.Rooms || [];
     // const rooms = rateDataRef.current?.Rooms || [];
  const dayRate = rateDataRef.current?.map((room) => {
  const updatedRatePlans = (room?.RatePlans || []).map((plan) => {
    const updatedRates = {};

    for (const [dateKey, rateValue] of Object.entries(plan.Rates || {})) {
  const updatedOBP = [];

  // Loop through each selectedRoom for this room
  for (const sel of selectedRoom || []) {
    if (sel.roomId === room.RoomId) continue; // only process same room

    // find mapping for this rateId
    const mapping = contentProperties.current?.[0]?.Mapping?.find(
      (m) => m.RateId === plan.RateId
    );
    const adults = sel.adults || 0;
    const children = sel.children || 0;
    const applicableAdult = mapping?.ApplicableAdult || 0;
    const applicableChild = mapping?.ApplicableChild || 0;
    const applicableGuest = mapping?.ApplicableGuest || 0;
    const maxAdult = mapping?.MaxAdult || 0;

    let adjustedAdults = adults;
    let adjustedChildren = children;

    // Step 1: Adjust children to meet minimum adults
    if (adults < applicableAdult && children > 0) {
      const neededAdults = applicableAdult - adults;
      const childrenToAdults = Math.min(neededAdults, children);
      adjustedAdults += childrenToAdults;
      adjustedChildren -= childrenToAdults;
    }

    // Step 2: Extra children beyond applicableChild & guest limit
    const extraChildren =
      adjustedChildren > applicableChild
        ? Math.min(
            adjustedChildren - applicableChild,
            Math.max(0, adjustedAdults + adjustedChildren - applicableGuest)
          )
        : 0;

    // Step 3: Extra adults beyond maxAdult
    const extraAdults = Math.max(0, adults - maxAdult);

    // Step 4: Compute base + extra rates + taxes
    // let guestRate ={};
    // //guestRate = rateValue.OBP?.[adults.toString()] ||rateValue.OBP?.[(rateValue.OBP?.length -1).toString()] || {};
    // if( adults < rateValue.OBP?.length){

    // guestRate = rateValue.OBP?.[adults.toString()] || {};
    // }
    // else{
      
    // // guestRate = rateValue?.OBP?.[(rateValue.OBP?.length -1).toString()] || {};
    // guestRate = rateValue?.OBP?.[Object.keys(rateValue.OBP || {}).pop()] || {};
    // }
    let guestRate = {};
const obpKeys = Object.keys(rateValue.OBP || {});
const obpLength = obpKeys.length;

if (adults < obpLength) {
  guestRate = rateValue.OBP?.[adults.toString()] || {};
} else {
  guestRate = rateValue.OBP?.[obpKeys[obpLength - 1]] || {};
}
    const baseRate = parseFloat(guestRate?.RateBeforeTax || 0);
    const perChildRate = parseFloat(rateValue?.ExtraChildRate?.RateBeforeTax || 0);
    //const perAdultExtraRate = parseFloat(rateValue?.ExtraAdultRate?.RateBeforeTax || 0);

    const guestTaxTotal = Array.isArray(guestRate?.Tax)
      ? guestRate.Tax.reduce((s, t) => s + parseFloat(t?.Amount || 0), 0)
      : 0;

    // const extraChildTaxTotal = extraChildren
    //   ? (rateValue?.ExtraChildRate?.Tax || []).reduce((s, t) => s + parseFloat(t?.Amount || 0), 0) * extraChildren
    //   : 0;
    let extraChildTaxTotal = 0
    let obp = extraChildren >= 1 ? rateValue?.ExtraChildRate?.Tax || [] : []
     if (extraChildren >= 1 && obp.length == 0) {
        const price = (parseFloat(rateValue?.ExtraChildRate?.RateBeforeTax * parseInt(extraChildren)) + parseFloat(baseRate));
         
          extraChildTaxTotal = price >= 7500 ? Math.round(price * 0.18) : Math.round(price * 0.05)
      }

    const totalRate =
      baseRate +
      perChildRate * extraChildren +
      (extraChildTaxTotal == 0 ? guestTaxTotal : 0) +
      extraChildTaxTotal;

    // Push to array instead of object
    updatedOBP.push({
      ...rateValue.OBP,
      rateId: sel.rateId,
      TotalRate: Math.round(totalRate).toString(),
    });
  }

  updatedRates[dateKey] = {
    ...rateValue,
    OBP: updatedOBP, // ✅ Now it's an array
    ExtraAdultRate: rateValue?.ExtraAdultRate || {},
    ExtraChildRate: rateValue?.ExtraChildRate || {},
  };
}


    return {
      ...plan,
      Rates: updatedRates,
    };
  });

  // Compute room-level total by summing TotalRate from all selectedRoom entries
  const roomLevelTotal = (selectedRoom || [])
    .filter((s) => s.roomId === room.RoomId)
    .reduce(
      (sum, s) =>
        sum +
        parseFloat(
          updatedRatePlans[0].Rates?.[Object.keys(updatedRatePlans[0].Rates)[0]]?.OBP?.[s.rateId]?.TotalRate || 0
        ),
      0
    );

  return {
    RoomId: room?.RoomId,
    MinInventory: room?.MinInventory ?? 0,
    RestrictionTitle: room?.RestrictionTitle ?? "",
    RateBeforeTax:
      room?.RatePlans?.[0]?.Rates?.[Object.keys(room?.RatePlans?.[0]?.Rates || {})[0]]?.OBP?.["1"]?.RateBeforeTax || "0",
    RateAfterTax:
      room?.RatePlans?.[0]?.Rates?.[Object.keys(room?.RatePlans?.[0]?.Rates || {})[0]]?.OBP?.["1"]?.RateAfterTax || "0",
    RatePlans: updatedRatePlans,
    TotalRate: Math.round(roomLevelTotal).toString(),
  };
});

      if (contentProperties.current?.[0]?.RoomData && dayRate?.length > 0) {
        const isSoldOut = dayRate.every((rate) => rate.MinInventory == 0);

        if (isSoldOut) {
          apiStatusData = data?.message;
          apiErrorCodeData = data?.TrackingID;
          apiMessageData = "Sold Out";
          setTimeout(() => {
            postBookingWidged(
              propertyId,
              roomsData,
              mappingData,
              isCloseData,
              "Sold Out",
              apiNameData,
              apiUrlData,
              apiStatusData,
              apiErrorCodeData,
              guid
            );
          }, 200);
        }

        contentProperties.current[0].RoomData =
          contentProperties.current?.[0]?.RoomData?.map((room) => {
            const matched = dayRate.find((r) => r.RoomId == room?.RoomId);
            setCancellationPolicyPackage(dayRate?.[0]?.RatePlans);
            return {
              ...room,
              RackRate: matched?.RateBeforeTax
                ? parseFloat(matched?.RateBeforeTax)
                : room?.RackRate,
              MinInventory: matched?.MinInventory ?? 0,
              RestrictionTitle: matched?.RestrictionTitle ?? "",
              // ensure we assign the updated RatePlans (with TotalRate inside)
              RatePlans: matched?.RatePlans || [],
              TotalRate: matched?.TotalRate ?? 0,
            };
          });

        if (
          parseInt(contentProperties.current?.[0]?.PropertyData?.PropertyId) ===
          parseInt(propertyId)
        ) {
          setFilteredProperties(contentProperties.current);
          handleBookNow(
            contentProperties.current?.[0]?.PropertyData?.PropertyId,
            contentProperties.current?.[0]?.PropertyData?.PropertyName,
            contentProperties.current?.[0]?.PropertyData?.Address.Phone
          );

          const availableRooms =
            contentProperties.current?.[0]?.RoomData?.filter(
              (room) => room.MinInventory > 0
            );

          apiStatusData = response?.status;
          apiErrorCodeData = response?.status;
          apiMessageData = guid;

          setTimeout(() => {
            setAvailableRooms(availableRooms);
          }, 200);
        } else {
          
          setFilteredProperties([]);
          setTimeout(() => {
            postBookingWidged(
              propertyId,
              roomsData,
              mappingData,
              isCloseData,
              "No rate plan found",
              apiNameData,
              apiUrlData,
              "No rate plan found",
              "No rate plan found",
              guid
            );
          }, 200);
        }
      } else {
        setTimeout(() => {
          postBookingWidged(
            propertyId,
            roomsData,
            mappingData,
            isCloseData,
            "No rate plan found",
            apiNameData,
            apiUrlData,
            "No rate plan found",
            "No rate plan found",
            guid
          );
        }, 200);
        setFilteredProperties([]);
      }
    }
}
  const fetchContentApi = async (value) => {
  let roomsData = ""; 
  let mappingData =""; 
  let isCloseData = false;
  let apiStatusData = ""; 
  let apiErrorCodeData = "";  
  let apiMessageData = "";
  let ctaNameData = ""; 
  let apiNameData = "GetRoomsRates";  
  let propId = value; 
  let apiUrlData = `${process.env.NEXT_PUBLIC_CMS_BASE_URL_ROOM_RATES}/rates/GetRoomsRates?RequestType=bedata&PropertyId=${value}&Product=yes&CheckInDate=${fromDate}&CheckOutDate=${toDate}&PromoCode=${promoCodeContext || encodeBase64(defaultOffer)}`;  
   if(!value){
   // setFilteredProperties([]);
   if(parseInt(selectedProperty) > 0 || parseInt(selectedPropertyId) > 0) 
  // if(parseInt(selectedPropertyId) > 0) 
    // {
    //   setIsClassAddedBook(true);
    //   setIsRateFetched(true);
    // }
      setTimeout(() => {
      postBookingWidged("0",roomsData,mappingData, isCloseData,"Property not found", 
      apiNameData,apiUrlData,apiStatusData,apiErrorCodeData,"Property not found");
    }, 200);
     return
   }
  try{
      const url = `${process.env.NEXT_PUBLIC_CMS_BASE_URL_ROOM_RATES}/rates/GetRoomsRates?RequestType=bedata&PropertyId=${value}&Product=yes&CheckInDate=${fromDate}&CheckOutDate=${toDate}&PromoCode=${promoCodeContext || encodeBase64(defaultOffer)}`;

        // const response = await fetch(url, {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //     "x-api-key": process.env.NEXT_PUBLIC_API_KEY_GETRATE,
        //   },
        // });
      
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY_GETRATE,
        },
        timeout: 15000, // 13 seconds timeout
      })

    //  if (!response.ok) {
    //    ctaNameData ="Property not found"
    //    apiStatusData= response?.status;
    //    apiErrorCodeData= response?.status;
    //    apiMessageData= "Property not found";

    //  }
    
     if (response.status !== 200 && response.data) {
       ctaNameData ="Property not found"
       apiStatusData= response?.status;
       apiErrorCodeData= response?.status;
       apiMessageData= "Property not found";
     //  throw new Error("Failed - Rate not found.");

     }
    else{
      // const data = await response?.json();
       const data = await response?.data;
     //setFilteredProperties(data?.PropertyList);
    if(data) {
      //setContentProperties(data?.PropertyList);
      contentProperties.current = data?.PropertyList;
     // setFilteredProperties(data?.PropertyList);
      ctaNameData ="Property found"
      apiStatusData= response?.status;
      apiErrorCodeData= data?.TrackingID;
      apiMessageData= "Success";
      setIsEditClicked(false);
     await checkIfBothReady(value);
     }}

    //const data = await response.json();
  }catch (error) {
    //setTimeOutInventory(error.code == "ECONNABORTED" ? true : false);
    //  ctaNameData = error.code == "ECONNABORTED" ? "Time out" : "Property not found"
     if(error.code == "ECONNABORTED" ){
      // setLoaderOverlay(false);
      // isTimeOutContent.current = true;
       await checkIfBothReady(error.code);
     }
    //setTimeOutContent(error.code == "ECONNABORTED" ? true : false);
      ctaNameData ="Property not found"
      apiStatusData= error;
      apiErrorCodeData= "1166";
      apiMessageData=  error;
      //console.error("Error fetching data:", error);
    }finally {
        if(bothReadyRef.current || isTimeOutContent.current){
       setLoaderOverlay(false);
       }
  //     await Promise.race([
  //   waitUntilRefTrue(isTimeOutContent), 
  //   waitUntilRefTrue(bothReadyRef)
  // ]);

 // setLoaderOverlay(false);
    // setLoaderOverlay(false);
    // await Promise.race([
    //   waitUntilRefTrue(isTimeOutContent),
    //   waitUntilRefTrue(bothReadyRef),
    // ]);
    // const ready = await Promise.race([
    //   waitUntilRefTrue(isTimeOutContent.current, 100, 10000), // 10 sec max wait
    //   waitUntilRefTrue(bothReadyRef.current, 100, 10000),
    // ]);

    // // Only hide loader if something became ready or timed out
    // if (ready) {
    //   setLoaderOverlay(false);
    // }
      setTimeout(() => {
      postBookingWidged(propId,roomsData,mappingData, isCloseData,ctaNameData, 
      apiNameData,apiUrlData,apiStatusData,apiErrorCodeData,apiMessageData);
    }, 200);

    }
  };
  const fetchGalleryImages = async (property_Id) => {
    
    let roomsData = ""; 
  let mappingData =""; 
  let isCloseData = false;
  let apiStatusData = ""; 
  let apiErrorCodeData = "";  
  let apiMessageData = "";
  let ctaNameData = "Fetch Gallery Images"; 
  let apiNameData = "GetGalleryByProperty";  
  let apiUrlData = `${process.env.NEXT_PUBLIC_CMS_BASE_URL_AMR}/cmsapi/gallery/GetGalleryByProperty`;  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CMS_BASE_URL_AMR}/cmsapi/gallery/GetGalleryByProperty?propertyId=${parseInt(
          property_Id
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
      apiStatusData= response?.status;
      apiErrorCodeData= response?.status;
      apiMessageData= "Data not found";
      
    }
      const res = await response.json();
      setCategoryImages(res?.data);
      setCategories(Object.keys(res?.data));
      
      apiStatusData= response?.status;
      apiErrorCodeData= "0";
      apiMessageData= "Success";

    } catch (error) {
      
      apiStatusData= error;
      apiErrorCodeData= "1166";
      apiMessageData=  error;
     // console.error("Error fetching data:", error);
    }finally {
      setTimeout(() => {
      postBookingWidged(property_Id,roomsData,mappingData, isCloseData,ctaNameData, 
      apiNameData,apiUrlData,apiStatusData,apiErrorCodeData,apiMessageData);
    }, 200);

    }
  };
  const handleGetDetailsClick = (rooms) => {
    const INR = "INR";
    const totalAdults = selectedRoom?.reduce(
      (sum, room) => sum + (room?.adults || 0),
      0
    );
    const totalChildren = selectedRoom?.reduce(
      (sum, room) => sum + (room?.children || 0),
      0
    );
    const totalRooms = selectedRoom?.length;

    const hotelName =
      document.querySelector(".hotel-title")?.textContent.trim() ||
      "Unknown Hotel";
    const rackRate =
      document
        .querySelector(".room-price")
        ?.textContent.replace(/[^\d]/g, "") || "0";
    const roomName =
      document.querySelector(".room-name")?.textContent.trim() ||
      "Unknown Room";
    const roomId =
      document.querySelector(".room-id")?.textContent.trim() || "Unknown Room";
    const RateBeforeTax = (() => {
      const ratePlans = rooms?.RatePlans || [];
      let minRate = Infinity;

      ratePlans.forEach((plan) => {
        const firstRateKey = Object.keys(plan?.Rates || {})[0];
        const rate = parseFloat(
          plan?.Rates?.[firstRateKey]?.OBP?.["1"]?.RateBeforeTax || "0"
        );
        if (!isNaN(rate) && rate < minRate) {
          minRate = rate;
        }
      });

      return isFinite(minRate) ? parseInt(minRate) : 0;
    })();
    window.dataLayer = window.dataLayer || [];

    // window.dataLayer.push({
    //   event: 'select_item', // ✅ Triggers GA4 ecommerce + custom dimensions

    //   // GA4 Ecommerce structure
    //   ecommerce: {
    //     items: [{
    //       item_id: rooms.RoomId,              // Room ID
    //       item_name: rooms.RoomName,          // Room Name
    //       item_category: roomName,                 // Static category
    //       price: data,               // Discounted price
    //       currency: 'INR',                       // ISO currency code
    //       item_brand: hotelName               // Hotel name
    //     }]
    //   },

    //   // Custom context (for GA4 custom dimensions)
    //   propertyName: hotelName,
    //   RoomId: rooms.RoomId,
    //   RoomName: rooms.RoomName,
    //   minRate: data,
    //   currency: 'INR',
    //   selectedStartDate: selectedStartDate,
    //   selectedEndDate: selectedEndDate,
    //   totalAdults: totalAdults,
    //   totalChildren: totalChildren,
    //   totalRooms: totalRooms,
    //   promoCode: promoCode || null
    // });
    // window.dataLayer.push({
    //   event: 'select_item',
    //   ecommerce: {
    //     currency: INR,
    //     items: [{
    //       item_id: selectedPropertyId,
    //       item_name: hotelName,              // ✅ Hotel
    //       item_category: rooms.RoomName,  // ✅ Room Name
    //       item_brand: hotelName,
    //       price: RateBeforeTax
    //     }]
    //   },
    //   propertyName: hotelName,
    //   RoomId: rooms.RoomId,
    //   RoomName: rooms.RoomName,
    //   minRate: RateBeforeTax,
    //   selectedStartDate,
    //   selectedEndDate,
    //   totalAdults,
    //   totalChildren,
    //   totalRooms,
    //   promoCode
    // });

    window.dataLayer.push({
      event: "select_item",
      ecommerce: {
        currency: "INR",
        items: [
          {
            item_id: `${selectedPropertyId}_${rooms?.RoomId}_defaultplan`,
            item_name: hotelName,
            item_category: rooms?.RoomName,
            item_variant: "Default Plan",
            item_brand: hotelName,
            price: parseFloat(RateBeforeTax),
          },
        ],
      },
      propertyName: hotelName,
      selectedStartDate,
      selectedEndDate,
      totalAdults,
      totalChildren,
      totalRooms,
      promoCode,
    });
  };
  // const handleBookNowClick = () => {
  //   const totalAdults = selectedRoom?.reduce((sum, room) => sum + (room.adults || 0), 0);
  //   const totalChildren = selectedRoom?.reduce((sum, room) => sum + (room.children || 0), 0);
  //   const totalRooms = selectedRoom?.length;
  //   const hotelName = document.querySelector('.hotel-title')?.textContent.trim() || 'Unknown Hotel';
  //   const rackRate = document.querySelector('.room-price')?.textContent.replace(/[^\d]/g, '') || '0';
  //   //const roomName = document.querySelector('.room-name')?.textContent.trim() || 'Unknown Room';
  //   const roomId = document.querySelector('.room-id')?.textContent.trim() || 'Unknown Room';
  //   window.dataLayer = window.dataLayer || [];

  //   const data = {
  //     propertyName: hotelName,               // From DOM or React state
  //     RackRate: rackRate,                    // Cleaned numeric string
  //     selectedStartDate: selectedStartDate,                    // Check-in date
  //     selectedEndDate: selectedEndDate,                      // Check-out date
  //     totalAdults: totalAdults,                          // Number of adults
  //     totalChildren: totalChildren,                        // Number of children
  //     totalRooms: totalRooms,                           // Number of rooms
  //     promoCode: promoCode                             // Promo code (if any)
  //   };

  //   // Push custom click event
  //   window.dataLayer.push({
  //     event: 'book_now_click',
  //     ...data
  //   });

  //   // Push GA4 view_item ecommerce event
  //   window.dataLayer.push({
  //     event: 'view_item',
  //     ecommerce: {
  //       items: [
  //         {
  //           item_name: hotelName,               // ✅ Hotel name
  //           // item_category: roomName,            // ✅ Room name
  //           item_brand: hotelName,
  //           price: parseFloat(rackRate),
  //           item_id: roomId.toString()                 // Optional: dynamic if needed
  //         }
  //       ]
  //     },
  //     ...data // Include search data here too if you want to pass it
  //   });
  // };
  const handleBookNowClick = () => {
    const INR = "INR";
    const totalAdults = selectedRoom?.reduce(
      (sum, room) => sum + (room?.adults || 0),
      0
    );
    const totalChildren = selectedRoom?.reduce(
      (sum, room) => sum + (room?.children || 0),
      0
    );
    const totalRooms = selectedRoom?.length;
    const hotelName =
      document.querySelector(".hotel-title")?.textContent.trim() ||
      "Unknown Hotel";
    const rackRate =
      document
        .querySelector(".room-price")
        ?.textContent.replace(/[^\d]/g, "") || "0";
    window.dataLayer = window.dataLayer || [];

    const data = {
      propertyName: hotelName,
      HotelId: selectedPropertyId, // ✅ Hotel ID
      RackRate: parseFloat(rackRate),
      selectedStartDate,
      selectedEndDate,
      totalAdults,
      totalChildren,
      totalRooms,
      promoCode,
    };

    // Custom funnel tracking
    window.dataLayer.push({
      event: "book_now_click",
      ...data,
    });

    // GA4 ecommerce - hotel level view_item
    // window.dataLayer.push({
    //   event: 'view_item',
    //   ecommerce: {
    //     currency: INR,
    //     value: parseFloat(rackRate),
    //     items: [{
    //       item_id: selectedPropertyId,        // ✅ Hotel ID
    //       item_name: hotelName,             // ✅ Hotel name
    //       item_brand: hotelName,            // Optional
    //       price: parseFloat(rackRate),
    //       currency: INR,
    //       // No item_category here ✅
    //     }]
    //   },
    //   ...data
    // });

    window.dataLayer.push({
      event: "view_item",
      ecommerce: {
        currency: "INR",
        value: parseFloat(rackRate),
        items: [
          {
            item_id: `${selectedPropertyId}_defaultroom_defaultplan`, // Use fixed strings if no room/rate yet
            item_name: hotelName,
            item_category: "Default Room", // Optional
            item_variant: "Default Plan", // Optional
            item_brand: hotelName,
            price: parseFloat(rackRate),
          },
        ],
      },
      propertyName: hotelName,
      selectedStartDate,
      selectedEndDate,
      totalAdults,
      totalChildren,
      totalRooms,
      promoCode,
    });
  };
  const handleMemberRatePlanSelect = (mapping, rooms) => {
    const INR = "INR";
    const totalAdults = selectedRoom?.reduce(
      (sum, room) => sum + (room?.adults || 0),
      0
    );
    const totalChildren = selectedRoom?.reduce(
      (sum, room) => sum + (room?.children || 0),
      0
    );
    const totalRooms = selectedRoom?.length;

    const hotelName =
      document.querySelector(".hotel-title")?.textContent.trim() ||
      "Unknown Hotel";
    const rackRate =
      document
        .querySelector(".room-price")
        ?.textContent.replace(/[^\d]/g, "") || "0";
    const roomName =
      document.querySelector(".room-name")?.textContent.trim() ||
      "Unknown Room";
    const roomId =
      document.querySelector(".room-id")?.textContent.trim() || "Unknown Room";
    const RName =
      document.querySelector(".rate-name")?.textContent.trim() ||
      "Unknown RateName";
    const RateName = RName;
    const Rate =
      document.querySelector(".member-rate")?.textContent.trim() || "5999";
    const MemberRate = parseInt(Rate.replace("₹", "").trim());
    const packageRate = parseInt(
      rooms?.RatePlans?.find((element) => element.RateId === mapping.RateId)
        ?.Rates?.[Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]]?.OBP?.[
        "1"
      ]?.RateBeforeTax || "0"
    );
    const data = (() => {
      const ratePlans = rooms?.RatePlans || [];
      let minRate = Infinity;

      ratePlans.forEach((plan) => {
        const firstRateKey = Object.keys(plan?.Rates || {})[0];
        const rate = parseFloat(
          plan?.Rates?.[firstRateKey]?.OBP?.["1"]?.RateBeforeTax || "0"
        );
        if (!isNaN(rate) && rate < minRate) {
          minRate = rate;
        }
      });

      return isFinite(minRate) ? parseInt(minRate) : 0;
    })();
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        currency: INR,
        value: parseInt(MemberRate),
        items: [
          {
            item_id: selectedPropertyId,
            HotelId: selectedPropertyId,
            item_name: hotelName, // ✅ Hotel
            item_category: rooms?.RoomName, // ✅ Room Name
            item_variant: RateName, // ✅ Rate Plan
            item_brand: hotelName,
            price: parseInt(MemberRate),
          },
        ],
      },
      propertyName: hotelName,
      RateName: RateName,
      RateBeforeTax: parseInt(MemberRate),
      selectedStartDate,
      selectedEndDate,
      totalAdults,
      totalChildren,
      totalRooms,
      promoCode,
    });
    //console.log(window.dataLayer);
  };

  const handleRatePlanSelect = (mapping, rooms) => {
    const INR = "INR";
    const totalAdults = selectedRoom?.reduce(
      (sum, room) => sum + (room?.adults || 0),
      0
    );
    const totalChildren = selectedRoom?.reduce(
      (sum, room) => sum + (room?.children || 0),
      0
    );
    const totalRooms = selectedRoom?.length;

    const hotelName =
      document.querySelector(".hotel-title")?.textContent.trim() ||
      "Unknown Hotel";
    const rackRate =
      document
        .querySelector(".room-price")
        ?.textContent.replace(/[^\d]/g, "") || "0";
    const roomName =
      document.querySelector(".room-name")?.textContent.trim() ||
      "Unknown Room";
    const roomId =
      document.querySelector(".room-id")?.textContent.trim() || "Unknown Room";
    const RName =
      document.querySelector(".rate-name")?.textContent.trim() ||
      "Unknown RateName";
    const RateName = RName;
    const MemberRate =
      document.querySelector(".member-rate")?.textContent.trim() || "5999";
    const cleanedPrice = parseFloat(
      rooms?.RatePlans?.find((element) => element.RateId === mapping.RateId)
        ?.Rates?.[Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]]?.OBP?.[
        "1"
      ]?.RateBeforeTax || "0"
    );
    const data = (() => {
      const ratePlans = rooms?.RatePlans || [];
      let minRate = Infinity;

      ratePlans.forEach((plan) => {
        const firstRateKey = Object.keys(plan?.Rates || {})[0];
        const rate = parseFloat(
          plan?.Rates?.[firstRateKey]?.OBP?.["1"]?.RateBeforeTax || "0"
        );
        if (!isNaN(rate) && rate < minRate) {
          minRate = rate;
        }
      });

      return isFinite(minRate) ? parseInt(minRate) : 0;
    })();
    window.dataLayer = window.dataLayer || [];

    const cleanedRateName = RateName || "Unknown Plan";
    const cleanedItemId = `${selectedPropertyId}_${rooms?.RoomId}_${cleanedRateName}`;
    setTimeout(() => {
      window.dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
          currency: "INR",
          value: cleanedPrice,
          items: [
            {
              item_id: cleanedItemId,
              item_name: hotelName,
              item_category: rooms?.RoomName,
              item_variant: cleanedRateName,
              item_brand: hotelName,
              price: cleanedPrice,
            },
          ],
        },
        propertyName: hotelName,
        RateName: cleanedRateName,
        RateBeforeTax: cleanedPrice,
        selectedStartDate,
        selectedEndDate,
        totalAdults,
        totalChildren,
        totalRooms,
        promoCode,
      });
    }, 1000);
    //console.log(window.dataLayer);
  };
  const verifyGuidToken = async () => {
  
  let roomsData = ""; 
  let mappingData =""; 
  let isCloseData = false;
  let apiStatusData = ""; 
  let apiErrorCodeData = "";  
  let apiMessageData = "";
  let ctaNameData = "Verify GuidToken"; 
  let apiNameData = "verify-token";  
  let apiUrlData = `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/verify-token`; 
    try {
      const respTokenKey = tokenKey;
      const timestamp = Date.now().toString();
      const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
      const signature = await createSignature(
        JSON.stringify(respTokenKey),
        timestamp,
        secret
      );
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/verify-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-timestamp": timestamp,
            "x-signature": signature,
          },
          body: JSON.stringify({ respTokenKey, keyData }),
        }
      );

          if (!res.ok) {
           apiStatusData= res?.status;
           apiErrorCodeData= res?.status;
           apiMessageData= "Data not found";
            //throw new Error("failed - token not found");
          }
      const data = await res.json();
           apiStatusData= res?.status;
           apiErrorCodeData= res?.status;
           apiMessageData= "Success";
      return data;
    } catch (error) {
      
       apiStatusData= error;
       apiErrorCodeData= "1166";
       apiMessageData= error;
      //console.error("API call failed:", error); // Will now show in console
    }finally {
      setTimeout(() => {
      postBookingWidged("0",roomsData,mappingData, isCloseData,ctaNameData, 
      apiNameData,apiUrlData,apiStatusData,apiErrorCodeData,apiMessageData);
    }, 200);

    }
  };
  const handleOnEdit = ()=>{
    setIsEditClicked(true);
    setIsRateFetched(false);
    setShowDropDown(false);
    setShowDownDiv(true);
    setFilteredProperties([])
  }

// const fetchRatePrices = async (propertyId, defaultOffer) => {
//   setLoaderOverlay(true);
//   const guid = crypto.randomUUID();
//   setRateGuid(guid);
//   setInitialTime(performance.now());

//   let roomsData = "";
//   let mappingData = "";
//   let isCloseData = false;
//   let apiStatusData = "";
//   let apiErrorCodeData = "";
//   let apiMessageData = guid;
//   let apiNameData = "rate";
//   let apiUrlData = `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/cin-api/rate`;

//   if (!propertyId) {
//     setFilteredProperties([]);
//     setIsRateFetched(true);
//     setLoaderOverlay(false);
//     setHasSearched(true);
//     setTimeout(() => {
//       postBookingWidged(
//         propertyId,
//         "",
//         "",
//         false,
//         "Property not found",
//         apiNameData,
//         apiUrlData,
//         "",
//         "",
//         guid
//       );
//     }, 5000);
//     return;
//   }

//   try {
//     const timestamp = Date.now().toString();
//     const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";

//     const signature = await createSignature(
//       JSON.stringify(propertyId),
//       timestamp,
//       secret
//     );

//     const body = {
//       selectedPropertyId: propertyId,
//       fromDate,
//       toDate,
//       promoCodeContext: promoCodeContext || encodeBase64(defaultOffer),
//       guId: guid,
//     };

//     const response = await axios.post(
//       `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/cin-api/inventory`,
//       body,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "x-timestamp": timestamp,
//           "x-signature": signature,
//         },
//         timeout: 15000, // 15 seconds timeout
//       }
//     );

//     const data = response.data;

//     if (defaultOffer && !promoCodeContext) {
//       setPromoCodeContext(encodeBase64(defaultOffer));
//     }
//     if(data?.errtype == "promocode"){
//     setPromoError(data?.message);
//     setFilteredProperties([]);
//     setIsRateFetched(true);
//     setLoaderOverlay(false);
//     setHasSearched(true);
//     setTimeout(() => {
//       postBookingWidged(
//         propertyId,
//         "",
//         "",
//         false,
//         "Invalid Promocode",
//         apiNameData,
//         apiUrlData,
//         data?.message,
//         data?.TrackingID,
//         guid
//       );
//     }, 5000);
//     return;
//     }
//     const product = Array.isArray(data?.Product) ? data?.Product[0] : null;
//     setPromoError("");
//     if (!product) {
//       setTimeout(() => {
//         postBookingWidged(
//           propertyId,
//           "",
//           "",
//           false,
//           "No rate plan found",
//           apiNameData,
//           apiUrlData,
//           data?.message,
//           data?.TrackingID,
//           guid
//         );
//       }, 5000);
//     } else {
//       const rooms = product?.Rooms || [];
//       const dayRate = rooms?.map((room) => {
//         const rateObj =
//           Object.values(room?.RatePlans?.[0]?.Rates || {})[0]?.OBP?.["1"] || {};

          
//         // ✅ Add TotalRate field to each RatePlan
//         // ✅ Add TotalRate field to each RatePlan — now inside each OBP guest rate
// const updatedRatePlans = (room?.RatePlans || []).map((plan) => {
//   const updatedRates = {};

//   for (const [dateKey, rateValue] of Object.entries(plan.Rates || {})) {
//     const updatedOBP = {};

//     // Loop through each guest combination (1, 2, etc.)
//     for (const [guestKey, guestRate] of Object.entries(rateValue.OBP || {})) {
//       // base rate
//       const baseRate = parseFloat(guestRate?.RateBeforeTax || "0");

//       // sum of all taxes
//       const taxTotal = Array.isArray(guestRate?.Tax)
//         ? guestRate.Tax.reduce(
//             (sum, t) => sum + parseFloat(t?.Amount || 0),
//             0
//           )
//         : 0;

//       // add Extra Child and Extra Adult rates if they exist
//       const extraChildRate = parseFloat(
//         rateValue?.ExtraChildRate?.RateBeforeTax || "0"
//       );
//       const extraAdultRate = parseFloat(
//         rateValue?.ExtraAdultRate?.RateBeforeTax || "0"
//       );

//       // compute total
//       const totalRate =
//         baseRate + extraChildRate + extraAdultRate + taxTotal;

//       updatedOBP[guestKey] = {
//         ...guestRate,
//         TotalRate: Math.round(totalRate).toString(), // ✅ new field
//       };
//     }

//     // Also attach TotalRate to ExtraAdultRate / ExtraChildRate individually
//     const updatedExtraAdult = rateValue?.ExtraAdultRate
//       ? {
//           ...rateValue.ExtraAdultRate,
//           TotalRate: rateValue.ExtraAdultRate?.RateBeforeTax
//             ? parseFloat(rateValue.ExtraAdultRate.RateBeforeTax)
//             : 0,
//         }
//       : {};

//     const updatedExtraChild = rateValue?.ExtraChildRate
//       ? {
//           ...rateValue.ExtraChildRate,
//           TotalRate: rateValue.ExtraChildRate?.RateBeforeTax
//             ? parseFloat(rateValue.ExtraChildRate.RateBeforeTax)
//             : 0,
//         }
//       : {};

//     updatedRates[dateKey] = {
//       ...rateValue,
//       OBP: updatedOBP,
//       ExtraAdultRate: updatedExtraAdult,
//       ExtraChildRate: updatedExtraChild,
//     };
//   }

//   return {
//     ...plan,
//     Rates: updatedRates,
//   };
// });


//         // ✅ Compute total rate (base + extra child/adult + taxes)
//         const firstRateObj =
//           room?.RatePlans?.[0]?.Rates &&
//           Object.values(room.RatePlans[0].Rates || {})[0];
//         const baseRate =
//           firstRateObj?.OBP?.["1"]?.RateBeforeTax || rateObj?.RateBeforeTax || "0";
//         const extraChildRate =
//           firstRateObj?.ExtraChildRate?.RateBeforeTax || "0";
//         const extraAdultRate =
//           firstRateObj?.ExtraAdultRate?.RateBeforerTax || "0";

//         // taxes
//         const taxes = firstRateObj?.OBP?.["1"]?.Tax || [];
//         const taxTotal = taxes.reduce(
//           (sum, t) => sum + parseFloat(t.Amount || 0),
//           0
//         );

//         const totalRate =
//           parseFloat(baseRate) +
//           parseFloat(extraChildRate) +
//           parseFloat(extraAdultRate) +
//           taxTotal;
          
//         return {
//           RoomId: room?.RoomId,
//           MinInventory: room?.MinInventory ?? 0,
//           RestrictionTitle: room?.RestrictionTitle ?? "",
//           RateBeforeTax: rateObj?.RateBeforeTax || "0",
//           RateAfterTax: rateObj?.RateAfterTax || "0",
//          // RatePlans: room?.RatePlans || [],
//           RatePlans: updatedRatePlans || [],
//           TotalRate: Math.round(totalRate).toString(),
//         };
//       });

//       if (contentProperties.current?.[0]?.RoomData && dayRate?.length > 0) {
//         const isSoldOut = dayRate.every((rate) => rate.MinInventory == 0);

//         if (isSoldOut) {
//           apiStatusData = data?.message;
//           apiErrorCodeData = data?.TrackingID;
//           apiMessageData = "Sold Out";
//           setTimeout(() => {
//             postBookingWidged(
//               propertyId,
//               roomsData,
//               mappingData,
//               isCloseData,
//               "Sold Out",
//               apiNameData,
//               apiUrlData,
//               apiStatusData,
//               apiErrorCodeData,
//               guid
//             );
//           }, 200);
//         }

//         contentProperties.current[0].RoomData =
//           contentProperties.current?.[0]?.RoomData?.map((room) => {
//             const matched = dayRate.find((r) => r.RoomId == room?.RoomId);
//             setCancellationPolicyPackage(dayRate?.[0]?.RatePlans);
//             return {
//               ...room,
//               RackRate: matched?.RateBeforeTax
//                 ? parseFloat(matched?.RateBeforeTax)
//                 : room?.RackRate,
//               MinInventory: matched?.MinInventory ?? 0,
//               RestrictionTitle: matched?.RestrictionTitle ?? "",
//               RatePlans: matched?.RatePlans || [],
//               TotalRate: matched?.TotalRate ?? 0,
//             };
//           });

//         if (
//           parseInt(contentProperties.current?.[0]?.PropertyData?.PropertyId) ===
//           parseInt(propertyId)
//         ) {
//           setFilteredProperties(contentProperties.current);
//           handleBookNow(
//             contentProperties.current?.[0]?.PropertyData?.PropertyId,
//             contentProperties.current?.[0]?.PropertyData?.PropertyName,
//             contentProperties.current?.[0]?.PropertyData?.Address.Phone
//           );

//           const availableRooms =
//             contentProperties.current?.[0]?.RoomData?.filter(
//               (room) => room.MinInventory > 0
//             );

//           apiStatusData = response?.status;
//           apiErrorCodeData = response?.status;
//           apiMessageData = guid;

//           setTimeout(() => {
//             setAvailableRooms(availableRooms);
//           }, 200);
//         } else {
//           setFilteredProperties([]);
//           setTimeout(() => {
//             postBookingWidged(
//               propertyId,
//               roomsData,
//               mappingData,
//               isCloseData,
//               "No rate plan found",
//               apiNameData,
//               apiUrlData,
//               "No rate plan found",
//               "No rate plan found",
//               guid
//             );
//           }, 200);
//         }
//       } else {
//         setTimeout(() => {
//           postBookingWidged(
//             propertyId,
//             roomsData,
//             mappingData,
//             isCloseData,
//             "No rate plan found",
//             apiNameData,
//             apiUrlData,
//             "No rate plan found",
//             "No rate plan found",
//             guid
//           );
//         }, 200);
//         setFilteredProperties([]);
//       }
//     }

//     setRateResponse(data?.Product?.[0]);
//     setIsRateFetched(true);
//     setHasSearched(true);
//     setLoaderOverlay(false);
//   } catch (error) {
//     //console.error("Error fetching prices:", error?.message || error);
//     setFilteredProperties([]);
//     setIsRateFetched(true);
//     setHasSearched(true);
//     setLoaderOverlay(false);
//     setTimeout(() => {
//       setTimeOutInventory(error.code == "ECONNABORTED" ? true : false);
//       postBookingWidged(
//         propertyId,
//         roomsData,
//         mappingData,
//         isCloseData,
//         // error.code == "ECONNABORTED" ? "Time out" : 
//         "Rate not found",
//         apiNameData,
//         apiUrlData,
//         error?.message || error,
//         "1166",
//         guid
//       );
//     }, 200);
//   } finally {
//     setIsRateFetched(true);
//     setHasSearched(true);
//     setLoaderOverlay(false);
//   }
// };

const fetchRatePrices = async (propertyId, defaultOffer) => {
  setLoaderOverlay(true);
  const guid = crypto.randomUUID();
  setRateGuid(guid);
  setInitialTime(performance.now());

  let roomsData = "";
  let mappingData = "";
  let isCloseData = false;
  let apiStatusData = "";
  let apiErrorCodeData = "";
  let apiMessageData = guid;
  let apiNameData = "rate";
  let apiUrlData = `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/cin-api/rate`;

  if (!propertyId) {
    setFilteredProperties([]);
    setIsRateFetched(true);
    setLoaderOverlay(false);
    setHasSearched(true);
    setTimeout(() => {
      postBookingWidged(
        propertyId,
        "",
        "",
        false,
        "Property not found",
        apiNameData,
        apiUrlData,
        "",
        "",
        guid
      );
    }, 5000);
    return;
  }

  try {
    const timestamp = Date.now().toString();
    const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";

    const signature = await createSignature(
      JSON.stringify(propertyId),
      timestamp,
      secret
    );

    const body = {
      selectedPropertyId: propertyId,
      fromDate,
      toDate,
      guId: guid,
      promoCodeContext: promoCodeContext || "",
      //promoCodeContext: promoCodeContext || encodeBase64(defaultOffer),,
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/cin-api/inventory`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "x-timestamp": timestamp,
          "x-signature": signature,
        },
        timeout: 15000, // 15 seconds timeout
      }
    );

    const data = response.data;

     if (defaultOffer && !promoCodeContext) {
       setPromoCodeContext(encodeBase64(defaultOffer));
     }
      if (data?.errtype == "promocode") {
        setPromoError(data?.message);
        setFilteredProperties([]);
        setIsRateFetched(true);
        setLoaderOverlay(false);
        setHasSearched(true);
        setTimeout(() => {
          postBookingWidged(
            propertyId,
            "",
            "",
            false,
            "Invalid Promocode",
            apiNameData,
            apiUrlData,
            data?.message,
            data?.TrackingID,
            guid
          );
        }, 5000);
        return;
      }
    const product = Array.isArray(data?.Product) ? data?.Product[0] : null;
    setPromoError("");
    if (!product) {
      setTimeout(() => {
        postBookingWidged(
          propertyId,
          "",
          "",
          false,
          "No rate plan found",
          apiNameData,
          apiUrlData,
          data?.message,
          data?.TrackingID,
          guid
        );
      }, 5000);
    } else {
      rateDataRef.current = product?.Rooms || [];
      const rooms = product?.Rooms || [];
     await checkIfBothReady(propertyId,guid,response, data );
      
    }

    setRateResponse(data?.Product?.[0]);
    setIsRateFetched(true);
    setHasSearched(true);
    setLoaderOverlay(false);
  } catch (error) {
    //console.error("Error fetching prices:", error?.message || error);
    setTimeOutInventory(error.code == "ECONNABORTED" ? true : false);
    setFilteredProperties([]);
    setIsRateFetched(true);
    setHasSearched(true);
    setLoaderOverlay(false);
    setTimeout(() => {
      postBookingWidged(
        propertyId,
        roomsData,
        mappingData,
        isCloseData,
        // error.code == "ECONNABORTED" ? "Time out" : 
        "Rate not found",
        apiNameData,
        apiUrlData,
        error?.message || error,
        "1166",
        guid
      );
    }, 200);
  } finally {
    setIsRateFetched(true);
    setHasSearched(true);
       if(bothReadyRef.current || isTimeOutContent.current){
       setLoaderOverlay(false);
       }
  //       await Promise.race([
  //   waitUntilRefTrue(isTimeOutContent), 
  //   waitUntilRefTrue(bothReadyRef)
  // ]);
  
  // setLoaderOverlay(false);
  }
};

 useEffect(() => {
  if(!tokenKey) { 
    let roomsData = ""; 
  let mappingData =""; 
  let apiStatusData = ""; 
  let apiErrorCodeData = "";  
  let apiMessageData = "";
  let isClose = false;
  let ctaName = "Fetch Brand List"; 
  let apiName = "GetBrandList";  
  let apiUrl = `${process.env.NEXT_PUBLIC_CMS_BASE_URL_AMR}/cmsapi/property/GetBrandList`; 
    const storedData = sessionStorage?.getItem("paymentResponse");
    if (storedData) {
       setCurrentStep(4);
      //setCurrentStep(2);
      setIsWizardVisible(true);
    }
    if (!storedData) {
      sessionStorage?.removeItem("bookingData");
    }
    if (Array.isArray(contentData?.PropertyList)) {
      setPropertyList(contentData?.PropertyList);
    }

    fetch(`${process.env.NEXT_PUBLIC_CMS_BASE_URL_AMR}/cmsapi/property/GetBrandList`)
      .then((res) => res.json())
      .then((data) => {
        if (data.errorCode === "0") {
           apiStatusData= "0";
           apiErrorCodeData= "0";
           apiMessageData= "Success";
          const map = {};
          data.data.forEach((brand) => {
            map[brand.hotelBrandId] = brand.hotelBrand
              .toLowerCase()
              .replace(/\s+/g, "-");
          });
          setBrandMap(map);
        }
      })
      .catch((err) => {
           apiStatusData= err;
           apiErrorCodeData= "1166";
           apiMessageData= err;
      })
    .finally(() => {
      if(storedIndex == null){

      const storedInd = sessionStorage.getItem("offerTagIndex");
      setStoredIndex(storedInd);
      if (storedInd !== null) {
        setOfferTagIndex(parseInt(storedInd, 10));
      } else {
        setOfferTagIndex(Math.floor(Math.random() * 2)); // 0 or 1
        //sessionStorage.setItem(sessionKey, offerTagIndex);
      }
      }
      setTimeout(() => {
      postBookingWidged("0",roomsData,mappingData, isClose,ctaName, 
      apiName,apiUrl,apiStatusData,apiErrorCodeData,apiMessageData);
    }, 200);
    });}

  }, []);

  useEffect(() => {
    if (tokenKey) {
      setTokenKey(true);
      async function fetchData() {
        const paymentResponse = await verifyGuidToken();

        sessionStorage.setItem(
          "paymentResponse",
          JSON.stringify(paymentResponse)
        );
        setIsWizardVisible(true);
         setCurrentStep(4);
      //setCurrentStep(2);
      }
      fetchData();
    }
  }, [tokenKey]);

  useEffect(() => {
    if (selectedProperty > 0 && destination !== "") {
      if (roomDetails?.staahRoomsId > 0) {
       let matchingRoom = null;
        for (const property of propertyList) {
          for (const room of property?.RoomData) {
            if (room?.RoomId == roomDetails?.staahRoomsId) {
              matchingRoom = room;
              break; // exit inner loop
            }
          }
          if (matchingRoom) break; // exit outer loop
        }

        const formatingDate = (date) => {
          const d = new Date(date); // ensure it's a Date object
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const currentDate = formatingDate(today); // today's date
        const nextDate = formatingDate(tomorrow);
        setSelectedStartDate(currentDate);
        setSelectedEndDate(nextDate);
      }
    }
  }, [destination,selectedStartDate, selectedEndDate]);

  useEffect(() => {
    if (selectedProperty > 0) {
      showBookingEngine();
      setCityName(cityDetails);
    }
  }, [selectedProperty]);

  useEffect(() => {
    if (selectedRoomDetails?.isPropertyVisible == false) {
      setVisibleOfferRoomId(null);
    }
  }, [selectedRoomDetails?.isPropertyVisible]);

  useEffect(() => {
    if (
      destination.trim() &&
      selectedRoom?.length > 0 &&
      selectedRoom?.[0]?.roomId != ""
    ) {
      handleDateChange(selectedStartDate, selectedEndDate, 0);
    }
  }, [selectedStartDate, selectedEndDate]);

  const fetchAddOns = async () => {
  
    let roomsData = ""; 
  let mappingData =""; 
  let isCloseData = false;
  let apiStatusData = ""; 
  let apiErrorCodeData = "";  
  let apiMessageData = "";
  let ctaNameData = "Fetch AddOns"; 
  let apiNameData = "add-ons";  
  let apiUrlData = `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/cin-api/add-ons`;  
      try {
        if (selectedPropertyId != null) {
          const timestamp = Date.now().toString();
          const secret = "ABDEFGHJKLMOPQRSTUVWXYZ123456789";
          const signature = await createSignature(
            selectedPropertyId?.toString(),
            timestamp,
            secret
          );

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/cin-api/add-ons`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-timestamp": timestamp,
                "x-signature": signature,
              },
              body: JSON.stringify({
                selectedPropertyId: selectedPropertyId.toString(),
              }),
            }
          );

          if (!response.ok) {
           apiStatusData= response?.status;
           apiErrorCodeData= response?.status;
           apiMessageData= "Data not found";
           // throw new Error("failed - Add-Ons not found");
          }
         else {const data = await response?.json();
          setAddOnsResponse(data);
          const properties = data;
          if (Array.isArray(properties)) {
            setAddonList(properties?.[0]?.ExtrasData || []);
            if (properties?.[0]?.ExtrasData?.length > 0) {
              setIsAddOnns(true);
            }
          }
          
           apiStatusData= response?.status;
           apiErrorCodeData= response?.status;
           apiMessageData= "Success";
          }
        }
      } catch (error) {
        //console.error("Error fetching properties:", error);
            apiStatusData= error;
            apiErrorCodeData= "1166";
            apiMessageData= error;
      }finally {
      setTimeout(() => {
      postBookingWidged(selectedPropertyId,roomsData,mappingData, isCloseData,ctaNameData, 
      apiNameData,apiUrlData,apiStatusData,apiErrorCodeData,apiMessageData);
    }, 200);

    }
    };
  function handleBlur() {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  }

  const handleFocus = () => {
    setIsFocused(true);
    const inputEl = inputRef?.current;
    if (inputEl) {
      const rect = inputEl?.getBoundingClientRect();
      const spaceBelow = window?.innerHeight - rect.bottom;
      const spaceAbove = rect?.top;

      // Set dropUp if not enough space below and more space above
      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setDropUp(true);
      } else {
        setDropUp(false);
      }
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsFocused(false);
    }
  };

  useEffect(() => {
  //  console.log(cityDropDown);
  let roomsData = ""; 
  let mappingData =""; 
  let isCloseData = false;
  let apiStatusData = ""; 
  let apiErrorCodeData = "";  
  let apiMessageData = "";
  let ctaNameData = "Fetch Property"; 
  let apiNameData = "GetCityWithProperty";  
  let apiUrlData = `${process.env.NEXT_PUBLIC_CMS_BASE_URL_AMR}/cmsapi/property/GetCityWithProperty?CityId=${parseInt(
              cityName?.value
            )}`; 
    const fetchProperty = async () => {
      try {

          const propertyDropDown = [];
          properties?.forEach((property ) => {
            if (property.cityId === cityName?.value) { // <-- only for selected city
              const propData = {
                label: property?.propertyName,
                value: property?.staahPropertyId,
                offerCode: property?.offerCode,
                property_Id: property?.propertyId,
                hotelBrandId: property?.hotelBrandId,
                propertySlug: property?.propertySlug,
                staahBookingId: property?.staahBookingId,
              };
            propertyDropDown.push(propData);
            setPropertyDropDown(propertyDropDown);
          }
          });
          if (selectedProperty > 0) {
    const propertyList = properties || [];
  
    const matched = propertyList.find(
      (p) => p?.staahPropertyId == selectedProperty
    );
  
    if (matched) {
      //fetchContentApi(matched?.staahPropertyId);
      const firstList = {
        label: matched?.propertyName,
        value: matched?.staahPropertyId,
        offerCode: matched?.offerCode,
        property_Id: matched?.propertyId,
        hotelBrandId: matched?.hotelBrandId,
        propertySlug: matched?.propertySlug,
        staahBookingId:matched?.staahBookingId
      };
      handleSuggestionClick(firstList);
    }else { 
          
          const firstList = properties
          .filter(prop => prop.cityId === cityName?.value)
          .map(prop => ({
            label: prop.propertyName,
            value: prop.staahPropertyId,
            offerCode: prop.offerCode,
            property_Id: prop.propertyId,
            hotelBrandId: prop.hotelBrandId,
            propertySlug: prop.propertySlug,
            staahBookingId: prop.staahBookingId,
          }))[0] || null;
      //fetchContentApi(firstList?.value);
              // propertyValueRef.current =  res?.data?.[0]?.propertyData?.[0]?.staahPropertyId;
              handleSuggestionClick(firstList);
            }
          }

        else { 
          const firstList = properties
          .filter(prop => prop.cityId === cityName?.value)
          .map(prop => ({
            label: prop.propertyName,
            value: prop.staahPropertyId,
            offerCode: prop.offerCode,
            property_Id: prop.propertyId,
            hotelBrandId: prop.hotelBrandId,
            propertySlug: prop.propertySlug,
            staahBookingId: prop.staahBookingId,
          }))[0] || null;
     // fetchContentApi(firstList?.value);
              handleSuggestionClick(firstList);
            }
      } catch (error) {
       // console.error("Error fetching properties:", error);
        apiStatusData= error;
        apiErrorCodeData= "1166";
        apiMessageData= error;
      }finally {
      setTimeout(() => {
      postBookingWidged("0",roomsData,mappingData, isCloseData,ctaNameData, 
      apiNameData,apiUrlData,apiStatusData,apiErrorCodeData,apiMessageData);
    }, 200);

    }
    };
     if (cityName?.value) {
    fetchProperty();
     }
  }, [cityName]);

 async function postBookingWidged(propId,rooms,mapping, isClose,ctaName, 
  ApiName,ApiUrl,ApiStatus,ApiErrorCode,ApiMessage) {
  const resp = await getUserInfo();

    const sessionId = sessionStorage?.getItem("sessionId");
    const totalAdults = selectedRoom?.reduce(
      (sum, room) => sum + (room?.adults || 0),
      0
    );
    const totalChildren = selectedRoom?.reduce(
      (sum, room) => sum + (room?.children || 0),
      0
    );
    const totalRooms = selectedRoom?.length;
    const data = window.location.pathname;
    //console.log("data pathname",data)
    const payload = {
    ctaName: ctaName,
    urls: window.location.href,
    cityId: cityName?.value ? cityName?.value?.toString() : "0",
   // propertyId: propId?.toString() || selectedPropertyId?.toString() || "0",
    propertyId: propId?.toString() || "0",
    checkIn: fromDate ?? "" ,
    checkOut: toDate ?? "" ,
    adults: totalAdults?.toString() ?? "0",
    children: totalChildren?.toString() ?? "0",
    rooms: totalRooms?.toString() ?? "0",
    promoCode: promoCode ?? "",
    ip: resp?.ip,
    sessionId: sessionId,
    deviceName: resp?.deviceInfo?.deviceName,
    deviceType: resp?.deviceInfo?.deviceOS == "Unknown" ? resp?.deviceInfo?.platform : resp?.deviceInfo?.deviceOS,
    roomsName: rooms?.RoomName,
    packageName: mapping?.MappingName ,
    isCartOpen: mapping?.MappingName ? "Y": "N",
    isCartEdit: "N",
    isCartClick: "N",
    isClose: isClose ? "Y" : "N",
    ApiName: ApiName ?? "",
    ApiUrl: ApiUrl ?? "",
    ApiStatus: ApiStatus?.toString() ?? "",
    ApiErrorCode: ApiErrorCode?.toString() ?? "",
    ApiMessage: ApiMessage ?? ""
   }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/Api/tracker/BookingWidged`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify( payload ),
        }
      );
      const res = await response?.json();

  }
  const handleCityChange = async (e) => {
    const input = e.target.value;
    setCityName(input);

    if (input) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_BASE_URL_AMR}/cmsapi/property/GetCityWithProperty?CityId=${parseInt(
            input
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const res = await response.json();

        const propertyDropDown = [];

        res?.data?.propertyData?.forEach((property) => {
          const label = property?.propertyName;
          const value = property?.staahPropertyId;
          const property_Id = property?.propertyId;
          propertyDropDown.push({ label, value, property_Id });

          

        });
      } catch (error) {
       // console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };
  // Handle destination input change
  const handleDestinationChange = async (e) => {
    const input = e.target.value;
    setIsFocused(true);
    setDestination(input);

    if (input) {
      try {
        const matchedSuggestions = propertyList
          .flatMap((property) => [
            {
              name: property?.PropertyData.Address.City,
              id: property?.PropertyData.PropertyId,
            },
            {
              name: property?.PropertyData.PropertyName,
              id: property?.PropertyData.PropertyId,
            },
          ])
          .filter((item) =>
            item.name.toLowerCase().includes(input.toLowerCase())
          );
        setSuggestions([...new Set(matchedSuggestions)]);
      } catch (error) {
        //console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };
  const handlePromocodeChange = (e) => {
    setPromoCode(e.target.value);
    const encoded = encodeBase64(e.target.value);
    setPromoCodeContext(encoded);
    setPromoCodeChanged(true);
  };
  // Handle search
  const handleSearch = () => {
     if(isTimeOutContent.current == true){
     fetchContentApi(parseInt(selectedPropertyId) || parseInt(selectedProperty)).catch(() => {});
     isTimeOutContent.current = false;
     }
    rateDataRef.current = null;
    bothReadyRef.current = false;
    setTimeOutInventory(false);
    //setTimeOutContent(false);
  if(collectionProperties.includes(parseInt(selectedPropertyId) || parseInt(selectedProperty))){
    //handleSearchTh(parseInt(selectedPropertyId) || parseInt(selectedProperty));
    handleSearchTh();
  }
  else{
  setNumberOfNights(getDateDifferenceInDays(fromDate, toDate));
    setPromoError("");
    sessionStorage.removeItem("bookingData");
    setSelectedRoomDetails(null);
    replaceAction("search");
    setSelectedRoom((prev) =>
      prev.map((room) => ({
        id: room.id,
        roomId: "",
        roomName: "",
        roomRate: "",
        roomImage: {},
        adults: room.adults,
        children: room.children,
      }))
    );

    setShowFinalCart(0);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'virtualPageview',
      page_path: '/?search',
      page_location: `${window.location.pathname}/?search`,
      page_title: 'BE Steps - Search Page',
    });
  
    if (!destination?.trim()) {
      alert("Please enter a city/hotel.");
      return;
    } else if (selectedStartDate == "" || selectedEndDate == "") {
      alert("Please choose check-in and check-out both date.");
      return;
    }
    if(isTimeOutContent.current == true){
     setTimeout(()=>{
    //fetchRatePrices(propertyValueRef.current,defaultOffer);
    fetchRatePrices(propertyValueRef.current,null);
     },2000)
     }else{
    fetchRatePrices(propertyValueRef.current,null);
     }
          setIsDateChanged(false);
          setPromoCodeChanged(false);
          setIsEditClicked(false);
      
      if(!showDropDown){
      setShowDropDown(true);
    }
    if(showDownDiv){
      setShowDownDiv(false);
    }
    setIsClassAddedBook(true);
    if (propertyList?.length > 0) {
      setHandleSearched(true);
      setTimeout(() => {
        const element = document.getElementById(`property-div`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
    setTimeout(() => {
       postBookingWidged(selectedPropertyId || selectedProperty || "0","","",false,"Search Click");
        
       
    const userDetails = JSON.parse(localStorage?.getItem("userDetails"));

    if (userDetails) {
      setIsLoggedin(true);
      setIsOpenLogin(false);
      setIsOpenSignUp(false);
      setUserDetails(userDetails);

      setLoggedUserDetails({
        customerId: userDetails?.customerId || "",
        membershipId: userDetails?.membershipId || "",
        memberTitle: userDetails?.memberTitle || "",
        firstName: userDetails?.firstName || "",
        lastName: userDetails?.lastName || "",
        mobilePrefix: userDetails?.mobilePrefix || "",
        mobileNumber: userDetails?.mobileNumber || "",
        email: userDetails?.email || "",
        isLogged: true,
      });
    }
      }, 100);
    }
  };

  function handleVisitHotel(url) {
    const currentUrl = window.location.href;
    if (currentUrl == url) {
      window.location.reload();
    } else {
      window.location.href = url;
    }
  }
  const handleBookNow = (PropertyId, PropertyName, Phone) => {
    setHandleBookNow(!isHandleBookNow);
   if(!newClassRoom) {
      setNewClassRoom(newClassRoom);
    }
    setSelectedPropertyPhone(Phone);
    //setSelectedPropertyId(propertyId);
    if (PropertyName != "") {
      setSelectedPropertyName(PropertyName);
      handleBookNowClick();
    }
    toggleBookNow(PropertyId);
    setTimeout(() => {
      const element = document.getElementById(`hotel-${PropertyId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };
  const calculateNumberOfDays = () => {
    if (!selectedStartDate || !selectedEndDate) return 1;
    const start = new Date(selectedStartDate);
    const end = new Date(selectedEndDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateBasePrice = () => {
    const numberOfDays = calculateNumberOfDays();

    // Sum all selectedRoom's roomRate
    const totalRoomRate = selectedRoom?.reduce(
      (sum, room) => sum + (room?.roomRate || 0),
      0
    );

    return totalRoomRate * numberOfDays;
  };

  const calculateTotalWithTax = () => {
    const basePrice = calculateBasePrice();
    const taxRate = basePrice >= 7000 ? 0.18 : 0.12;
    const taxAmount = basePrice * taxRate;
    return basePrice + taxAmount;
  };

  const finalAmount = calculateTotalWithTax();
  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    contentProperties.current = null;
    propertyValueRef.current =  suggestion.value;
     if(process.env.NEXT_PUBLIC_STAAH_REDIRECT == "no"){
      fetchContentApi(suggestion.value).catch(() => {});
     }
    setSelectedPropertyId(suggestion.value);
   // setDefaultOffer(suggestion.offerCode);
    setCMSPropertyId(suggestion.property_Id);
    setDestination(suggestion.label);
    setSelectedHotelName(suggestion.label);
    setSelectedPropertyBookingId(suggestion?.value);
    setSuggestions([]);
    fetchGalleryImages(suggestion.property_Id);
    const brandSlug = brandMap[suggestion.hotelBrandId] || "brand";
    const propertySlug = suggestion.propertySlug || "property";
    const url = `/${brandSlug}/${propertySlug}/hotel-overview`;
    setpropertyPageUrl(url);
  };
  const handleGetDetails = (rooms, propertyData) => {

    router.replace("?select-room");
    setHandleBookNow(!isHandleBookNow);
   // fetchAddOns();
    postBookingWidged("0",rooms,"",false,"Select Room");
    const roomId = rooms?.RoomId;
    const data = removeHtmlTags(propertyData?.TermsAndConditions?.Description);
    setTermsAndConditions(data);
    setProperty(propertyData);
    const roomCount = selectedRoom?.filter(
      (room) => room?.roomId === roomId
    ).length;

    if (roomCount > rooms?.MinInventory) {
      if (rooms?.MinInventory == 0) {
        //alert(`This room is not available for selected date`);
        toast.error("This room is not available for selected date.", { position: "top-right", autoClose: 3000 });
      } else {
        toast.error(
          `Only ${rooms?.MinInventory} room(s) allowed for ${rooms?.RoomName}`, { position: "top-right", autoClose: 3000 }
        );
      }
      return; // Block further selection
    }

    handleGetDetailsClick(rooms);
    setVisibleOfferRoomId((prev) => (prev === roomId ? null : roomId));
    setSelectedRoomDetails({
      isPropertyVisible: true,
      id: selectedRoomDetails?.id,
    });

    if (selectedRoomDetails?.id) {
      setSelectedRoom((prev) => {
        const updatedRooms = prev.map((room) => {
          if (room?.id === selectedRoomDetails?.id) {
            if (room?.adults + room?.children <= rooms?.MaxGuest) {
              return {
                ...room,
                roomId: roomId,
                maxGuest: rooms?.MaxGuest,
                maxAdult: rooms?.MaxAdult,
                maxChildren: rooms?.MaxChildren,
                roomName: rooms?.RoomName,
                roomRate: rooms?.RackRate,
                roomImage: rooms?.Images[0],
              };
            } else {
              toast.error(
                `Only ${rooms?.MaxGuest} guests including adults and Children are allowed for this room`, { position: "top-right", autoClose: 3000 }
              );
            }
          }
          return room;
        });

        return updatedRooms;
      });
    } else {
      // If no id, replace only the first record and keep the rest unchanged
      setSelectedRoom((prev) => {
        if (prev.length > 0) {
          if (prev[0]?.children + prev[0]?.adults <= rooms?.MaxGuest) {
            const first = prev[0];
            return [
              {
                id: first?.id,
                roomId: roomId,
                maxGuest: rooms?.MaxGuest,
                maxAdult: rooms?.MaxAdult,
                maxChildren: rooms?.MaxChildren,
                roomName: rooms?.RoomName,
                roomRate: rooms?.RackRate,
                roomImage: rooms?.Images[0],
                adults: first?.adults,
                children: first?.children,
              },
              ...prev.slice(1),
            ];
          } else {
            toast.error(
              `Only ${rooms?.MaxGuest} guests including adults and Children are allowed for this room`, { position: "top-right", autoClose: 3000 }
            );
            return [
              {
                ...prev[0],
              },
              ...prev.slice(1),
            ];
          }
        } else {
          return [
            {
              roomId: roomId,
              roomName: rooms?.RoomName,
              roomRate: rooms?.RackRate,
              roomImage: rooms?.Images[0],
              adults: 1,
              children: 0,
              extraAdultRate: rooms?.ExtraAdultRate,
            },
          ];
        }
      });
    }

    setSelectedRoomRate({ roomId: roomId, roomRate: rooms?.RackRate });

function getScrollableParent(element) {
  let parent = element.parentElement;
  while (parent) {
    const hasScrollableContent = parent.scrollHeight > parent.clientHeight;
    const overflowY = window.getComputedStyle(parent).overflowY;
    const isScrollable = hasScrollableContent && (overflowY === 'auto' || overflowY === 'scroll');
    if (isScrollable) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return window; // fallback
}

setTimeout(() => {
  const el = document?.getElementById(`offer-${roomId}`);
  if (el) {
    const parent = getScrollableParent(el);
    const elRect = el?.getBoundingClientRect();
    const parentRect = parent?.getBoundingClientRect();

    const offset = elRect?.top - parentRect?.top;

    parent.scrollTo({
      top: parent?.scrollTop + offset - 450, // adjust offset if needed
      behavior: "smooth",
    });
  }
}, 100);


  };

  const handleSelectMemberRate = (
    mapping,
    rate,
    rooms,
    packageRate,
    adultRate
  ) => {
    if (!isLoggedin) {
      setIsOpenLogin(true);
    } else {
      if (!rooms?.RestrictionTitle && rooms?.RestrictionTitle == "") {
        setIsMemberRate(true);
        SelectedRoomWithOffer(mapping);
        if (selectedRoomDetails?.id) {
          const roomCount = selectedRoom?.filter(
            (room) => room?.roomId === rooms?.RoomId
          ).length;
          if (roomCount <= rooms?.MinInventory) {
            setSelectedRoom((prev) =>
              prev.map((room, index) =>
                room?.id === selectedRoomDetails?.id &&
                room?.adults <= room?.maxAdult &&
                parseInt(room?.adults) + parseInt(room?.children) <= room?.maxGuest
                  ? {
                      ...room,
                      roomPackage: rate.RateName,
                      rateId: rate.RateId,
                      applicableGuest: mapping.ApplicableGuest,
                      applicableAdult: mapping.ApplicableAdult,
                      applicableChild: mapping?.ApplicableChild
                        ? mapping?.ApplicableChild
                        : 0,

                      packageRate:
                        (parseFloat(
                          rooms?.RatePlans?.find(
                            (element) => element.RateId === mapping.RateId
                          )?.Rates?.[
                            Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]
                          ]?.OBP?.[prev[index]?.adults?.toString()]
                            ?.RateBeforeTax
                        ) || 0) * 0.9,

                      roomRateWithTax:
                        Math.round(packageRate) +
                        Math.round(
                          Math.round(packageRate) *
                            (Math.round(packageRate) <= 7500 ? 1.2 : 1.8)
                        ),
                      roomAdultExtraCharge:
                        Math.round(
                          rooms?.RatePlans?.find(
                            (element) => element.RateId === mapping.RateId
                          )?.Rates?.[
                            Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]
                          ]?.OBP?.[prev[index]?.adults?.toString()]
                            ?.RateAfterTax || "0"
                        ) -
                        Math.round(
                          rooms?.RatePlans?.find(
                            (element) => element.RateId === mapping.RateId
                          )?.Rates?.[
                            Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]
                          ]?.OBP?.[prev["1"]]?.RateAfterTax || "0"
                        ),
                    }
                  : room
              )
            );
          } else {
            setSelectedRoom((prev) => {
              if (prev.length === 0) return prev; // nothing to reset

              const updated = [...prev];
              const lastIndex = updated.length - 1;
              const lastRoom = updated[lastIndex];

              updated[lastIndex] = {
                id: lastRoom.id,
                roomId: "",
                roomName: "",
                roomRate: "",
                roomImage: {},
                adults: 1,
                children: 0,
              };

              return updated;
            });

            toast.error(
              `Only ${rooms?.MinInventory} room(s) allowed for ${rooms?.RoomName}`, { position: "top-right", autoClose: 3000 }
            );
          }
        } else {
          // If no id, replace only the first record and keep the rest unchanged
          setSelectedRoom((prev) => {
            if (prev.length > 0) {
              const pacRate = rooms?.RatePlans?.find(
                (element) => element.RateId === mapping.RateId
              )?.Rates?.[Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]]
                ?.OBP;
              const pacRatess =
                parseFloat(
                  pacRate?.[prev[0]?.adults.toString()]?.RateBeforeTax || "0"
                ) * 0.9;
              return [
                {
                  ...prev[0],
                  roomPackage: rate.RateName,
                  rateId: rate.RateId,
                  applicableGuest: mapping.ApplicableGuest,
                  applicableAdult: mapping.ApplicableAdult,
                  applicableChild: mapping?.ApplicableChild
                    ? mapping?.ApplicableChild
                    : 0,
                  adultExRate:
                    parseFloat(
                      pacRate?.[prev[0]?.adults.toString()]?.RateAfterTax || "0"
                    ) - parseFloat(pacRate?.[0]?.RateAfterTax || "0"),
                  packageRate: pacRatess,
                },
                ...prev.slice(1),
              ];
            } else {
              return [{ roomPackage: rate.RateName }];
            }
          });
        }
        if (finalAmount !== 0 && finalAmount !== null && !isNaN(finalAmount)) {
          setTotalPrice(finalAmount);
        }
      } else {
        toast.error(rooms?.RestrictionTitle);
      }
    }
  };
const handleSelectRoom = (propertyData,mapping, rate, rooms ) => {
  const toasts = [];
   replaceAction("select-package");
   window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'virtualPageview',
      page_path: '/?select-package',
      page_location: `${window.location.pathname}/?select-package`,
      page_title: 'BE Steps - select-package Page',
    });
  postBookingWidged(selectedPropertyId,rooms,mapping, false,"Select Package And Cart Open");

  const roomId = rooms?.RoomId;
  const data = removeHtmlTags(propertyData?.TermsAndConditions?.Description);
  setTermsAndConditions(data);
  setProperty(propertyData);
  setVisibleOfferRoomId((prev) => (prev === roomId ? null : roomId));
  
  const ratePlanList = rooms?.RatePlans?.find((el) => el.RateId === mapping.RateId);
  const rateList = ratePlanList?.Rates;

  // Update selectedRoom
  if (selectedRoomDetails?.id) {
    setSelectedRoom((prev) =>
      prev.map((room, index) => {
        if (room?.id === selectedRoomDetails?.id) {
          const isGuestLimitExceeded =  (room.adults + room.children) > rooms.MaxGuest;
          const isAdultLimitExceeded =  room.adults > rooms.MaxAdult;
          const isChildLimitExceeded = room.children > rooms.MaxChildren;
          if (isGuestLimitExceeded) {
              toasts.push(
                `A maximum of ${rooms.MaxGuest} guests are allowed in ${rooms?.RoomName}`
              );
              return room;
            }
            if (isAdultLimitExceeded) {
                toasts.push(
                  `A maximum of ${rooms.MaxAdult} adults are allowed in ${rooms?.RoomName}`
                );
                return room;
              }
              if (isChildLimitExceeded) {
                toasts.push(
                  `A maximum of ${rooms.MaxChildren} children are allowed in ${rooms?.RoomName}`
                );
                return room;
              }
          // if(room.adults <= rooms.applicableAdult 
          //   && room.children <= rooms.maxAdult
          //   && (room.children + room.adults ) <= rooms>maxGuest
          // )
          // if (room?.adults + room?.children <= rooms?.MaxGuest) {
            setSelectedRoomDetails(null);
            const ratePlan = rooms?.RatePlans?.find((el) => el.RateId === mapping.RateId);
            const rates = ratePlan?.Rates?.[Object.keys(ratePlan?.Rates || {})[0]]?.OBP;

          const primary = rates?.[room?.adults?.toString()]?.RateAfterTax ?? undefined;

        // fallback = last rate in rates object/array
        let fallback = 0;
        if (rates) {
          if (Array.isArray(rates)) {
            // If rates is an array
            const last = rates[rates.length - 1];
            fallback = last?.RateAfterTax ?? 0;
          } else {
            // If rates is an object with numeric keys as strings
            const keys = Object.keys(rates).sort((a, b) => Number(a) - Number(b));
            const lastKey = keys[keys.length - 1];
            fallback = rates[lastKey]?.RateAfterTax ?? 0;
          }
        }
        
          const primaryBe = rates?.[room?.adults?.toString()]?.RateBeforeTax ?? undefined;

        // fallback = last rate in rates object/array
        let fallbackBe = 0;
        if (rates) {
          if (Array.isArray(rates)) {
            // If rates is an array
            const last = rates[rates.length - 1];
            fallbackBe = last?.RateBeforeTax ?? 0;
          } else {
            // If rates is an object with numeric keys as strings
            const keys = Object.keys(rates).sort((a, b) => Number(a) - Number(b));
            const lastKey = keys[keys.length - 1];
            fallbackBe = rates[lastKey]?.RateBeforeTax ?? 0;
          }
        }
            return {
              ...room,
              roomId,
              roomName: rooms?.RoomName,
              roomRate: rooms?.RackRate,
              roomImage: rooms?.Images?.[0],
              maxGuest: rooms?.MaxGuest,
              maxAdult: rooms?.MaxAdult,
              maxChildren: rooms?.MaxChildren,
              roomPackage: rate.RateName,
              rateId: rate.RateId,
              applicableGuest: mapping.ApplicableGuest,
              applicableAdult: mapping.ApplicableAdult,
              applicableChild: mapping?.ApplicableChild || 0,
              roomRateWithTax: Math.round(
                // rates?.[room?.adults?.toString()]?.RateAfterTax || 0
                primary ?? fallback
              ),
              packageRate: parseFloat(
                // rates?.[room?.adults?.toString()]?.RateBeforeTax || 0
               primaryBe ?? fallbackBe
              ),
              roomAdultExtraCharge:
                Math.round(rates?.[room?.adults?.toString()]?.RateAfterTax || 0) -
                Math.round(rates?.["1"]?.RateAfterTax || 0),
              minInventory:rooms?.MinInventory,
              packageRateList: rateList
            };
          // } 
          // else {
          //   // toast.error(
          //   //   `Only ${rooms?.MaxGuest} guests including adults and children are allowed for this room`
          //   // );
          //   showGuestLimitError = true;
          // }
        }
        return room;
      })
    );
//     if (showGuestLimitError) {
//   toast.error(
//     `Only ${rooms?.MaxGuest} guests including adults and children are allowed for this room`
//   );
// }

  SelectedRoomWithOffer(mapping);
 // calculateFinalCart();
  } else {
    // No id → update last room if exists, otherwise add new
    setSelectedRoom((prev) => {
  if (prev.length > 0 && !prev?.[0]?.roomId) {
    const pacRate = rooms?.RatePlans?.find((el) => el.RateId === mapping.RateId)
      ?.Rates?.[Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]]?.OBP;

    const firstRoom = prev[0];

          const isGuestLimitExceeded =  (firstRoom.adults + firstRoom.children) > rooms.MaxGuest;
          const isAdultLimitExceeded =  firstRoom.adults > rooms.MaxAdult;
          const isChildLimitExceeded = firstRoom.children > rooms.MaxChildren;
          if (isGuestLimitExceeded) {
              toasts.push(
                `A maximum of ${rooms.MaxGuest}  guests are allowed in ${rooms?.RoomName}`
              );
              return prev;
            }
            if (isAdultLimitExceeded) {
                toasts.push(
                  `A maximum of ${rooms.MaxAdult}  adults are allowed in ${rooms?.RoomName}`
                );
                return prev;
              }
              if (isChildLimitExceeded) {
                toasts.push(
                  `A maximum of ${rooms.MaxChildren} children are allowed in ${rooms?.RoomName}`
                );
                return prev;
              }
            const ratePlan = rooms?.RatePlans?.find((el) => el.RateId === mapping.RateId);
            const rates = ratePlan?.Rates?.[Object.keys(ratePlan?.Rates || {})[0]]?.OBP;

          const primary = rates?.[firstRoom?.adults?.toString()]?.RateAfterTax ?? undefined;

        // fallback = last rate in rates object/array
        let fallback = 0;
        if (rates) {
          if (Array.isArray(rates)) {
            // If rates is an array
            const last = rates[rates.length - 1];
            fallback = last?.RateAfterTax ?? 0;
          } else {
            // If rates is an object with numeric keys as strings
            const keys = Object.keys(rates).sort((a, b) => Number(a) - Number(b));
            const lastKey = keys[keys.length - 1];
            fallback = rates[lastKey]?.RateAfterTax ?? 0;
          }
        }
        
          const primaryBe = rates?.[firstRoom?.adults?.toString()]?.RateBeforeTax ?? undefined;

        // fallback = last rate in rates object/array
        let fallbackBe = 0;
        if (rates) {
          if (Array.isArray(rates)) {
            // If rates is an array
            const last = rates[rates.length - 1];
            fallbackBe = last?.RateBeforeTax ?? 0;
          } else {
            // If rates is an object with numeric keys as strings
            const keys = Object.keys(rates).sort((a, b) => Number(a) - Number(b));
            const lastKey = keys[keys.length - 1];
            fallbackBe = rates[lastKey]?.RateBeforeTax ?? 0;
          }
        }
    return [
      {
        ...firstRoom,
        roomId,
        roomName: rooms?.RoomName,
        roomRate: rooms?.RackRate,
        roomImage: rooms?.Images?.[0],
        maxGuest: rooms?.MaxGuest,
        maxAdult: rooms?.MaxAdult,
        maxChildren: rooms?.MaxChildren,
        adults: firstRoom?.adults || 1,
        children: firstRoom?.children || 0,
        roomPackage: rate.RateName,
        rateId: rate.RateId,
        applicableGuest: mapping.ApplicableGuest,
        applicableAdult: mapping.ApplicableAdult,
        applicableChild: mapping?.ApplicableChild || 0,
        adultExRate:
          parseFloat(pacRate?.[firstRoom?.adults?.toString()]?.RateAfterTax || 0) -
          parseFloat(pacRate?.["0"]?.RateAfterTax || 0),
        packageRate: parseFloat(
          // pacRate?.[firstRoom?.adults?.toString()]?.RateBeforeTax || 0
          primaryBe ?? fallbackBe
        ),
        minInventory:rooms?.MinInventory,
        packageRateList: rateList
      },
      ...prev.slice(1), // keep rest rooms unchanged
    ];
  // } else {
  //   const pacRate = rooms?.RatePlans?.find((el) => el.RateId === mapping.RateId)
  //       ?.Rates?.[Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]]?.OBP;

  //     //const lastIndex = prev.length - 1;
  //     const lastIndex = prev?.findIndex(item => item.roomName === "");

  //     const lastRoom = prev[lastIndex];

  //     return [
  //       ...prev.slice(0, lastIndex),
  //       {
  //         ...lastRoom,
  //         roomId,
  //         roomName: rooms?.RoomName,
  //         roomRate: rooms?.RackRate,
  //         roomImage: rooms?.Images?.[0],
  //         maxGuest: rooms?.MaxGuest,
  //         maxAdult: rooms?.MaxAdult,
  //         adults: lastRoom?.adults || 1,
  //         children: lastRoom?.children || 0,
  //         roomPackage: rate.RateName,
  //         rateId: rate.RateId,
  //         applicableGuest: mapping.ApplicableGuest,
  //         applicableAdult: mapping.ApplicableAdult,
  //         applicableChild: mapping?.ApplicableChild || 0,
  //         adultExRate:
  //           parseFloat(pacRate?.[lastRoom?.adults?.toString()]?.RateAfterTax || 0) -
  //           parseFloat(pacRate?.["0"]?.RateAfterTax || 0),
  //         packageRate: parseFloat(
  //           pacRate?.[lastRoom?.adults?.toString()]?.RateBeforeTax || 0
  //         ),
  //         minInventory:rooms?.MinInventory
  //       },
  //     ];
  // }
  } else {
  const pacRate = rooms?.RatePlans?.find((el) => el.RateId === mapping.RateId)
    ?.Rates?.[Object.keys(rooms?.RatePlans?.[0]?.Rates || {})[0]]?.OBP;

  let updated = false;

  return prev.map((room) => {
    if (!updated && (room?.roomName === "" || room?.roomName === null)) {
      updated = true; // mark as updated so no other rooms get changed
      
          const isGuestLimitExceeded =  (room.adults + room.children) > rooms.MaxGuest;
          const isAdultLimitExceeded =  room.adults > rooms.MaxAdult;
          const isChildLimitExceeded = room.children > rooms.MaxChildren;
          if (isGuestLimitExceeded) {
              toasts.push(
                `A maximum of ${rooms.MaxGuest} guests are allowed in ${rooms?.RoomName}`
              );
              return room;
            }
            if (isAdultLimitExceeded) {
                toasts.push(
                  `A maximum of ${rooms.MaxAdult} adults are allowed in ${rooms?.RoomName}`
                );
                return room;
              }
              if (isChildLimitExceeded) {
                toasts.push(
                  `A maximum of ${rooms.MaxChildren} children are allowed in ${rooms?.RoomName}`
                );
                return room;
              }
            const ratePlan = rooms?.RatePlans?.find((el) => el.RateId === mapping.RateId);
            const rates = ratePlan?.Rates?.[Object.keys(ratePlan?.Rates || {})[0]]?.OBP;

          const primary = rates?.[room?.adults?.toString()]?.RateAfterTax ?? undefined;

        // fallback = last rate in rates object/array
        let fallback = 0;
        if (rates) {
          if (Array.isArray(rates)) {
            // If rates is an array
            const last = rates[rates.length - 1];
            fallback = last?.RateAfterTax ?? 0;
          } else {
            // If rates is an object with numeric keys as strings
            const keys = Object.keys(rates).sort((a, b) => Number(a) - Number(b));
            const lastKey = keys[keys.length - 1];
            fallback = rates[lastKey]?.RateAfterTax ?? 0;
          }
        }
        
          const primaryBe = rates?.[room?.adults?.toString()]?.RateBeforeTax ?? undefined;

        // fallback = last rate in rates object/array
        let fallbackBe = 0;
        if (rates) {
          if (Array.isArray(rates)) {
            // If rates is an array
            const last = rates[rates.length - 1];
            fallbackBe = last?.RateBeforeTax ?? 0;
          } else {
            // If rates is an object with numeric keys as strings
            const keys = Object.keys(rates).sort((a, b) => Number(a) - Number(b));
            const lastKey = keys[keys.length - 1];
            fallbackBe = rates[lastKey]?.RateBeforeTax ?? 0;
          }
        }
      return {
        ...room,
        roomId,
        roomName: rooms?.RoomName,
        roomRate: rooms?.RackRate,
        roomImage: rooms?.Images?.[0],
        maxGuest: rooms?.MaxGuest,
        maxAdult: rooms?.MaxAdult,
        adults: room?.adults || 1,
        children: room?.children || 0,
        roomPackage: rate.RateName,
        rateId: rate.RateId,
        applicableGuest: mapping.ApplicableGuest,
        applicableAdult: mapping.ApplicableAdult,
        applicableChild: mapping?.ApplicableChild || 0,
        adultExRate:
          parseFloat(pacRate?.[room?.adults?.toString()]?.RateAfterTax || 0) -
          parseFloat(pacRate?.["0"]?.RateAfterTax || 0),
        packageRate: parseFloat(
          // pacRate?.[room?.adults?.toString()]?.RateBeforeTax || 0
          primaryBe ?? fallbackBe
        ),
        minInventory: rooms?.MinInventory,
        packageRateList: rateList
      };
    }
    return room; // keep unchanged
  });
  
}


});
//toasts.forEach((msg) => toast.error(msg, { position: "top-right", duration: 3000 }));
setToastMessages(toasts);
  SelectedRoomWithOffer(mapping);
  //calculateFinalCart();
  }

  // Update selected room rate & total
  setSelectedRoomRate({ roomId, roomRate: rooms?.RackRate });
  if (finalAmount !== 0 && finalAmount !== null && !isNaN(finalAmount)) {
    setTotalPrice(finalAmount);
  }
};



  const handleDateChange = (startDate, endDate, totalPrice) => {
    if (startDate != "" && endDate != "") {
      setFilters({
        ...filters,
        dateRange: { start: startDate, end: endDate, totalPrice },
      });
    } else {
      toast.error("Please choose check-in and check-out both date.");
    }
  };

  const handleRoomChange = (adults, children, roomCount) => {
    setFilters((prev) => ({
      ...prev,
      guests: { adults, children, rooms: roomCount },
    }));
  };

  const showBookingEngine = async () => {
    const formatingDate = (date) => {
      const d = new Date(date); // ensure it's a Date object
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const currentDate = formatingDate(today); // today's date
    const nextDate = formatingDate(tomorrow);
    setSelectedStartDate(currentDate);
    setSelectedEndDate(nextDate);

    setTimeout(() => {
      const element = document.getElementById(`filter-bar-search`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
    setIsVisible(true);
  };

  const hideBookingEngine = () => {
    setIsVisible(false);
    onClose(isTimeOutInventory);
  };

  const toggleBookNow = (id) => {
    setActiveHotel(id);
  };

  const toggleAmenitiesPopup = () => {
    setShowAllAmenities(!showAllAmenities);
  };

  const removeHtmlTags = (htmlString) => {
    return htmlString?.replace(/\n|\t/g, "")
      .replace(/<\/?ul>/g, "")
      .replace(/<br\s*\/?>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/<span[^>]*>/g, "") // remove opening <span> with any attributes
      .replace(/<\/span>/g, "") // remove closing </span>
      .replace(/<strong[^>]*>/g, "") // remove opening <strong> with any attributes
      .replace(/<\/strong>/g, "") // remove closing </strong>
      .replace(/<style[^>]*>/g, "") // remove opening <style> with any attributes
      .replace(/<\/style>/g, "") // remove closing </style>
      .replace(/<font[^>]*>/g, "") // remove opening <font> with any attributes
      .replace(/<\/font>/g, "") // remove closing </font>
      .replace(/<p[^>]*>/g, "") // remove opening <p> with any attributes
      .replace(/<\/p>/g, "") // remove closing </p>
      .replace(/<b[^>]*>/g, "") // remove opening <b> with any attributes
      .replace(/<\/b>/g, ""); // remove closing </b>
  };

  const [isWizardVisible, setIsWizardVisible] = useState(false);

   useEffect(()=>{

  const toggleWizard = () => {
    isSetCallWizard(false);
   // setIsStayStepOpen(false);
    if(selectedRoom?.length > 0 && selectedRoom[selectedRoom?.length-1].roomName !== null 
      && selectedRoom[selectedRoom?.length-1].roomName !== ""){
    setIsWizardVisible(!isWizardVisible);
    if (!isWizardVisible) {
      // Add the CombinedWizard class to body for :before styling, but don't set inline styles
      document.body.classList.add("CombinedWizard1");
      // No need to set overflow here if you want to control it via CSS
    } else {
      document.body.classList.remove("CombinedWizard1");
      setIsWizardVisible(!isWizardVisible);
    }
    }
  };
  if(isCallWizard){
   
    toggleWizard();
    setTimeout(() => {
      // setLoaderOverlay(false);
       setSelectLoader(false);
    }, 500);
  }
   }, [isCallWizard])

  const resetRoomSelection = (id) => {
    if(typeof id === "string"){
    setSelectedRoom((prev) =>
    prev.map((room, index) => {
      if (room.id === id) {
        return {
          id: room.id,
          roomId: "",
          roomName: "",
          roomRate: "",
          roomImage: {},
          adults: room.adults,
          children: room.children,
        };
      }
        return room; // keep others unchanged
      })
    );
   }
    else{
      
    setSelectedRoom((prev) =>
    prev.map((room, index) => {
    if (index === prev.length - 1) {
      return {
        id: room.id,
        roomId: "",
        roomName: "",
        roomRate: "",
        roomImage: {},
        adults: room.adults,
        children: room.children,
      };
    }
    return room; 
  })
);
    }
  };
  const handleWizardClose = () => {
    setIsWizardVisible(false);
    document.body.classList.remove("CombinedWizard1");
    if (tokenKey) {
      status();
    }
    //window.location.href = '/';
  };
  const status = () => {
    //window.location.reload();
    window.location.href = "/";
  };
  const SelectedRoomWithOffer = (mapping) => {
    //setLoaderOverlay(true)
       setSelectLoader(true);
    if (!mapping || !mapping.CancellationPolicy) {
     // console.error("Mapping is undefined or missing CancellationPolicy");
      return;
    }

    setCancellationPolicyState(mapping.CancellationPolicy);
    //toggleWizard();
    setIsStayStepOpen(true);
    isSetCallWizard(true);
    setIsVisible(true);
  };

  const handleSignUpSubmit = async (dataSignUp) => {
    if (dataSignUp.errorCode == "0") {
      alert("Registered Successfully");

      const user = dataSignUp.result[0];

      setUserDetails(user);

      setLoggedUserDetails({
        customerId: user?.customerId || "",
        membershipId: user?.membershipId || "",
        memberTitle: user?.memberTitle || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        mobilePrefix: user?.mobilePrefix || "",
        mobileNumber: user?.mobileNumber || "",
        email: user?.email || "",
        isLogged: true,
      });

      // setHandleSearched(true);
      setIsLoggedin(true);
      setIsOpenLogin(false);
      setIsOpenSignUp(false);
      localStorage.setItem("userDetails", JSON.stringify(user));
    }
  };

  const handleLoginSubmit = async (dataLogin) => {
    if (dataLogin.errorCode == "0") {
      alert("Login Successfully");

      const user = dataLogin.result[0];
      setUserDetails(user);
      setLoggedUserDetails({
        customerId: user?.customerId || "",
        membershipId: user?.membershipId || "",
        memberTitle: user?.memberTitle || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        mobilePrefix: user?.mobilePrefix || "",
        mobileNumber: user?.mobileNumber || "",
        email: user?.email || "",
        isLogged: true,
      });

      // setHandleSearched(true);
      setIsLoggedin(true);
      setIsOpenLogin(false);
      localStorage.setItem("userDetails", JSON.stringify(user));
    } else if (dataLogin.errorCode == "SignUp") {
      setIsOpenLogin(false);
      setIsOpenSignUp(true);
    } else {
      alert("Something went wrong try again");
    }
  };

  function stripHtml(html) {
    if (!html) return "";
    const entityMap = {
      "&rsquo;": "'",
      "&lsquo;": "'",
      "&rdquo;": '"',
      "&ldquo;": '"',
      "&mdash;": "—",
      "&ndash;": "–",
      "&nbsp;": " ",
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
    };
    let decoded = html.replace(
      /&[a-zA-Z0-9#]+;/g,
      (match) => entityMap[match] || ""
    );
    decoded = decoded.replace(/<[^>]+>/g, "");
    decoded = decoded.replace(/['’“”—]/g, " ");
    return decoded.replace(/\s+/g, " ").trim();
  }
  const images = [
    "/booking-engine-imgs/images/mountain-view.jpg",
    "/booking-engine-imgs/images/offer-pp.jpg",
  ];
  const handleReadMore = (room) => {
    setViewMoreRoom(room);
    setShowRoomsModal(true);
  };

  useEffect(() => {
    if (showRoomsModal) {
      const modalEl = document.getElementById("RoomPopupModal");
      if (modalEl) {
        import("bootstrap/dist/js/bootstrap.bundle.min.js").then(
          ({ Modal }) => {
            const modal = new Modal(modalEl);
            modal.show();

            modalEl.addEventListener(
              "hidden.bs.modal",
              () => {
                setShowRoomsModal(false);
                setViewMoreRoom(null);
              },
              { once: true }
            );
          }
        );
      }
    }
  }, [showRoomsModal]);
  useEffect(() => {
    if (filteredProperties?.length > 0 && !isLoaderOverlay) {

    let t1 = performance.now();
    const totalTimeTaken = ((t1 - initialTime) / 1000).toFixed(2); 
    postBookingWidged(selectedPropertyId,"","", false,"rate fetched", 
    "rate",`${process.env.NEXT_PUBLIC_STAAH_BASE_URL}/api/cin-api/rate`,"rate response",totalTimeTaken?.toString(),rateGuid);
    }
  }, [isLoaderOverlay]);

  return (
    
    <>
      <section
        className={`booking-form-wrapper toggle-div ${
         !tokenKey && isVisible ? "visible" : "hidden"
        } ${newClassRoom ? "booking-widget-set" : ""}`}

      >
        <div
          id="booking-bar"
          className={`booking-bar ${isClassAddedBook && !isSmallScreen ? "fullscreen" : ""}`}
        >
          {isVisible && (
            <div className="hide-booking-engine hide-on-desktop-close-btn">
              
              {isSmallScreen && (isRateFetched || hasSearched) &&  (
                  <>
                  {
                    filteredProperties.map((item, index) => {
                      return(
                          <div className="d-flex aglin-items-center search-details-header"  key={index}  onClick={handleOnEdit}>
                              <div className="top-detail-var">
                                    <h4>{item.PropertyData.PropertyName}</h4>
                                    <div className="top-head-roomdetails">
                                      {selectedStartDate && selectedEndDate ? (
                                        <span>
                                          {new Date(selectedStartDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })} -{' '}
                                          {new Date(selectedEndDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                                        </span>
                                      ) : (
                                        <span>Dates not selected</span>
                                      )}
                                      , <span>{`${totalRooms} Rooms, ${totalAdults + totalChildren} Guests`}</span>
                                    </div>  
                              </div>

                              <button className="ms-3 p-2 text-center edit-engine">
                                {/* <Edit size={20} color="#0090ff" /> */}
                                <Pencil size={20} color="#0090ff"></Pencil>
                              </button> 
                           </div>
                      )
                       
                    })
                   
                  }
                 </>
              )}

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
            <div className={`col-3 main-bx-field filter-item position-relative ${isSmallScreen? "m-7":""}`}>
              <Select
                options={cityDropDown}
                value={cityName}
                onChange={(selected) => {setCityName(selected),
                setIsEditClicked(false)}}
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
                  className={`list-group position-absolute w-100 zindex-dropdown ${
                    dropUp ? "drop-up" : ""
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
                      setIsEditClicked(false);}}
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
              {/* {promoError && (
                <div className="text-danger small mt-1">{promoError}</div>
              )} */}
            </div>
            <div
              id="search" 
              className="col-2 search-icon hotel-search-btn-wrapper position-relative"
            >
              <button onClick={process.env.NEXT_PUBLIC_STAAH_REDIRECT == "redirect" ? handleSearchTh : handleSearch}> 
               <span className="this-search-for-mobile">Search</span>
                <span className="this-search-for-desk">BOOK NOW</span>
              </button>
            </div>
          </div>)}
          {noProperty &&
            ReactDOM.createPortal(
              <>
                <div className="modal-backdrop fade show"></div>
          
                <div
                  className="modal fade show d-block"
                  id="MessageForNoProperty"
                  tabIndex="-1"
                  aria-labelledby="MessageForNoPropertyLabel"
                  aria-hidden="false"
                >
                  <div className="modal-dialog modal-dialog-centered text-start">
                    <div className="modal-content no-property-modal-data">
                      <div className="p-3">
                        <h6 className="modal-title" id="MessageForNoPropertyLabel">
                          For the best rates and reservations, please contact our Central Reservations team:
                        </h6>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setNoProperty(false)}
                          aria-label="Close"
                        >x</button>
                      </div>
                      <div className="modal-body">
                        <div className="offer-list">
                          <p>
                            <Link href="tel:9717170578">📞 +91 97171 70578</Link>
                            <Link href="mailto:bookmystay@theclarkshotels.com">📧 bookmystay@theclarkshotels.com</Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>,
              document.body
            )
          }
         {hasSearched && filteredProperties?.length > 0 ? (
  <>
    <div className="container step-wizard-card-section position-relative">
      <div className="d-flex justify-content-between align-items-center position-relative w-75 m-auto stepper-wizard">

        {(() => {
          // find first room where roomName is empty/null
          const firstIncompleteIndex = selectedRoom?.findIndex(
            (rm) => !rm?.roomName
          );

          const isMoreThanEight = selectedRoom?.length > 8;

          return selectedRoom?.map((rm, indx) => {
            let circleClass = "";
            if (firstIncompleteIndex === -1 || indx < firstIncompleteIndex) {
              circleClass = "completed"; // done already
            } else if (indx === firstIncompleteIndex) {
              circleClass = "active"; // first empty slot
            }
            const divClassName = `text-center position-relative flex-fill ${
        isMoreThanEight ? "larger-div-box" : ""
      }`;

            return (
              
              <div className={divClassName} key={indx}>
                <div className={`step-circle ${circleClass}`}>
                  {circleClass === "completed" ? (
                    <Check size={18} strokeWidth={3} />
                  ) : (
                    indx + 1
                  )}
                </div>
                <div
                  className={`mt-2 ${
                    circleClass === "completed" ? "fw-bold" : "fw-normal"
                  }`}
                >
                  Room {indx + 1}
                </div>
                <div className="step-line completed"></div>
                
              </div>
            );
          });
        })()}

        {/* Reservation step */}
        <div className="text-center position-relative flex-fill">
          <div className="step-circle">{selectedRoom?.length + 1}</div>
          <div className="mt-2 fw-normal">Reservation</div>
        </div>
        <Toaster />
      </div>

    </div>
  </>
) : (
  ""
)}



{/* 
          {isLoaderOverlay || isSelectLoader || (isTimeOutContent.current == true && rateDataRef?.length ==0) ? ( */}
          {isLoaderOverlay || isSelectLoader || (bothReadyRef.current && filteredProperties?.length === 0) ? (
            <div className="d-flex w-100 align-items-center justify-content-center">
              <div className="loader-dots" aria-label="Loading" role="status">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
           
          ) : (
            <>

             <div id="property-div" className="hotels-list hotels-rooms-list">
              <div className="row m-0">

               <div className="col-md-12 p-0">
                  {hasSearched && filteredProperties?.length > 0 && bothReadyRef.current ? (
                    <div className="repeated-div-property">
                         
           {filteredProperties?.map((property) => (
                        <div
                          key={property?.PropertyData?.PropertyId}
                          className="card rounded-3 mb-3 p-3 mt-1"
                        >
                          {activeHotel === property?.PropertyData?.PropertyId && (
                            <div
                              className="book-now-content"
                            >
                              <div className="accordion-body mt-3">
                                 {Array.isArray(property?.RoomData) ?( property?.RoomData?.length > 0 ? (
    (() => {
      const excludeRoomNames = ["B2B","b2b","B2b","b2B","copy"];
//       const maxAdultsInRoom = selectedRoom.reduce(
//   (max, rm) => (rm.adults > max ? rm.adults : max),
//   0
// );
// let isSoldOutProp = false;
// let emptyRoom = selectedRoom.find(rm => rm.roomName === "");
// const maxAdultsInRoom = emptyRoom 
//   ? (emptyRoom.adults + emptyRoom.children) 
//   : selectedRoom.reduce((max, rm) => (rm.adults > max ? (rm.adults + rm.children) : 0), 0);

// let mappedRooms = property?.RoomData
//   ?.filter(room => !excludeRoomNames.includes(room.RoomName) 
//   && !room.RoomName.toLowerCase().includes("copy"))
//   ?.map((rooms) => {
//     const ratePlans = rooms?.RatePlans || [];

//     // Calculate minimum available rate for this room
//     let minRate = null;
//     ratePlans.forEach((plan) => {
//       const firstRateKey = Object.keys(plan?.Rates || {})[0];
//       const rate = parseFloat(
//         plan?.Rates?.[firstRateKey]?.OBP?.[0]?.RateBeforeTax || "0"
//       );

//       if (rate > 0) {
//         if (minRate === null || rate < minRate) {
//           minRate = rate;
//         }
//       }
//     });

//     // Exclude sold-out rooms
//     if (!minRate) return null;

//     return {
//       ...rooms,
//       minRate,
//       exactMatch: rooms?.MaxGuest === maxAdultsInRoom,
//     };
//   })
//   .filter(Boolean); // remove sold-out rooms

// // Fallback: if no exact match AND maxAdultsInRoom > all room MaxGuest
// if (!mappedRooms.some(r => r.exactMatch)) {
//   const validRooms = mappedRooms.filter(r => r.MaxGuest < maxAdultsInRoom);
//   if (validRooms.length > 0) {
//     const highestGuest = Math.max(...validRooms.map(r => r.MaxGuest));
//     mappedRooms = mappedRooms.map(r => ({
//       ...r,
//       exactMatch: r.MaxGuest === highestGuest
//     }));
//   }
// }
// let sortedRooms = [];
// if(mappedRooms?.length > 0){ sortedRooms = mappedRooms.sort((a, b) => {
//   // 1️⃣ Exact match (or fallback) first
//   if (a.exactMatch !== b.exactMatch) return a.exactMatch ? -1 : 1;

//   // 2️⃣ Then sort by descending MaxGuest
//   if (a.MaxGuest !== b.MaxGuest) return b.MaxGuest - a.MaxGuest;

//   // 3️⃣ Then sort by lowest rate
//   if (a.minRate !== b.minRate) return a.minRate - b.minRate;

//   // 4️⃣ Tie-breaker by room name
//   return (a.RoomName || "").localeCompare(b.RoomName || "");
// });
// }
// else{
//   isSoldOutProp = true;
//   let mappedRooms = property?.RoomData
//   ?.filter(room => !excludeRoomNames.includes(room.RoomName) 
//   && !room.RoomName.toLowerCase().includes("copy"));
//  sortedRooms = mappedRooms
// }

let isSoldOutProp = false;
let emptyRoom = selectedRoom.find(rm => rm.roomName === "");
const maxAdultsInRoom = emptyRoom 
  ? (emptyRoom.adults + emptyRoom.children) 
  : selectedRoom.reduce(
      (max, rm) => (rm.adults > max ? (rm.adults + rm.children) : max),
      0
    );

let mappedRooms = property?.RoomData
  ?.filter(
    room =>
      !excludeRoomNames.includes(room.RoomName) &&
      !room.RoomName.toLowerCase().includes("copy")
  )
  ?.map(rooms => {
    const ratePlans = rooms?.RatePlans || [];
    let minRate = null;

    ratePlans.forEach(plan => {
      const firstRateKey = Object.keys(plan?.Rates || {})[0];
      const rate = parseFloat(
        plan?.Rates?.[firstRateKey]?.OBP?.[0]?.["1"]?.RateBeforeTax || "0"
      );

      if (rate > 0) {
        if (minRate === null || rate < minRate) {
          minRate = rate;
        }
      }
    });

    if (!minRate) return null;

    return {
      ...rooms,
      minRate,
    };
  })
  .filter(Boolean);

if (mappedRooms?.length > 0) {
  // Find all unique guest capacities
  const guestCapacities = mappedRooms.map(r => r.MaxGuest);

  // Find the next greater or equal MaxGuest
  const exactOrGreater = guestCapacities
    .filter(g => g >= maxAdultsInRoom)
    .sort((a, b) => a - b)[0]; // smallest greater or equal

  // Fallback to the highest if none is >= maxAdultsInRoom
  const targetGuest =
    exactOrGreater !== undefined
      ? exactOrGreater
      : Math.max(...guestCapacities);

  // Assign exactMatch based on the closest rule
  mappedRooms = mappedRooms.map(r => ({
    ...r,
    exactMatch: r.MaxGuest === targetGuest,
  }));

  // ✅ Sort rooms
  // mappedRooms.sort((a, b) => {
  //   // 1️⃣ Exact or closest match first
  //   if (a.exactMatch !== b.exactMatch) return a.exactMatch ? -1 : 1;

  //   // 2️⃣ Higher capacity next
  //   if (a.MaxGuest !== b.MaxGuest) return b.MaxGuest - a.MaxGuest;

  //   // 3️⃣ Then lower rate
  //   if (a.minRate !== b.minRate) return a.minRate - b.minRate;

  //   // 4️⃣ Finally by room name
  //   return (a.RoomName || "").localeCompare(b.RoomName || "");
  // });
  mappedRooms.sort((a, b) => {
  // 1️⃣ Exact or nearest match first
  if (a.exactMatch !== b.exactMatch) return a.exactMatch ? -1 : 1;

  // 2️⃣ Then by how close MaxGuest is to maxAdultsInRoom
  const aDiff = a.MaxGuest - maxAdultsInRoom;
  const bDiff = b.MaxGuest - maxAdultsInRoom;

  // Sort ascending by positive difference (nearest greater first)
  // If both are smaller (negative), sort descending (largest smaller first)
  if (aDiff >= 0 && bDiff >= 0) return aDiff - bDiff; // both greater
  if (aDiff < 0 && bDiff < 0) return bDiff - aDiff;   // both smaller
  if (aDiff >= 0 && bDiff < 0) return -1;             // a is greater/equal, b is smaller → a first
  if (aDiff < 0 && bDiff >= 0) return 1;              // a smaller, b greater/equal → b first

  // 3️⃣ Then lower rate
  if (a.minRate !== b.minRate) return a.minRate - b.minRate;

  // 4️⃣ Finally by name
  return (a.RoomName || "").localeCompare(b.RoomName || "");
});

} else {
  // All rooms sold out
  isSoldOutProp = true;
  mappedRooms = property?.RoomData?.filter(
    room =>
      !excludeRoomNames.includes(room.RoomName) &&
      !room.RoomName.toLowerCase().includes("copy")
  );
}

const sortedRooms = mappedRooms;

      // .sort((a, b) => a?.minRate - b?.minRate);
      if (sortedRooms?.length === 0) {
        return <p> No room data available for this property.</p>;
      }
      //const nonSoldOutRooms = sortedRooms?.filter(r => !r.soldOut) || [];
       return sortedRooms?.map((rooms, index) => (
        <div className="row g-0 mb-3" key={rooms?.RoomId}>
                                      <div className="col-md-10">
                                        <div className="row">
                                          <div className="col-md-4">
                                            <div className="position-relative">
                                              {rooms?.Images &&
                                              rooms?.Images.length > 0 ? (
                                                <Swiper
                                                              modules={[
                                                                Navigation,
                                                                Autoplay,
                                                                Pagination
                                                              ]}
                                                              autoplay={
                                                              //   {
                                                              //   delay: 3000,
                                                              //   disableOnInteraction: false,
                                                              // }
                                                              false
                                                            }
                                                              navigation={true}
                                                              pagination={{
                                                                clickable: "true"
                                                              }}
                                                              
                                                              spaceBetween={10}
                                                              slidesPerView={1}
                                                              loop={true}
                                                              
                                                              className="images-slider filterbar-g-slider"
                                                            >
                                                              {rooms?.Images &&
                                                              rooms?.Images
                                                                .length > 0
                                                                ? rooms?.Images.map(
                                                                    (
                                                                      src,
                                                                      idx
                                                                    ) => (
                                                                      <SwiperSlide
                                                                        key={
                                                                          idx
                                                                        }
                                                                      >
                                                                        <img
                                                                          src={
                                                                            src
                                                                          }
                                                                          alt={`Slide ${
                                                                            idx +
                                                                            1
                                                                          }`}
                                                                          width={500}
                                                  height={150}
                                                  className="img-fluid rounded-3 property-image"
                                                                           data-bs-toggle="modal"
                                                                           data-bs-target={`#RoomPopupModal-${rooms.RoomId}`}
                                                                        />
                                                                      </SwiperSlide>
                                                                    )
                                                                  )
                                                                : images.map(
                                                                    (
                                                                      src,
                                                                      idx
                                                                    ) => (
                                                                      <SwiperSlide
                                                                        key={
                                                                          idx
                                                                        }
                                                                      >
                                                                        <img
                                                                          src={
                                                                            src
                                                                          }
                                                                          alt={`Slide ${
                                                                            idx +
                                                                            1
                                                                          }`}
                                                                         width={500}
                                                  height={150}
                                                  className="img-fluid rounded-3 property-image"
                                                                        />
                                                                      </SwiperSlide>
                                                                    )
                                                                  )}
                                                            </Swiper>
                                              ) : (
                                                <Image
                                                  src={dummyImage}
                                                  alt="alt"
                                                  width={500}
                                                  height={150}
                                                  className="img-fluid rounded-3 property-image"
                                                />
                                              )}
                                            </div>
                                          </div>
                                          <div className="col-md-8">
                                            <div className="card-body p-0 roomname-leftroom">
                                              <div>
                                                <p className="hotel-info mb-1">
                                                  <span data-bs-toggle="modal"
                                                    data-bs-target={`#RoomPopupModal-${rooms?.RoomId}`}>
                                                    {rooms?.RoomName}
                                                  </span>
                                                 <span className="not-showing-mobile-txt">
                                                    {(() => {
                                                      const nonSoldOutRooms = sortedRooms?.filter(r => !r.soldOut) || [];
                                                      const nonSoldOutIndex = nonSoldOutRooms.findIndex(r => r.RoomId === rooms.RoomId);

                                                      return (
                                                        <>
                                                          {nonSoldOutIndex === offerTagIndex && !isSoldOutProp && (
                                                            <span className="offer-tag">Only {number1} rooms left</span>
                                                          )}
                                                        </>
                                                      );
                                                    })()}
                                                  </span>
                                                </p>
                                                <div className="align-mobile-set">
                                                  <div className="room-type-single">
                                                  {/* <p className="bold-text1 mb-0">
                                                    Up to {rooms?.MaxGuest}{" "}
                                                    Guests &nbsp; | &nbsp;&nbsp;
                                                  </p> */}

                                                  <p className="bold-text1 mb-0">
                                                   <FontAwesomeIcon icon={faUser} />
                                                   {" "} {rooms?.MaxGuest}{" "}
                                                    Guests &nbsp; | &nbsp;&nbsp;
                                                  </p>

                                                  <p className="bold-text1 mb-0">
                                                    {rooms?.RoomSize}
                                                  </p>
                                                </div>

                                                <div className="tile-placeholder text-justify py-2 pr-3 mobile-hidden-text1">
                                                 <span className="d-none d-md-inline">
                                                    {stripHtml(rooms?.RoomDescription || "").slice(0, 90)}
                                                  </span>
                                                  <span className="d-inline d-md-none">
                                                    {stripHtml(rooms?.RoomDescription || "").slice(0, 0)}
                                                  </span>
                                                  ...
                                                  <Link
                                                    href="#"
                                                    className="read-more-btn-propery"
                                                    data-bs-toggle="modal"
                                                    data-bs-target={`#RoomPopupModal-${rooms?.RoomId}`}
                                                  >
                                                   More info
                                                  </Link>
                                                </div>
                                                
                                                </div>
                                               
                                                  {ReactDOM.createPortal(
                                                    <div
                                                      className="modal fade"
                                                      id={`RoomPopupModal-${rooms?.RoomId}`}
                                                      tabIndex="-1"
                                                      aria-labelledby={`roomModalLabel-${rooms?.RoomId}`}
                                                      aria-hidden="true"
                                                    >
                                                      <div className="modal-dialog modal-dialog-centered modal-lg">
                                                        <div className="modal-content room-popup-modal-content">
                                                          <div className="modal-header">
                                                            <h5
                                                              className="modal-title"
                                                              id="RoomPopupModalTitle"
                                                            >
                                                              {rooms?.RoomName}
                                                            </h5>
                                                            <button
                                                              type="button"
                                                              className="btn-close"
                                                              data-bs-dismiss="modal"
                                                              aria-label="Close"
                                                            >
                                                              x
                                                            </button>
                                                          </div>
                                                          <div className="modal-body pt-0">
                                                            <Swiper
                                                              modules={[
                                                                Navigation,
                                                                Pagination,
                                                                Autoplay,
                                                              ]}
                                                              autoplay={
                                                              //   {
                                                              //   delay: 3000,
                                                              //   disableOnInteraction: false,
                                                              // }
                                                              false
                                                            }
                                                              navigation
                                                              pagination={{
                                                                clickable: true,
                                                              }}
                                                              spaceBetween={10}
                                                              slidesPerView={1}
                                                              loop={true}
                                                              className="images-slider"
                                                            >
                                                              {rooms?.Images &&
                                                              rooms?.Images
                                                                .length > 0
                                                                ? rooms?.Images.map(
                                                                    (
                                                                      src,
                                                                      idx
                                                                    ) => (
                                                                      <SwiperSlide
                                                                        key={
                                                                          idx
                                                                        }
                                                                      >
                                                                        <img
                                                                          src={
                                                                            src
                                                                          }
                                                                          alt={`Slide ${
                                                                            idx +
                                                                            1
                                                                          }`}
                                                                          className="img-fluid img-thumb"
                                                                        />
                                                                      </SwiperSlide>
                                                                    )
                                                                  )
                                                                : images.map(
                                                                    (
                                                                      src,
                                                                      idx
                                                                    ) => (
                                                                      <SwiperSlide
                                                                        key={
                                                                          idx
                                                                        }
                                                                      >
                                                                        <img
                                                                          src={
                                                                            src
                                                                          }
                                                                          alt={`Slide ${
                                                                            idx +
                                                                            1
                                                                          }`}
                                                                          className="img-fluid img-thumb"
                                                                        />
                                                                      </SwiperSlide>
                                                                    )
                                                                  )}
                                                            </Swiper>

                                                            <div className="bottom-modal-content">
                                                              <div className="property-description mt-3 px-3">
                                                                <p>
                                                                  {stripHtml(
                                                                    rooms?.RoomDescription ||
                                                                      ""
                                                                  )}
                                                                </p>
                                                              </div>
                                                              <div className="property-amenitiess mt-4 px-3 gallery-popup-section">
                                                                <div className="row">
                                                                  {Array.isArray(
                                                                    rooms?.Bedding
                                                                  ) &&
                                                                    rooms?.Bedding.some(
                                                                      (item) =>
                                                                        item?.BedType?.trim()
                                                                    ) && (
                                                                      <div className="col-lg-4 col-md-6 d-none">
                                                                        <h6 className="amenity-ttile">
                                                                          Beds
                                                                          and
                                                                          Bedding
                                                                        </h6>
                                                                        <ul className="pl-0 ps-0">
                                                                          {rooms?.Bedding.map(
                                                                            (
                                                                              item,
                                                                              itemIndex
                                                                            ) =>
                                                                              item?.BedType?.trim() ? (
                                                                                <li
                                                                                  key={`bedding-${itemIndex}`}
                                                                                  className="list-bedding"
                                                                                >
                                                                                  {
                                                                                    item.BedType
                                                                                  }
                                                                                </li>
                                                                              ) : null
                                                                          )}
                                                                        </ul>
                                                                      </div>
                                                                    )}

                                                                  {rooms?.RoomAmenities &&
                                                                    Object?.entries(
                                                                      rooms?.RoomAmenities
                                                                    ).map(
                                                                      (
                                                                        [
                                                                          category,
                                                                          items,
                                                                        ],
                                                                        roomAmenity
                                                                      ) => (
                                                                        <div
                                                                          className="col-lg-4 col-md-6 col-sm-6"
                                                                          key={`room-cat-${roomAmenity}`}
                                                                        >
                                                                          <h6 className="amenity-ttile">

                                                                            {
                                                                              category
                                                                            }
                                                                          </h6>
                                                                          <ul className="ps-0 pl-0">
                                                                            {Array.isArray(
                                                                              items
                                                                            ) &&
                                                                              items.map(
                                                                                (
                                                                                  item,
                                                                                  itemIndex
                                                                                ) => (
                                                                                  <li
                                                                                    key={`room-item-${roomAmenity}-${itemIndex}`}
                                                                                    className="list-item"
                                                                                  >
                                                                                    {" "}
                                                                                    <FontAwesomeIcon
                                                                                      icon={
                                                                                        faDiamond
                                                                                      }
                                                                                      className="me-2"
                                                                                      color="#7b7b7b"
                                                                                      size="6"
                                                                                    />{" "}
                                                                                    {
                                                                                      item
                                                                                    }
                                                                                  </li>
                                                                                )
                                                                              )}
                                                                          </ul>
                                                                        </div>
                                                                      )
                                                                    )}
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>,
                                                    document.body
                                                  )}

                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-2">
                                        <div className="price-detail-right room-price-hide">
                                          <div className="price-details mt-0">
                                            <div className="make-flex">

                                             <div className="priceText mb-0 mt-1 property-price-text">
                                                    {(() => {
                                                      const ratePlans = rooms?.RatePlans || [];
                                                      let minRate = Infinity;
                                                      let saveings = Infinity;
                                                         
                                                      ratePlans.forEach((plan) => {
                                                        const firstRateKey = Object.keys(plan?.Rates || {})[0];
                                                        const rate = parseFloat(
                                                          plan?.Rates?.[firstRateKey]?.OBP?.[0]?.["1"]?.RateBeforeTax || "0"
                                                        );
                                                        const rateSavings = parseFloat(
                                                          plan?.Rates?.[firstRateKey]?.OBP?.[0]?.["1"]?.Savings || "0"
                                                        );
                                                        if (!isNaN(rate) && rate < minRate) {
                                                          minRate = rate;
                                                          saveings = rateSavings;
                                                        }
                                                      });
                                                      if (!isFinite(minRate)) {
                                                      return (
                                                        <>
                                                        <span className="sold-out-txt">
                                                          Sold Out
                                                          <span className="small-text-for-today"> (for today)</span>
                                                        </span>
                                                          
                                                        </>
                                                      );
                                                    }
                                                      // Format INR
                                                      const formatINR = (value) =>
                                                        new Intl.NumberFormat("en-IN", {
                                                          style: "currency",
                                                          currency: "INR",
                                                          maximumFractionDigits: 0,
                                                        }).format(value);

                                                      // 25% higher original price
                                                      const increasedPrice = saveings + minRate;

                                                      return (
                                                        <div className="roomprice-hide-mobile">
                                                          {Math.round(increasedPrice) > Math.round(minRate) && <span className="line-through text-gray-500">
                                                              {/* {formatINR(increasedPrice)} */}
                                                              INR{" "}{increasedPrice.toLocaleString()}
                                                            </span>}
                                                          <span className="flex items-center gap-2">
                                                            <span className="text-green-600 font-bold">
                                                              {/* {formatINR(minRate)} */}
                                                              INR{" "}{minRate.toLocaleString()}
                                                            </span>

                                                            <span className="sm-text-price">/Night</span>
                                                          </span>
                                                        </div>

                                                      );
                                                    })()}
                                                  </div>
                                              { !rooms.soldOut && !isSoldOutProp && <p className="price-details">
                                                <span className="txes-hide-mobile">
                                                  Plus INR &nbsp;
                                                  {(() => {
                                                    const ratePlans =
                                                      rooms?.RatePlans || [];
                                                    let minRate = Infinity;

                                                    ratePlans.forEach(
                                                      (plan) => {
                                                        const firstRateKey =
                                                          Object.keys(
                                                            plan?.Rates || {}
                                                          )[0];
                                                        const rate =
                                                          parseFloat(
                                                            plan?.Rates?.[
                                                              firstRateKey
                                                            ]?.OBP?.[0]?.["1"]
                                                              ?.RateAfterTax ||
                                                              "0"
                                                          ) -
                                                          parseFloat(
                                                            plan?.Rates?.[
                                                              firstRateKey
                                                            ]?.OBP?.[0]?.["1"]
                                                              ?.RateBeforeTax ||
                                                              "0"
                                                          );
                                                        if (
                                                          !isNaN(rate) &&
                                                          rate < minRate
                                                        ) {
                                                          minRate = rate;
                                                        }
                                                      }
                                                    );

                                                    return isFinite(minRate)
                                                      ? Math.round(minRate)
                                                      : 0;
                                                  })()}{" "}
                                                  in taxes
                                                </span>
                                                {(() => {
                                                  const nonSoldOutRooms = sortedRooms?.filter(r => !r.soldOut) || [];
                                                  const nonSoldOutIndex = nonSoldOutRooms.findIndex(r => r.RoomId === rooms.RoomId);
                                                  return (
                                                    <>
                                                    <span className="txes-hide-mobile">
                                                      {nonSoldOutIndex === offerTagIndex && !isSoldOutProp && (
                                                        <span className="offer-tag">Only {number1} rooms left</span>
                                                      )}
                                                    </span>
                                                     
                                                    </>
                                                  );
                                                })()}

                                              </p>}
                                            </div>
                                          </div>
                                          <div className="book-a-stay book-stay-room-btn style-for-mob-price">

                                            <div className="price-details mt-0 no-need-this-price">
                                              <div className="make-flex mb-1">
                                                <p className="priceText mb-0 mt-1 property-price-text">
                                                  Total
                                                </p>
                                              </div>
                                              <div className="make-flex">
                                                <p className="priceText mb-0 mt-0 property-price-text">
                                                  INR &nbsp;
                                                  {(() => {
                                                    const ratePlans =
                                                      rooms?.RatePlans || [];
                                                    let minRate = Infinity;

                                                    ratePlans.forEach(
                                                      (plan) => {
                                                        const firstRateKey =
                                                          Object.keys(
                                                            plan?.Rates || {}
                                                          )[0];
                                                        const rate = parseFloat(
                                                          plan?.Rates?.[
                                                            firstRateKey
                                                          ]?.OBP?.[0]?.["1"]
                                                            ?.RateAfterTax ||
                                                            "0"
                                                        );
                                                        if (
                                                          !isNaN(rate) &&
                                                          rate < minRate
                                                        ) {
                                                          minRate = rate;
                                                        }
                                                      }
                                                    );

                                                    return isFinite(minRate)
                                                      ? Math.round(minRate)
                                                      : 0;
                                                  })()}
                                                  <span className="sm-text-price">
                                                    {" "}
                                                    (incl. of taxes)
                                                  </span>
                                                </p>
                                                <p className="price-details"></p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {rooms?.MinInventory > 0 && rooms?.RoomId && (
                                        <div
                                          id={`offer-${rooms?.RoomId}`}
                                          className="offers-container booking-engine-package mt-1"
                                        >
                                          <div className="accordion-body swiper-slider-package">
                                            <Swiper
                                              modules={[Navigation, Pagination, Autoplay]}
                                              spaceBetween={5}
                                              slidesPerView={1}
                                              navigation={{
                                                nextEl: ".swiper-button-next",
                                                prevEl: ".swiper-button-prev",
                                              }}
                                              pagination={false}
                                              autoplay={
                                              false
                                            }
                                              breakpoints={{
                                                  0: { slidesPerView: 1.1 },
                                                576: { slidesPerView: 1.1 },
                                                768: { slidesPerView: 2.1 },
                                                992: { slidesPerView: 3 },
                                                1200: { slidesPerView: 3 },
                                              }}
                                              className="swiper-container-with-navigation"
                                            >
                                              {property?.RateData.filter(
                                                (rate) =>
                                                  property?.Mapping.some(
                                                    (map) =>
                                                      map.RoomId ===
                                                        rooms?.RoomId &&
                                                      map.RateId === rate.RateId
                                                  )
                                              ).map((rate, idx) => {
                                                const mapping =
                                                  property?.Mapping.find(
                                                    (map) =>
                                                      map?.RoomId ===
                                                        rooms?.RoomId &&
                                                      map?.RateId === rate?.RateId
                                                  );
                                                      const ratePlan = rooms?.RatePlans?.find(
                                                                  (element) => element.RateId === mapping.RateId
                                                                );
                                                                const firstRateKey = Object.keys(ratePlan?.Rates || {})[0];
                                                                const minRate = parseFloat(
                                                                  ratePlan?.Rates?.[firstRateKey]?.OBP?.[0]?.["1"]?.RateBeforeTax || "0"
                                                                );
                                                                const saveingsPerPackage = parseFloat(
                                                                  ratePlan?.Rates?.[firstRateKey]?.OBP?.[0]?.["1"]?.Savings || "0"
                                                                );
                                                               const increasedPricePerRoom = saveingsPerPackage + minRate;
                                                              
                                                              const { totalCartValue, totalSavings, cartValueWithTax , increasedPrice2} = selectedRoom?.reduce(
                                                                (acc, sel,selInd) => {
                                                                  const matchedRatePlan = rooms?.RatePlans?.find(
                                                                    (ratePlan) =>
                                                                      ratePlan?.RateId === sel?.rateId ||
                                                                      ratePlan?.RateId === mapping?.RateId
                                                                  );
                                                                
                                                                  if (!matchedRatePlan?.Rates) return acc;
                                                                
                                                                  const adultKey = String(sel?.adults || 1);
                                                                
                                                                  Object.values(matchedRatePlan.Rates).forEach((dateData) => {
                                                                    let obp = dateData?.OBP?.[adultKey];
                                                                  if (!obp && dateData?.OBP) {
                                                                      const numericKeys = Object.keys(dateData.OBP)
                                                                        .map(Number)
                                                                        .filter((n) => !isNaN(n))
                                                                        .sort((a, b) => a - b);
                                                                      const lastKey = numericKeys[numericKeys.length - 1];
                                                                      obp = dateData.OBP[String(lastKey)];
                                                                    }
                                                                  
                                                                    if (obp) {
                                                                      acc.totalCartValue += parseFloat(obp?.[parseInt(adultKey)]?.RateBeforeTax || "0");
                                                                      acc.totalSavings += parseFloat(dateData?.OBP?.[selInd]?.[adultKey]?.Savings || "0");
                                                                      acc.cartValueWithTax += parseFloat(obp.TotalRate || "0");
                                                                      acc.increasedPrice2 = (acc.totalCartValue + acc.totalSavings);
                                                                    }
                                                                  });
                                                                
                                                                  return acc;
                                                                },
                                                                { totalCartValue: 0, totalSavings: 0 ,cartValueWithTax: 0, increasedPrice2: 0}
                                                              );
                                                              // const increasedPricePerRoom = totalSavings + minRate;
                                                              //const finalTotal = totalCartValue + (Number(totalTax) || 0);
                                                             // const increasedPrice = totalCartValue + totalSavings; 
                                                             console.log(increasedPrice2);
                                                              const finalCartValue = cartValueWithTax +  + (Number(totalTax) || 0);
                                                              
                                                            
                                                return (
                                                  <SwiperSlide key={idx}>
                                                    <div className="mt-1 package-main-box">
                                                      <div className="winter-box-content carddd"

                                                      >
                                                        <p className="hotel-info mb-1">
                                                          <span className="d-flex align-content-center w-100">
                                                            <span className="room-card-txt">{rate.RateName}</span> 
                                                            {selectedRoom.length == 1 && (Math.round(totalSavings) > 0) ? (<span className="offer-tag">
                                                            <Tags size={24} /> Save INR {Math.round(totalSavings)?.toLocaleString()}/-
                                                            </span>) :(<>{(Math.round(saveingsPerPackage) > 0)  && (<span className="offer-tag">
                                                            <Tags size={24} /> Save INR {Math.round(saveingsPerPackage)?.toLocaleString()}/-
                                                            </span>)}</>)}
                                                          </span>
                                                        </p>
                                                        {/* <p className="package-desc-content">
                                                          {stripHtml(
                                                            rate.RateDescription ||
                                                              ""
                                                          ).slice(0, 90)}
                                                          ...
                                                          <a
                                                            className="view-package-detail-btn"
                                                            onClick={() =>
                                                              setSelectedRoomOffers(
                                                                [rate]
                                                              )
                                                            }
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#rateDetailsModal"
                                                          >
                                                            more info
                                                          </a>
                                                        </p> */}
                                                        <div className="package-desc-content">
                                                          {/* <div
                                                            dangerouslySetInnerHTML={{
                                                              __html: rate.RateDescription || "",
                                                            }}
                                                          /> */}
                                                          <a
                                                            className="view-package-detail-btn"
                                                            onClick={() => setSelectedRoomOffers([rate])}
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#rateDetailsModal"
                                                          >
                                                          Inclusions & Policies
                                                          </a>
                                                        </div>

                                                        <div className="winter-box-btn offer-footer-part">
                                                          <div className="package-select-left">
                                                            <p className="priceText">
                                                              <small>
                                                                Standard Rate
                                                              </small>
                                                            </p>
                                                            <p className="priceText">
                                                              {(() => {
                                                                return (
                                                            <span className="items-center gap-2">
                                                            {(() => {
                                                              return (
                                                                <>
                                                                 {selectedRoom?.length > 1 ?
                                                                 (<> {Math.round(increasedPricePerRoom) > Math.round(minRate) && <span className="line-through text-gray-500">
                                                                    INR {increasedPricePerRoom.toLocaleString()}
                                                                  </span>}
                                                                  <span className="text-green-600 font-bold ps-2">
                                                                    INR {minRate.toLocaleString() } 
                                                                   </span>
                                                                   {/* <span className="text-green-600 font-bold ps-2">
                                                                    INR12 {minRate23.toLocaleString() } 
                                                                   </span> */}
                                                                   
                                                                    <small className="text-gray-500">/Room/Night</small>
                                                                    </>):(<>
                                                                     {Math.round(increasedPrice2) > Math.round(finalCartValue) && <span className="line-through text-gray-500">
                                                                    INR {increasedPrice2.toLocaleString()}
                                                                  </span>}
                                                                  {/* <span className="text-green-600 font-bold ps-2">
                                                                    INR {totalRoomsBasePrice > 0 ? totalRoomsBasePrice?.toLocaleString() : finalTotal.toLocaleString() } 
                                                                     {numberOfNights > 1 ?(<small className="text-muted">{" "}(for{" "}{numberOfNights}{" "} nights)</small>)
                                                                     :(<small className="text-muted">{" "}(for{" "}{numberOfNights}{" "} night)</small>)}
                                                                    <small className="d-block text-muted"><FontAwesomeIcon icon={faPlus} /> taxes & fees</small>
                                                                   </span> */}
                                                                   <span className="text-green-600 font-bold ps-2">
                                                                    INR {parseInt(totalRoomsBasePrice) > 0 ? totalRoomsBasePrice?.toLocaleString() : finalCartValue.toLocaleString() } 
                                                                     {numberOfNights > 1 ?(<small className="text-muted">{" "}(for{" "}{numberOfNights}{" "} nights)</small>)
                                                                     :(<small className="text-muted">{" "}(for{" "}{numberOfNights}{" "} night)</small>)}
                                                                    <small className="d-block text-muted"> incl. of taxes & fees</small>
                                                                   </span>
                                                                   </>
                                                                   )

                                                                 }
                                                                </>
                                                              );
                                                            })()}
                                                          </span>

                                                                );
                                                              })()}
                                                            </p>

                                                            {rooms?.RatePlans?.find(
                                                              (element) =>
                                                                element.RateId ===
                                                                mapping.RateId
                                                            )?.Rates?.[
                                                              Object.keys(
                                                                rooms
                                                                  ?.RatePlans?.[0]
                                                                  ?.Rates || {}
                                                              )[0]
                                                            ]?.OBP?.[0]?.["1"]
                                                              ?.RateBeforeTax ? (
                                                              <button
                                                                className="btn offer-select-btnn rounded-0"
                                                                onClick={() => {
                                                                  handleSelectRoom(
                                                                    property?.PropertyData,
                                                                    mapping,
                                                                    rate,
                                                                    rooms,
                                                                    Math.round(
                                                                      rooms?.RatePlans?.find(
                                                                        (
                                                                          element
                                                                        ) =>
                                                                          element.RateId ===
                                                                          mapping.RateId
                                                                      )
                                                                        ?.Rates?.[
                                                                        Object.keys(
                                                                          rooms
                                                                            ?.RatePlans?.[0]
                                                                            ?.Rates ||
                                                                            {}
                                                                        )[0]
                                                                      ]?.OBP?.[
                                                                        "1"
                                                                      ]
                                                                        ?.RateBeforeTax ||
                                                                        "0"
                                                                    ),
                                                                    Math.round(
                                                                      rooms?.RatePlans?.find(
                                                                        (
                                                                          element
                                                                        ) =>
                                                                          element.RateId ===
                                                                          mapping.RateId
                                                                      )
                                                                        ?.Rates?.[
                                                                        Object.keys(
                                                                          rooms
                                                                            ?.RatePlans?.[0]
                                                                            ?.Rates ||
                                                                            {}
                                                                        )[0]
                                                                      ]?.OBP?.[
                                                                        "1"
                                                                      ]
                                                                        ?.RateAfterTax ||
                                                                        "0"
                                                                    ),index
                                                                  );
                                                                  selectedSetRateDataList(
                                                                    rate
                                                                  );
                                                                  setTotalRoomsBasePrice(finalCartValue);
                                                                }}
                                                              >
                                                                Book Now{" "}
                                                              </button>
                                                            ) : (
                                                              <button
                                                                className="btn btn-primary offer-select-btnn"
                                                                onClick={() => {
                                                                  handleSelectRoom(
                                                                    property?.PropertyData,
                                                                    mapping,
                                                                    rate,
                                                                    rooms,
                                                                    Math.round(
                                                                      rooms?.RatePlans?.find(
                                                                        (
                                                                          element
                                                                        ) =>
                                                                          element.RateId ===
                                                                          mapping.RateId
                                                                      )
                                                                        ?.Rates?.[
                                                                        Object.keys(
                                                                          rooms
                                                                            ?.RatePlans?.[0]
                                                                            ?.Rates ||
                                                                            {}
                                                                        )[0]
                                                                      ]?.OBP?.[
                                                                        "1"
                                                                      ]
                                                                        ?.RateBeforeTax ||
                                                                        "0"
                                                                    ),
                                                                    Math.round(
                                                                      rooms?.RatePlans?.find(
                                                                        (
                                                                          element
                                                                        ) =>
                                                                          element.RateId ===
                                                                          mapping.RateId
                                                                      )
                                                                        ?.Rates?.[
                                                                        Object.keys(
                                                                          rooms
                                                                            ?.RatePlans?.[0]
                                                                            ?.Rates ||
                                                                            {}
                                                                        )[0]
                                                                      ]?.OBP?.[
                                                                        "1"
                                                                      ]
                                                                        ?.RateAfterTax ||
                                                                        "0"
                                                                    ),index
                                                                  );
                                                                  selectedSetRateDataList(
                                                                    rate
                                                                  );
                                                                }}
                                                                disabled
                                                              >
                                                                Select Package{" "}
                                                              </button>
                                                            )}
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </SwiperSlide>
                                                );
                                              })}
                                              <div className="swiper-pagination"></div>
                                              <div className="slider-btns-arrow">
                                                <div className="swiper-button-prev"></div>
                                                <div className="swiper-button-next"></div>
                                              </div>
                                            </Swiper>
                                          </div>
                                        </div>
                                      )}
                                      {ReactDOM.createPortal(
                                        <div
                                          className="modal fade"
                                          id="rateDetailsModal"
                                          tabIndex="-1"
                                          aria-labelledby="rateDetailsModalLabel"
                                          aria-hidden="true"
                                        >
                                          <div className="modal-dialog modal-dialog-centered text-start">
                                            <div className="modal-content">
                                              <div className="p-3">
                                                <h5
                                                  className="modal-title"
                                                  id="rateDetailsModalLabel"
                                                >
                                                  Rate Details
                                                </h5>
                                                <button
                                                  type="button"
                                                  className="btn-close"
                                                  data-bs-dismiss="modal"
                                                  aria-label="Close"
                                                  onClick={() =>
                                                    setSelectedRoomOffers([])
                                                  }
                                                >
                                                  x
                                                </button>
                                              </div>
                                              <div className="modal-body">
                                                <div className="offer-list">
                                                  {selectedRoomOffers.map(
                                                    (rate, idx) => (
                                                      <div
                                                        key={idx}
                                                        className="offer-item"
                                                      >
                                                        <h6>{rate.RateName}</h6>
                                                        <h6>{rate.Meal}</h6>
                                                        <div className="popup-amenity-items py-3">
                                                          {/* <p className="f-12-new">
                                                            {stripHtml(
                                                              rate.RateDescription ||
                                                                ""
                                                            )}
                                                          </p> */}
                                                          <div
                                                            dangerouslySetInnerHTML={{
                                                              __html: rate.RateDescription || "",
                                                            }}
                                                          />
                                                        </div>
                                                        <div className="cancellation-div">
                                                          <h6>
                                                            Cancellation Policy
                                                          </h6>
                                                          <p>
                                                            {
                                                              cancellationPolicyPackage.find(rp => rp?.RateId === rate?.RateId)?.CancellationPolicy?.Description
                                                            }
                                                          </p>
                                                        </div>
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>,
                                        document.body
                                      )}
                                    </div>
                                      ));
                                      })()
                                  ) : (
                                    <p>
                                      No room data available for this property.
                                    </p>
                                  )) : (
                                     <p>No room data available for this property</p>
                                   )}
                                </div>


                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) 
                   :(
                     <div className="no-property">
                       {isSmallScreen && isRateFetched && showDropDown && !isTimeOutInventory && promoError == ""  && !isTimeOutContent.current ? (
                        <><div className="repeated-div-property text-center">
                          <p>Apologies, we couldn’t find any properties matching your search.</p>
                          </div></>)
                          :(<>{!isSmallScreen && isRateFetched && !isTimeOutInventory  && promoError == ""  && !isTimeOutContent.current ? (<div className="repeated-div-property  text-center">
                          <p className="no-property-desktop text-center">Apologies, we couldn’t find any properties matching your search.</p>
                          </div>): (<>{isRateFetched && isTimeOutInventory && promoError == "" || isTimeOutContent.current ? (<div className="repeated-div-property  text-center pb-4">
                          <p className="no-property-desktop  text-center">
                          Property details could not be loaded due to a temporary network issue. Please click below to try again.
                          </p>
                          <button onClick={process.env.NEXT_PUBLIC_STAAH_REDIRECT == "redirect" ? handleSearchTh : handleSearch}> 
                            <span className="this-search-for-desk mt-3 d-inline-block">Try Again</span>
                          </button>
                          </div>) :(<>{isSmallScreen && isRateFetched && showDropDown && !isTimeOutInventory && promoError != "" && !isTimeOutContent.current ? (<div className="repeated-div-property text-center">
                          <p  className="no-property-desktop text-center">{promoError}</p>
                          </div>):(<>{!isSmallScreen && isRateFetched && !isTimeOutInventory  && promoError != "" && !isTimeOutContent.current && <div className="repeated-div-property text-center">
                          <p  className="no-property-desktop text-center">{promoError}</p>
                          </div>}</>)}</>)}</>)}</>)}
                     </div>
                   ) 
                  }
                </div>
              </div>
            </div>
            </>
           
          )}

          {isOpenLogin && (
            <div className="login-pop-up">
              <div className="modal-overlay">
                <div className="modal-content">
                  <button
                    className="modal-close"
                    onClick={() => setIsOpenLogin(false)}
                  >
                    &times;
                  </button>
                  {/* <SignUp onSubmit={handleSignUpSubmit} /> */}
                  <Login onSubmit={handleLoginSubmit} />
                </div>
              </div>
            </div>
          )}

          {isOpenSignUp && (
            <div className="signup-pop-up">
              <div className="modal-overlay">
                <div className="modal-content">
                  <button
                    className="modal-close"
                    onClick={() => setIsOpenSignUp(false)}
                  >
                    &times;
                  </button>
                  <SignUp onSubmit={handleSignUpSubmit} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* <WizardSidebar
        isVisible={isWizardVisible}
        onClose={() => handleWizardClose()}
        status={status}
      /> */}
      {tokenKey ? (<WizardSidebar
        isVisible={isWizardVisible}
        onClose={() => handleWizardClose()}
        status={status}
      />): (
      <CombinedWizardSidebar
        isVisible={isWizardVisible}
        onClose={(id) => {handleWizardClose(), resetRoomSelection(id)}}
        status={status}
        destination={destination}
        
      ></CombinedWizardSidebar>)}
    </>
  );
};

export default FilterBar;
