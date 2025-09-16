import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { GoogleMap, useJsApiLoader, Marker, Polyline, Autocomplete } from '@react-google-maps/api';

const Hero = () => {
const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [showPolyline, setShowPolyline] = useState(false);
  const [arcPath, setArcPath] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [mapZoom, setMapZoom] = useState(13);
  const pickupRef = useRef(null);
  const destinationRef = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY || process.env.VITE_GOOGLE_API_KEY,
    libraries: ['places']
  });

  // Generate straight path between points
  const generateStraightPath = (start, end) => {
    if (!start || !end) return [];
    return [start, end];
  };

  // Function to center map on both locations
  const centerMapOnLocations = () => {
    if (pickupLocation && destinationLocation && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(new window.google.maps.LatLng(pickupLocation.lat(), pickupLocation.lng()));
      bounds.extend(new window.google.maps.LatLng(destinationLocation.lat(), destinationLocation.lng()));
      
      mapRef.current.fitBounds(bounds);
      
      // Add a small padding to the bounds
      const padding = 50;
      mapRef.current.panToBounds(bounds, padding);
    }
  };

  const handlePlaceSelect = (type) => {
    return () => {
      let place;
      if (type === 'pickup' && pickupRef.current) {
        place = pickupRef.current.getPlace();
        if (place && place.geometry) {
          setPickupLocation(place.geometry.location);
          setPickup(place.name);
          
          // Generate path if both locations are set
          if (destinationLocation) {
            const path = generateStraightPath(
              { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() },
              { lat: destinationLocation.lat(), lng: destinationLocation.lng() }
            );
            setArcPath(path);
            setShowPolyline(true);
            centerMapOnLocations();
          }
        }
      } else if (type === 'destination' && destinationRef.current) {
        place = destinationRef.current.getPlace();
        if (place && place.geometry) {
          setDestinationLocation(place.geometry.location);
          setDestination(place.name);
          
          // Generate path if both locations are set
          if (pickupLocation) {
            const path = generateStraightPath(
              { lat: pickupLocation.lat(), lng: pickupLocation.lng() },
              { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
            );
            setArcPath(path);
            setShowPolyline(true);
            centerMapOnLocations();
          }
        }
      }
    };
  };

  const handleSeePrices = () => {
    setShowPolyline(false);
    setArcPath(null);
  };

  // Center map logic when only one location is selected
  useEffect(() => {
    if (pickupLocation && !destinationLocation && mapRef.current) {
      mapRef.current.panTo({
        lat: pickupLocation.lat(),
        lng: pickupLocation.lng()
      });
      mapRef.current.setZoom(15);
    } else if (!pickupLocation && destinationLocation && mapRef.current) {
      mapRef.current.panTo({
        lat: destinationLocation.lat(),
        lng: destinationLocation.lng()
      });
      mapRef.current.setZoom(15);
    }
  }, [pickupLocation, destinationLocation]);

  // Function to handle map load
  const onMapLoad = (map) => {
    mapRef.current = map;
  };


  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row items-center px-20 gap-10">
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
      <div className="flex-1 h-96">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={mapCenter}
            zoom={mapZoom}
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
                position={{ lat: pickupLocation.lat(), lng: pickupLocation.lng() }}
              />
            )}
            
            {/* Destination Marker */}
            {destinationLocation && (
              <Marker
                position={{ lat: destinationLocation.lat(), lng: destinationLocation.lng() }}
              />
            )}
            
  {showPolyline && arcPath && (
          <Polyline
            key={`${arcPath[0]?.lat}-${arcPath[0]?.lng}-${arcPath[1]?.lat}-${arcPath[1]?.lng}`}
            path={arcPath}
            options={{
              strokeColor: "#ffffff",
              strokeOpacity: 0.8,
              strokeWeight: 4,
              geodesic: true
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
  );
};

export default Hero;