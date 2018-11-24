const app = {};
app.markerIndicator = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

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
    // : true,
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
  setTimeout(function () {
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
  maps.receiveMarkerData(normalizedArr);
};

zomatoAPI.eventListeners = () => {
  $("#submit-btn").on("click", function () {
    zomatoAPI.userKeywords = $("#search").val();
    const breakTime = $("#break-time").val();
    const walkSpeed = $("input:checked").val();
    console.log(breakTime, walkSpeed);
    zomatoAPI.setRadius(breakTime, walkSpeed);
    // Call our API and get results based on input provided by user
    zomatoAPI.getResults();
  });
};

// FIREBASE OBJECT
const firedb = {};

// Initialize Firebase
firedb.init = () => {
  const config = {
    apiKey: "AIzaSyB49cILyim9CYlPKeIp0Mzj7Jmz05QF_Wg",
    authDomain: "testhyproject.firebaseapp.com",
    databaseURL: "https://testhyproject.firebaseio.com",
    projectId: "testhyproject",
    storageBucket: "",
    messagingSenderId: "717581892962"
  };
  firebase.initializeApp(config);
  firedb.eventListeners();
};

firedb.setupAuth = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
};

firedb.eventListeners = () => {
  //Register
  firebase.auth().signInWithPopup(provider).then(function (result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });

  // $("#logout").on("click", function (e) {
  //   e.preventDefault();
  //   firebase.auth().signOut();
  // });
};

//MAP OBJECT
// Create app namespace to hold all methods
const maps = {};
maps.locations = [];
// Static locations array for google markers
// maps.locations = [
//   ["Tosto Quickfire Pizza Pasta", "43.6476250217", "-79.3966819841"],
//   ["Maker Pizza", "43.6501420000", "-79.3978720000"]
// ];
maps.startLocation = {
  lat: 43.6482644,
  lng: -79.4000474
};

// Get data from Zomato API and push into locations array
maps.receiveMarkerData = array => {
  maps.locations.push(...array);
  console.log(maps.locations);
  maps.displayMap();
};

// Display Google Map on screen, run a forEach method against each location in the Locations array
maps.displayMap = () => {
  let map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: maps.startLocation.lat, lng: maps.startLocation.lng },
    zoom: 15
  });
  maps.hyMarker = new google.maps.Marker({
    position: { lat: 43.6482644, lng: -79.4000474 },
    map: map,
    // animation: google.maps.Animation.BOUNCE,
    animation: google.maps.Animation,
    title: "Hacker You!"
  });
  maps.setMarkers(map);
};

//Create markers on Google Maps based on the Locations
maps.setMarkers = map => {
  for (index = 0; index < maps.locations.length; index++) {
    let location = maps.locations[index];
    let position = new google.maps.LatLng(location[1], location[2]);
    let marker = new google.maps.Marker({
      position: position,
      map: map,
      label: app.markerIndicator[index],
      title: location[0]
    });

    // Add add click listener for each marker added to map
    maps.eventListener(map, marker, index);
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

maps.eventListener = (map, marker, index) => {
  let mapContent = maps.locations[index];
  let contentString = `<div class="pin-container">
              <h2>${mapContent[0]}</h2>
              <h3 class="mapContent-subheading">${mapContent[4]}</h3>
              <span class="mapContent-address">${mapContent[3]}</span>
                <div className="svg-container" style="width:18px;display:block;margin-left: auto;padding-top:4px;">
                <svg xmlns="http://www.w3.org/2000/svg" style="width:100%;" data-name="Layer 1" viewBox="0 0 100 125"><style>.a{font-weight:bold;}</style><title>  A___UP</title><path d="M36.2 64.7h-8C28.2 73.8 35.9 81.4 46 83V95h8V83.1c10.4-1.4 17.8-8.4 17.8-17.4 0-7.8-6.1-14.2-17.8-18.5V25.2c5.6 1.4 9.8 5.5 9.8 10.2h8C71.8 26.2 64.1 18.6 54 17V5H46V16.9c-10.4 1.4-17.8 8.4-17.8 17.4 0 7.8 6.1 14.2 17.8 18.5V74.8C40.4 73.5 36.2 69.4 36.2 64.7Zm27.6 1c0 5.1-4.5 8.3-9.8 9.3V55.8C58.6 57.9 63.8 61.2 63.8 65.7ZM36.2 34.3c0-4.6 4-8.2 9.8-9.3V44.2C41.4 42.1 36.2 38.8 36.2 34.3Z"/></svg>
                </div>
              </div>`;
  console.log(mapContent);
  let infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  marker.addListener("click", function () {
    infowindow.open(map, marker);
  });
};

// Start app
maps.init = () => {
  // maps.displayMap();
};

$(function () {
  maps.init();
  zomatoAPI.init();
  firedb.init();
});
