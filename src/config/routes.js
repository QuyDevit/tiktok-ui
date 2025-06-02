const routes = {
  home: "/",
  following: "/following",
  upload: "/upload",
  search: "/search",
  searchaccount: "/search/user",
  searchvideo: "/search/video",
  profile: "/:nickname",
  videoDetail: "/video/:videoId",
  live: "/live",
  friend: "/friends",
  message: "/messages",
  explore: "/explore",
  login: "/login",
  loginphone: "/login/phone-or-email/phone",
  loginemail: "/login/phone-or-email/email",
  resetwithphone: "/login/phone/forget-password",
  resetwithemail: "/login/email/forget-password",
  signup: "/signup",
  signupphone: "/signup/phone-or-email/phone",
  signupemail: "/signup/phone-or-email/email",
  createusername: "/signup/create-username",
  createdateofbirth: "/signup/create-birthdate",
};

export const pagesTitle = {
  [routes.home]: "TikTok | Make Your Day",
  [routes.following]:
    "Đang theo dõi | Xem video từ những người sáng tạo bạn theo dõi | TikTok",
  [routes.live]: "TikTok LIVE | TikTok",
  [routes.search]: (search) => `Tìm '${search}' trên TikTok | Tìm kiếm TikTok`,
  [routes.profile]: (name, username) =>
    `${name} (@${username}) TikTok | Xem video TikTok mới nhất của ${name}`,
  [routes.videoDetail]: (description, username) =>
    `${description} | (@${username}) | TikTok`,
  [routes.upload]: "Tải lên | TikTok",
  [routes.explore]: "Khám phá | TikTok",
  [routes.friend]: "Bạn bè | TikTok",
  [routes.message]: "Tin nhắn | TikTok",
  [routes.login]: "Đăng nhập | TikTok",
  [routes.signup]: "Đăng ký | TikTok",
};

export default routes;
