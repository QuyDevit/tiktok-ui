import Home from "~/pages/Home/";
import Following from "~/pages/Following";
import Profile from "~/pages/Profile/Profile";
import Upload from "~/pages/Upload";
import Search from "~/pages/Search";
import Live from "~/pages/Live";
import Friend from "~/pages/Friend";
import Explore from "~/pages/Explore";
import config from "~/config";

import { HeaderOnly } from "~/layouts";
import Message from "~/pages/Message";
import Login from "~/pages/Auth";
import Signup from "~/pages/Signup";
import {WithPhone,WithEmail} from "~/pages/Auth/Login";


const publicRoutes = [
  { path: config.routes.home, component: Home },
  { path: config.routes.following, component: Following,isFullWidth: true },
  { path: config.routes.upload, component: Upload, layout: HeaderOnly },
  { path: config.routes.search, component: Search, layout: null },
  { path: config.routes.profile, component: Profile ,isFullWidth: true},
  { path: config.routes.live, component: Live ,isFullWidth: true},
  { path: config.routes.friend, component: Friend ,isFullWidth: true},
  { path: config.routes.explore, component: Explore ,isFullWidth: true},
  { path: config.routes.message, component: Message ,isFullWidth: true},
  { path: config.routes.login, component: Login ,layout:null},
  { path: config.routes.signup, component: Signup ,layout:null},
  { path: config.routes.loginphone, component: WithPhone ,layout:null},
  { path: config.routes.loginemail, component: WithEmail ,layout:null},
];
const privateRoutes = [];

export { publicRoutes, privateRoutes };
