export const displayMap = (locations) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoicHJhYmVlbnNvcmVuZyIsImEiOiJja2MzOXh0ZzYyNXdkMnFvNGRyZHMxb3NkIn0.fPmLgq_f7DwRQ96ku_zbHQ";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/prabeensoreng/ckc3a86iz0nvg1iqufgf2ygp5",
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement("div");
    el.className = "marker";

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
