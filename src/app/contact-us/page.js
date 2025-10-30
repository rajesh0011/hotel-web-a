
import "../Styles/inner-hero.css"
import ContactUsClient from './ContactUsClient';


export const metadata = {
  title: 'Hotels and Resorts in India - Amritara Hotels',
  description: 'Amritara Hotels- A group of hotels with the best luxury and heritage hotels and resorts in India. Stay in the best accommodations with all the contemporary amenities. Book now.',
  alternates: {
    canonical: '/contact-us',
  },
};

export default function ContactPage() {
  
  return (
    <>
    <ContactUsClient></ContactUsClient>
    
    </>
  );
}