"use client";
import { Mail, MapPinned, PhoneCall } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

const ContactUsMain = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  // ✅ Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // ✅ Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit number";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setResponseMsg("");

    const payload = {
      cityId: "",
      propertyId: "",
      firstName: formData.name,
      lastName: "",
      mobileNo: formData.phone,
      email: formData.email,
      eventDate: "",
      eventType: "Contact",
      roomsRequired: false,
      noOfRooms: "0",
      noOfGuests: "0",
      checkIn: "",
      checkOut: "",
      requestFrom: "Contact Page",
      remarks: formData.message,
      remarks1: formData.subject,
      remarks2: "",
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CMS_API_Base_URL}/common/EnquireNow`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      let data = null;
      try {
        data = await res.clone().json();
      } catch { }

      if (!res.ok) {
        const msg = data?.message || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      if (data?.errorCode && String(data.errorCode) !== "0") {
        throw new Error(data.errorMessage || "Something went wrong");
      }

      toast.success("Your enquiry has been submitted successfully!");
      setResponseMsg("Enquiry submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send enquiry. Please try again later.");
      setResponseMsg("Failed to send enquiry. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-us-2 contact-us-main">
      <div className="container contact-us-main-form">
        <div className="row justify-content-center">
          <div className="col-md-12 mb-4">
            <form onSubmit={handleSubmit} className="Query-form-fields" noValidate>
              {/* ===== FORM FIELDS ===== */}
              <div className="row">
                <div className="col-lg-6 mb-3">
                  <input
                    type="text"
                    name="name"
                    maxLength={30}
                    placeholder="Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  />
                  {errors.name && <small className="text-danger">{errors.name}</small>}
                </div>

                <div className="col-lg-6 mb-3">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    maxLength={100}
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  />
                  {errors.email && <small className="text-danger">{errors.email}</small>}
                </div>

                <div className="col-lg-6 mb-3">
                  <input
                    type="tel"
                    maxLength={10}
                    name="phone"
                    placeholder="Phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  />
                  {errors.phone && <small className="text-danger">{errors.phone}</small>}
                </div>

                <div className="col-lg-6 mb-3">
                  <input
                    type="text"
                    name="subject"
                    maxLength={50}
                    placeholder="Subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                  />
                  {errors.subject && (
                    <small className="text-danger">{errors.subject}</small>
                  )}
                </div>

                <div className="col-lg-12 mb-3">
                  <textarea
                    name="message"
                    placeholder="Message"
                    maxLength={500}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className={`form-control ${errors.message ? "is-invalid" : ""}`}
                  />
                  {errors.message && (
                    <small className="text-danger">{errors.message}</small>
                  )}
                </div>
              </div>

              {/* ===== SUBMIT BUTTON ===== */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary contact-submit mt-3"
                >
                  {loading ? "Processing..." : "Submit"}
                </button>

                {responseMsg && (
                  <p className="mt-2 text-success fw-bold">{responseMsg}</p>
                )}
              </div>
            </form>
          </div>
        </div>

        <style jsx>{`
                    input,textarea{

                    border: 1px solid #ddd;
                    border-radius: 0px;
                    }
                    input:focus,textarea:focus{
                    box-shadow: none;

                    }
                    .contact-submit{
                    letter-spacing: 2px;
                    font-size: 14px;
                    font-weight: 600;
                    padding: 7px 20px;
                    text-transform: uppercase;
                    border-radius: 0px;
                    
                    }
                    .box-d-flex {
                    display: flex;
                    gap: 10px;

                }
                    .address-contact {
                        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
                        padding: 1.5rem 1rem;
                        margin-bottom: .5rem;
                    }
                       .address-contact .box-d-flex p{
                       margin-bottom: 0;
                       }
                       .map-iframe{
                       filter:grayscale(1) opacity(0.9);
                       }
                       .inner-head-title{
                       font-size: 20px;
                       }


                `}</style>
        {/* ===== CONTACT DETAILS + MAP ===== */}
        <div className="row mb-3 mt-4">
          <div className="col-lg-6 col-md-6">
            <div className="address-contact mb-3">
              <h3 className="inner-head-title">Address</h3>
              <div className="box-d-flex">
                <MapPinned />
                <p>
                  <Link
                    href="https://maps.app.goo.gl/tAZTrh2Hvv7YhEBE8"
                    target="_blank"
                  >
                    Kausalya Park, Block L1, Padmini Enclave, Hauz Khas,
                    New Delhi, Delhi 110016
                  </Link>
                </p>
              </div>
            </div>

            <div className="address-contact mb-3">
              <h3 className="inner-head-title">Phone</h3>
              <div className="box-d-flex">
                <PhoneCall />
                <p>
                  <Link href="tel:01140752200">011 4075 2200</Link>
                </p>
              </div>
            </div>

            <div className="address-contact mb-3">
              <h3 className="inner-head-title">Email</h3>
              <div className="box-d-flex">
                <Mail />
                <p>
                  <Link href="mailto:reservations@amritara.co.in">
                    reservations@amritara.co.in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6">
            <iframe
              className="map-iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.796479986025!2d77.20158805421443!3d28.545836415441816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1bf8e2340a6f%3A0x2bb9cba86c44b4e1!2sAmritara%20Hotels%20%26%20Resorts%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1750839896235!5m2!1sen!2sin"
              width="100%"
              height="350"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUsMain;
