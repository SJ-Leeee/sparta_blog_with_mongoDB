const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true, // 무조건 있어야 하는 가?
  },
  content: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comments", commentsSchema);
