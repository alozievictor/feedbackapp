const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['awaiting_feedback', 'feedback_received', 'in_progress', 'completed'],
      default: 'awaiting_feedback',
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Client is required'],
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
    },
    clientEmail: {
      type: String,
      required: [true, 'Client email is required'],
    },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
      },
    ],
    activity: [
      {
        action: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        userName: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add project activity middleware
projectSchema.methods.addActivity = function (action, user) {
  this.activity.unshift({
    action,
    userId: user._id,
    userName: user.name,
  });
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
