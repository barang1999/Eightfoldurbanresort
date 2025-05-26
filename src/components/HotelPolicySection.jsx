import React, { useEffect, useState } from 'react';

// Reusable key-value line display
const PolicyItem = ({ title, content }) => (
  <div className="flex justify-between items-start py-2 border-b border-gray-200">
    <span className="font-medium text-gray-800">{title}</span>
    <span className="text-gray-600 text-right max-w-sm">{content}</span>
  </div>
);

// HotelPolicySection: displays hotel policies in a clean 2-column layout
const HotelPolicySection = ({ propertyId }) => {
  const [policy, setPolicy] = useState(null);

  // Fetch hotel policy data from backend
  useEffect(() => {
    if (!propertyId) return;

    const fetchPolicy = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_ADMIN_API_URL}/api/policy/${propertyId}`);
        const data = await res.json();
        setPolicy(data);
      } catch (err) {
        console.error("❌ Failed to fetch hotel policy:", err);
      }
    };

    fetchPolicy();
  }, [propertyId]);

  if (!policy) return null;

  return (
    <section className="py-12 bg-gray-50">
      {/* Section header */}
      <h2 className="text-2xl font-semibold text-center mb-8">Hotel Policies</h2>

      {/* Policy list layout */}
      <div className="max-w-4xl mx-auto px-6 space-y-4">
        <PolicyItem title="Check-in / Check-out" content={`${policy.checkIn || 'N/A'} - ${policy.checkOut || 'N/A'}`} />
        <PolicyItem
          title="Cancellation"
          content={
            policy.cancellationPolicy?.cancellationAllowed
              ? `Allowed with ${policy.cancellationPolicy.cancellationNoticeDays} days notice`
              : 'Not allowed'
          }
        />
        <PolicyItem
          title="Children & Beds"
          content={`Children: ${policy.childrenAndBeds?.childrenAllowed ? 'Allowed' : 'Not allowed'}, 
          Cribs: ${policy.childrenAndBeds?.cribAvailable ? `$${policy.childrenAndBeds.cribPrice}` : 'Not available'}, 
          Extra Bed: ${policy.childrenAndBeds?.extraBedAvailable ? `$${policy.childrenAndBeds.extraBedPrice}` : 'Not available'}`}
        />
        <PolicyItem title="Pets" content={policy.petsPolicy || 'Not specified'} />
        <PolicyItem
          title="Age Restriction"
          content={
            policy.ageRestriction?.required
              ? `Minimum age: ${policy.ageRestriction.minimumAge}`
              : 'No age restriction'
          }
        />
        <PolicyItem
          title="Smoking"
          content={policy.smokingPolicy?.allowed ? 'Allowed' : `Not allowed (${policy.smokingPolicy?.notes || ''})`}
        />
        <PolicyItem
          title="Damage Deposit"
          content={
            policy.damageDeposit?.required
              ? `Required: $${policy.damageDeposit.amount} (Refund via ${policy.damageDeposit.refundMethod})`
              : 'Not required'
          }
        />
        <PolicyItem
          title="Quiet Hours"
          content={
            policy.quietHours?.enabled
              ? `${policy.quietHours.start} - ${policy.quietHours.end}`
              : 'Not enforced'
          }
        />
        <PolicyItem
          title="Parties"
          content={policy.partyPolicy?.allowed ? 'Allowed' : `Not allowed (${policy.partyPolicy?.notes || ''})`}
        />
        <PolicyItem
          title="Internet"
          content={
            policy.internet?.available
              ? `${policy.internet.coverage} (${policy.internet.isFree ? 'Free' : 'Paid'})`
              : 'Not available'
          }
        />
        <PolicyItem
          title="Parking"
          content={
            policy.parking?.available
              ? `${policy.parking.type} parking ${policy.parking.requiresReservation ? '(Reservation needed)' : ''} ${policy.parking.isFree ? '(Free)' : ''}`
              : 'No parking available'
          }
        />
        <PolicyItem
          title="Payment Methods"
          content={policy.paymentMethods?.length ? policy.paymentMethods.join(', ') : 'Not specified'}
        />
        <PolicyItem
          title="VAT"
          content={policy.vat?.enabled ? `${policy.vat.percentage}% included` : 'Not applicable'}
        />
      </div>
    </section>
  );
};

export default HotelPolicySection;