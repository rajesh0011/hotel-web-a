import React from 'react'

import Link from "next/link";
import Image from "next/image";

import { Facebook, FacebookIcon, Instagram, InstagramIcon, Linkedin, Tally2, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const AsideFixed = () => {
  return (
    <>
    <div className="aside-fixed-logo-strip">
          <div className="aside-fixed-box">
            {/* <Image
              src="/img/logo.png"
              className="header-logo"
              alt="Amritara Hotels And Resorts"
              width={300}
              height={200}
            /> */}
            
            {/* <div className='unforgettable-baner'>
                <div className='linee'></div>
                <h5 className='unforgettable-text'>Unforgettable Experience</h5>
            </div> */}

            <div className="vertical-container">
                <div className="vertical-line"></div>
    <div className="vertical-text">Unforgettable Experience</div>
    <div className="vertical-line"></div>
  </div>
            <div className="aside-social-icons">
              <div className="aside-icon-list">
                <Link href="https://www.facebook.com/amritararesorts/" target="_blank" rel="noopener noreferrer">
                  <FacebookIcon></FacebookIcon>
                </Link>
                <Link href="https://www.instagram.com/amritarahotelsandresorts/" target="_blank" rel="noopener noreferrer">
                  <InstagramIcon></InstagramIcon>
                </Link>
                {/* <Link href="https://www.linkedin.com/company/amritara-hotels-and-resorts/" target="_blank" rel="noopener noreferrer">
                  <Linkedin></Linkedin>
                </Link> */}
                <Link href="https://wa.me/+919319296390?text=Hi Amritara Hotels And Resorts." target="_blank" rel="noopener noreferrer">
                <FaWhatsapp></FaWhatsapp>
                </Link>
              </div>
              
            </div>
          </div>
        </div>
    </>
  )
}

export default AsideFixed