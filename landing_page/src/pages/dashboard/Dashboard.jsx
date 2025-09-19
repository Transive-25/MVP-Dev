import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, OverlayView } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaCar, FaMotorcycle, FaShuttleVan, } from 'react-icons/fa';
import { defaultCenter, libraries, uberMapStyle } from '../../constant/mapsStyle';
import ServiceTypeDropdown from '../../components/UI/ServiceTypeDropdown';
import AutoCompleteTextInputVersion2 from '../../components/UI/AutoCompleteTextInputVersion2';
import DateInput from '../../components/UI/DateInput';
import TimeInput from '../../components/UI/TimeInput';
import { optionsServices, transportOptions } from '../../constant/choices';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const vehicleOptions = [
  {
    id: 1,
    name: "Economy",
    description: "Affordable, compact ride",
    price: "$12.50",
    eta: "5 min",
    icon: <FaCar className="text-blue-500 text-2xl" />,
    capacity: "4 people",
    priceMultiplier: 1.0
  },
  {
    id: 2,
    name: "Premium",
    description: "Luxury car with professional driver",
    price: "$22.75",
    eta: "7 min",
    icon: <FaCar className="text-black text-2xl" />,
    capacity: "4 people",
    priceMultiplier: 1.8
  },
  {
    id: 3,
    name: "Motorcycle",
    description: "Fastest option for solo riders",
    price: "$8.25",
    eta: "2 min",
    icon: <FaMotorcycle className="text-red-500 text-2xl" />,
    capacity: "1 person",
    priceMultiplier: 0.7
  },
  {
    id: 4,
    name: "Van",
    description: "For larger groups and luggage",
    price: "$18.90",
    eta: "10 min",
    icon: <FaShuttleVan className="text-green-500 text-2xl" />,
    capacity: "6 people",
    priceMultiplier: 1.5
  },
  {
    id: 5,
    name: "SUV",
    description: "Spacious and comfortable",
    price: "$20.50",
    eta: "6 min",
    icon: <FaCar className="text-purple-500 text-2xl" />,
    capacity: "6 people",
    priceMultiplier: 1.6
  },
  {
    id: 6,
    name: "Electric",
    description: "Eco-friendly electric vehicle",
    price: "$15.75",
    eta: "8 min",
    icon: <FaCar className="text-green-600 text-2xl" />,
    capacity: "4 people",
    priceMultiplier: 1.2
  },
  {
    id: 7,
    name: "Express Pool",
    description: "Share ride for lower cost",
    price: "$9.99",
    eta: "12 min",
    icon: <FaCar className="text-teal-500 text-2xl" />,
    capacity: "4 people",
    priceMultiplier: 0.8
  },
  {
    id: 8,
    name: "Business",
    description: "Professional for business trips",
    price: "$25.00",
    eta: "5 min",
    icon: <FaCar className="text-gray-700 text-2xl" />,
    capacity: "4 people",
    priceMultiplier: 2.0
  },
  {
    id: 9,
    name: "XL",
    description: "Extra large for big groups",
    price: "$28.50",
    eta: "9 min",
    icon: <FaShuttleVan className="text-orange-500 text-2xl" />,
    capacity: "8 people",
    priceMultiplier: 2.2
  },
  {
    id: 10,
    name: "Luxury SUV",
    description: "Premium SUV experience",
    price: "$35.00",
    eta: "7 min",
    icon: <FaCar className="text-yellow-600 text-2xl" />,
    capacity: "6 people",
    priceMultiplier: 2.8
  },
  {
    id: 11,
    name: "Accessible",
    description: "Wheelchair accessible vehicle",
    price: "$16.50",
    eta: "15 min",
    icon: <FaCar className="text-blue-700 text-2xl" />,
    capacity: "4 people + wheelchair",
    priceMultiplier: 1.3
  },
  {
    id: 12,
    name: "Courier",
    description: "For packages and deliveries",
    price: "$14.25",
    eta: "4 min",
    icon: <FaMotorcycle className="text-gray-800 text-2xl" />,
    capacity: "Packages only",
    priceMultiplier: 1.1
  },
  {
    id: 13,
    name: "Executive",
    description: "Top-tier luxury experience",
    price: "$45.00",
    eta: "10 min",
    icon: <FaCar className="text-red-600 text-2xl" />,
    capacity: "3 people",
    priceMultiplier: 3.5
  },
  {
    id: 14,
    name: "Pet Friendly",
    description: "Vehicles that welcome pets",
    price: "$18.00",
    eta: "8 min",
    icon: <FaCar className="text-pink-500 text-2xl" />,
    capacity: "3 people + pets",
    priceMultiplier: 1.4
  },
  {
    id: 15,
    name: "Convertible",
    description: "Enjoy the open air",
    price: "$32.00",
    eta: "12 min",
    icon: <FaCar className="text-yellow-500 text-2xl" />,
    capacity: "2 people",
    priceMultiplier: 2.5
  },
  {
    id: 16,
    name: "Vintage",
    description: "Ride in classic style",
    price: "$40.00",
    eta: "15 min",
    icon: <FaCar className="text-indigo-700 text-2xl" />,
    capacity: "4 people",
    priceMultiplier: 3.2
  },
  {
    id: 17,
    name: "Truck",
    description: "For moving and hauling",
    price: "$38.50",
    eta: "20 min",
    icon: <FaShuttleVan className="text-gray-900 text-2xl" />,
    capacity: "2 people + cargo",
    priceMultiplier: 3.0
  },
  {
    id: 18,
    name: "Night Safe",
    description: "Extra security for night rides",
    price: "$22.00",
    eta: "8 min",
    icon: <FaCar className="text-blue-900 text-2xl" />,
    capacity: "4 people",
    priceMultiplier: 1.7
  },
  {
    id: 19,
    name: "City Scooter",
    description: "Quick urban mobility",
    price: "$6.50",
    eta: "3 min",
    icon: <FaMotorcycle className="text-lime-500 text-2xl" />,
    capacity: "1 person",
    priceMultiplier: 0.5
  }
];

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
  const [showVehicleOptions, setShowVehicleOptions] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

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

   const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
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
        <div className="absolute top-4 left-4 max-w-96 w-full bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-6">Move anything with Transive</h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-2 max-w-full w-full">

              {/* Pickup Input */}
              <AutoCompleteTextInputVersion2
                ref={pickupAutocompleteRef}
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Enter pickup location"
                icon={<FaMapMarkerAlt className="text-gray-500 text-xl" />}
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
                 icon={<FaMapMarkerAlt className="text-gray-500 text-xl" />}
                iconBg="bg-red-500"
                isLoaded={isLoaded}
                onPlaceChanged={onDestinationPlaceChanged}
                onLoad={onDestinationLoad}
              />

  
                 <DateInput />
      
                <TimeInput/>
      

                <ServiceTypeDropdown options={optionsServices}/>

                      <ServiceTypeDropdown placeHolder='Choose a transport' options={transportOptions}/>

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


        {showVehicleOptions && (
          <div className="absolute top-0 right-0 h-full w-96 bg-white shadow-lg overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4">Choose a ride</h3>
              
              {/* Route summary */}
              {directions && (
                <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Distance:</span>
                    <span>{directions.routes[0].legs[0].distance.text}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Duration:</span>
                    <span>{directions.routes[0].legs[0].duration.text}</span>
                  </div>
                </div>
              )}
              
              {/* Vehicle options */}
              <div className="space-y-4">
                {vehicleOptions.map((vehicle) => (
                  <div 
                    key={vehicle.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedVehicle?.id === vehicle.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    onClick={() => handleVehicleSelect(vehicle)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-4">
                          {vehicle.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold">{vehicle.name}</h4>
                          <p className="text-sm text-gray-500">{vehicle.eta} away</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{vehicle.price}</span>
                        <p className="text-sm text-gray-500">{vehicle.capacity}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{vehicle.description}</p>
                  </div>
                ))}
              </div>
              
              {/* Selected vehicle confirmation */}
              {selectedVehicle && (
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-bold mb-2">Selected Option</h4>
                  <div className="flex justify-between items-center">
                    <span>{selectedVehicle.name}</span>
                    <span className="font-bold">{selectedVehicle.price}</span>
                  </div>
                  <button className="w-full mt-4 py-3 bg-black text-white rounded-lg font-medium">
                    Confirm {selectedVehicle.name}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;