mapboxgl.accessToken = mapToken;

console.log("Listing for map:", listing); // ✅ Debug info

if (listing && listing.geometry && listing.geometry.coordinates) {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: listing.geometry.coordinates,
    zoom: 10
  });

  new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h4>${listing.location}</h4><p>Provided after booking</p>`)
    )
    .addTo(map);
} else {
  console.error("Map coordinates not found in listing:", listing);
}
