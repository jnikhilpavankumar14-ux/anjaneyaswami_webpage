export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-saffron mb-8">Privacy Policy</h1>

      <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="text-gray-700 leading-relaxed">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 ml-4">
            <li>Name, email address, and phone number when you create an account</li>
            <li>Donation information including amount and payment details</li>
            <li>Any notes or messages you provide with your donations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 ml-4">
            <li>Process and record your donations</li>
            <li>Generate and send donation receipts</li>
            <li>Communicate with you about your donations</li>
            <li>Improve our services and website</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Payment Information</h2>
          <p className="text-gray-700 leading-relaxed">
            All payment processing is handled by Razorpay, a secure payment gateway. We do not store
            your credit card or bank account details. Payment information is encrypted and processed
            according to PCI DSS standards.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We use Supabase, a secure cloud database service, to store your information. We implement
            appropriate technical and organizational measures to protect your personal data against
            unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
          <p className="text-gray-700 leading-relaxed">
            We retain your donation records and receipts as required by law and for accounting purposes.
            You may request deletion of your account and personal data by contacting us, subject to
            legal and accounting requirements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed">
            You have the right to:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1 ml-4">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data (subject to legal requirements)</li>
            <li>Opt-out of non-essential communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            We use cookies and similar technologies to maintain your session and improve your experience
            on our website. You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Third-Party Services</h2>
          <p className="text-gray-700 leading-relaxed">
            We use third-party services including Supabase (database and authentication), Razorpay
            (payments), and Vercel/Netlify (hosting). These services have their own privacy policies
            governing the use of your information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by
            posting the new policy on this page and updating the &quot;Last Updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-gray-700 leading-relaxed mt-2">
            Email: {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'sriabhayanjaneyaswamytemplegpl@gmail.com'}<br />
            Phone: {process.env.NEXT_PUBLIC_TEMPLE_PHONE || '8885209456'}
          </p>
        </section>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}

