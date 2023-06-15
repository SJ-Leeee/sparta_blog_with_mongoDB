const express = require("express");
const connect = require("./schemas/index.js");
const app = express(); // 앱 객체 만들기
const port = 3000;
const postsRouter = require("./routes/posts.js")


connect();

app.use(express.json()); 

app.use("/api", [postsRouter]);


app.listen(port, () => {
    console.log(port, "포트로 서버가 열렸어요!");
  });

