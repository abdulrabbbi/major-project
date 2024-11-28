// Mapbox Access Token
mapboxgl.accessToken = maptoken;

// Function to initialize the map
const initializeMap = ({ coordinates, title }) => {
  // Validate coordinates
  if (
    !Array.isArray(coordinates) ||
    coordinates.length !== 2 ||
    typeof coordinates[0] !== "number" ||
    typeof coordinates[1] !== "number"
  ) {
    console.error("Invalid coordinates provided:", coordinates);
    return;
  }

  // Initialize the map
  const map = new mapboxgl.Map({
    container: "map", // Map container ID
    style: "mapbox://styles/mapbox/streets-v12", // Map style
    center: coordinates, // Map center
    zoom: 10, // Initial zoom level
  });

  // Popup content
  const popupContent = `
    <h4>${title || "Unknown Title"}</h4>
    <p>Exact location will be provided after booking</p>
  `;

  // Add a marker with a popup
  new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
    .addTo(map);

  console.log("Map initialized and marker added at:", coordinates);
};

// Example usage with `list`
initializeMap({
  coordinates: list.geometry.coordinates,
  title: list.title,
});
