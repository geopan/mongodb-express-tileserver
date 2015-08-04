mapboxgl.accessToken = 'pk.eyJ1IjoiZ2lzLXZvY3VzIiwiYSI6IkNkUE9HdUUifQ.BrV7hSpl0zpMw4wapkc3ng';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'minimal.json', //stylesheet location
  center: [-33.8650, 151.2094], // starting position
  zoom: 12 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.Navigation());
