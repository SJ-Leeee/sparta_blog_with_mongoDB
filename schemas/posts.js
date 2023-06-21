const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true, // 무조건 있어야 하는 가?
  },
  title: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Posts", postsSchema);
