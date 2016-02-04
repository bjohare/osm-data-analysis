var L = require('leaflet');
var $ = require('jquery');

var app = (function() {

    return {
        init: function() {
            initMap();
            initForm();
        }
    }

    function initMap() {
        var southWest = L.latLng(27.438822, 85.687866),
            northEast = L.latLng(27.939820, 85.042419),
            bounds = L.latLngBounds(southWest, northEast);
        var map = new L.Map('map', {
            maxBounds: bounds
        });
        // create the tile layer with correct attribution
        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {
            minZoom: 8,
            maxZoom: 17,
            attribution: osmAttrib
        });

        // start the map in nepal
        map.setView(new L.LatLng(27.7000, 85.3333), 13);

        $('#bounds').html(map.getBounds().toBBoxString());
        $('#zoom').html(map.getZoom());
        map.addLayer(osm);

        // analysis layer
        var analysis_features = new L.geoJson();
        analysis_features.addTo(map);

        /*
        $.ajax({
            dataType: "json",
            url: "/count.json",
            success: function(data) {
                $(data.features).each(function(key, data) {
                    analysis_features.addData(data);
                });
            }
        }).error(function() {});
        */

        map.on('moveend', function() {
            $('#bounds').html(map.getBounds().toBBoxString());
            $('#zoom').html(map.getZoom());
        })
    }

    function initForm() {
        $('#countForm').on('submit', function(e) {
            e.preventDefault(); // prevent native submit
            $('button#count').css('disabled', 'true');
            $('button#count').html('Processing..')
            $.ajax({
                dataType: "json",
                url: "/count.json",
                success: function(data) {
                    $('span#count').html(data.total_buildings);
                }
            }).error(function() {});
        });
    }

}());

$(document).ready(function() {
    app.init();
});
