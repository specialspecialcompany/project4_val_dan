// APP OBJECT

const app = {};
app.markerIndicator = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Method to generate map tiles

app.generateMapTiles = normalizedData => {
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
      `);

    $("#map-tiles").append(`<div class="map-scroll-tile">
    <span class="map-scroll-tile-indicator">${
      app.markerIndicator[normalizedData.indexOf(element)]
    }</span>
      </span>
    <span class="map-scroll-tile-title">${element[0]}</span>
    <span class="map-scroll-tile-cuisine">Cuisine: ${element[4]}</span>
    <span class="map-scroll-tile-price">
      Price: <span class="map-scroll-tile-price-dollar">${
        zomatoAPI.priceArr[element[5]]
      }</span>
    </span>
  </div>`);
  });
};

//Create a slider and get it's value on change
app.slider = () => {
  let slider = $("#slider").roundSlider({
    max: 60,
    radius: 70,
    startAngle: 90,
    width: 8,
    handleSize: "+16",
    handleShape: "dot",
    sliderType: "min-range",
    value: 15,
    change: function(e) {
      app.sliderValue = e;
    }
  });
};

app.checkForFavourite = item => {
  console.log(item);
};

app.getFavourite = name => {
  // Get the existing data
  return (existing = localStorage.getItem(name));
};

app.addFavourite = (name, key, value) => {
  /**
   * Add an item to a localStorage() object
   * @param {String} name  The localStorage() key
   * @param {String} key   The localStorage() value object key
   * @param {String} value The localStorage() value object value
   */
  // Get the existing data
  let existing = localStorage.getItem(name);

  // If no existing data, create an array
  // Otherwise, convert the localStorage string to an array
  existing = existing ? JSON.parse(existing) : {};

  // Add new data to localStorage Array
  existing[key] = value;

  // Save back to localStorage
  localStorage.setItem(name, JSON.stringify(existing));
};

//App init function

app.init = () => {
  app.slider();
};

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

//Price icon array
zomatoAPI.priceArr = ["", "$", "$$", "$$$", "$$$"];

//Icons for Favourite icons, item 0 is unfilled heart, item 1 is filled in heart
zomatoAPI.favoriateArr = ["far fa-heart", "fas fa-heart"];

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
  // console.log(zomatoAPI.radius);
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
  }, 3000);
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
  app.generateMapTiles(normalizedArr);
};

zomatoAPI.eventListeners = () => {
  $("#submit-btn").on("click", function() {
    zomatoAPI.userKeywords = $("#search").val();
    const breakTime =
      app.sliderValue === undefined ? 15 : app.sliderValue.value;
    const walkSpeed = $("input:checked").val();
    // console.log(breakTime, walkSpeed);
    zomatoAPI.setRadius(breakTime, walkSpeed);
    // Call our API and get results based on input provided by user
    zomatoAPI.getResults();
  });
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
  const hyContent = `<div class="pin-container">
              <h2>HackerYou</h2>
              <span class="mapContent-address">483 Queen St W, Toronto, ON M5V 2A9</span>
              </div>`;
  let map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: maps.startLocation.lat, lng: maps.startLocation.lng },
    zoom: 15
  });
  maps.hyMarker = new google.maps.Marker({
    position: { lat: 43.6482644, lng: -79.4000474 },
    map: map,
    animation: google.maps.Animation.BOUNCE,
    // animation: google.maps.Animation,
    content: hyContent
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
  maps.locations.forEach(item => {
    if (mapContent[4] === app.getFavourite(mapContent[4])) {
      console.log("true");
    }
  });
  const contentCard = `<div class="pin-container">
              <h2>${mapContent[0]}</h2>
              <h3 class="mapContent-subheading">${mapContent[4]}</h3>
              <span class="mapContent-address">${mapContent[3]}</span>
              <div className="mapContent-website"><a href="${
                mapContent[8]
              }">Website</a>
              </div>
              <div style="font-weight:bold; margin-top: 3px;">${
                zomatoAPI.priceArr[mapContent[5]]
              }</div>
           
              
              </div>`;
  // console.log(mapContent);
  let infowindow = new google.maps.InfoWindow({
    content: contentCard
  });
  marker.addListener("click", function() {
    infowindow.open(map, marker);
  });
  // console.log(index);
};

// Start app
maps.init = () => {
  // maps.displayMap();
};

$(function() {
  maps.init();
  zomatoAPI.init();
  app.init();
});
