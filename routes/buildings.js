var turf = require('turf');
var normalize = require('geojson-normalize');

module.exports = function(data, tile, writeData, done) {
  var count = 0;
  var osmdata = normalize(data.osm.osm);
  var buildings = [];
  osmdata.features.forEach(function(feature){
    if (feature.properties.building){
      buildings.push(feature);
    }
  })
  done(null, buildings);
};
