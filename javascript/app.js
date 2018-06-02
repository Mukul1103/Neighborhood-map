//for error in maps
function error() {
    window.alert('Map API failed to load.');
}

var pointers = [{
        title: 'Bestech Square Mall',
        position: {
            lat: 30.673778,
            lng: 76.740393
        },
        show: true,
        selected: false,
        id: "51b180e9498e29a28cabb946"
    },

    {   
        title: 'Sector 67 Market',
        position: {
            lat: 30.679469, 
            lng: 76.725590
        },        
        show: true,
        selected: false,
        id: "4df752ee1f6e94c2c77f2f3a"

    },
    {
        title: 'Indian School of Business',
        position: {
            lat: 30.668962,
            lng: 76.726472
        },
        show: true,
        selected: false,
        id: "4f7c4364e4b0de4ca1d369e4"        
    },
    {
        title: 'IISER Mohali Library',
        position: {
            lat: 30.664909,
            lng: 76.731994
        },
        show: true,
        selected: false,
        id: "57808d6a498eb55b299953e0"        
    },
    {
        title: 'HCL Services Ltd.',
        position: {
            lat: 30.681315,
            lng: 76.727820
        },
        show: true,
        selected: false,
        id: "4eb966bed5fb442a67b80959"        
    },
    {
        title: 'Bestech Business Tower',
        position: {
            lat: 30.675648,
            lng: 76.741023
        },
        show: true,
        selected: false,
        id: "51b180e9498e29a28cabb946"        
    }
];


// This function initialises the map and applies knockout bindings.
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 30.675777, 
            lng: 76.730311
        },
        zoom: 15
    });
    var pointinfo = new google.maps.InfoWindow();
    ko.applyBindings(new ViewModel(map, pointinfo));
}


// ViewModel of Knockout JS.
function ViewModel(map, pointinfo) {
    var point;
    var bounds = new google.maps.LatLngBounds();
    var it = this;
    it.points = ko.observableArray([]);
    it.searchText = ko.observable();

    // A Loop to create points 
    for (var index = 0; index < pointers.length; index++) {
        point = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            title: pointers[index].title,
            position: pointers[index].position,
            show: ko.observable(pointers[index].show),
            selected: ko.observable(pointers[index].selected), 
            fsid: pointers[index].id  
        });

        bounds.extend(point.position);
        it.points.push(point);
    }


    // Filters for searches.

    it.search = function() {
         pointinfo.close();
         var text = it.searchText();
         if (text.length === 0) {
             it.showAll(true);
         } else {
             for (var i = 0; i < it.points().length; i++) {
                 if (it.points()[i].getTitle().toLowerCase().indexOf(text.toLowerCase()) > -1) {
                     it.points()[i].show(true);
                     it.points()[i].setVisible(true);
                 } else {
                     it.points()[i].show(false);
                     it.points()[i].setVisible(false);
                 }
             }
         }
         pointinfo.close();
     };
    
    it.showAll = function(show) {
         for (var i = 0; i < it.points().length; i++) {
             it.points()[i].setVisible(show);
             it.points()[i].show(show);
         }
     };

     it.unselectAll = function() {
         for (var i = 0; i < it.points().length; i++) {
             it.points()[i].selected(false);
         }
     };


     it.setSelected = function(point) {
         console.log(position);
         it.unselectAll();
         point.selected(true);
     };




    // This function adds click listener to the points and opens an info window.

    for (var j = 0; j < it.points().length; j++) {
        point = it.points()[j];
        point.addListener('click', displayWindow(map, point, pointinfo));
    }


    // This function triggers the point click event.
    it.setSelected = function(point) {
        google.maps.event.trigger(point, 'click');
    };


}



// Function sets the info inside point.

function displayWindow(map, point, pointinfo) {
    return function() {
        $.ajax({

            //client id and secret are added here to url from foursquare api.

            url: "https://api.foursquare.com/v2/venues/" + point.fsid + "?client_id=L3MXTVJD4DFYOLHCM2NKKXOMD2LPVH1NBAO5RYG5P2COKK5Y&client_secret=YWUF0GAFMHLEYERQBOGREUGZMUQH0NRWCT0CZUOIONQ4UHK4&v=20180501",
            method: 'GET',
            dataType: "json",
            success: function(data) {
                var venue = data.response.venue;
                if (venue.hasOwnProperty('rating')) {
                    mark.rating = venue.rating;
                } 
                else {
                     mark.rating = ' not available';
                }
                
            },
            error: function(e) {
                this.errormsg("Error loading");
            }
        });
        
        var currentMarker = point;

        formatRatings = function() {
             if (currentMarker.rating === "" || currentMarker.rating === undefined) {
                return "No rating";
             } 
             else {
                return currentMarker.rating;
             }
         };


        var contentMarker = "<h5>" + currentMarker.getTitle() + "</h5>" + "<div>" + formatRatings() + "</div>";

        pointinfo.setContent(contentMarker);
        pointinfo.open(map, point);



        // Bounce Animation on click.
        point.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            point.setAnimation(null);
        }, 650);
    };
}


