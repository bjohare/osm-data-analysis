var express = require('express');
var pg = require('pg');
var turf = require('turf');
var router = express.Router();

var connStr = "postgres://gis:@/osm_data_analysis";

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'OSM Data Analysis Prototype'
    });
});

router.get('/map', function(req, res) {
    res.render('map', {
        title: 'OSM Data Analysis Prototype',
    });
});

router.get('/townlands.json', function(req, res) {
    var client = new pg.Client(connStr);
    client.connect();
    var query = client.query("SELECT id, name, ST_AsGeoJSON(ST_Transform(the_geom, 4326)) as geometry FROM cloughjordan_townlands");
    var features = {
        "type": "FeatureCollection",
        "features": []
    }
    query.on("row", function(row, result) {
        var feat = {
            "type": "Feature",
            "properties": {},
            "geometry": {}
        }
        var geom = row.geometry;
        feat.geometry = JSON.parse(geom);
        var properties = {};
        properties.id = row.id;
        properties.name = row.name;
        properties.area = turf.area(feat.geometry);
        feat.properties = properties;
        result.addRow(feat);
    });

    query.on("end", function(result) {
        features.features = result.rows;
        res.type('application/json');
        res.send(features);
    });
});


module.exports = router;
