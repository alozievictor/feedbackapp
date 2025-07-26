const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
      required: [true, 'File is required'],
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'implemented', 'rejected'],
      default: 'pending',
    },
    // For pinpointing specific parts of a design
    coordinates: {
      x: {
        type: Number,
      },
      y: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
