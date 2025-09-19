import React, { useState } from "react";

const TransportWizard = () => {
  const [step, setStep] = useState(1);
  const [summary, setSummary] = useState({
    location: "",
    dateTime: "",
    category: "",
    vehicleType: "",
  });

  const handleNext = (updates) => {
    setSummary({ ...summary, ...updates });
    setStep(step + 1);
  };

  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Summary & Initial Selections */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Move anything with Transive</h2>

          {/* Step 1: Location, Date, Time */}
          {step === 1 && (
            <div>
              <label className="block mb-2">Pickup Location</label>
              <input
                type="text"
                placeholder="Enter location"
                className="w-full p-2 border rounded mb-4"
                onChange={(e) => setSummary({ ...summary, location: e.target.value })}
              />

              <label className="block mb-2">Date & Time</label>
              <input
                type="datetime-local"
                className="w-full p-2 border rounded mb-4"
                onChange={(e) => setSummary({ ...summary, dateTime: e.target.value })}
              />

              <button
                onClick={() => handleNext({})}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            </div>
          )}

          {/* Summary always shown */}
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">Your Selections:</h3>
            <ul className="text-sm space-y-1">
              {summary.location && <li>📍 Location: {summary.location}</li>}
              {summary.dateTime && <li>🕒 Date/Time: {summary.dateTime}</li>}
              {summary.category && <li>📦 Category: {summary.category}</li>}
              {summary.vehicleType && <li>🚗 Vehicle: {summary.vehicleType}</li>}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Step Content */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          {step === 2 && (
            <>
              <h3 className="text-xl font-bold mb-4">What would you like to transport?</h3>
              <div className="grid gap-4">
                {["Vehicle", "Equipment", "General Freight", "Household Items", "Package"].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => handleNext({ category: cat })}
                      className="p-3 border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </>
          )}

          {step === 3 && summary.category === "Vehicle" && (
            <>
              <h3 className="text-xl font-bold mb-4">Select Vehicle Type</h3>
              <div className="grid gap-4">
                {["Car", "Bike", "Boat"].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleNext({ vehicleType: type })}
                    className="p-3 border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </>
          )}

          {step >= 3 && summary.category && (
            <>
              <h3 className="text-xl font-bold mb-4">Choose Transport Option</h3>
              <div className="grid gap-4">
                {["Express", "Depot-to-Depot", "Hybrid"].map((option) => (
                  <div
                    key={option}
                    className="p-4 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <h4 className="font-semibold">{option}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {option === "Express" && "Door-to-door private transport."}
                      {option === "Depot-to-Depot" &&
                        "Drop off at one depot and pick up at another."}
                      {option === "Hybrid" && "A mix of door and depot options."}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TransportWizard;
