import Link from "next/link";
import style from "./footer.module.css";
import Image from "next/image";
import { MessageCircleCode, FacebookIcon, InstagramIcon, TwitterIcon, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <>
      <footer className={`${style.footer} footer footer-section`}>
        <div className="container">
         
          <div className="row">
            <div className="col-md-12">
               <Link className={style.footerLogoD} href="/" >
                <Image src="/img/amritara-footer-logo.png" alt="Amritara Logo" width={600} height={600} className="footer-logo" />
              </Link>
           <div className="top-inline-list py-2">
            <ul className="list-inline mb-0">
              <li className="list-inline-item me-0">
                <Link href="/about-us" className={style.linkstyle}>
                  About Us
                </Link>
              </li>
              <span className="mx-1">|</span>
              <li className="list-inline-item me-0">
                <Link href="/careers" className={style.linkstyle}>
                  Careers
                </Link>
              </li>
              <span className="mx-1">|</span>
              <li className="list-inline-item me-0">
                <Link href="/term-and-condition" className={style.linkstyle}>
                  Terms & Conditions
                </Link>
              </li>
              <span className="mx-1">|</span>
              <li className="list-inline-item me-0">
                <Link href="/privacy-policy" className={style.linkstyle}>
                  Privacy Policy
                </Link>
              </li>
              <span className="mx-1">|</span>
              <li className="list-inline-item me-0">
                <Link href="#" className={style.linkstyle}>
                  Sitemap
                </Link>
              </li>
              <span className="mx-1">|</span>
              <li className="list-inline-item me-0">
                <Link href="/blog" className={style.linkstyle}>
                  Blog
                </Link>
              </li>
            </ul>
          </div>
             {/* <Image src="/img/phoneimg.png" alt="Amritara Call" width={200} height={200} className={style.footerLogo} /> */}
               <p className="footer-contact mb-0 pb-0">
                    <Link href="mailto:reservations@amritara.co.in" className={style.linkstyle2}>
                     Email:- <span>reservations@amritara.co.in</span>
                    </Link>
                    <span className="line-footer">|</span>
                    <Link href="tel:011-40752200" className={style.linkstyle2}>
                      Phone:- 011-40752200
                    </Link>
                    <span className="line-footer">|</span>
                     <Link href="tel:+91-9319296392" className={style.linkstyle2}>
                      Wedding & Events:- +91-9319296392
                    </Link>
                </p>

                 <p className="footer-contact mt-0 pt-0">
                    <Link href="#" className={style.linkstyle2}>
                     Address:- <span className="footer-address">Kausalya Park, Block L1, Padmini Enclave, Hauz Khas, New Delhi, Delhi 110016</span>
                    </Link>
                </p>
                {/* <p className={style.fcoldata}>
                    <Link href="tel:011-40752200" className={style.linkstyle2}>
                      <Phone size={20} strokeWidth={1.5} color="#000" /> 011-40752200
                    </Link>
                </p> */}

                 <div className="mt-3">
                    <h5 className={`${style.footerHeadingR} text-uppercase`}>Connect with us </h5>
                    <div className={`${style.SocialLinkFooter} justify-content-center mb-0`}>
                        <Link href="https://www.facebook.com/amritararesorts/" target="_blank" className={style.socialLink} title="Facebook">
                            <FacebookIcon size={24} className={style.socialIcon} />
                        </Link>
                        <Link href="https://wa.me/+919319296390?text=Hi Amritara Hotels And Resorts." target="_blank" className={style.socialLink} title="Whatsapp">
                            <MessageCircleCode size={24} className={style.socialIcon} />
                        </Link>
                        <Link href="https://twitter.com/amritararesorts" target="_blank" className={style.socialLink} title="Twitter">
                            <TwitterIcon size={24} className={style.socialIcon} />
                        </Link>
                        <Link href="https://www.instagram.com/amritarahotelsandresorts/" target="_blank" className={style.socialLink} title="Instagram">
                            <InstagramIcon size={24} className={style.socialIcon} />
                        </Link>
                    </div>
                    {/* <div className={style.GetLatestUpdate}>
                        <h5 className={`${style.footerHeading2} text-uppercase`}>Get latest updates</h5>
                        <form className={style.footerForm}>
                            <div className={`{style.footerInputContainer} mb-1`}>
                                <input type="email" placeholder="Enter your Email ID" className={style.footerInput} />
                                <button type="submit" className={style.footerSButton}>Submit</button>
                            </div>
                            <input type="checkbox" className={style.footerCheckbox} />
                            <span className={style.fCheckText}>Agree to Subscribe newsletter</span>
                        </form>
                    </div> */}
                
              </div>
                
            </div>
          
          </div>
          <div className="footer-bottom text-center mt-2">
           Copyright &copy; {new Date().getFullYear()}, Amritara Hotels and Resorts. All rights reserved. Powered by&nbsp;
            <Link href="https://www.cinuniverse.com/" target="_blank">
               CIN Universe.
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
