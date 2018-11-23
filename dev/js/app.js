const zomatoAPI = {};

// API url
zomatoAPI.url = "https://developers.zomato.com/api/v2.1/search";

//API Key
zomatoAPI.key = "6bff49b5a9a15a9b920996759741d5b1";

//Initiate a key to hold the returned results
zomatoAPI.results = [];

//User keywords
zomatoAPI.userKeywords = "";

//User location
zomatoAPI.location = "";

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
zomatoAPI.radius = 10;

// Set up a init function so we can add additional functions in the future.
zomatoAPI.init = () => {
  zomatoAPI.eventListeners();
};

// Method to set search radius in Meters - Moved to zomatoAPI.eventListeners
zomatoAPI.setRadius = (walkSpeed = 5, breakTime = 60) => {
  // Calculate this based on total break time multiply by walking speed.
  zomatoAPI.radius = walkSpeed * breakTime;
  console.log(zomatoAPI.radius);
};

//GET results from Zomato API
zomatoAPI.getResults = () => {
  $.ajax({
    method: "GET",
    crossDomain: true,
    url: zomatoAPI.url,
    dataType: "json",
    // async: true,
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
    zomatoAPI.results = res.restaurants;
  });
  // FROM DAN: This code should be refactored as it waits to the data to be returned before running normalizeResults function
  setTimeout(function() {
    zomatoAPI.normalizeResults();
  }, 2000);
};

zomatoAPI.normalizeResults = () => {
  let flatArr = zomatoAPI.results;
  let normalizedArr = [];
  flatArr = flatArr
    .map(item => item.restaurant)
    .forEach(item =>
      normalizedArr.push([
        item.name,
        item.location.latitude,
        item.location.longitude,
        item.location.address,
        item.cuisines,
        item.price_range,
        item.thumb,
        item.featured_image,
        item.url
      ])
    );
  console.log(normalizedArr);
  maps.receiveMarkerData(normalizedArr);
};

zomatoAPI.eventListeners = () => {
  $("button[type=submit]").on("click", function(event) {
    event.preventDefault();
    zomatoAPI.userKeywords = $("#search").val();
    const breakTime = $("#break-time").val();
    const walkSpeed = $("input:checked").val();
    console.log(breakTime, walkSpeed);
    zomatoAPI.setRadius(breakTime, walkSpeed);
    // console.log(zomatoAPI.userKeywords);
    // Call our API and get results based on input provided by user
    zomatoAPI.getResults();
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
// Static locations array for google markers
maps.locations = [];
maps.startLocation = {
  lat: 43.6482644,
  lng: -79.4000474
};

// Get data from Zomato API and push into locations array
maps.receiveMarkerData = array => {
  maps.locations.push(...array);

  // console.log(maps.locations[0]);
  // maps.displayMap();
  maps.buildMap();
};

// maps.filterRecievedMarkerData = () => {
//   for (let i = 0; i < maps.locations.length; i++) {
//     const location = maps.locations[i];
//     if (location[0] !== undefined) {
//       console.log("bad res title");
//     }
//     if (location[1] !== undefined || location[2] !== undefined) {
//       console.log("bad res title");
//     }
//   }
// };

// Display Google Map on screen, run a forEach method against each location in the Locations array
// maps.displayMap = function() {
//   let map = new google.maps.Map(document.getElementById("map"), {
//     center: { lat: maps.startLocation.lat, lng: maps.startLocation.lng },
//     zoom: 15
//   });
//   map.hyMarker = new google.maps.Marker({
//     position: { lat: 43.6482644, lng: -79.4000474 },
//     map: map,
//     // animation: google.maps.Animation.BOUNCE,
//     animation: google.maps.Animation,
//     title: "Hacker You!"
//   });
//   maps.drawRadiusMarker(map);
// };

maps.buildMap = () => {
  let map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: maps.startLocation.lat, lng: maps.startLocation.lng },
    zoom: 15
  });
  map.hyMarker = new google.maps.Marker({
    position: { lat: 43.6482644, lng: -79.4000474 },
    map: map,
    // animation: google.maps.Animation.BOUNCE,
    animation: google.maps.Animation,
    title: "Hacker You!"
  });
  for (let i = 0; i < maps.locations.length; i++) {
    let location = maps.locations[i];
    let marker = new google.maps.Marker({
      // position: { lat: parseInt(location[1]), lng: parseInt(location[2]) },
      position: {
        lat: parseInt("43.6543916667"),
        lng: parseInt("-79.4012000000")
      },
      map: map,
      title: "TEST"
    });
    marker.setMap(map);
    // Add add click listener for each marker added to map
    marker.addListener("click", function() {
      infowindow.open(map, marker);
    });
    maps.eventListener(map, marker);
  }
  let infowindow = new google.maps.InfoWindow({
    content: `<h1>hi!</h1>
              <h2> I'm a sub-heading </h2>
              <p> Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum quis cupiditate corporis veritatis culpa nemo reiciendis numquam delectus quia aperiam, dolore beatae neque cum consequuntur maxime praesentium voluptatum dolor sed!</p>
    `
  });
};

//Create markers on Google Maps based on the Locations
maps.setMarkers = map => {
  // console.log(map);
  for (let i = 0; i < maps.locations.length; i++) {
    let location = maps.locations[i];
    let marker = new google.maps.Marker({
      // position: { lat: parseInt(location[1]), lng: parseInt(location[2]) },
      position: {
        lat: parseInt("43.6543916667"),
        lng: parseInt("-79.4012000000")
      },
      map: map,
      title: "TEST"
    });
    marker.setMap(map);
    // Add add click listener for each marker added to map

    maps.eventListener(map, marker);
  }
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
  maps.setMarkers(map);
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
  // maps.displayMap();
};

$(function() {
  maps.init();
  zomatoAPI.init();
  // firedb.init();
});
