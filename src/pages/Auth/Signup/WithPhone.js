import clsx from "clsx";
import styles from "../Auth.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { LogoIcon, QuestionIcon } from "~/components/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/Button";
import { useRef, useState } from "react";
import PhoneCountrySelect from "~/components/PhoneCountrySelect";
import config from "~/config";
import BirthdayPicker from "~/components/BirthdayPicker";
import { useDispatch } from "react-redux";
import { setFormType } from "~/store/features/formAuthSlice";
import { registerotp, registeruser } from "~/services/auth/register";
import { authcookie } from "~/helpers";

function WithPhone({ isModal = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [birthday, setBirthday] = useState({
    day: null,
    month: null,
    year: new Date().getFullYear(),
  });
  const [showSelection, setShowSelection] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [reponesmessage, setReponesMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  const timerRef = useRef(null);

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

  // Error states
  const [phoneError, setPhoneError] = useState("");
  const [codeError, setCodeError] = useState("");

  const handleBirthdayChange = (newValue) => {
    setBirthday(newValue);
    checkCanSendCode(inputValue, newValue);
  };

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

  // Kiểm tra mã xác thực
  const validateCode = (value) => {
    if (!value) {
      return "Vui lòng nhập mã xác thực";
    }
    if (!/^\d{6}$/.test(value)) {
      return "Mã xác thực phải gồm 6 chữ số";
    }
  };
  const checkCanSendCode = (phone, birth) => {
    const phoneError = validatePhone(phone);
    const isBirthdayComplete =
      birth.day !== null && birth.month !== null && birth.year !== null;

    setIsDisabled(!(!phoneError && isBirthdayComplete));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const error = validatePhone(value);
    setPhoneError(error);
    checkCanSendCode(value, birthday);
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
  const handleRegisterOtp = () => {
    startCountdown();
    const fetchApi = async () => {
      const result = await registerotp("phone", inputValue, "");
      if (!result.success) {
        clearInterval(timerRef.current);
        setIsDisabled(false);
        setCountdown(60);
      }
      setCodeError("Mã xác thực của bạn là: " + result.data);
      setReponesMessage(result.message);
    };
    fetchApi();
  };
  const handleRegisterUser = () => {
    setReponesMessage("");
    const fetchApi = async () => {
      const result = await registeruser(
        "phone",
        inputValue,
        "",
        "",
        new Date(birthday.year, birthday.month, birthday.day),
        verificationCode
      );
      if (!result.success) {
        setCodeError(result.message);
      } else {
        authcookie.setRefreshTokenExpiry();
        if (isModal) {
          dispatch(setFormType("signup-username"));
        } else {
          navigate(config.routes.createusername);
        }
      }
    };
    fetchApi();
  };
  // Kiểm tra xem có thể đăng ký không
  const canSignup = () => {
    return (
      inputValue &&
      !phoneError &&
      verificationCode &&
      !codeError &&
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
          style={{ height: isModal ? "368px" : "440px" }}
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
            <label>Điện thoại</label>
            <Link
              to={config.routes.signupemail}
              className={clsx(styles.link)}
              onClick={(e) => handleFormTypeChange(e, "signup-email")}
            >
              Đăng ký bằng email
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
          {phoneError && (
            <span className={clsx(styles.error)}>{phoneError}</span>
          )}
          {reponesmessage && (
            <span className={clsx(styles.error)}>{reponesmessage}</span>
          )}
          <div className={clsx(styles.divInput)}>
            <input
              key="code"
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

export default WithPhone;
