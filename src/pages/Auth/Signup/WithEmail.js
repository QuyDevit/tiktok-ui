import clsx from "clsx";
import styles from "../Auth.module.scss";
import { Link } from "react-router-dom";
import { LogoIcon, QuestionIcon } from "~/components/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/Button";
import { useEffect, useRef, useState } from "react";
import config from "~/config";
import BirthdayPicker from "~/components/BirthdayPicker";
import { useDispatch } from "react-redux";
import { setFormType } from "~/store/features/formAuthSlice";
import * as registerService from "~/services/auth/register";
import * as authHelper from "~/helpers";
import { useNavigate } from "react-router-dom";

function WithEmail({ isModal = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [isShowPass, setIsShowPass] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [birthday, setBirthday] = useState({
    day: null,
    month: null,
    year: new Date().getFullYear(),
  });

  // Error states
  const [inputError, setInputError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [reponesmessage, setReponesMessage] = useState("");

  const timerRef = useRef(null);

  const handleBirthdayChange = (newValue) => {
    setBirthday(newValue);
    checkCanSendCode(inputValue, password, newValue);
  };

  const startCountdown = () => {
    setIsDisabled(true);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsDisabled(false);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const validateEmail = (value) => {
    if (!value) {
      return "Vui lòng nhập email";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Email không hợp lệ";
    }
  };

  // Kiểm tra mật khẩu hợp lệ
  const validatePassword = (value) => {
    if (value.length < 6) {
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

  const checkCanSendCode = (email, pass, birth) => {
    const emailError = validateEmail(email);
    const passError = validatePassword(pass);
    const isBirthdayComplete =
      birth.day !== null && birth.month !== null && birth.year !== null;

    setIsDisabled(!(!emailError && !passError && isBirthdayComplete));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const error = validateEmail(value);
    setInputError(error);
    checkCanSendCode(value, password, birthday);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    const error = validatePassword(value);
    setPasswordError(error);
    checkCanSendCode(inputValue, value, birthday);
  };
  const handleCodeChange = (e) => {
    const value = e.target.value;
    setVerificationCode(value);
    const error = validateCode(value);
    setCodeError(error);
  };
  const handleFormTypeChange = (e, option) => {
    if (isModal) {
      e.preventDefault();
      dispatch(setFormType(option));
    }
  };

  const handleRegisterOtp = () => {
    startCountdown();
    const fetchApi = async () => {
      const result = await registerService.registerotp("email", "", inputValue);
      if (!result.success) {
        clearInterval(timerRef.current);
        setIsDisabled(false);
        setCountdown(60);
      }
      setReponesMessage(result.message);
    };
    fetchApi();
  };
  const handleRegisterUser = () => {
    setReponesMessage("");
    const fetchApi = async () => {
      const result = await registerService.registeruser(
        "email",
        "",
        inputValue,
        password,
        new Date(birthday.year, birthday.month, birthday.day),
        verificationCode
      );
      if (!result.success) {
        setCodeError(result.message);
      } else {
        authHelper.authcookie.setRefreshTokenExpiry();
        if (isModal) {
          dispatch(setFormType("signup-username"));
        } else {
          navigate(config.routes.createusername);
        }
      }
    };
    fetchApi();
  };
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  // Kiểm tra xem có thể đăng ký không
  const canSignup = () => {
    return (
      inputValue &&
      !inputError &&
      verificationCode &&
      !codeError &&
      password &&
      !passwordError &&
      birthday.day !== null &&
      birthday.month !== null &&
      birthday.year !== null
    );
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
        <h2 className={clsx(styles.header)}>Đăng ký</h2>
        <div
          className={clsx(styles.LoginOptionContainer)}
          style={{ height: isModal ? "368px" : "500px" }}
        >
          <div className={clsx(styles.divTitle)}>
            Ngày sinh của bạn là ngày nào?
          </div>
          <BirthdayPicker onChange={handleBirthdayChange} />
          <div className={clsx(styles.noteDescription)}>
            Ngày sinh của bạn sẽ không được hiển thị công khai.
          </div>
          <div
            className={clsx(styles.divDescription)}
            style={{ width: isModal ? "336px" : "360px" }}
          >
            <label>Email</label>
            <Link
              to={config.routes.signupphone}
              className={clsx(styles.link)}
              onClick={(e) => handleFormTypeChange(e, "signup-phone")}
            >
              Đăng ký bằng số điện thoại
            </Link>
          </div>
          <div className={clsx(styles.divInput)}>
            <input
              type="text"
              placeholder="Địa chỉ Email"
              value={inputValue}
              onChange={handleInputChange}
              className={clsx(styles.inputWrapper)}
            />
          </div>
          {inputError && (
            <span className={clsx(styles.error)}>{inputError}</span>
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
          {passwordError && (
            <span className={clsx(styles.error)}>{passwordError}</span>
          )}
          {reponesmessage && (
            <span className={clsx(styles.error)}>{reponesmessage}</span>
          )}
          <div className={clsx(styles.divInput)}>
            <input
              // key="code"
              type="text"
              placeholder="Nhập mã gồm 6 chữ số"
              className={clsx(styles.inputWrapper)}
              onChange={handleCodeChange}
            />
            <Button
              disabled={isDisabled}
              className={clsx(styles.btnSendCode)}
              onClick={handleRegisterOtp}
            >
              {countdown < 60 ? `${countdown}s` : "Gửi mã"}
            </Button>
          </div>
          {codeError && <span className={clsx(styles.error)}>{codeError}</span>}

          <Button
            disabled={!canSignup()}
            primary
            className={clsx(styles.btnLogin)}
            onClick={handleRegisterUser}
          >
            Tiếp
          </Button>

          <div className={clsx(styles.back)}>
            <Button
              to={config.routes.signup}
              className={clsx(styles.btnBack)}
              onClick={(e) => handleFormTypeChange(e, "signup")}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                style={{ marginRight: "8px", marginBottom: "2px" }}
              />
              Quay lại
            </Button>
          </div>
        </div>
        <div className={clsx(styles.divAgreement)}>
          <p style={isModal ? undefined : { width: "337px" }}>
            Bằng việc tiếp tục với tài khoản có vị trí tại
            <strong> Việt Nam </strong>, bạn đồng ý với
            <strong> Điều khoản dịch vụ</strong>, đồng thời xác nhận rằng bạn đã
            đọc <strong>Chính sách quyền riêng tư </strong>
            của chúng tôi.
          </p>
        </div>
      </div>
      <div className={clsx(styles.divFooter)}>
        <div className={clsx(styles.divNote)}>
          <span>Bạn đã có tài khoản?</span>
          <Link
            to={config.routes.login}
            className={clsx(styles.btnLink)}
            onClick={(e) => handleFormTypeChange(e, "login")}
          >
            Đăng nhập
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
