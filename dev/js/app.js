// APP OBJECT

const app = {};
app.markerIndicator = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Method to generate map tiles

app.generateMapTiles = (normalizedData) => {
  $("#map-tiles").html("");
  $("#main-tiles").html("");


  normalizedData.forEach(element => {
    $("#main-tiles").append(`
    <div class="user-results-tile">
            <div class="upper-tile">
              <img src="${element[7]}" alt="" />
            </div>
            <div class="lower-tile">
              <h2 class="lower-tile-title">${element[0]}</h2>
              <p class="tile-description">
                Cuisine: ${element[4]}
              </p>
              <a href="${element[8]}" class="tile-btn">See more</a>
            </div>
          </div>
      `)

    $("#map-tiles").append(`
    <div class="map-scroll-tile">
    <span class="map-scroll-tile-indicator">Indicator: ${app.markerIndicator[normalizedData.indexOf(element)]}</span>
    <span class="map-scroll-tile-title">Title: ${element[0]}</span>
    <span class="map-scroll-tile-cuisine">Cuisine: ${element[4]}</span>
    <span class="map-scroll-tile-price">Price: ${element[5]}</span>
  </div>`);

  });
}

app.slider = () => {
  $("#slider").roundSlider({
    max: 60,
    radius: 80,
    startAngle: 90,
    width: 8,
    handleSize: "+16",
    handleShape: "dot",
    sliderType: "min-range",
    value: 90
  });
}

app.init = () => {
  app.slider();
}


// ZOMATO OBJECT

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
  app.generateMapTiles(normalizedArr);
};

zomatoAPI.eventListeners = () => {
  $("#submit-btn").on("click", function() {
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
  console.log(map);
  for (i = 0; i < maps.locations.length; i++) {
    let location = maps.locations[i];
    let position = new google.maps.LatLng(location[1], location[2]);
    let marker = new google.maps.Marker({
      position: position,
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
  // maps.displayMap();
};

$(function() {
  maps.init();
  zomatoAPI.init();
  app.init();
  // firedb.init();
});