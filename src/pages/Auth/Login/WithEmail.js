import clsx from "clsx";
import styles from "../Auth.module.scss";
import { Link } from "react-router-dom";
import { LogoIcon, QuestionIcon } from "~/components/Icons";
import config from "~/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/Button";
import { useState } from "react";
function WithEmail({ isModal = false }) {
  const [isShowPass, setIsShowPass] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (value) => {
    if (!value) {
      return "Vui lòng nhập Email hoặc TikTok ID";
    }
  };

  const validatePassword = (value) => {
    if (value.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const error = validateEmail(value);
    setEmailError(error);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(password));
  };

  const canLogin = () => {
    return inputValue && !emailError && password && !passwordError;
  };
  return (
    <div
      className={clsx(styles.container)}
      style={{ height: isModal ? "unset" : "100vh" }}
    >
      {!isModal && (
        <div className={clsx(styles.divHeaderContainer)}>
          <Link to="/">
            <LogoIcon />
          </Link>
          <Link to={config.routes.feedback} className={clsx(styles.feedback)}>
            <QuestionIcon />
            <span>Phản hồi và trợ giúp</span>
          </Link>
        </div>
      )}
      <div className={clsx(styles.divPageWrapper)}>
        <h2 className={clsx(styles.header)}>Đăng nhập</h2>
        <div
          className={clsx(styles.LoginOptionContainer)}
          style={{ height: isModal ? "368px" : "416px" }}
        >
          <div
            className={clsx(styles.divDescription)}
            style={{ width: isModal ? "336px" : "360px" }}
          >
            <label>Email hoặc TikTok ID</label>
            <Link to={config.routes.loginphone} className={clsx(styles.link)}>
              Đăng nhập bằng số điện thoại
            </Link>
          </div>
          <div className={clsx(styles.divInput)}>
            <input
              type="text"
              placeholder="Email hoặc TikTok ID"
              value={inputValue}
              onChange={handleInputChange}
              className={clsx(styles.inputWrapper)}
            />
          </div>
          {emailError && (
            <span className={clsx(styles.error)}>{emailError}</span>
          )}
          <div className={clsx(styles.divInput)}>
            <input
              type={isShowPass ? "text" : "password"}
              placeholder="Mật khẩu"
              value={password}
              onChange={handlePasswordChange}
              className={clsx(styles.inputWrapper)}
              style={{ paddingInlineEnd: "50px" }}
            />
            <button
              onClick={() => setIsShowPass((prev) => !prev)}
              className={clsx(styles.iconPassword)}
            >
              <FontAwesomeIcon icon={isShowPass ? faEye : faEyeSlash} />
            </button>
          </div>
          { passwordError && (
            <span className={clsx(styles.error)}>{passwordError}</span>
          )}

          <button className={clsx(styles.link)}>Quên mật khẩu?</button>
          <Button
            disabled={!canLogin()}
            primary
            className={clsx(styles.btnLogin)}
          >
            Đăng nhập
          </Button>

          <div className={clsx(styles.back)}>
            <Button to={"/login"} className={clsx(styles.btnBack)}>
              <FontAwesomeIcon
                icon={faChevronLeft}
                style={{ marginRight: "8px", marginBottom: "2px" }}
              />
              Quay lại
            </Button>
          </div>
        </div>
      </div>
      <div className={clsx(styles.divFooter)}>
        <div className={clsx(styles.divNote)}>
          <span>Bạn không có tài khoản?</span>
          <Link to={"/signup"} className={clsx(styles.btnLink)}>
            Đăng ký
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

export default WithEmail;
