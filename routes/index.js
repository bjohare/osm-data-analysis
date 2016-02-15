var express = require('express');
var pg = require('pg');
var turf = require('turf');
var tilereduce = require('tile-reduce');
var path = require('path');
var uuid = require('uuid');
var router = express.Router();

var results = {
    "count": 0,
    "tiles": 0
}


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


router.get('/count.json', function(req, res) {
    var count = 0;
    var tiles = 0;
    var mapPath = path.join(__dirname, 'buildings.js');
    var features = [];

    // query_id
    var quid = uuid.v4();

    var bbox = req.query.bbox.split(' ');
    var zoom = req.query.zoom;
    var tag = req.query.feature;

    var mapOpts = {
        "tag": tag
    }

    tilereduce({
            // kathmandu
            bbox: bbox,
            zoom: zoom,
            mapOptions: mapOpts,
            map: __dirname + '/buildings.js',
            maxWorkers: 4,
            sources: [{
                name: 'osm',
                mbtiles: path.join(__dirname, '../data/nepal.mbtiles'),
                raw: false
            }]
        })
        .on('start', function(result, tile) {
            // stream data to the client
            res.setHeader("content-type", "application/json");
            res.write('{"type": "FeatureCollection", "features": [' + '\n');
        })
        .on('reduce', function(result, tile) {
            count += result.length;
            tiles += 1;
            results.count = count;
            results.tiles = tiles;
            result.forEach(function(feature){
                res.write(JSON.stringify(feature) + ',');
            });
        })
        .on('end', function() {
            res.write(']}' + '\n');
            res.end();
            console.log('Features total: %d', count);
            // store results
        });

});

router.get('/query.json', function(req, res) {
    res.type('application/json');
    res.send({
        "status": "OK",
        "count": results.count,
        "tiles": results.tiles
    })
});

module.exports = router;
