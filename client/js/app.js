var leaflet = require('leaflet');
var $ = require('jquery');

var app = {};

app.log = (function(){

    return {
        init: function(){
            console.log('running...');
        }
    }

}());

$(document).ready(function() {
        app.log.init();
});
