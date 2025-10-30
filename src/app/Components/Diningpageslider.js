'use client';
import React, { useMemo, useState } from 'react';

export default function Diningpageslider({ dineData = [], cityId = '', propertyId = '' }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [enquiryHotel, setEnquiryHotel] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');

  // Transform API dine data into UI-friendly format
  const allHotels = dineData.map((item) => ({
    img: item?.dineImages?.[0]?.dineImage || '/images/room/default.jpg',
    title: item?.dineName || 'Untitled',
    text: item?.dineDesc || '',
    ohrs: item?.openingHours || '',
    chrs: item?.closingHours || '',
    city: '',
    category: '',
    price: '',
  }));

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredHotels = allHotels.filter((hotel) => {
    const matchCity = hotel.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory ? hotel.category === selectedCategory : true;
    return matchCity && matchCategory;
  });

  const [form, setForm] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',   // digits only
    date: '',
    guests: '',  // keep string for control
    message: '',
  });
  const [errors, setErrors] = useState({});

  // Utils
  const stripHtml = (html) => html.replace(/<[^>]+>/g, '');

  // today string for date min
  const todayStr = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);

  const isDateTodayOrFuture = (val) => !!val && val >= todayStr;
  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).trim());
  const validatePhone = (val) => /^\d{10}$/.test(String(val));
  const validateGuests = (val) => {
    if (val === '') return false;
    const n = Number(val);
    return Number.isInteger(n) && n >= 1 && n <= 999;
  };

  const validateField = (name, value) => {
    let msg = '';
    switch (name) {
      case 'fname':
      case 'lname':
        if (!String(value).trim()) msg = 'This field is required.';
        break;
      case 'email':
        if (!validateEmail(value)) msg = 'Enter a valid email.';
        break;
      case 'phone':
        if (!validatePhone(value)) msg = 'Enter a 10-digit mobile number.';
        break;
      case 'date':
        if (!isDateTodayOrFuture(value)) msg = 'Choose today or a future date.';
        break;
      case 'guests':
        if (!validateGuests(value)) msg = 'Guests must be 1 to 999.';
        break;
      case 'message':
        if (!String(value).trim()) msg = 'This field is required.';
        break;
      default:
        break;
    }
    return msg;
  };

  const formIsValid = () => {
    const next = {};
    Object.entries(form).forEach(([k, v]) => {
      const m = validateField(k, v);
      if (m) next[k] = m;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleOpenModal = (hotel) => {
    setEnquiryHotel(hotel);
    setShowModal(true);
    setNotice('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm({ fname: '', lname: '', email: '', phone: '', date: '', guests: '', message: '' });
    setErrors({});
    setEnquiryHotel(null);
    setNotice('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const msg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleFormChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10); // digits only, max 10
    }
    if (name === 'guests') {
      value = value.replace(/\D/g, '');
      if (value !== '') {
        value = String(parseInt(value, 10));
        if (isNaN(Number(value))) value = '';
      }
      if (value) {
        let n = Number(value);
        if (n < 1) n = 1;
        if (n > 999) n = 999;
        value = String(n);
      }
    }

    setForm({ ...form, [name]: value });
    const msg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const blockNonNumeric = (e) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice('');

    if (!formIsValid()) return;

    const base = process.env.NEXT_PUBLIC_CMS_API_Base_URL; // set this per project
    if (!base) {
      setNotice('Configuration error: NEXT_PUBLIC_CMS_BASE_URL is not set.');
      return;
    }

    // Build payload (same mapping you used earlier)
    const payload = {
      cityId: String(cityId || ''),
      propertyId: String(propertyId || ''),
      firstName: form.fname.trim(),
      lastName: form.lname.trim(),
      mobileNo: form.phone.trim(),
      email: form.email.trim(),
      eventDate: form.date,              // YYYY-MM-DD
      eventType: 'Dining',
      roomsRequired: false,
      noOfRooms: '0',
      noOfGuests: String(form.guests || '0'),
      checkIn: String(form.date || ''),
      checkOut: String(form.date || ''),
      requestFrom: 'Dining',
      remarks: form.message || 'Dining',
      remarks1: enquiryHotel?.title || '',
      remarks2: '',
    };

    try {
      setSubmitting(true);

      const res = await fetch(`${base}/common/EnquireNow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await res.clone().json();
      } catch (_) {}

      if (!res.ok) {
        const msg = data?.message || data?.error || `HTTP ${res.status}`;
        setNotice(`Failed to submit: ${msg}`);
        return;
      }

      if (data && typeof data === 'object' && 'errorCode' in data && String(data.errorCode) !== '0') {
        setNotice(data.errorMessage || 'Something went wrong.');
        return;
      }

      setNotice('Your booking enquiry has been submitted successfully.');
      setForm({ fname: '', lname: '', email: '', phone: '', date: '', guests: '', message: '' });
      setTimeout(handleCloseModal, 1200);
    } catch (err) {
      setNotice('Failed to send enquiry. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="property-inner-zigzag-section">
        <div className="container pushed-wrapper">
          {filteredHotels.map((hotel, index) => {
            const cleanText = stripHtml(hotel.text);
            return (
              <div className="row align-items-center position-relative mb-4" key={index}>
                <div
                  className="col-md-12"
                  style={{
                    backgroundImage: `url("${encodeURI(hotel.img || '/amritara-dummy-room.jpeg')}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '320px',
                    backgroundColor: '#f0f0f0',
                  }}
                />
                <div className="col-md-12">
                  <div className="pushed-header text-center">
                    <span className="header-1 mt-3">{hotel.title}</span>
                    <span className="display-block d-flex align-content-center justify-content-center mt-2">
                      {cleanText.length > 70 ? (
                        <>
                          {expandedIndex === index ? cleanText : cleanText}
                          {/* <span
                            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                            style={{cursor: 'pointer', color: '#000', fontWeight: '600' }}
                          >
                            {expandedIndex === index ? ' ❮❮' : ' ❯❯'}
                          </span> */}
                        </>
                      ) : (
                        cleanText
                      )}
                    </span>
                    <div className="inline-flex mt-3 gap-2">
                      <button className="box-btn book-now" onClick={() => handleOpenModal(hotel)}>
                        Book a Table
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredHotels.length === 0 && (
            <div className="text-center text-gray-500 mt-10">No hotels match your filters.</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content p-1">
              <div className="modal-header">
                {/* <h1>property id :{propertyId}</h1>
                <h1>city id :{cityId}</h1> */}
                <h5 className="modal-title">Enquiry for {enquiryHotel?.title}</h5>
                <button type="button" className="btn-close close-popup" aria-label="Close" onClick={handleCloseModal}>
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} noValidate>
                <div className="modal-body p-2">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3 form-group">
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          name="fname"
                          className={`form-control ${errors.fname ? 'is-invalid' : ''}`}
                          value={form.fname}
                          onChange={handleFormChange}
                          onBlur={handleBlur}
                          required
                        />
                        {errors.fname && <div className="error">{errors.fname}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3 form-group">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          name="lname"
                          className={`form-control ${errors.lname ? 'is-invalid' : ''}`}
                          value={form.lname}
                          onChange={handleFormChange}
                          onBlur={handleBlur}
                          required
                        />
                        {errors.lname && <div className="error">{errors.lname}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3 form-group">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          name="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          value={form.email}
                          onChange={handleFormChange}
                          onBlur={handleBlur}
                          required
                        />
                        {errors.email && <div className="error">{errors.email}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3 form-group">
                        <label className="form-label">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          inputMode="numeric"
                          pattern="\d{10}"
                          maxLength={10}
                          minLength={10}
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          value={form.phone}
                          onChange={handleFormChange}
                          onBlur={handleBlur}
                          required
                        />
                        {errors.phone && <div className="error">{errors.phone}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3 form-group">
                        <label className="form-label">Date</label>
                        <input
                          type="date"
                          name="date"
                          className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                          value={form.date}
                          onChange={handleFormChange}
                          onBlur={handleBlur}
                          min={todayStr}
                          required
                        />
                        {errors.date && <div className="error">{errors.date}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3 form-group">
                        <label className="form-label">No. of Guests</label>
                        <input
                          type="number"
                          name="guests"
                          className={`form-control ${errors.guests ? 'is-invalid' : ''}`}
                          value={form.guests}
                          onChange={handleFormChange}
                          onBlur={handleBlur}
                          onKeyDown={blockNonNumeric}
                          min={1}
                          max={999}
                          required
                        />
                        {errors.guests && <div className="error">{errors.guests}</div>}
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="mb-0 form-group">
                        <label className="form-label">Message</label>
                        <textarea
                          name="message"
                          className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                          value={form.message}
                          onChange={handleFormChange}
                          onBlur={handleBlur}
                          rows={2}
                          required
                        />
                        {errors.message && <div className="error">{errors.message}</div>}
                      </div>
                    </div>
                  </div>

                  {notice && (
                    <p className="mt-2" style={{ color: notice.startsWith('Failed') || notice.startsWith('Configuration') ? '#d00' : 'green' }}>
                      {notice}
                    </p>
                  )}
                </div>
                <div className="text-center mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary submit-btn"
                    disabled={
                      submitting ||
                      Object.values(errors).some(Boolean) ||
                      !form.fname ||
                      !form.lname ||
                      !form.email ||
                      !form.phone ||
                      !form.date ||
                      !form.guests ||
                      !form.message
                    }
                  >
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}

      <style jsx>{`
        .modal-content { border-bottom: 5px solid #000; }
        .close-popup {
          position: absolute; right: 10px; top: 10px; border: none; background: none;
          font-size: 1.7rem; cursor: pointer; color: #fff; line-height: 1rem; padding: 0;
          opacity: 1; background-color: #000;
        }
        .error { color: red; font-size: 0.8rem; margin-top: 0.2rem; }
        .is-invalid { border-color: #d00 !important; }
        .submit-btn { font-size: 14px; border-radius: 0; background: var(--primary-color);
          padding: 7px 10px; border: none; color: #fff; cursor: pointer; text-transform: uppercase; }
        .submit-btn[disabled] { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </>
  );
}
