
const zomatoAPI = {};

// API url
zomatoAPI.url = "https://developers.zomato.com/api/v2.1/search";

//API Key
zomatoAPI.key = "6bff49b5a9a15a9b920996759741d5b1";

//Initiate a key to hold the returned results
zomatoAPI.results = [];

//User keywords
zomatoAPI.userKeywords = "";

//Number of results to display, 50 by default
zomatoAPI.numberOfResults = 50;

//Method to change number of results to display
zomatoAPI.changeNumberOfResults = newNumber => {
   zomatoAPI.numberOfResults = newNumber;
};

//User coordinates, defaults to HackerYou -
zomatoAPI.userCoordinates = {
   lat: 43.6482644,
   lon: -79.3978587
};

//Method to change user coordinates
zomatoAPI.setCoordinates = (lat, lon) => {
   zomatoAPI.userCoordinates.lat = lat;
   zomatoAPI.userCoordinates.lat = lon;
};

//Search radius default value in Meters
zomatoAPI.radius = 1000;

//Method to set search radius in Meters
zomatoAPI.setRadius = radius => {
   zomatoAPI.radius = radius;
};

//GET results from Zomato API
zomatoAPI.getResults = () => {
   $.ajax({
      method: "GET",
      crossDomain: true,
      url: zomatoAPI.url,
      dataType: "json",
      async: true,
      data: {
      q: zomatoAPI.userKeywords,
      lat: zomatoAPI.userCoordinates.lat,
      lon: zomatoAPI.userCoordinates.lon,
      radius: zomatoAPI.radius,
      sort: "real_distance"
      },
      headers: {
      "user-key": zomatoAPI.key
      }
   }).then(res => {
      zomatoAPI.results = res;
      console.log(zomatoAPI.results)
   });
};

//MAP OBJECT

// Create app namespace to hold all methods
const map = {
    apikey: 'AIzaSyB0FxLlOyFzx58M8oGoi2Aw232l2shTAbs',
    // markermarkers: [
    //     ['HackerYou', 43.6482644, -79.4000474, 17],
    //     ['Fresh on Spadina', 43.648264, -79.400047, 17],
    //     ['Dollarama', 43.648264, -79.400047, 17],
    //     ['Loblaws', 43.648264, -79.400047, 17],
    // ],
}
// Collect user input
map.getMapData = (...array) => {
    map.mapData.push([])
}

// // Make AJAX request with user inputted data
// map.getInfo = function () {

// }

// Display data on the page
map.displayMap = function () {
    map.googleMap = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 43.6482644, lng: -79.4000474 },
        zoom: 17
    });
    map.hyMarker = new google.maps.Marker({
        position: { lat: 43.6482644, lng: -79.4000474 },
        map: map.googleMap,
        // animation: google.maps.Animation.BOUNCE,
        animation: google.maps.Animation,
        title: 'Hacker You!',

    });
    map.placeMarker();
}

map.placeMarker = () => {
    var locations = [
        ['HackerYou', 43.6482644, -79.4000474, 17],
        ['Fresh on Spadina', 43.648264, -79.400047, 17],
        ['Dollarama', 43.648264, -79.400047, 17],
        ['Loblaws', 43.648264, -79.400047, 17],
    ];


    // var infowindow = new google.maps.InfoWindow();

    // let marker, i;

    // for (i = 0; i < locations.length; i++) {
    //     map.marker = new google.maps.Marker({
    //         position: new google.maps.LatLng(locations[i][1], locations[i][2]),
    //         map: map
    //     });

    //     google.maps.event.addListener(marker, 'click', (function (marker, i) {
    //         return function () {
    //             infowindow.setContent(locations[i][0]);
    //             infowindow.open(map, marker);
    //         }
    //     })(marker, i));
    // }
}

// Start app
map.init = () => {
    map.displayMap();
}

$(function () {
    map.init();
    zomatoAPI.getResults();
});