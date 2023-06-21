const express = require("express");
const router = express.Router();

const User = require("../schemas/users.js");
// const authMiddleware = require("../auth-middlewares/auth-middleware");

// 내 정보 조회 API
// router.get("/users/me", authMiddleware, async (req, res) => {
//   const { email, nickname } = res.locals.user;

//   res.status(200).json({
//     user: { email, nickname },
//   });
// });

// 회원가입 API
router.post("/users", async (req, res) => {
  const { nickname, password, confirmPassword } = req.body;

  const regex = /^[a-zA-Z0-9]{3,}$/;
  const idCheck = regex.test(nickname);

  if (!idCheck) {
    res.status(400).json({
      errorMessage:
        "nickname을 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9) 으로 작성하세요",
    });
    return;
  }

  if (password.length < 4 || password.includes(nickname)) {
    res.status(400).json({
      errorMessage:
        "password를 nickname 을 포함하지 않으면서 최소 4자 이상으로 작성하세요",
    });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({
      errorMessage: "password이 confirmPassword과 다릅니다.",
    });
    return;
  }

  // nickname이 동일한 데이터가 있는지 확인하기 위해 가져온다.
  const existsUsers = await User.findOne({ nickname });
  if (existsUsers) {
    // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않습니다.
    res.status(400).json({
      errorMessage: "닉네임이 이미 사용중입니다.",
    });
    return;
  }

  const user = new User({ nickname, password });
  await user.save();

  res.status(201).json({ message: "회원가입 성공!" });
});

module.exports = router;

// - 닉네임, 비밀번호, 비밀번호 확인을 **request**에서 전달받기
// - 닉네임은 `최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)`로 구성하기
// - 비밀번호는 `최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패`로 만들기
// - 비밀번호 확인은 비밀번호와 정확하게 일치하기
// - 데이터베이스에 존재하는 닉네임을 입력한 채 회원가입 버튼을 누른 경우 "중복된 닉네임입니다." 라는 에러메세지를 **response**에 포함하기
