const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true, // 무조건 있어야 하는 가?
  },
  password: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  postId:{
    type : String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comments", commentsSchema);
