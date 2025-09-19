import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import AutoCompleteInput from '../UI/AutoCompleteTextInput';
import { defaultCenter, landingpageMap } from '../../constant/mapsStyle';
import DateInput from '../UI/DateInput';
import TimeInput from '../UI/TimeInput';
import { getCurvedPath } from '../../helper/helper';

const Hero = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const pickupRef = useRef(null);
  const destinationRef = useRef(null);
  const mapRef = useRef(null);
  const polylineRef = useRef(null);

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

      // Get the center of the bounds
      const center = bounds.getCenter();

      // Calculate the distance between points to determine appropriate zoom
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(pickupLocation.lat, pickupLocation.lng),
        new window.google.maps.LatLng(destinationLocation.lat, destinationLocation.lng)
      );

      // Adjust zoom level based on distance
      let zoomLevel;
      if (distance < 1000) { // Very close points
        zoomLevel = 15;
      } else if (distance < 5000) { // Nearby points
        zoomLevel = 14;
      } else if (distance < 20000) { // Medium distance
        zoomLevel = 12;
      } else { // Long distance
        zoomLevel = 11;
      }

      // Set map center and zoom instead of fitBounds to maintain orientation
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(zoomLevel);
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
          setValue(`${place.name}, ${place.formatted_address}`);
          console.log(place)

          if (mapRef.current) {
            if (pickupLocation && destinationLocation) {
              // Center on both locations
              centerMapOnLocations();
            } else {
              // Center on the newly selected location
              mapRef.current.panTo(location);
              mapRef.current.setZoom(15);
            }
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
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }

      const curvedPath = getCurvedPath(pickupLocation, destinationLocation, 100, 0.02);

      polylineRef.current = new window.google.maps.Polyline({
        path: curvedPath,
        geodesic: false,
        strokeColor: "#FFD700", // black line
        strokeOpacity: 1,
        strokeWeight: 3,
      });

      polylineRef.current.setMap(mapRef.current);
    }
  }, [pickupLocation, destinationLocation]);

  useEffect(() => {
    if (pickupLocation && destinationLocation && mapRef.current) {
      // Remove existing shadow line if it exists
      if (window.shadowPolyline) {
        window.shadowPolyline.setMap(null);
      }

      // Create a straight path between the two points
      const straightPath = [
        { lat: pickupLocation.lat, lng: pickupLocation.lng },
        { lat: destinationLocation.lat, lng: destinationLocation.lng }
      ];

      // Create the shadow line (straight path)
      window.shadowPolyline = new window.google.maps.Polyline({
        path: straightPath,
        geodesic: true,
        strokeColor: "#FFD700", // Black color for shadow
        strokeOpacity: 0.2,     // Semi-transparent
        strokeWeight: 3.5,        // Slightly thicker than the curved line
        zIndex: 0,              // Place behind the curved line
      });

      // Add the shadow line to the map
      window.shadowPolyline.setMap(mapRef.current);
    }
  }, [pickupLocation, destinationLocation]);

  // Also make sure to clean up the shadow polyline when component unmounts
  useEffect(() => {
    return () => {
      if (window.shadowPolyline) {
        window.shadowPolyline.setMap(null);
      }
    };
  }, []);



  return (
    <div className="md:min-h-screen min-h-full dark:bg-black bg-white dark:text-white text-black flex flex-col md:flex-row justify-center 2xl:px-60 lg:px-20 md:px-10 px-5 sm:px-4">
      <div className="flex md:flex-row flex-col items-center w-full h-fit gap-10 md:mt-32 mt-20 md:mb-0 mb-20">
        {/* Left side - Form */}
        <div className="w-full flex flex-col justify-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Move anything with <span className="text-yellow-500">Transive</span>
          </motion.h1>

          <motion.p
            className="text-lg text-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            On-demand transport for vehicles, equipment, and more.
          </motion.p>

          <div className="space-y-4 mb-6">
            <AutoCompleteInput
              label="Pickup location"
              icon={<FaMapMarkerAlt className="text-gray-500 text-3xl" />}
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Enter pickup location"
              isLoaded={isLoaded}
              ref={pickupRef}
              onPlaceChanged={handlePlaceSelect("pickup")}
            />

            <AutoCompleteInput
              label="Dropoff locations"
              icon={<FaMapMarkerAlt className="text-gray-500 text-3xl" />}
              iconBg="bg-red-500"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter dropoff location"
              isLoaded={isLoaded}
              ref={destinationRef}
              onPlaceChanged={handlePlaceSelect('destination')}

            />

            <div className="flex gap-1 w-full items-start">
              <DateInput label={"Select a date"} />
              <TimeInput label={"Select a time"} />
            </div>
          </div>

          <motion.button
            onClick={handleSeePrices}
            className="dark:bg-white bg-gray-900 dark:text-black text-white font-medium hover:cursor-pointer rounded-lg px-6 py-3 flex items-center justify-center w-full disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="w-full h-96 2xl:h-[35rem] xl:h-[30rem] lg:h-[25rem]">
          <div className="h-full border-4 dark:border-white border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-gray-6900">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={defaultCenter}
                zoom={13}
                onLoad={onMapLoad}
                options={{
                  styles: landingpageMap,
                  disableDefaultUI: true, // Hide all controls first
                  draggable: false, // Disable dragging
                  zoomControl: true, // Allow zoom control buttons
                  scrollwheel: true, // Allow zoom with scroll
                  disableDoubleClickZoom: false, // Allow zoom with double-click
                  keyboardShortcuts: true, // Allow zoom with keyboard shortcuts (+/-)
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
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
    </div>
  );
};

export default Hero;