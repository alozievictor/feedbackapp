const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: [true, 'File URL is required'],
    },
    path: {
      type: String,
      required: [true, 'File path is required'],
    },
    type: {
      type: String,
      required: [true, 'File type is required'],
    },
    size: {
      type: Number,
      required: [true, 'File size is required'],
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader is required'],
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    feedback: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model('File', fileSchema);

module.exports = File;
