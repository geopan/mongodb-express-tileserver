// Module dependencies.
var mongoose = require('mongoose');

var ParcelSchema = new mongoose.Schema({
  properties: {

  },
  geometry: {
    type: {type:String},
    coordinates: Array
  }
});

ParcelSchema.index({ geometry: '2dsphere' });

ParcelSchema.method.geojson = function(callback) {
  // parse response into geojson
  return callback(null, this);
};


// Export Model
module.exports = mongoose.model('Parcel', ParcelSchema);
