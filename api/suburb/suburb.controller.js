var Suburb = require('./suburb.model');
var SphereMercator = require('sphericalmercator');
var utils = require('../../utils');


exports.index = function(req, res, next) {

  Suburb
    .find()
    .limit(100)
    .lean()
    .exec(function(err, docs) {
    if (err) return next(err);
    if (!docs) return next(new Error('Oops nothing found.'));
    var geojson = {
      "type": "FeatureCollection",
      "features": docs
    };
    // cache controller for nginx
    res.header("Cache-Control", "public, max-age=300");
    res.status(200).json(geojson);
  });

};

exports.show = function(req, res, next) {

  Suburb.findById(req.params.id, function(err, doc) {
    if (err) return next(err);
    if (!doc) return next(new Error('Oops nothing found.'));
    res.status(200).json(doc);
  });

};


exports.tile = function(req, res, next) {

  var params = {};
  params.z = parseInt(req.params.z);
  params.x = parseInt(req.params.x);
  params.y = parseInt(req.params.y);
  params.format = req.params.format || 'png';

  var mercator = new SphereMercator();

  var bbox = mercator.bbox(params.x, params.y, params.z, false, '4326');

  var latlo = parseFloat(bbox[1]),
      lnglo = parseFloat(bbox[0]),
      lathi = parseFloat(bbox[3]),
      lnghi = parseFloat(bbox[2]);

  var bound = {
    type: "Polygon",
    coordinates: [[[lnglo,latlo],[lnglo,lathi],[lnghi,lathi],[lnghi,latlo],[lnglo,latlo]]]
  };

  Suburb
    .find()
    .where('geometry').intersects(bound)
    .select('-properties')
    .lean()
    .exec(function(err, data) {
    if (err) return next(err);
    utils.generateMapnikStyle(__dirname + '/suburb.style.xml', data, function(err, xml) {
      utils.generateMapnikResponse(xml, params, res, next);
    });
  });
};
