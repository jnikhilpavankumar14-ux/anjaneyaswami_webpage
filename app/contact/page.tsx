export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-saffron mb-8 text-center">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Temple Information</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800">Address</h3>
              <p className="text-gray-600">
                Sri Abhayanjaneya Swamy Temple<br />
                Gandlapalli<br />
                {/* Address will be updated from trust documents */}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">Phone</h3>
              <p className="text-gray-600">
                <a href="tel:8885209456" className="hover:text-saffron">
                  {process.env.NEXT_PUBLIC_TEMPLE_PHONE || '8885209456'}
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">Email</h3>
              <p className="text-gray-600">
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'sriabhayanjaneyaswamytemplegpl@gmail.com'}`}
                  className="hover:text-saffron"
                >
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'sriabhayanjaneyaswamytemplegpl@gmail.com'}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Location</h2>
          <div className="w-full h-96 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.1234567890123!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjgiTiA3N8KwMzUnNDAuNiJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Temple Location"
            />
          </div>
          <p className="text-sm text-gray-600 mt-4">
            {/* Update map embed URL with actual temple coordinates */}
            Please update the Google Maps embed URL with the actual temple location coordinates.
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Trustees</h2>
        <p className="text-gray-600">
          Trustee information will be updated from trust documents.
        </p>
      </div>
    </div>
  )
}

