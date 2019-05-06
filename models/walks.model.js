const mongoose = require('mongoose');

const walkSchema = new mongoose.Schema({
  walksLocation: {
    type: {
      type: [String],
      default: 'Point'
    },
    coordinates: [Number]
  },
  favorites: [{ type: userSchema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true })

walkSchema.index({location: '2dsphere'});

const Walks = mongoose.model('Walks', walkSchema);
module.exports = Walks;