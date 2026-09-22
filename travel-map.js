// Real coordinates only, no flight numbers or precise addresses; Vietnam
// has no confirmed city yet, so it gets a general country-area marker
// instead of a guessed one. The text list next to this map (in index.html)
// carries the same real info and stays fully readable whether or not this
// script or the map tiles load.
import * as L from "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet-src.esm.js";

const TRIPS = [
  { place: "Seattle", dates: "Sep 5–7, 2026", lat: 47.6062, lng: -122.3321 },
  { place: "Las Vegas", dates: "Sep 18–21, 2026", lat: 36.1699, lng: -115.1398 },
  { place: "Japan", dates: "Dec 27, 2026 – Jan 12, 2027", lat: 35.6762, lng: 139.6503 },
  { place: "Vietnam", dates: "Feb 2–17, 2027", lat: 16.05, lng: 108.0 },
];

const MARKER_COLORS = [0x5b93c9, 0x5b93c9, 0x52c2b8, 0x52c2b8];

export function initTravelMap(container) {
  if (!container) return;

  try {
    const map = L.map(container, {
      scrollWheelZoom: false,
      attributionControl: true,
    });

    // CARTO's anonymous basemap tiles now require an account/API key, so
    // this uses Esri's dark gray canvas basemap instead, confirmed free
    // and keyless. Esri's tile path is z/y/x, not the usual z/x/y.
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
      attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
      maxZoom: 16,
    }).addTo(map);

    const points = [];
    TRIPS.forEach((trip, i) => {
      const color = "#" + MARKER_COLORS[i].toString(16).padStart(6, "0");
      const marker = L.circleMarker([trip.lat, trip.lng], {
        radius: 6,
        color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.85,
      }).addTo(map);
      marker.bindPopup(`<strong>${trip.place}</strong><br>${trip.dates}`);
      points.push([trip.lat, trip.lng]);
    });

    map.fitBounds(points, { padding: [24, 24] });
  } catch (err) {
    console.warn("travel-map.js: failed to initialize map.", err);
  }
}
