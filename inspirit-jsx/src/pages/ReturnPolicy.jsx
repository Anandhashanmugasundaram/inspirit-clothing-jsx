import React from "react";

const ReturnPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Return & Exchange Policy</h1>

      <p className="mb-4">
        At Inspirit Clothings, we aim to ensure customer satisfaction with every purchase.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Returns & Exchanges</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>No refunds are offered on any orders.</li>
        <li>We only provide exchanges for wrong size, wrong item, or defective products.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Time Frame</h2>
      <p>Exchange requests must be raised within 7 days of delivery.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Conditions</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Items must be unused and unwashed</li>
        <li>Original tags and packaging must be intact</li>
        <li>Subject to quality inspection</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Not Eligible</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Used or washed items</li>
        <li>Items without tags</li>
        <li>Change of mind requests</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
      <p>Email: inspiritclothings@gmail.com</p>
      <p>Phone: +91 7397 284 491</p>
    </div>
  );
};

export default ReturnPolicy;