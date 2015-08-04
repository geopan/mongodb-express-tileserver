var Parcel = require('./parcel.model');
var SphereMercator = require('sphericalmercator');
var utils = require('../../utils');


exports.index = function(req, res, next) {

  Parcel
    .find()
    .limit(100)
    .exec(function(err, docs) {
    if (err) return next(err);
    if (!docs) return next(new Error('Oops nothing found.'));
    // cache controller for nginx
    // res.header("Cache-Control", "public, max-age=300");
    res.status(200).json(docs);
  });

};

exports.show = function(req, res, next) {

  Parcel.findById(req.params.id, function(err, doc) {
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

  var latlo = bbox[1],
      lnglo = bbox[0],
      lathi = bbox[3],
      lnghi = bbox[2];

  var bound = {
    type: "Polygon",
    coordinates: [[[lnglo,latlo],[lnglo,lathi],[lnghi,lathi],[lnghi,latlo],[lnglo,latlo]]]
  };

  Parcel
    .find()
    .where('geometry').intersects(bound)
    .select('geometry')
    .lean()
    .exec(function(err, docs) {
    if (err) return next(err);

    utils.generateMapnikStyle(__dirname + '/parcel.style.xml', geojson, function(err, xml) {
      utils.generateMapnikResponse(xml, params, res, next);
    });
  });
};
