import clsx from "clsx";
import styles from "../Auth.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { LogoIcon, QuestionIcon } from "~/components/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faChevronLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/Button";
import { useRef, useState } from "react";
import PhoneCountrySelect from "~/components/PhoneCountrySelect";
import config from "~/config";
import { useDispatch } from "react-redux";
import { setFormType } from "~/store/features/formAuthSlice";
import { sendotp, authlogin } from "~/services/auth/login";
import * as authHelper from "~/helpers";

function WithPhone({ isModal = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(60);
  const [isPassword, setIsPassword] = useState(false);
  const [isShowPass, setIsShowPass] = useState(false);
  const [showSelection, setShowSelection] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [canSendCode, setCanSendCode] = useState(false);

  const timerRef = useRef(null);

  // Error states
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [reponesmessage, setReponesMessage] = useState("");

  const [selectedCountry, setSelectedCountry] = useState({
    name: "Vietnam (+84)",
    code: "84",
    abbr: "VN",
  });
  // Kiểm tra Số điện thoại hợp lệ
  const validatePhone = (value) => {
    if (!value) {
      return "Vui lòng nhập số điện thoại";
    }
    const phoneRegex = /^\d{9,15}$/;
    if (!phoneRegex.test(value)) {
      return "Số điện thoại không hợp lệ";
    }
  };

  // Kiểm tra mật khẩu hợp lệ
  const validatePassword = (value) => {
    if (isPassword && value.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }
  };
  // Kiểm tra mã xác thực
  const validateCode = (value) => {
    if (!value) {
      return "Vui lòng nhập mã xác thực";
    }
    if (!/^\d{6}$/.test(value)) {
      return "Mã xác thực phải gồm 6 chữ số";
    }
  };

  const startCountdown = () => {
    setCanSendCode(false);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanSendCode(true);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const error = validatePhone(value);
    setPhoneError(error);
    setCanSendCode(!error);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };
  const handleCodeChange = (e) => {
    const value = e.target.value;
    setVerificationCode(value);
    const error = validateCode(value);
    setCodeError(error);
  };

  const handleCountrySelect = (option) => {
    if (option) {
      setSelectedCountry(option);
    }
    setShowSelection(false);
  };
  const handleToggle = () => {
    setShowSelection((prev) => !prev);
  };

  const handleFormTypeChange = (e, option) => {
    if (isModal) {
      e.preventDefault();
      dispatch(setFormType(option));
    }
  };

  const handleLoginOtp = () => {
    startCountdown();
    const fetchApi = async () => {
      const result = await sendotp(inputValue);
      if (!result.success) {
        clearInterval(timerRef.current);
        setCanSendCode(true);
        setCountdown(60);
      }
      setReponesMessage(`${result.message}  ${result.data ? `--- ${result.data}` : ""}`);
    };
    fetchApi();
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
    const result = await authlogin("phone", inputValue,isPassword ? password : verificationCode,isPassword ? false : true);
    if (result.success) {
      authHelper.authcookie.setRefreshTokenExpiry();
      if (!isModal) {
        navigate(config.routes.home);
      } else {
        window.location.reload();
      }
    }else{
      setReponesMessage(result.message)
    }
  };

  // Kiểm tra xem có thể đăng nhập không
  const canLogin = () => {
    if (isPassword) {
      return inputValue && !phoneError && password && !passwordError;
    }
    return inputValue && !phoneError && verificationCode && !codeError;
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
            <label>Điện thoại</label>
            <Link
              to={config.routes.loginemail}
              className={clsx(styles.link)}
              onClick={(e) => handleFormTypeChange(e, "login-email")}
            >
              Đăng nhập bằng email hoặc tên người dùng
            </Link>
          </div>
          <div className={clsx(styles.divInput)}>
            <PhoneCountrySelect
              showSelection={showSelection}
              onSelect={handleCountrySelect}
              selectedCountry={selectedCountry}
            >
              <div
                className={clsx(styles.divAreaSelection)}
                onClick={handleToggle}
              >
                <span className={clsx(styles.label)}>
                  {selectedCountry.abbr} +{selectedCountry.code}
                </span>
                <span
                  className={clsx(
                    styles.iconSelection,
                    showSelection ? styles.open : styles.closed
                  )}
                >
                  <FontAwesomeIcon icon={faCaretDown} />
                </span>
              </div>
            </PhoneCountrySelect>
            <input
              type="text"
              placeholder="Số điện thoại"
              value={inputValue}
              onChange={handleInputChange}
              className={clsx(styles.inputWrapper)}
              onKeyDown={handleKeyDown}
            />
          </div>
          {phoneError && (
            <span className={clsx(styles.error)}>{phoneError}</span>
          )}
          <div className={clsx(styles.divInput)}>
            {isPassword ? (
              <>
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
              </>
            ) : (
              <>
                <input
                  key="code"
                  type="text"
                  placeholder="Nhập mã gồm 6 chữ số"
                  className={clsx(styles.inputWrapper)}
                  onChange={handleCodeChange}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  type="button"
                  disabled={!canSendCode}
                  className={clsx(styles.btnSendCode)}
                  onClick={handleLoginOtp}
                >
                  {countdown < 60 ? `${countdown}s` : "Gửi mã"}
                </Button>
              </>
            )}
          </div>
          {isPassword && passwordError && (
            <span className={clsx(styles.error)}>{passwordError}</span>
          )}
          {!isPassword && codeError && (
            <span className={clsx(styles.error)}>{codeError}</span>
          )}
          {reponesmessage && (
            <span className={clsx(styles.error)}>{reponesmessage}</span>
          )}
          {isPassword && (
            <>
              <Link
                to={config.routes.resetwithphone}
                className={clsx(styles.link)}
                onClick={(e) => handleFormTypeChange(e, "resetpass-phone")}
              >
                Quên mật khẩu?
              </Link>
              <span className={clsx(styles.splitLine)}></span>
            </>
          )}
          <button
            className={clsx(styles.link)}
            onClick={() => {
              setIsPassword((prev) => !prev);
              setPasswordError("");
              setCodeError("");
              setPassword("");
              setVerificationCode("");
            }}
          >
            {isPassword ? "Đăng nhập bằng mã" : "Đăng nhập với Mật khẩu"}
          </button>
          <Button
            type="submit"
            disabled={!canLogin()}
            primary
            className={clsx(styles.btnLogin)}
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

export default WithPhone;
