import { FaFacebookF, FaInstagram } from 'react-icons/fa';

export default function Footer({ id }) {
  return (
    <footer id={id} className="bg-white text-gray-800 px-10 py-24 pb-22 md:pb-15 text-center">
      <div className="flex flex-col items-center justify-center mb-8 space-y-2">
        
        <h3 className="text-2xl font-serif mb-4">Get social</h3>
        <div className="flex space-x-4">
          <a href="https://www.facebook.com/8thfold/" className="text-gray-800 hover:text-[#8a6b41] text-xl">
            <FaFacebookF />
          </a>
          <a href="https://www.instagram.com/explore/locations/110646448513968/eightfold-urban-resort/" className="text-gray-800 hover:text-[#8a6b41] text-xl">
            <FaInstagram />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 text-left gap-12 w-full max-w-6xl mx-auto mt-8 justify-items-center">
        <div className="w-full md:w-auto md:text-left text-center">
          <h4 className="text-lg font-light mb-2 font-serif text-gray-700">Location</h4>
          <p className="text-sm leading-relaxed text-gray-600 font-light">
            Wat Svay, Sala Kamreuk<br />
            171204 SIEM REAP<br />
            Cambodia<br />
            <a href="https://maps.app.goo.gl/mXyjo9GPuDEva8BP7" className="text-[#8a6b41] underline font-light">Get Directions</a>
          </p>
        </div>
        <div className="w-full md:w-auto md:text-left text-center">
          <h4 className="text-lg font-light mb-2 font-serif text-gray-700">Reservation</h4>
          <p className="text-sm leading-relaxed text-gray-600 font-light">
            <a href="tel:+85563964600" className="underline text-[#8a6b41] font-light">Tel: +855 92 500 400</a><br />
            <a href="mailto:h3123@sofitel.com" className="underline text-[#8a6b41] font-light">Mail: eightfoldurban@gmail.com</a>
          </p>
        </div>
        <div className="w-full md:w-auto md:text-left text-center">
          <h4 className="text-lg font-light mb-2 font-serif text-gray-700">Parking</h4>
          <p className="text-sm leading-relaxed text-gray-600 font-light">
            Parking included<br />
            Outdoor parking
          </p>
        </div>
        <div className="w-full md:w-auto md:text-left text-center">
          <h4 className="text-lg font-light mb-2 font-serif text-gray-700">Property</h4>
          <p className="text-sm leading-relaxed text-gray-600 font-light">
            <a href="/policies" className="underline text-[#8a6b41] font-light block mb-1">View Hotel Policies</a>
            <a href="/facilities" className="underline text-[#8a6b41] font-light block">View Hotel Facilities</a>
          </p>
        </div>
      </div>
      <div className="mt-20 md:mt-20 text-sm text-gray-500 font-light text-center">
        © Eightfold Urban Resort<br />2025, Official site
      </div>
    </footer>
  );
}
