import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, Autocomplete, OverlayView } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaArrowRight, FaCar, FaBicycle, FaMotorcycle } from 'react-icons/fa';
import { uberMapStyle } from '../../constant/mapsStyle';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

const libraries = ['places', 'geometry'];

const Dashboard = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [isRouteVisible, setIsRouteVisible] = useState(false);
  const [directions, setDirections] = useState(null);
  const [map, setMap] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  
  const pickupAutocompleteRef = useRef(null);
  const destinationAutocompleteRef = useRef(null);

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

  const onPickupLoad = (autocomplete) => {
    pickupAutocompleteRef.current = autocomplete;
  };

  const onDestinationLoad = (autocomplete) => {
    destinationAutocompleteRef.current = autocomplete;
  };

  const onPickupPlaceChanged = () => {
    if (pickupAutocompleteRef.current) {
      const place = pickupAutocompleteRef.current.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setPickupLocation(location);
        setMapCenter(location);
        setPickup(place.formatted_address);
        
        // If we already have a destination, calculate the route
        if (destinationLocation) {
          calculateRoute(location, destinationLocation);
        }
      }
    }
  };

  const onDestinationPlaceChanged = () => {
    if (destinationAutocompleteRef.current) {
      const place = destinationAutocompleteRef.current.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setDestinationLocation(location);
        setDestination(place.formatted_address);
        
        // If we already have a pickup location, calculate the route
        if (pickupLocation) {
          calculateRoute(pickupLocation, location);
        }
      }
    }
  };

 const calculateRoute = (origin, destination) => {
  if (!window.google || !map) return;

  const directionsService = new window.google.maps.DirectionsService();

  directionsService.route(
    {
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (result, status) => {
      if (status === "OK") {
        setDirections(result);
        setIsRouteVisible(true);

        // Fit map to route
        const bounds = new google.maps.LatLngBounds();
        result.routes[0].overview_path.forEach((p) => bounds.extend(p));
        map.fitBounds(bounds);
      } else {
        console.error("Directions request failed:", status);
      }
    }
  );
};



  const handleSubmit = (e) => {
    e.preventDefault();
    if (pickupLocation && destinationLocation) {
      calculateRoute(pickupLocation, destinationLocation);
    }
  };

  // Function to create custom SVG marker
  const createSvgMarker = (color) => {
    return {
      url: "data:image/svg+xml;base64," + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="${color}" d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(30, 30),
      anchor: { x: 12, y: 24 }
    };
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
              center={mapCenter}
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                styles: uberMapStyle
              }}
            >
           
           {/* Pickup marker */}
{pickupLocation && (
  <>
    <Marker
      position={pickupLocation}
      icon={{
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: "#00FF00",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#fff",
        scale: 10,
      }}
    />
  <OverlayView
  position={pickupLocation}
  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
>
  <div className=" px-3 py-1 shadow-md text-sm font-medium w-2xl">
    <div className="w-fit p-2 bg-white">
      From: {pickup}
    </div>
  </div>
</OverlayView>
  </>
)}

{/* Destination marker */}
{destinationLocation && (
  <>
    <Marker
      position={destinationLocation}
      icon={{
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: "#FF0000",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#fff",
        scale: 10,
      }}
    />
    <OverlayView
      position={destinationLocation}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
     <div className=" px-3 py-1 shadow-md text-sm font-medium w-2xl">
    <div className="w-fit p-2 bg-white">
      To: {destination}
    </div>
  </div>
    </OverlayView>
  </>
)}


            {isRouteVisible && directions && (
  <DirectionsRenderer
    directions={directions}
    options={{
      polylineOptions: {
        strokeColor: "#FFD700",
        strokeWeight: 2,
      },
      suppressMarkers: true, // hide Google’s default A/B markers since you already added custom ones
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
                  <Autocomplete
                    onLoad={onPickupLoad}
                    onPlaceChanged={onPickupPlaceChanged}
                  >
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
                  <Autocomplete
                    onLoad={onDestinationLoad}
                    onPlaceChanged={onDestinationPlaceChanged}
                  >
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