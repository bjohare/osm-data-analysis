var L = require('leaflet');
var $ = require('jquery');

var app = {};

app.map = (function(){

    return {
        init: function(){
            console.log('running...');
            initMap();
        }
    }

    function initMap(){
        map = new L.Map('map');
        // create the tile layer with correct attribution
        var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 17, attribution: osmAttrib});

        // start the map in cloughjordan
        map.setView(new L.LatLng(52.9403, -8.0356),12);
        map.addLayer(osm);
        var townlands = new L.geoJson();
        townlands.addTo(map);

        $.ajax({
        dataType: "json",
        url: "/townlands.json",
        success: function(data) {
            $(data.features).each(function(key, data) {
                console.log(data.properties.area);
                townlands.addData(data);
            });
        }
        }).error(function() {});
    }

}());

$(document).ready(function() {
        app.map.init();
});
