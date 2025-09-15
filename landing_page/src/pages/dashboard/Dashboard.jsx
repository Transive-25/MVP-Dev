import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, Polyline, Autocomplete } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaArrowRight, FaCar, FaBicycle, FaMotorcycle } from 'react-icons/fa';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 40.7128, // Default to New York
  lng: -74.0060
};

const libraries = ['places'];

const Dashboard = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [isRouteVisible, setIsRouteVisible] = useState(false);
  const [directions, setDirections] = useState(null);
  const [map, setMap] = useState(null);

  // Load your Google Maps API key from environment variables
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY || process.env.VITE_GOOGLE_API_KEY,
    libraries
  });

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pickup && destination) {
      calculateRoute();
    }
  };

  const calculateRoute = async () => {
    // In a real app, you would use the Google Maps Directions Service
    // For this example, we'll just simulate it
    setIsRouteVisible(true);

    // This is where you would make the actual Directions API call
    // For now, we'll just set a mock directions response
    setTimeout(() => {
      // Simulating route calculation
      setIsRouteVisible(true);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black text-white flex items-center px-6 py-4 justify-around">
        <div className="flex gap-2 items-center">
          <img src="./logo.png" className='w-14' alt="" />
        </div>
     
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-gray-300">Transport</a>
            <a href="#" className="hover:text-gray-300">Provide</a>
            <a href="#" className="hover:text-gray-300">About</a>
            <a href="#" className="hover:text-gray-300">Help</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-white px-4 py-2 rounded-full font-medium">
              Sign in
            </button>
            <button className="bg-white text-black px-4 py-2 rounded-full font-medium">
              Sign Up
            </button>
            <button className="md:hidden">☰</button>
          </div>
   

      </header>

      {/* Main Content */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 relative">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                styles: [
                  {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                  }
                ]
              }}
            >
              {/* Origin marker */}
              {isRouteVisible && (
                <Marker
                  position={{ lat: 40.7128, lng: -74.0060 }}
                  icon={{
                    url: "data:image/svg+xml;base64," + btoa(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="#000000"/>
                        <circle cx="12" cy="12" r="4" fill="#FFFFFF"/>
                      </svg>
                    `)
                  }}
                />
              )}

              {/* Destination marker */}
              {isRouteVisible && (
                <Marker
                  position={{ lat: 40.7282, lng: -73.9842 }}
                  icon={{
                    url: "data:image/svg+xml;base64," + btoa(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="#000000"/>
                        <circle cx="12" cy="12" r="4" fill="#FFFFFF"/>
                      </svg>
                    `)
                  }}
                />
              )}

              {/* Curved route line (simulated) */}
              {isRouteVisible && (
                <Polyline
                  path={[
                    { lat: 40.7128, lng: -74.0060 },
                    { lat: 40.720, lng: -73.9950 },
                    { lat: 40.7282, lng: -73.9842 }
                  ]}
                  options={{
                    strokeColor: "#FFD700",
                    strokeOpacity: 1,
                    strokeWeight: 4,
                    geodesic: true
                  }}
                />
              )}
            </GoogleMap>
          ) : (
            <div className="absolute inset-0 bg-blue-200 flex items-center justify-center">
              <span className="text-blue-500 text-lg">Loading Map...</span>
            </div>
          )}
        </div>

        {/* Form Panel */}
        <div className="absolute top-4 left-4 w-11/12 md:w-96 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-6">Move anything with Transive</h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
             {/* Pickup */}
<div className="flex items-center border border-gray-300 rounded-lg p-3">
  <FaMapMarkerAlt className="text-gray-600 mr-3" />
  {isLoaded && (
    <Autocomplete>
      <input
        type="text"
        placeholder="Enter pickup location"
        className="w-full outline-none"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
      />
    </Autocomplete>
  )}
</div>

{/* Destination */}
<div className="flex items-center border border-gray-300 rounded-lg p-3">
  <FaArrowRight className="text-gray-600 mr-3" />
  {isLoaded && (
    <Autocomplete>
      <input
        type="text"
        placeholder="Enter destination"
        className="w-full outline-none"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
    </Autocomplete>
  )}
</div>

            </div>
            {/*             
            <div className="mt-8">
              <h3 className="font-semibold mb-3">Choose a ride type:</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="border rounded-lg p-3 text-center cursor-pointer hover:bg-gray-100">
                  <FaCar className="text-2xl mx-auto mb-2" />
                  <span className="text-sm">TransiveX</span>
                </div>
                <div className="border rounded-lg p-3 text-center cursor-pointer hover:bg-gray-100">
                  <FaCar className="text-2xl mx-auto mb-2 text-blue-500" />
                  <span className="text-sm">Transive Comfort</span>
                </div>
                <div className="border rounded-lg p-3 text-center cursor-pointer hover:bg-gray-100">
                  <FaBicycle className="text-2xl mx-auto mb-2" />
                  <span className="text-sm">Transive Bike</span>
                </div>
              </div>
            </div>
             */}
            <button
              type="submit"
              className={`w-full mt-6 py-3 rounded-lg font-medium ${pickup && destination
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              disabled={!pickup || !destination}
            >
              View Prices
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;