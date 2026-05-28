import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        We respect your privacy and protect your personal information.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Name, phone number, email</li>
        <li>Shipping and billing address</li>
        <li>Payment and order details</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Data</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Order processing</li>
        <li>Customer support</li>
        <li>Marketing updates (optional)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Cookies</h2>
      <p>We use cookies to improve user experience and analytics.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Protection</h2>
      <p>Your data is stored securely and never sold to third parties.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Third Parties</h2>
      <p>We only share data with payment and delivery partners.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
      <p>Email: inspiritclothings@gmail.com</p>
      <p>Phone: +91 7397 284 491</p>
    </div>
  );
};

export default PrivacyPolicy;