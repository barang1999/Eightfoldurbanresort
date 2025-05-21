export default function ContactInfoBlock({ address, phone, email, hours }) {
  return (
    <div className="bg-white border-t pt-10 pb-16 px-6 text-sm text-gray-700 max-w-screen-md mx-auto space-y-4">
      {address && (
        <div>
          <h4 className="font-semibold text-gray-800">Address</h4>
          <p>{address}</p>
        </div>
      )}
      {phone && (
        <div>
          <h4 className="font-semibold text-gray-800">Phone</h4>
          <p>{phone}</p>
        </div>
      )}
      {email && (
        <div>
          <h4 className="font-semibold text-gray-800">Email</h4>
          <p>{email}</p>
        </div>
      )}
      {hours && (
        <div>
          <h4 className="font-semibold text-gray-800">Opening Hours</h4>
          <p>{hours}</p>
        </div>
      )}
    </div>
  );
}