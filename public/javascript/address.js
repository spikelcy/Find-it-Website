var map, places;
var autocomplete;

    function initMap() {
        var myLatLang = {lat: -37.8207879, lng: 144.9561307};
         map = new google.maps.Map(document.getElementById('map'), {
            center: myLatLang,
            zoom: 15
        });


        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')));

        places = new google.maps.places.PlacesService(map);
        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', fillInAddress);

    }

    function fillInAddress() {
        // Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();
        if (place.geometry) {
            map.panTo(place.geometry.location);
            map.setZoom(15);
        } else {
            document.getElementById('autocomplete').placeholder = 'Enter a city';
        }
        var marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
        });
        // saves place address and id to place schema.
        var address = place.formatted_address;
        var id = place.place_id;
        var doc = {
            "address": address,
            "id": id

        };
        $.ajax({
            url: "/api/place",
            type: 'POST',
            contentType:'application/json',
            data: JSON.stringify(doc),
            dataType:'json'
        });


    }
// geolocation to limit it to australia
    function geolocate() {

      autocomplete = new google.maps.places.Autocomplete(
          /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')));

      places = new google.maps.places.PlacesService(map);

      autocomplete.addListener('place_changed', fillInAddress);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                var circle = new google.maps.Circle({
                    center: geolocation,
                    radius: position.coords.accuracy
                });
                autocomplete.setBounds(circle.getBounds());
            });
        }
    }
