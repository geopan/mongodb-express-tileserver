'use strict';

var fs = require('fs');
var mapnik = require('mapnik');
var zlib = require('zlib');
var SphereMercator = require('sphericalmercator');

exports.generateMapnikStyle = function(path, geojson, callback) {
  fs.readFile(path, 'utf8', function(err, xml) {
    if (err) return callback(err);
    return callback(null, xml.replace('{{geojson}}', JSON.stringify( geojson ) ));
  });
};

exports.generateMapnikResponse = function(xml, params, res, callback) {

  var mercator = new SphereMercator({size:256});

  mapnik.register_default_fonts();
  mapnik.register_default_input_plugins();
  var map = new mapnik.Map(256, 256);
  map.extent = mercator.bbox(params.x, params.y, params.z, false, '900913');

  res.header("Cache-Control", "public, max-age=300");

  map.fromString( xml, function(err,map) {
    if (err) return callback(err);

    if ( params.format === 'png' ) {

      var im = new mapnik.Image(256, 256);
      map.render(im, function(err,im) {
        if (err) return callback(err);
        im.encode('png', function(err,buffer) {
          if (err) throw err;
          if (err) {
            res.end(err.message);
          } else {
            res.type("png");
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.end(buffer);
          }
        });
      });

    } else if ( params.format === 'pbf' ) {

      var vtile = new mapnik.VectorTile( params.z, params.x, params.y );
      map.render(vtile, {}, function(err,vtile) {
        if (err) return callback(err);
        res.setHeader('Content-Encoding', 'deflate');
        res.setHeader('Content-Type', 'application/x-protobuf');
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        zlib.deflate(vtile.getData(), function(err, pbf) {
          res.send(pbf);
        });
      });
    }

  });
};
