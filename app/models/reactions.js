import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Blog'
  },
  userId: {
    type:String,
    required: true,
   
  },
  reaction: {
    type: String,
    enum: ['like', 'dislike', null],
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Reaction || mongoose.model('Reaction', reactionSchema);
