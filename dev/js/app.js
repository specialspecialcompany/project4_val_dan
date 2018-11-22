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
    console.log(zomatoAPI.results);
  });
};

// FIREBASE OBJECT
const firedb = {};

// Initialize Firebase
firedb.init = () => {
  var config = {
    apiKey: "AIzaSyB49cILyim9CYlPKeIp0Mzj7Jmz05QF_Wg",
    authDomain: "testhyproject.firebaseapp.com",
    databaseURL: "https://testhyproject.firebaseio.com",
    projectId: "testhyproject",
    storageBucket: "",
    messagingSenderId: "717581892962"
  };
  firebase.initializeApp(config);
};

firedb.setupAuth = () => {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
};

//MAP OBJECT
// Create app namespace to hold all methods
const maps = {};
// Static locations for markers on map
maps.locations = [
  ["HackerYou", 43.6482644, -79.4000474],
  ["HackerYou", 43.6482644, -79.4000474],
  ["Fresh on Spadina", 43.648264, -79.395689],
  ["Dollarama", 43.648264, -79.398544],
  ["Loblaws", 43.648264, -79.400516]
];
maps.startLocation = {
  lat: 43.6482644,
  lng: -79.4000474
};
// var cityCircle = new google.maps.Circle({
//   strokeColor: "#FF0000",
//   strokeOpacity: 0.8,
//   strokeWeight: 2,
//   fillColor: "#FF0000",
//   fillOpacity: 0.35,
//   map: map,
//   center: citymap[city].center,
//   radius: Math.sqrt(citymap[city].population) * 100
// });
// Get data from ZOmato API and push into locations array

maps.getMapData = (...array) => {
  map.locations.push([]);
};

// Display Google Map on screen, run a forEach method against each location in the Locations array
maps.displayMap = function() {
  let map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: maps.startLocation.lat, lng: maps.startLocation.lng },
    zoom: 15
  });
  maps.setMarkers(map);
};

//Create markers on Google Maps based on the Locations
maps.setMarkers = map => {
  for (let i = 0; i < maps.locations.length; i++) {
    const location = maps.locations[i];
    const marker = new google.maps.Marker({
      position: { lat: location[1], lng: location[2] },
      map: map,
      title: location[0]
    });
    // Add add click listener for each marker added to map

    maps.eventListener(map, marker);
  }
  maps.drawRadiusMarker(map);
};

maps.drawRadiusMarker = map => {
  let hyCircle = new google.maps.Circle({
    strokeColor: "#D11F26",
    strokeOpacity: 0.5,
    strokeWeight: 2,
    fillColor: "#D11F26",
    fillOpacity: 0.2,
    map: map,
    center: { lat: maps.startLocation.lat, lng: maps.startLocation.lng },
    radius: zomatoAPI.radius
  });
};

// map.markerContent = (title, subtype, description) => {
//   return `<h1>${title}</h1>
//     <h3>${subtype}</h3>
//     <p>${description}</p>
//   `;
// };

maps.eventListener = (map, marker) => {
  let infowindow = new google.maps.InfoWindow({
    content: `<h1>hi!</h1>
              <h2> I'm a sub-heading </h2>
              <p> Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum quis cupiditate corporis veritatis culpa nemo reiciendis numquam delectus quia aperiam, dolore beatae neque cum consequuntur maxime praesentium voluptatum dolor sed!</p>
    `
  });
  marker.addListener("click", function() {
    infowindow.open(map, marker);
  });
};

// Start app
maps.init = () => {
  maps.displayMap();
};

$(function() {
  maps.init();
  zomatoAPI.getResults();
  firedb.init();
});
