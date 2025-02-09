import styles from "./Auth.module.scss";
import clsx from "clsx";
import {
  AppleIcon,
  FacebookIcon,
  GoogleIcon,
  KakaoTalkIcon,
  LineIcon,
  LogoIcon,
  QRIcon,
  QuestionIcon,
  UserIcon,
} from "~/components/Icons";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import config from "~/config";
const AUTH_OPTIONS = [
  {
    icon: <QRIcon />,
    title: "Đăng nhập với QR",
    to: "/qrcode",
  },
  {
    icon: <UserIcon width="2rem" height="2rem" />,
    title: "Sử dụng SĐT/ email / tên người dùng",
    titleSignup: "Sử dụng số điện thoại hoặc email",
    to: config.routes.loginphone,
  },
  {
    icon: <FacebookIcon />,
    title: "Tiếp tục với Facebook",
  },
  {
    icon: <GoogleIcon />,
    title: "Tiếp tục với Google",
  },
  {
    icon: <LineIcon />,
    title: "Tiếp tục với LINE",
  },
  {
    icon: <KakaoTalkIcon />,
    title: "Tiếp tục với KakaoTalk",
  },
  {
    icon: <AppleIcon />,
    title: "Tiếp tục với Apple",
  },
];
function Auth({ isModal = false, isOpen, isFormLogin = true, setIsFormLogin }) {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  const handleAuthTypeChange = (e) => {
    if (isModal) {
      e.preventDefault();
      setIsFormLogin(!isFormLogin);
    }
  };
  return (
    <div
      className={clsx(styles.container)}
      style={{ height: isModal ? "unset" : "100vh" }}
    >
      {!isModal && (
        <div className={clsx(styles.divHeaderContainer)}>
          <Link to={config.routes.home}>
            <LogoIcon />
          </Link>
          <Link to={config.routes.feedback} className={clsx(styles.feedback)}>
            <QuestionIcon />
            <span>Phản hồi và trợ giúp</span>
          </Link>
        </div>
      )}
      <div className={clsx(styles.divPageWrapper)}>
        <h2 className={clsx(styles.header)}>
          {isFormLogin ? "Đăng nhập vào" : "Đăng ký"} TikTok
        </h2>
        <div
          className={clsx(styles.LoginOptionContainer)}
          style={{ height: isModal ? "368px" : "unset" }}
          ref={scrollContainerRef}
        >
          {(isFormLogin ? AUTH_OPTIONS : AUTH_OPTIONS.slice(1)).map(
            (option, index) => {
              const Comp = !isModal && option.to ? Link : "div";
              const props = !isModal && option.to ? { to: option.to } : {};
              return (
                <Comp
                  key={index}
                  className={clsx(styles.divBoxContainer)}
                  style={{ width: isModal ? "336px" : "360px" }}
                  {...props}
                >
                  <div className={clsx(styles.divIconContainer)}>
                    {option.icon}
                  </div>
                  <div className={clsx(styles.divTextContainer)}>
                    {index === 0 && !isFormLogin
                      ? option.titleSignup
                      : option.title}
                  </div>
                </Comp>
              );
            }
          )}
        </div>
        <div className={clsx(styles.divAgreement)}>
          <p>
            Bằng việc tiếp tục với tài khoản có vị trí tại{" "}
            <strong>Việt Nam</strong>, bạn đồng ý với{" "}
            <strong>Điều khoản dịch vụ</strong>, đồng thời xác nhận rằng bạn đã
            đọc <strong>Chính sách quyền riêng tư </strong>
            của chúng tôi.
          </p>
        </div>
      </div>
      <div className={clsx(styles.divFooter)}>
        <div className={clsx(styles.divNote)}>
          <span>Bạn {isFormLogin ? "không có" : "đã có"} tài khoản?</span>
          <Link
            to={isFormLogin ? config.routes.signup : config.routes.login}
            className={clsx(styles.btnLink)}
            onClick={handleAuthTypeChange}
          >
            {isFormLogin ? "Đăng ký" : "Đăng nhập"}
          </Link>
        </div>
        {!isModal && (
          <div className={clsx(styles.divBottom)}>
            <div className={clsx(styles.divLanguage)}>
              <select>
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className={clsx(styles.divCopyRight)}>
              © {new Date().getFullYear()} Tiktok
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Auth;
