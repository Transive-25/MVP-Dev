import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, OverlayView } from '@react-google-maps/api';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { defaultCenter, libraries, uberMapStyle } from '../../constant/mapsStyle';
import ServiceTypeDropdown from '../../components/UI/ServiceTypeDropdown';
import AutoCompleteTextInputVersion2 from '../../components/UI/AutoCompleteTextInputVersion2';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const Dashboard = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [placeLocation, setPlaceLocation] = useState({ pickup: null, destination: null })
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
    libraries: libraries
  });

  const onLoad = useCallback(function callback(map) {
    setMap(map);
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
        setPickup(`${place.name}, ${place.formatted_address}`);
        setPlaceLocation((prev) => ({
          ...prev,
          pickup: {
            name: place.name,
            address: place.formatted_address,
          },
        }));

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
        setDestination(`${place.name}, ${place.formatted_address}`);
        setPlaceLocation((prev) => ({
          ...prev,
          destination: {
            name: place.name,
            address: place.formatted_address,
          },
        }));


        // ✅ Center map on destination even if pickup is not set yet
        setMapCenter(location);

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

  return (
    <div className="flex flex-col h-screen bg-gray-100">

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
                    <div className="px-3 py-1 shadow-md text-sm font-medium w-2xl">
                      <div className="w-fit p-2 bg-white">
                        From: {placeLocation.pickup.name}, {placeLocation.pickup.address}
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
                    <div className="px-3 py-1 shadow-md text-sm font-medium w-2xl">
                      <div className="w-fit p-2 bg-white">
                        To: {placeLocation.destination.name}, {placeLocation.destination.address}
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
                    suppressMarkers: true,
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
            <div className="space-y-2">
              <ServiceTypeDropdown />

              {/* Pickup Input */}
              <AutoCompleteTextInputVersion2
                ref={pickupAutocompleteRef}
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Enter pickup location"
                icon={<FaMapMarkerAlt className="text-white" />}
                isLoaded={isLoaded}
                onPlaceChanged={onPickupPlaceChanged}
                onLoad={onPickupLoad}
              />

              {/* Destination Input */}
              <AutoCompleteTextInputVersion2
                ref={destinationAutocompleteRef}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination location"
                icon={<FaMapMarkerAlt className="text-white" />}
                iconBg="bg-red-500"
                isLoaded={isLoaded}
                onPlaceChanged={onDestinationPlaceChanged}
                onLoad={onDestinationLoad}
              />
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