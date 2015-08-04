var classic = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

var suburb = L.tileLayer('http://127.0.0.1:8080/suburbs/tile/{z}/{x}/{y}.png', {minZoom: 6, maxZoom: 18});

var baseMaps = {
  "Classic": classic
};

var overlayMaps = {
  Suburb: suburb,
};

var map = L.map('map', {
  center: [-33.8650, 151.2094],
  zoom: 13
});

L.control.layers(baseMaps, overlayMaps).addTo(map);
