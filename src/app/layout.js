import { Elsie, Montserrat } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../app/Styles/custom.css'
import '../app/Styles/header.css'
import '../app/Styles/HeaderStyle.css'
import '../app/Styles/inner-hero.css'
import '../app/Styles/style.css'
import '../app/Styles/styleblog.css'

import '../app/Styles/responsive.css'


import Footer from './Common/Footer';
import { AuthProvider } from '@/context/AuthContext';
import '../app/Styles/globals.css'
import "./globals.css"
import { FormProvider } from './booking-engine-widget/FormContext';
// import VisitTracker from './Common/VisitTracker';

const elsie = Elsie({
  weight: ['400', '900'],
  subsets: ['latin'],
  variable: '--font-elsie',
  display: 'swap',
});

const montserrat = Montserrat({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata = {
  title: 'Hotels and Resorts in India - Amritara Hotels',
  description: 'Amritara Hotels- A group of hotels with the best luxury and heritage hotels and resorts in India. Stay in the best accommodations with all the contemporary amenities. Book now.',
};

const GTM_ID = 'GTM-P422PMQ';

export default async function RootLayout({ children }) {
  
const cityRes = await fetch(
    `${process.env.NEXT_PUBLIC_CMS_BASE_URL_AMR}/cmsapi/property/GetCityWithProperty`,
    { cache: "force-cache" }
  );
  const res = await cityRes.json();
  //console.log("CityApi Resp", res);
  const cityDropDown =
    res?.data?.map((p) => 
      ({ label: p.cityName, 
      value: p.cityId, 
      propertyData:p.propertyData})) || [];
      
      const properties = res.data.flatMap(city => 
        city.propertyData.map(property => ({
          ...property,
          cityId: city.cityId, // keep reference to city
        }))
      );
  return (
    <html lang="en" className={`${elsie.variable} ${montserrat.variable}`}>
      <head>
        {/* ✅ GTM in server-rendered head */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
        
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>

<noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
height="0" width="0" style={{display:"none", visibility:'hidden'}}></iframe></noscript>


        <FormProvider cityDropDown={cityDropDown} properties={properties}>
        <AuthProvider>
        {/* <VisitTracker /> */}
          {children}
        </AuthProvider>
        </FormProvider>
        <Footer />
      </body>
    </html>
  );
}
