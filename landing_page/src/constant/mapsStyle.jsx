export const uberMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  {
    featureType: "poi",
    elementType: "labels.icon",
    stylers: [{ visibility: "on" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#aaaaaa" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2c2c2c" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3d3d3d" }]
  }
];

export const landingpageMap = [
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
]

export const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

export const libraries = ['places', 'geometry'];