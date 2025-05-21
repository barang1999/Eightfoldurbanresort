// src/components/MapEmbed.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MapEmbed({ propertyId, id }) {
  const [mapSrc, setMapSrc] = useState('');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_ADMIN_API_URL}/api/property?propertyId=${propertyId}`)
      .then(res => {
        const embedHTML = res.data.googleMapEmbed || '';
        const match = embedHTML.match(/src="([^"]+)"/);
        const extractedSrc = match ? match[1] : '';
        console.log('📍 Extracted Map src:', extractedSrc);
        setMapSrc(extractedSrc);
      })
      .catch(err => {
        console.error('❌ Failed to fetch property embed map:', err);
      });
  }, [propertyId]);

  return (
    <section id={id} className="w-full pt-0 scroll-mt-48">
      <div className="w-full h-[600px]">
        {mapSrc ? (
          <iframe
            src={mapSrc}
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full border-0"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Map is loading or unavailable
          </div>
        )}
      </div>
    </section>
  );
}