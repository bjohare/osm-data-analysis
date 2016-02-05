var L = require('leaflet');
var $ = require('jquery');
var leafletStream = require('leaflet-geojson-stream');
var vsprintf = require('sprintf').vsprintf;
var Q = require('q');

var app = (function() {

    var analysis_features = null;

    return {
        init: function() {
            initMap();
            initForm();
        }
    }

    function initMap() {
        L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images';
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
        map.setView(new L.LatLng(27.7000, 85.3333), 12);
        var ll = map.getBounds();
        $('#bounds').html(vsprintf('%s %s %s %s', [ll.getWest().toFixed(5), ll.getSouth().toFixed(5), ll.getEast().toFixed(5), ll.getNorth().toFixed(5)]));
        $('#zoom').html(map.getZoom());
        map.addLayer(osm);

        // analysis layer
        analysis_features = new L.geoJson();
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
            var ll = map.getBounds();
            $('#bounds').html(vsprintf('%s %s %s %s', [ll.getWest().toFixed(5), ll.getSouth().toFixed(5), ll.getEast().toFixed(5), ll.getNorth().toFixed(5)]));
            $('#zoom').html(map.getZoom());
        })
    }

    function initForm() {
        $('#countForm').on('submit', function(e) {
            e.preventDefault(); // prevent native submit
            $('button#count').prop('disabled', true);
            var zoom = $('#zoom').html();
            var bbox = $('#bounds').html();
            var feature = $('input#feature').val();
            var url = '/count.json?zoom=' + zoom + '&bbox=' + bbox + '&feature=' + feature;
            leafletStream.ajax(url, analysis_features)
                .on('data', function(data) {})
                .on('end', function() {
                    $('button#count').prop('disabled', false);
                });

            var intId = window.setInterval(function() {
                $.getJSON('/query.json', function(json, textStatus) {
                    $('#analysis').empty();
                    $('#analysis').html('Proccessed: ' + json.tiles + ' tiles. Found: ' + json.count + ' features.');
                });
            }, 5000);

        });
    }

}());

$(document).ready(function() {
    app.init();
});
