// APP OBJECT
const app = {};
app.markerIndicator = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Method to generate map tiles

app.reset = () => {
  $("#map-tiles").empty();
  $("#map").empty();
  maps.locations = [];
};

app.generateMapTiles = normalizedData => {
  $("#map-tiles").html("");
  $("#main-tiles").html("");

  normalizedData.forEach(element => {
    $("#main-tiles").append(`<div class="user-results-tile">
    <div class="upper-tile">
      <img src="${
        element[7] === "" ? "dev/assets/placeholder.jpg" : element[7]
      }" alt="Picture of ${element[0]} place" />
    </div>
    <div class="lower-tile">
      <h2 class="lower-tile-title">
      ${element[0]}
      </h2>
      <p class="tile-description">${
        element[4]
      } <span class="map-scroll-tile-price-dollar">${
      zomatoAPI.priceArr[element[5]]
    }</span></p>
      <p class="tile-address"><span class="bold">Address:</span> ${
        element[3]
      }</p>
      <a href="${element[8]}" class="tile-btn">See More</a>
    </div>
    </div>`);

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
          <span className="favoriate-icon"><i class="far fa-heart"></i></span>
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

//Icons for Favourite icons, item 0 is unfilled heart, item 1 is filled in heart
// app.favoriateIconArr = [
//   '<i class="far fa-heart"></i>',
//   '<i class="fas fa-heart"></i>'
// ];

// app.getFavorite = key => {
//   return (localData = JSON.parse(window.localStorage.getItem(key)));
// };

// app.createFavCard = () => {
//   $(".favDialog");
// };

// app.eventListeners = function() {
//   $(".showfavoriates").on("click", function() {
//     $(".favDialog").toggleClass("showFavDialog hideFavDialog");
//     for (let i = 0; i < localStorage.length; i++) {
//       let item = app.getFavorite();
//       console.log(item);
//     }
//   });
// };

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
// zomatoAPI.radius = 10;

// Set up a init function so we can add additional functions in the future.
zomatoAPI.init = () => {
  zomatoAPI.eventListeners();
};

// Method to set search radius in Meters - Moved to zomatoAPI.eventListeners
zomatoAPI.setRadius = (walkSpeed, breakTime) => {
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

  //Append a preloader
  $(`<div class="loader loader--flipDelay loader--3d">
    <span class="loader-item">1</span> <span class="loader-item">2</span>
    <span class="loader-item">3</span> <span class="loader-item">4</span>
    <span class="loader-item">5</span> <span class="loader-item">6</span>
    </div>`)
    .appendTo(".preloader")
    .hide()
    .fadeIn(300);

  //Normalize results and unhide page content
  setTimeout(() => {
    zomatoAPI.normalizeResults();
    $(".hidden").toggleClass("visible");
    $(".visible").toggleClass("hidden");
  }, 2000);

  //Scroll to the map and delete the preloader
  setTimeout(() => {
    $("html, body").animate({
      scrollTop: $(".visible").position().top
    });
    $(".preloader").html("");
  }, 2200);
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
    app.reset();
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
// Locations array for google markers
maps.startLocation = {
  lat: 43.6482644,
  lng: -79.4000474
};

// Get data from Zomato API and push into locations array
maps.receiveMarkerData = array => {
  maps.locations.push(...array);
  maps.displayMap();
};

// Display Google Map on screen, run a forEach method against each location in the Locations array
maps.displayMap = () => {
  const hyContent = `<div class="pin-container">
              <h2>HackerYou</h2>
              <span class="mapContent-address">483 Queen St W, Toronto, ON M5V 2A9</span>
              </div>`;
  let map = null;
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: maps.startLocation.lat, lng: maps.startLocation.lng },
    zoom: 15
  });
  const hyMarker = new google.maps.Marker({
    position: { lat: 43.6482644, lng: -79.4000474 },
    map: map,
    animation: google.maps.Animation.BOUNCE,
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
    const contentCard = `<div class="pin-container">
              <h2>${
                mapContent[0]
              }</h2><span class="favoriateIcon"><i class="far fa-heart"></i></span>
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
    const infoWindow = new SnazzyInfoWindow({
      marker: marker,
      content: contentCard,
      closeWhenOthersOpen: true,
      callbacks: {
        beforeOpen: function() {},
        open: function() {
          $(".fa-heart").on("click", function() {
            $(this).toggleClass("fas far");
          });
        }
      }
    });
  });
};

// Document Ready
$(function() {
  zomatoAPI.init();
  app.init();
});