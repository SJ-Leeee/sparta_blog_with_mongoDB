# Blog 백엔드 구현 프로젝트

## 🖥️ 프로젝트 소개

express와 mongodb를 이용한 백엔드 프로젝트입니다.\

---

## 📌 주요 기능

#### 👌로그인 api

**POST**//<a>localhost:3000/api/auth</a>

- nickname, password 항목 req.body 로 전달
- DB값 검증
- 로그인시 JWT토큰을 생성해 res.cookie로 전달

#### 👌회원가입 api

**POST**//<a>localhost:3000/api/users</a>

- nickname, password, confirmPassword를 req.body로 전달
- DB값 nickname 중복 체크
- nickname, password 조건검사 후 DB에 저장

#### 👌게시물조회 api

**GET**//<a>localhost:3000/api/posts</a>

- 날짜 내림차순
- 토큰검사 x

#### 👌게시물작성 api

**POST**//<a>localhost:3000/api/posts</a>

- jwt토큰을 이용해 검증 후 작성 가능
- title, content 를 req.body로 전달
- nickname(locals.user), title, content, createdAt 을 DB에 저장

#### 👌게시물상세조회 api

**GET**//<a>localhost:3000/api/posts/:postId</a>

- 게시물 \_id를 postId의 역할로 req.param을 이용해 전달
- DB에 \_id를 매칭해 res.json으로 전달

#### 👌게시물수정 api

**PUT**//<a>localhost:3000/api/posts/:postId</a>

- 수정할 게시물 \_id를 postId의 역할로 req.param을 이용해 전달
- DB에 \_id를 매칭해 데이터 전달
- 데이터의 nickname값과 locals.user의 nickname값을 검증

#### 👌게시물삭제 api

**DELETE**//<a>localhost:3000/api/posts/:postId</a>

- 삭제할 게시물 \_id를 postId의 역할로 req.param을 이용해 전달
- DB에 \_id를 매칭해 데이터 전달
- 데이터의 nickname값과 locals.user의 nickname값을 검증
- isDelete를 req.body로 전달 ( y 이외에는 비동의 처리 )

#### 👌댓글조회 api

**GET**//<a>localhost:3000/api/posts/:postId/comments</a>

- 게시물 \_id를 postId의 역할로 req.param을 이용해 전달
- 날짜 내림차순
- 토큰검사 x

#### 👌댓글작성 api

**POST**//<a>localhost:3000/api/posts/:postId/comments</a>

- 게시물 \_id를 postId의 역할로 req.param을 이용해 전달
- jwt토큰을 이용해 검증 후 작성 가능
- content 를 req.body로 전달
- nickname(locals.user), title, content, createdAt 을 DB에 저장

#### 👌상세댓글조회 api

**GET**//<a>localhost:3000/api/posts/:postId/comments/:commentId</a>

- 게시물 \_id를 postId의 역할로 req.param을 이용해 전달
- 댓글 \_id를 commentId의 역할로 req.param을 이용해 전달

#### 👌댓글수정 api

**PUT**//<a>localhost:3000/api/posts/:postId/comments/:commentId</a>

- 게시물 \_id를 postId의 역할로 req.param을 이용해 전달
- 수정할 댓글 \_id를 commentId의 역할로 req.param을 이용해 전달
- DB에 댓글 \_id를 매칭해 데이터 전달
- 데이터의 nickname값과 locals.user의 nickname값을 검증

#### 👌댓글삭제 api

**DELETE**//<a>localhost:3000/api/posts/:postId/comments/:commentId</a>

- 게시물 \_id를 postId의 역할로 req.param을 이용해 전달
- 수정할 댓글 \_id를 commentId의 역할로 req.param을 이용해 전달
- DB에 댓글 \_id를 매칭해 데이터 전달
- 데이터의 nickname값과 locals.user의 nickname값을 검증
