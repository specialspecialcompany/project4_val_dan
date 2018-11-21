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
    map.displayMap()
}

$(function () {
    map.init();
});