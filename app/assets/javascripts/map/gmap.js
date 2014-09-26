var ready = function() {
  //Run only on the new route add page /routes/new
  if($('#map-container').length){
    loadScript();
  }
};

//Handle JS load with Rails 4 turbolinks
$(document).ready(ready);
//Handle JS load without turbolinks
$(document).on('page:load', ready);

var map;
var elevator;
var distance = 0;
var dist_arr = [];
var elev_arr = [];

//Inits the map
function initialize() {
  var mapOptions = {
    zoom: 16,
    // Center the map on Chicago, USA.
    center: new google.maps.LatLng(1.296643, 103.776394),
    streetViewControl: false
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var polyOptions = {
    strokeColor: '#c77925',
    strokeOpacity: 1.0,
    strokeWeight: 3
  };
  poly = new google.maps.Polyline(polyOptions);
  poly.setMap(map);

  fixInfoWindow();
  // Add a listener for the click event
  google.maps.event.addListener(map, 'click', addLatLng);

  // Create an ElevationService
  elevator = new google.maps.ElevationService();

  // Add a listener for the click event and call getElevation on that location
  google.maps.event.addListener(map, 'click', getElevation);
}

/**
 * Handles click events on a map, and adds a new point to the Polyline.
 * @param {google.maps.MouseEvent} event
 */
function addLatLng(event) {

  var path = poly.getPath();

  var loc1 = path.getAt(path.getLength()-1);
  var loc2 = event.latLng;
  
  path.push(event.latLng);

  if(loc1 && loc2) {
    distance = distance + google.maps.geometry.spherical.computeDistanceBetween (loc1, loc2);
  }


  var dist_dec2 = (distance/1000).toFixed(2);
  $("#distance").val(dist_dec2 + " km");

  dist_arr.push(dist_dec2);  
  var dist_str = dist_arr.join();
  $("#dist_box").val(dist_str);

  var cross = {
    path: 'M -4,-4 4,4 M 4,-4 -4,4',
    strokeColor: '#3e3c39',
    strokeWeight: 2
  }; 

  // Add a new marker at the new plotted point on the polyline.
  var marker = new google.maps.Marker({
    position: event.latLng,
    title: '#' + path.getLength(),
    icon: cross,
    map: map
  });

}

function getElevation(event) {

  var locations = [];

  // Retrieve the clicked location and push it on the array
  var clickedLocation = event.latLng;
  locations.push(clickedLocation);

  // Create a LocationElevationRequest object using the array's one value
  var positionalRequest = {
    'locations': locations
  }

  // Initiate the location request
  elevator.getElevationForLocations(positionalRequest, function(results, status) {
    if (status == google.maps.ElevationStatus.OK) {

      // Retrieve the first result
      if (results[0]) {

        // Open an info window indicating the elevation at the clicked position
        console.log('The elevation at this point is ' + results[0].elevation.toFixed(3) + ' meters.');
        
        elev_arr.push(results[0].elevation.toFixed(3));
        var elev_str = elev_arr.join();
        $("elev_box").val(elev_str);

      } else {
        console.log('No results found');
      }
    } else {
      console.log('Elevation service failed due to: ' + status);
    }
  });
}

//Makes links and labels unclickable
function fixInfoWindow() {
    var set = google.maps.InfoWindow.prototype.set;
    google.maps.InfoWindow.prototype.set = function (key, val) {
        if (key === 'map') {
            if (!this.get('noSupress')) {
                return;
            }
        }
        set.apply(this, arguments);
    }
}

function loadScript() {
	console.log("map loading ...");
  var script = document.createElement('script');
  script.type = 'text/javascript';
  //'https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyBJYFdplGeKUUEmGZ-vL4ydiSZ09Khsa_o&sensor=false&libraries=drawing'
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
    //'&v=3.14'+
    //'&key=AIzaSyBJYFdplGeKUUEmGZ-vL4ydiSZ09Khsa_o'+
    '&libraries=drawing, geometry'+
    '&callback=initialize';
  document.body.appendChild(script);
}
