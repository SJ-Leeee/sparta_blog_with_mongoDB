const express = require("express");
const router = express.Router();
const Posts = require("../schemas/posts.js");
const Comments = require("../schemas/commnets.js");

router.get("/posts", async (req, res) => {
  // 게시물 조회
  const posts = await Posts.find();
  showPost = posts.map((post) => {
    return {
      _id: post.id,
      user: post.user,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
    };
  });
  const result = showPost.sort((a, b) => {
    return a.createdAt - b.createdAt;
  });
  res.json({ posts: result });
});

router.get("/posts/:postId", async (req, res) => {
  // 게시물 상세 조회
  const { postId } = req.params;
  const posts = await Posts.find();

  getPost = posts.filter((post) => postId === post.id);
  result = getPost.map((post) => {
    return {
      _id: post.id,
      user: post.user,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
    };
  });
  res.status(200).json({ detail: result });
});

router.post("/posts", async (req, res) => {
  // 게시물 등록
  const { user, password, title, content } = req.body;
  const createPosts = await Posts.create({
    user,
    password,
    title,
    content,
  });

  res.json({ message: "성공적으로 저장되었습니다." });
});

router.put("/posts/:postId", async (req, res) => {
  // 게시물 수정
  const { postId } = req.params;
  const { user, password, title, content } = req.body;

  const existsPosts = await Posts.find({ _id: postId });
  if (existsPosts.length && password === existsPosts[0].password) {
    await Posts.updateOne(
      { _id: postId },
      {
        $set: {
          user: user,
          password: password,
          title: title,
          content: content,
          createdAt: Date(),
        },
      }
    );
    return res.status(200).json({
      success: true,
    });
  }
  res.status(400).json({
    message: "존재하지 않거나 비밀번호가 맞지 않습니다",
  });
});

router.delete("/posts/:postId", async (req, res) => {
  // 게시물 삭제
  const { postId } = req.params;
  const { password } = req.body;

  const existsPosts = await Posts.find({ _id: postId });

  if (existsPosts.length && password === existsPosts[0].password) {
    await Posts.deleteOne({ _id: postId });
    res.status(200).json({
      status: "success",
    });
  } else {
    res.status(400).json({
      status: "존재하지 않거나 비밀번호가 맞지 않습니다",
    });
  }
});

router.post("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const existsPosts = await Posts.find({ _id: postId });
  const { user, password, content } = req.body;
  if (existsPosts.length) {
    const createComments = await Comments.create({
      user,
      password,
      content,
      postId: postId,
    });

    return res.json({ message: "성공적으로 저장되었습니다." });
  } else if (content === "") {
    return res.json({ message: "댓글을 입력해주세요" });
  }

  res.status(400).json({ message: "post가 존재하지 않습니다" });
});

router.get("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const comments = await Comments.find();
  const getComments = comments.filter((comment) => postId === comment.postId);
  const showComments = getComments.map((comment) => {
    return {
      _id: comment._id,
      user: comment.user,
      content: comment.content,
      postId: postId,
      createdAt: comment.createdAt,
    };
  });
  const result = showComments.sort((a, b) => {
    return a.createdAt - b.createdAt;
  });
  res.status(200).json({ comments: result });
});

router.get("/posts/:postId/comments/:commentId", async (req, res) => {
  const { postId } = req.params;
  const { commentId } = req.params;
  const comments = await Comments.find();
  const getComments = comments.filter(
    (comment) => comment._id.toString() === commentId
  );
  result = getComments.map((comment) => {
    return {
      _id: comment._id,
      user: comment.user,
      content: comment.content,
      postId: postId,
      createdAt: comment.createdAt,
    };
  });
  res.status(200).json({ comments: result });
});

router.put("/posts/:postId/comments/:commentId", async (req, res) => {
  // 게시물 수정
  const { commentId } = req.params;
  const { user, password, content } = req.body;

  const existComments = await Comments.find({ _id: commentId });

  if (
    existComments.length &&
    password === existComments[0].password &&
    content !== ""
  ) {
    await Comments.updateOne(
      { _id: commentId },
      {
        $set: {
          user,
          password,
          content,
          createdAt: Date(),
        },
      }
    );
    res.status(200).json({
      success: true,
    });
  } else if (content === "") {
    res.status(400).json({
      message: "댓글을 입력해주세요",
    });
  } else {
    res.status(404).json({
      message: "존재하지 않거나 비밀번호가 맞지 않습니다",
    });
  }
});

router.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  // 게시물 삭제
  const { commentId } = req.params;
  const { password } = req.body;

  const existComments = await Comments.find({ _id: commentId });

  if (existComments.length && password === existComments[0].password) {
    await Comments.deleteOne({ _id: commentId });
    res.status(200).json({
      status: "success",
    });
  } else {
    res.status(400).json({
      status: "존재하지 않거나 비밀번호가 맞지 않습니다",
    });
  }
});

module.exports = router;
