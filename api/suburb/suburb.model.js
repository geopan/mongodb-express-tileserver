// Module dependencies.
var mongoose = require('mongoose');

var SuburbSchema = new mongoose.Schema({
  type: { type: String, trim: true },
  properties: {
    ssc_code: { type: String, trim: true },
    ssc_name: { type: String, trim: true },
    conf_value: { type: String, trim: true },
    id: { type: Number },
  },
  geometry: {
    type: { type: String, enum: ['Polygon'] },
    coordinates: Array
  }
});

SuburbSchema.index({ geometry: '2dsphere' });

// Export Model
module.exports = mongoose.model('Suburb', SuburbSchema);
