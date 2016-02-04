var express = require('express');
var pg = require('pg');
var turf = require('turf');
var tilereduce = require('tile-reduce');
var path = require('path');
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


router.get('/count.json', function(req, res) {
    var count = 0;
    var tiles = 0;
    var mapPath = path.join(__dirname, 'buildings.js');
    var features = [];
    tilereduce({
            // kathmandu
            bbox: [85.687866, 27.438822, 85.042419, 27.939820], // w,s,e,n
            zoom: 12,
            map: __dirname + '/buildings.js',
            maxWorkers: 4,
            sources: [{
                name: 'osm',
                mbtiles: path.join(__dirname, '../data/nepal.mbtiles'),
                raw: false
            }]
        })
        .on('reduce', function(result, tile) {
            features.push(result);
            count += result.length;
            tiles += 1;
        })
        .on('end', function() {
            var feats = {
                "type": "FeatureCollection",
                "features": features
            }
            console.log('Features total: %d', count);
            res.type('application/json');
            res.send({
                'tiles_processed': tiles,
                'total_buildings': count,
            });
        });

});

module.exports = router;
