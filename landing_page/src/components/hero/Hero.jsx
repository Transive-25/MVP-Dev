import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';

const Hero = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const pickupRef = useRef(null);
  const destinationRef = useRef(null);
  const mapRef = useRef(null);
  const polylineRef = useRef(null);
  const animationRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY || process.env.VITE_GOOGLE_API_KEY,
    libraries: ['places', 'geometry']
  });

  // Function to center map on both locations
  const centerMapOnLocations = useCallback(() => {
    if (pickupLocation && destinationLocation && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(new window.google.maps.LatLng(pickupLocation.lat, pickupLocation.lng));
      bounds.extend(new window.google.maps.LatLng(destinationLocation.lat, destinationLocation.lng));
      
      // Fit map to bounds with padding
      mapRef.current.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      });
    }
  }, [pickupLocation, destinationLocation]);

  const handlePlaceSelect = (type) => {
    return () => {
      let place;
      let autocompleteRef;
      let setLocation;
      let setValue;
      
      if (type === 'pickup') {
        autocompleteRef = pickupRef.current;
        setLocation = setPickupLocation;
        setValue = setPickup;
      } else {
        autocompleteRef = destinationRef.current;
        setLocation = setDestinationLocation;
        setValue = setDestination;
      }
      
      if (autocompleteRef) {
        place = autocompleteRef.getPlace();
        if (place && place.geometry) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          
          setLocation(location);
          setValue(place.name);
          
          // Center map immediately after selecting a place
          if (pickupLocation && destinationLocation) {
            centerMapOnLocations();
          } else if (type === 'pickup') {
            // If only pickup is selected, center on pickup
            mapRef.current.panTo(location);
            mapRef.current.setZoom(15);
          } else {
            // If only destination is selected, center on destination
            mapRef.current.panTo(location);
            mapRef.current.setZoom(15);
          }
        }
      }
    };
  };

  const handleSeePrices = () => {
    console.log("See prices clicked");
  };

  // Function to handle map load
  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  // Effect to center map when both locations are available
  useEffect(() => {
    if (pickupLocation && destinationLocation) {
      centerMapOnLocations();
    }
  }, [pickupLocation, destinationLocation, centerMapOnLocations]);

  // Effect to create and animate polyline
  useEffect(() => {
    if (pickupLocation && destinationLocation && mapRef.current) {
      // Clear previous polyline if exists
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }

      // Create a polyline with dashed effect
      polylineRef.current = new window.google.maps.Polyline({
        path: [pickupLocation, destinationLocation],
        geodesic: true,
        strokeOpacity: 0, // Hide solid line
        strokeWeight: 4,
        icons: [
          {
            icon: {
              path: "M 0,-1 0,1", // small dash
              strokeOpacity: 1,
              strokeColor: "#FFD700",
              scale: 4,
            },
            offset: "0",
            repeat: "20px",
          },
        ],
      });

      polylineRef.current.setMap(mapRef.current);

      // Animate the dashes
      let count = 0;
      animationRef.current = setInterval(() => {
        count = (count + 1) % 200;

        const icons = polylineRef.current.get("icons");
        icons[0].offset = (count / 2) + "%"; // shift offset
        polylineRef.current.set("icons", icons);
      }, 50);
    }

    // Cleanup when unmount
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [pickupLocation, destinationLocation]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row items-center px-4 md:px-20 gap-10">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center">
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
           Move anything with <span className="text-white">Transive</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Request a ride, hop in, and go.
        </motion.p>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-900 rounded-lg p-3 flex items-center">
            <div className="bg-green-500 rounded-full p-2 mr-3">
              <FaMapMarkerAlt className="text-white" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Pickup location</label>
              {isLoaded ? (
                <Autocomplete
                  onLoad={autocomplete => {
                    pickupRef.current = autocomplete;
                  }}
                  onPlaceChanged={handlePlaceSelect('pickup')}
                >
                  <input
                    type="text"
                    placeholder="Enter pickup location"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full bg-transparent text-white outline-none"
                  />
                </Autocomplete>
              ) : (
                <input
                  type="text"
                  placeholder="Enter pickup location"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full bg-transparent text-white outline-none"
                />
              )}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-3 flex items-center">
            <div className="bg-red-500 rounded-full p-2 mr-3">
              <FaMapMarkerAlt className="text-white" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Dropoff location</label>
              {isLoaded ? (
                <Autocomplete
                  onLoad={autocomplete => {
                    destinationRef.current = autocomplete;
                  }}
                  onPlaceChanged={handlePlaceSelect('destination')}
                >
                  <input
                    type="text"
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-transparent text-white outline-none"
                  />
                </Autocomplete>
              ) : (
                <input
                  type="text"
                  placeholder="Enter destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent text-white outline-none"
                />
              )}
            </div>
          </div>
        </div>

        <motion.button
          onClick={handleSeePrices}
          className="bg-white text-black font-medium hover:cursor-pointer rounded-lg px-6 py-3 flex items-center justify-center w-full disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          See prices <FaArrowRight className="ml-2" />
        </motion.button>

        <motion.p 
          className="text-gray-400 mt-6 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Log in to see your recent activity
        </motion.p>
      </div>

      {/* Right side - Map */}
      <div className="flex-1 h-screen py-44">
       <div className="h-full border-4 border-white rounded-2xl overflow-hidden shadow-2xl shadow-gray-800">
         {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={mapCenter}
            zoom={13}
            onLoad={onMapLoad}
            options={{
              styles: [
                {
                  featureType: "all",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }]
                },
                {
                  featureType: "all",
                  elementType: "geometry",
                  stylers: [{ color: "#1c1c1c" }]
                },
                {
                  featureType: "all",
                  elementType: "labels.text.stroke",
                  stylers: [{ visibility: "off" }]
                },
                {
                  featureType: "all",
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#ffffff" }]
                },
                {
                  featureType: "water",
                  elementType: "geometry",
                  stylers: [{ color: "#2c2c2c" }]
                },
                {
                  featureType: "road",
                  elementType: "geometry",
                  stylers: [{ color: "#3c3c3c" }]
                }
              ],
              disableDefaultUI: true,
              draggable: false,
              zoomControl: false,
              scrollwheel: false,
              disableDoubleClickZoom: true,
              keyboardShortcuts: false
            }}
          >
            {/* Pickup Marker */}
            {pickupLocation && (
              <Marker
                position={pickupLocation}
                icon={{
                  url: "data:image/svg+xml;base64," + btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="green" stroke="white" stroke-width="2">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                    </svg>
                  `),
                  scaledSize: new window.google.maps.Size(30, 30),
                  anchor: { x: 12, y: 24 }
                }}
              />
            )}
            
            {/* Destination Marker */}
            {destinationLocation && (
              <Marker
                position={destinationLocation}
                icon={{
                  url: "data:image/svg+xml;base64," + btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red" stroke="white" stroke-width="2">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                    </svg>
                  `),
                  scaledSize: new window.google.maps.Size(30, 30),
                  anchor: { x: 12, y: 24 }
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="animate-pulse text-white">Loading Map...</div>
          </div>
        )}
       </div>
      </div>
    </div>
  );
};

export default Hero;