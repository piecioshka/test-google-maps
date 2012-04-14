(function (global) {
    "use strict";
    
    // -------------------------------------------------------------------------
    // [Constructor]
    // -------------------------------------------------------------------------
    
    function Map (placeHolder) {
        var self = this;
        
        this.marker_theme = (function () {
        	var google_dir = "http://www.google.com/intl/en_us/mapfiles/ms/micons/";
        	return {
                "google_red": google_dir + "red-dot.png",
                "google_blue": google_dir + "blue-dot.png",
                "google_green": google_dir + "green-dot.png",
                "google_pink": google_dir + "pink-dot.png",
                "google_purple": google_dir + "purple-dot.png"
            };
        }(this));
        this.markers = [];
        this.circles = [];
        this.options = {
            zoom: 8,
            center: new google.maps.LatLng(0, 0),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(placeHolder, this.options);
        /*
        this.bindClickOnMap(function (event) {
            var latLng = event.latLng;
            var point = {
                latitude: latLng.lat(),
                longitude: latLng.lng()
            };
            self.clearMarkers();
            self.addMarker(point, "google_green");
            self.clearCircles();
            self.addCircle(latLng, 2);
        });
        */
        return this;
    }

    // -------------------------------------------------------------------------
    // [Setters / Getters]
    // -------------------------------------------------------------------------
    
    Map.prototype.setCenter = function (coordinates) {
        var lat = String(coordinates.latitude);
        var lng = String(coordinates.longitude);
        var point = new google.maps.LatLng(lat, lng);
        this.map.setCenter(point);
    };
    
    Map.prototype.setZoom = function (zoom) {
        this.map.setZoom(zoom);
    };

    Map.prototype.setCurrentPosition = function () {
        if (!navigator.geolocation) {
            return false;
        }
        navigator.geolocation.getCurrentPosition(function (position) {
            var latitude = position.coords.latitude, 
                longitude = position.coords.longitude, 
                point = new google.maps.LatLng(latitude, longitude);

            googlelibapi.addMarker(point, true);
        });
    };

    // -------------------------------------------------------------------------
    // [Modifiers]
    // -------------------------------------------------------------------------
    
    Map.prototype.addMarker = function (coordinates, theme) {
        theme = theme || "google_blue";
        
        var self = this,
            lat = coordinates.latitude,
            lng = coordinates.longitude,
            icon = this.marker_theme[theme],
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: self.map,
                draggable: false,
                animation: google.maps.Animation.DROP,
                icon: icon
            });
        this.markers.push(marker);

        this.bindClickOnMarker(marker, function (event) {
            var latLng = event.latLng;
            var point = {
                latitude: latLng.lat(),
                longitude: latLng.lng()
            };
            coordinates = "<strong>Współrzędne:</strong><br/>";
            coordinates += "<br/>Szerokość: " + point.latitude;
            coordinates += "<br/>Długość: " + point.longitude;
            
            var infowin = new google.maps.InfoWindow();
            infowin.setContent(coordinates);
            infowin.open(self.map, marker);
        });
    };

    Map.prototype.clearMarkers = function () {
        var iterator,
            length = this.markers.length;
        for (iterator = 0; iterator < length; ++iterator) {
            this.markers[iterator].setMap(null);
        }
        this.markers.length = 0;
    };

    Map.prototype.circlePath = function (latLng, radius) {
        var radiusLat = radius / (40008 / 360),
            radiusLng = radius / (40075 * Math.cos(latLng.lat() * Math.PI / 180) / 360),
            points = [],
            pointsNumber = 40,
            step = 2 * Math.PI / pointsNumber;
        for ( var alfa = 2 * Math.PI + step; alfa > 0; alfa -= step) {
            var x = latLng.lat() + radiusLat * Math.cos(alfa),
                y = latLng.lng() + radiusLng * Math.sin(alfa);
            points.push(new google.maps.LatLng(x, y));
        }
        return points;
    };

    Map.prototype.addCircle = function (curPos, radius) {
        var self = this,
            vertexes = this.circlePath(curPos, radius),
            circle = new google.maps.Polygon({
                paths: vertexes,
                strokeColor: "#DA9B00",
                strokeOpacity: 0.8,
                strokeWeight: 5,
                fillColor: "#F8F0B1",
                fillOpacity: 0.35
            });
        this.circles.push(circle);
        circle.setMap(self.map)
    };
    
    Map.prototype.clearCircles = function () {
        var iterator,
            length = this.circles.length;
        for (iterator = 0; iterator < length; ++iterator) {
            this.circles[iterator].setMap(null);
        }
        this.circles.length = 0;
    };
    
    // -------------------------------------------------------------------------
    // [Event Handler]
    // -------------------------------------------------------------------------

    Map.prototype.bindClickOnMap = function (callback) {
        google.maps.event.addListener(this.map, 'click', function handler(event) {
            (typeof callback === "function") && callback(event);
        });
    };
    Map.prototype.bindClickOnMarker = function (marker, callback) {
        google.maps.event.addListener(marker, 'click', function(event) {
            (typeof callback === "function") && callback(event);
        });
    };

    global.googlemaps = {
        Map: Map
    };
}(this));