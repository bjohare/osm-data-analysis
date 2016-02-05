var turf = require('turf');
var normalize = require('geojson-normalize');

var opts = global.mapOptions;

module.exports = function(data, tile, writeData, done) {

  var query = opts.tag;
  var count = 0;
  var osmdata = normalize(data.osm.osm);
  var filtered = [];
  osmdata.features.forEach(function(feature) {
    if (feature.properties.hasOwnProperty(query)) {
      filtered.push(feature);
    }
  })
  done(null, filtered);
};
