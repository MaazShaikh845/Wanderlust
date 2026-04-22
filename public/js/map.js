const mapContainer = document.getElementById("map");
const hasValidCoordinates = Array.isArray(coordinates) && coordinates.length === 2;

if (mapContainer && hasValidCoordinates) {
    // Leaflet uses [lat, lng] but GeoJSON/our coordinates are stored as [lng, lat]
    const [lng, lat] = coordinates;

    const map = L.map("map").setView([lat, lng], 9);

    // Free OpenStreetMap tiles — no API key required
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<h3>${title}</h3><p>Exact location provided after booking</p>`)
        .openPopup();

} else if (mapContainer) {
    mapContainer.classList.add("d-flex", "align-items-center", "justify-content-center", "text-muted");
    mapContainer.textContent = "Map preview unavailable for this listing.";
}
