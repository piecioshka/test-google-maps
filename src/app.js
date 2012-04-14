(function (global) {
    "use strict";

    var document = global.document || {},
    	devjs = global.devjs || {};

    function init(g) {
        var o;
        for (o in g) {
            if (g.hasOwnProperty(o)) {
                g[o].init();
            }
        }
    }
    function initMaps () {
    	var placeHolder = pklib.dom.byId("google-maps"),
	        coords = {
	            latitude: 51,
	            longitude: 23
	        },
	        zoom = 6;
        var map = new googlemaps.Map(placeHolder);
        map.setCenter(coords);
        map.setZoom(zoom);
        map.addMarker(coords, "google_red");
    }

    pklib.event.add(window, "load", function () {
    	init(devjs);
    	initMaps();
    	pklib.utils.action.outerlink();
    });

}(this));
