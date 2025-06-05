import Home from "~/pages/Home/";
import Following from "~/pages/Following";
import Profile from "~/pages/Profile";
import Upload from "~/pages/Upload";
import Search from "~/pages/Search";
import Live from "~/pages/Live";
import Friend from "~/pages/Friend";
import Explore from "~/pages/Explore";
import config from "~/config";

import { HeaderOnly } from "~/layouts";
import Message from "~/pages/Message";
import Auth from "~/pages/Auth";
import { WithPhone, WithEmail, ResetPassword } from "~/pages/Auth/Login";
import {
  SignupPhone,
  SignupEmail,
  CreateName,
  CreateDateOfBirth,
} from "~/pages/Auth/Signup";
import VideoDetail from "~/pages/VideoDetail";

const publicRoutes = [
  { path: config.routes.home, component: Home },
  { path: config.routes.following, component: Following, isFullWidth: true },
  { path: config.routes.upload, component: Upload, layout: HeaderOnly },
  { path: config.routes.search, component: Search },
  { path: config.routes.searchaccount, component: Search },
  { path: config.routes.searchvideo, component: Search },
  { path: config.routes.profile, component: Profile, isFullWidth: true },
  {
    path: config.routes.videoDetail,
    component: VideoDetail,
    isFullWidth: true,
  },
  { path: config.routes.live, component: Live, isFullWidth: true },
  { path: config.routes.friend, component: Friend, isFullWidth: true },
  { path: config.routes.explore, component: Explore, isFullWidth: true },
  {
    path: config.routes.message,
    component: Message,
    isFullWidth: true,
    layout: HeaderOnly,
  },
  { path: config.routes.login, component: Auth, layout: null },
  {
    path: config.routes.loginphone,
    component: () => <WithPhone />,
    layout: null,
  },
  {
    path: config.routes.loginemail,
    component: () => <WithEmail />,
    layout: null,
  },
  {
    path: config.routes.resetwithemail,
    component: () => <ResetPassword resetWith="email" />,
    layout: null,
  },
  {
    path: config.routes.resetwithphone,
    component: () => <ResetPassword resetWith="phone" />,
    layout: null,
  },
  {
    path: config.routes.signup,
    component: () => <Auth isFormLogin={false} />,
    layout: null,
  },
  {
    path: config.routes.signupphone,
    component: () => <SignupPhone />,
    layout: null,
  },
  {
    path: config.routes.signupemail,
    component: () => <SignupEmail />,
    layout: null,
  },
  { path: config.routes.createusername, component: CreateName, layout: null },
  {
    path: config.routes.createdateofbirth,
    component: CreateDateOfBirth,
    layout: null,
  },
];
const privateRoutes = [];

export { publicRoutes, privateRoutes };
