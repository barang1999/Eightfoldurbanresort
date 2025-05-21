import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FacilityPage from '../components/FacilityPage';
import FacilityInfoSection from '../components/FacilityInfoSection';
import BookingForm from '../components/BookingForm';
import RestaurantShowcase from '../components/RestaurantShowcase';

// Use public path strings for images
const restaurant1 = '/restaurant1.jpg';
const restaurant2 = '/restaurant2.jpg';
const restaurant3 = '/restaurant3.jpg';
const restaurant4 = '/restaurant4.jpg';

const RestaurantName = "Sankya";

const propertyId = '6803cba3dadf9a0d829427fe';
const fetchUrl = `${import.meta.env.VITE_ADMIN_API_URL}/api/restaurants?propertyId=${propertyId}`;


export default function SankyaPage() {
  const [showModal, setShowModal] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null);
  const subtitle = restaurantData?.subtitle || "Elegant Dining, Local Charm.";

  useEffect(() => {
    fetch(fetchUrl)
      .then(res => res.json())
      .then(data => {
        const matched = Array.isArray(data) ? data.find(r => r.name.toLowerCase() === RestaurantName.toLowerCase()) : null;
        setRestaurantData(matched);
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-white"
    >
      <>
        <FacilityPage
          title={RestaurantName}
          subtitle={subtitle}
          heroImage={restaurant1}
          extraTopElement={
            <div className="flex justify-center mt-6 mb-[-70px]">
              <svg
                fill="#826845"
                className="w-12 h-12 opacity-80"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 511.999 511.999"
                xmlSpace="preserve"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier"> <g> <g> <path d="M256.747,86.809C149.033,86.809,61.4,174.442,61.4,282.156c0,107.715,87.633,195.348,195.347,195.348 c107.715,0,195.347-87.633,195.347-195.348C452.094,174.441,364.462,86.809,256.747,86.809z M256.747,462.295 c-99.328,0-180.138-80.81-180.138-180.139s80.81-180.138,180.138-180.138c99.329,0,180.138,80.809,180.138,180.138 S356.076,462.295,256.747,462.295z"></path> </g> </g> <g> <g> <path d="M256.748,155.943c-69.594,0-126.214,56.619-126.214,126.213c0,11.232,1.478,22.375,4.392,33.119l14.678-3.983 c-2.564-9.445-3.863-19.249-3.863-29.137c0-61.208,49.797-111.004,111.005-111.004c17.825,0,34.844,4.093,50.584,12.167 l6.941-13.534C296.364,160.6,277.01,155.943,256.748,155.943z"></path> </g> </g> <g> <g> <path d="M156.761,330.436l-13.691,6.624c7.979,16.492,19.726,31.348,33.97,42.961l9.611-11.787 C174.116,358.013,163.78,344.943,156.761,330.436z"></path> </g> </g> <g> <g> <path d="M333.721,182.124l-9.282,12.046c27.526,21.212,43.314,53.281,43.314,87.984c0,61.208-49.797,111.005-111.005,111.005 c-21.791,0-42.88-6.309-60.991-18.241l-8.368,12.699c20.602,13.575,44.585,20.751,69.359,20.751 c69.595,0,126.214-56.619,126.214-126.214C382.961,242.698,365.013,206.238,333.721,182.124z"></path> </g> </g> <g> <g> <path d="M63.945,48.058v88.065H47.181V48.058H31.972v88.065H15.209V48.058H0v88.065v13.111v2.098h0.057 c0.96,18.283,14.386,33.312,31.916,36.738v281.83h15.209V188.07c17.529-3.427,30.955-18.455,31.916-36.739h0.057v-2.098v-13.111 V48.058H63.945z M39.577,173.601c-12.73,0-23.211-9.813-24.278-22.27h48.557C62.787,163.788,52.306,173.601,39.577,173.601z"></path> </g> </g> <g> <g> <path d="M499.327,42.243c-22.486,13.731-36.456,38.628-36.456,64.975V273.63h33.919v196.269h15.209v-196.27v-92.423V34.496 L499.327,42.243z M496.791,181.205v77.215h-18.711V107.217c0-16.624,6.948-32.525,18.711-43.896V181.205z"></path> </g> </g> </g>
              </svg>
            </div>
          }
          descriptionText={restaurantData?.about || ''}
          infoSectionProps={{
            hours: restaurantData?.openingHours?.length
            ? restaurantData.openingHours.map(day =>
                `${day.dayOfWeek} : ${day.slots?.map(slot => `${slot.start} - ${slot.end}`).join(' | ') || `${day.open} - ${day.close}`}`
              )
            : '',
            contact: restaurantData?.bookingContact || '',
            buttonLabel: "Book a Table",
            onClick: () => setShowBookingForm(true),
            imageUrl: "/restaurant5.jpg",
            altText: "Sankya Restaurant",
          }}
          infoModalData={["Open Daily: 11:00 AM - 11:00 PM"]}
          infoModalDescription="Indulge in a culinary journey at Sankya, where local flavors meet elegance. Our restaurant is open daily from 11:00 AM to 11:00 PM, offering a delightful dining experience that captures the essence of our vibrant culture."
          slideshowImages={restaurantData?.photos}
          fetchUrl={fetchUrl}
          infoModalTitle="Menu"
          ctaLabel="Menu"
          dataSelector={data => {
            console.log('Fetched data:', data);
            const matched = Array.isArray(data) ? data.find(r => r.name.toLowerCase() === RestaurantName.toLowerCase()) : null;
            if (!matched || !Array.isArray(matched.menu)) return [];
            return matched.menu.map(item => ({
              label: item?.name || item?.title || item?.typeOfMassage || '',
              value: item?.price || item?.cost || item?.rate || '',
            }));
          }}
        />
        {showBookingForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <BookingForm
              onClose={() => setShowBookingForm(false)}
              title={RestaurantName} // ✅ Passed here
              onSubmit={(data) => {
                console.log("Booking data submitted:", data);
                // You can add API call here later
              }}
            />
          </div>
        )}

        <div className="mt-auto">
                <section className="bg-white py-16 px-4 md:px-10">
                  <h2 className="text-2xl text-center font-light mb-4">More Dining Options</h2>
                  <RestaurantShowcase propertyId="6803cba3dadf9a0d829427fe" />
                </section>
              </div>
      </>
    </motion.div>
  );
}