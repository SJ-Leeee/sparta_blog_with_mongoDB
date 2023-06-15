const express = require("express");
const router = express.Router();
const Posts = require("../schemas/posts.js");

router.get("/posts", async (req, res) => {
  // 게시물 조회
  const posts = await Posts.find();
  result = posts.map((post) => {
    return {
      _id: post.id,
      user: post.user,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
    };
  });
  res.json({ posts: result });
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

router.get("/posts/:_Id", async (req, res) => {
  // 게시물 상세 조회
  const { _Id } = req.params;
  const posts = await Posts.find();

  // let result = null;

  // for (const good of goods) {
  //   if (Number(goodsId) === good.goodsId) {
  //     result = good;
  //   }
  // }

  result = posts.filter((post) => _Id === post.id);
  res.status(200).json({ detail: result });
});

router.put("/posts/:_Id", async (req, res) => {
  // 게시물 수정
  const { _Id } = req.params;
  const { user, password, title, content } = req.body;

  const existsPosts = await Posts.find({ _id: _Id });

  if (existsPosts.length && password === existsPosts[0].password) {
    await Posts.updateOne(
      { _id: _Id },
      {
        $set: {
          user: user,
          password: password,
          title: title,
          content: content,
        },
      }
    );
    res.status(200).json({
      success: true,
    });
  }
  res.status(400).json({
    message: "존재하지 않거나 비밀번호가 맞지 않습니다",
  });
});

router.delete("/posts/:_Id", async (req, res) => {
  // 게시물 삭제
  const { _Id } = req.params;

  const existsPosts = await Posts.find({ _id: _Id });

  if (existsPosts.length) {
    await Posts.deleteOne({ _id: _Id });
    res.status(200).json({
      status: "success",
    });
  } else {
    res.status(400).json({
      status: "존재하지 않습니다",
    });
  }
});

module.exports = router;
