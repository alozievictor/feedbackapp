const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: function() {
        // Text is required if there are no attachments
        return this.attachments.length === 0;
      },
      trim: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attachments: [
      {
        filename: String,
        path: String,
        size: Number,
        type: String,
        url: String, // For compatibility with the frontend
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for formatted timestamp
messageSchema.virtual('formattedCreatedAt').get(function() {
  return new Date(this.createdAt).toLocaleString();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
