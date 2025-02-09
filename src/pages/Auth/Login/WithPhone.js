import clsx from "clsx";
import styles from "../Auth.module.scss";
import { Link } from "react-router-dom";
import { LogoIcon, QuestionIcon } from "~/components/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faChevronLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/Button";
import { useState } from "react";
import PhoneCountrySelect from "~/components/PhoneCountrySelect";
import config from "~/config";
function WithEmail({ isModal = false }) {
  const [isPassword, setIsPassword] = useState(false);
  const [isShowPass, setIsShowPass] = useState(false);
  const [showSelection, setShowSelection] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // Error states
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [canSendCode, setCanSendCode] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState({
    name: "Vietnam (+84)",
    code: "84",
    abbr: "VN",
  });
  // Kiểm tra Số điện thoại hợp lệ
  const validatePhone  = (value) => {
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
    setPasswordError(validatePassword(password));
  };
  const handleCodeChange = (e) => {
    const value = e.target.value;
    setVerificationCode(value);
    setCodeError(validateCode(verificationCode));
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
        <div
          className={clsx(styles.LoginOptionContainer)}
          style={{ height: isModal ? "368px" : "416px" }}
        >
          <div
            className={clsx(styles.divDescription)}
            style={{ width: isModal ? "336px" : "360px" }}
          >
            <label>Điện thoại</label>
            <Link to={config.routes.loginemail} className={clsx(styles.link)}>
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
            />
          </div>
          {phoneError && <span className={clsx(styles.error)}>{phoneError}</span>}
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
                />
                <button
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
                />
                <Button disabled={!canSendCode} className={clsx(styles.btnSendCode)}>
                  Gửi mã
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
          {isPassword && (
            <>
              <button className={clsx(styles.link)}>Quên mật khẩu?</button>
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
          <Button disabled={!canLogin()} primary className={clsx(styles.btnLogin)}>
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
