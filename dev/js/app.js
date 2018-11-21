<<<<<<< HEAD
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
const maps = {};
maps.googleApiKey = 'AIzaSyCQXH5sS5BqaSv72Nbb3AJnx4yzjWCSbtE'

// Collect user input
maps.getZomatoData = function () {

}

// Make AJAX request with user inputted data
maps.getInfo = function () {

}

// Display data on the page
maps.displayMap = function () {

}

// Start app
maps.init = function () {

}

$(function () {
    maps.init();
    zomatoAPI.getResults();

});