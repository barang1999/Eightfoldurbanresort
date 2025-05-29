import React from 'react';
// src/components/FacilityInfoSection.jsx
export default function FacilityInfoSection({
  hours = '',
  contact = '',
  buttonLabel = 'Learn More',
  onClick = () => {},
  imageUrl = '',
  altText = '',
  hideSecondaryButton = false,
}) {
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-screen-md mx-auto flex flex-col-reverse md:grid md:grid-cols-2 gap-10 items-center">
        <div className="text-center md:text-left">
          {hours && (
            <div className="mb-2 mt-5 text-gray-800 font-light text-base whitespace-pre-line">
              {Array.isArray(hours) ? (
                <div className="grid grid-cols-[max-content_auto] gap-x-2 gap-y-1 leading-relaxed">
                  {hours.map((line, idx) => {
                    const [day, time] = line.split(' : ');
                    return (
                      <React.Fragment key={idx}>
                        <div className="min-w-[50px] text-right pr-2 font-medium">{day}</div>
                        <div>: {time}</div>
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <pre className="whitespace-pre-line">{hours}</pre>
              )}
            </div>
          )}
          {contact && (
            <p className="font-light text-gray-800 text-base mb-6">
              <span className="font-medium font-light">Booking:</span> {contact}
            </p>
          )}
          {!hideSecondaryButton && (
            <button
              onClick={onClick}
              className="border border-black px-6 py-3 text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-200"
            >
              {buttonLabel}
            </button>
          )}
        </div>
        {imageUrl && (
          <div>
            <img src={imageUrl} alt={altText} className="rounded shadow-md w-full" />
          </div>
        )}
      </div>
    </section>
  );
}