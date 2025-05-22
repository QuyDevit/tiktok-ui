import clsx from "clsx";
import styles from "../Auth.module.scss";
import { Link, useNavigate } from "react-router-dom";
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
import { useDispatch } from "react-redux";
import { setFormType } from "~/store/features/formAuthSlice";
import { authlogin } from "~/services/auth/login";
import { authcookie } from "~/helpers";

function WithEmail({ isModal = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isShowPass, setIsShowPass] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [reponesMessage, setReponesMessage] = useState("");

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
    setPasswordError(validatePassword(value));
  };

  const handleFormTypeChange = (e, option) => {
    if (isModal) {
      e.preventDefault();
      dispatch(setFormType(option));
    }
  };
  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    if (canLogin()) {
      handleLogin();
    } else {
      e.preventDefault();
    }
  };
  const handleLogin = async () => {
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    const result = await authlogin("email", inputValue, password);
    if (result.success) {
      authcookie.setRefreshTokenExpiry();
      if (!isModal) {
        navigate(config.routes.home);
      } else {
        window.location.reload();
      }
    } else {
      setReponesMessage(result.message);
    }
    setIsLoggingIn(false);
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
        <form
          className={clsx(styles.LoginOptionContainer)}
          style={{ height: isModal ? "unset" : "416px" }}
          onSubmit={(e) => e.preventDefault()}
        >
          <div
            className={clsx(styles.divDescription)}
            style={{ width: isModal ? "336px" : "360px" }}
          >
            <label>Email hoặc TikTok ID</label>
            <Link
              to={config.routes.loginphone}
              className={clsx(styles.link)}
              onClick={(e) => handleFormTypeChange(e, "login-phone")}
            >
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
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={() => setIsShowPass((prev) => !prev)}
              className={clsx(styles.iconPassword)}
            >
              <FontAwesomeIcon icon={isShowPass ? faEye : faEyeSlash} />
            </button>
          </div>
          {passwordError && (
            <span className={clsx(styles.error)}>{passwordError}</span>
          )}
          {reponesMessage && (
            <span className={clsx(styles.error)}>{reponesMessage}</span>
          )}

          <Link
            to={config.routes.resetwithemail}
            className={clsx(styles.link)}
            onClick={(e) => handleFormTypeChange(e, "resetpass-phone")}
          >
            Quên mật khẩu?
          </Link>
          <Button
            disabled={!canLogin()}
            primary
            className={clsx(styles.btnLogin)}
            type="submit"
            onClick={handleLogin}
          >
            Đăng nhập
          </Button>

          <div className={clsx(styles.back)}>
            <Button
              to={config.routes.login}
              className={clsx(styles.btnBack)}
              onClick={(e) => handleFormTypeChange(e, "login")}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                style={{ marginRight: "8px", marginBottom: "2px" }}
              />
              Quay lại
            </Button>
          </div>
        </form>
      </div>
      <div className={clsx(styles.divFooter)}>
        <div className={clsx(styles.divNote)}>
          <span>Bạn không có tài khoản?</span>
          <Link
            to={config.routes.signup}
            className={clsx(styles.btnLink)}
            onClick={(e) => handleFormTypeChange(e, "signup")}
          >
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
