const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  owner: {type: userSchema.Types.ObjectId, ref: 'User' },
  comment: {
    type: [String],
    default: [] 
  }
}, { timestamps: true })

walkSchema.index({location: '2dsphere'});

const Comments = mongoose.model('Comments', commentSchema);
module.exports = Walks;