const mapContainer = document.getElementById("map");
const hasValidCoordinates = Array.isArray(coordinates) && coordinates.length === 2;

if (mapContainer && mapToken && hasValidCoordinates && typeof mapboxgl !== "undefined") {
    mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: coordinates,
        zoom: 9
    });

    new mapboxgl.Marker({ color: "red"})
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${title}</h3> <p>Exact location provided after booking</p>`
        ))
        .addTo(map);
} else if (mapContainer) {
    mapContainer.classList.add("d-flex", "align-items-center", "justify-content-center", "text-muted");
    mapContainer.textContent = "Map preview unavailable for this listing.";
}
