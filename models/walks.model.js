const mongoose = require('mongoose');

const walkSchema = new mongoose.Schema({
  owner: {type: userSchema.Types.ObjectId, ref: 'User' },
  location: {
    type: {
      type: [String],
      default: 'Point'
    },
    coordinates: [Number]
  }
}, { timestamps: true })

walkSchema.index({location: '2dsphere'});

const Walks = mongoose.model('Walks', walkSchema);
module.exports = Walks;