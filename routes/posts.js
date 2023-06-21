const express = require("express");
const router = express.Router();
const Posts = require("../schemas/posts.js");
const Comments = require("../schemas/commnets.js");
const authMiddleware = require("../auth-middlewares/auth-middleware.js");

router.get("/posts", async (req, res) => {
  // 게시물 조회
  const posts = await Posts.find();
  showPost = posts.map((post) => {
    return {
      _id: post.id,
      nickname: post.nickname,
      title: post.title,
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
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
    };
  });
  if (getPost.length === 0) {
    return res.status(400).json({ message: "게시물이 존재하지 않습니다." });
  }
  res.status(200).json({ detail: result });
});

router.post("/posts", authMiddleware, async (req, res) => {
  // 게시물 등록
  const { nickname } = res.locals.user;
  const { title, content } = req.body;
  const createPosts = await Posts.create({
    nickname,
    title,
    content,
  });

  res.json({ message: "성공적으로 저장되었습니다." });
});

router.put("/posts/:postId", authMiddleware, async (req, res) => {
  // 게시물 수정
  const { nickname } = res.locals.user;
  const { postId } = req.params;
  const { title, content } = req.body;
  const existsPosts = await Posts.find({ _id: postId });
  if (existsPosts.length && existsPosts[0].nickname === nickname) {
    await Posts.updateOne(
      { _id: postId },
      {
        $set: {
          nickname: nickname,
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
    message: "게시물이 존재하지 않거나 수정권한이 없습니다.",
  });
});

router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  // 게시물 삭제
  const { nickname } = res.locals.user;
  const { postId } = req.params;
  const { isDelete } = req.body;

  const existsPosts = await Posts.find({ _id: postId });

  if (
    existsPosts.length &&
    existsPosts[0].nickname === nickname &&
    isDelete === "y"
  ) {
    await Posts.deleteOne({ _id: postId });
    return res.status(200).json({
      status: "success",
    });
  } else if (isDelete !== "y") {
    return res.status(400).json({
      message: "삭제동의(isDelete)를 작성하세요",
    });
  }
  res.status(400).json({
    message: "게시물이 존재하지 않거나 수정권한이 없습니다.",
  });
});

router.post("/posts/:postId/comments",authMiddleware, async (req, res) => {
  const { nickname } = res.locals.user;
  const { postId } = req.params;
  const existsPosts = await Posts.find({ _id: postId });
  const { content } = req.body;
  if (existsPosts.length) {
    const createComments = await Comments.create({
      nickname,
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
      nickname: comment.nickname,
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
      nickname: comment.nickname,
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
  const { nickname, password, content } = req.body;

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
          nickname,
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
