var map;
var marker;
var directionsService;
var directionsRenderer;
var geocoder;

function initMap() {
  var defaultLocation = { lat: 50.4501, lng: 30.5234 };

  map = new google.maps.Map(document.getElementById('map'), {
    center: defaultLocation,
    zoom: 12
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: true
  });

  geocoder = new google.maps.Geocoder();

  // Создание маркера
  marker = new google.maps.Marker({
    position: defaultLocation,
    map: map,
    draggable: true
  });
  marker.addListener('dragend', function () {
    calculateAndDisplayRoute();
    geocodeLatLng(marker.getPosition());
  });

  document.querySelector('.close').addEventListener('click', function () {
    var modal = document.getElementById('mapModal');
    modal.style.display = 'none';
  });
}

function calculateAndDisplayRoute() {
  var destination = marker.getPosition();

  directionsService.route(
    {
      origin: destination,
      destination: { lat: 50.4501, lng: 30.5234 }, // Киев
      travelMode: 'DRIVING'
    },
    function (response, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    }
  );
}

function geocodeLatLng(latlng) {
  geocoder.geocode({ location: latlng }, function (results, status) {
    if (status === 'OK') {
      if (results[0]) {
        document.querySelector('input[name="address"]').value = results[0].formatted_address;
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}
