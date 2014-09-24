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
}


/**
 * Handles click events on a map, and adds a new point to the Polyline.
 * @param {google.maps.MouseEvent} event
 */
function addLatLng(event) {

  var path = poly.getPath();

  // Because path is an MVCArray, we can simply append a new coordinate
  // and it will automatically appear.
  
  var p1 = path.getAt(path.getLength()-1);
  var p2 = event.latLng;

  //console.log(google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000);

  path.push(event.latLng);

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
