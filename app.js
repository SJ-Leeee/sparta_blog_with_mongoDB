const express = require("express");
const connect = require("./schemas/index.js");
const cookieParser = require("cookie-parser");
const app = express(); // 앱 객체 만들기
const port = 3000;
const postsRouter = require("./routes/posts.js");
const usersRouter = require("./routes/users.js");
const authRouter = require("./routes/auth.js");

connect();

app.use(express.json());
app.use(cookieParser());
app.use("/api", [postsRouter, usersRouter, authRouter]);

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
