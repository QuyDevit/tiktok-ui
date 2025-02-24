import clsx from "clsx";
import styles from "../Auth.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { LogoIcon, QuestionIcon } from "~/components/Icons";
import config from "~/config";
import Button from "~/components/Button";
import { useState } from "react";
import * as updateInfoUser from "~/services/users/updateInfoUser";
function CreateName({ isModal = false }) {
    const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");

  const [inputError, setInputError] = useState("");

  const validateInput = (value) => {
    if (!value) {
      return "Vui lòng nhập TikTok ID";
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const error = validateInput(value);
    setInputError(error);
  };
  const handleNext = () =>{
    if(isModal){
      window.location.reload();
    }else{
      navigate(config.routes.home)
    }
  }
  const handleSubmit =() => {
    const fetchApi = async() =>{
      const result = await updateInfoUser.updateNickname(inputValue);
      if(!result.success){
        setInputError(result.message)
      }else{
        if(isModal){
          window.location.reload();
        }else{
          navigate(config.routes.home)
        }
      }
    }
    fetchApi();
  }
  const canNext = () => {
    return inputValue && !inputError;
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
        <h2 className={clsx(styles.header)}>Đăng ký</h2>
        <div
          className={clsx(styles.LoginOptionContainer)}
          style={{ height: isModal ? "368px" : "416px" }}
        >
          <div
            className={clsx(styles.divDescription)}
            style={{ width: isModal ? "336px" : "360px" }}
          >
            <label>Tạo TikTok ID</label>
          </div>
          <div className={clsx(styles.divInput)}>
            <input
              type="text"
              placeholder="TikTok ID"
              value={inputValue}
              onChange={handleInputChange}
              className={clsx(styles.inputWrapper)}
            />
          </div>
          {inputError && (
            <span className={clsx(styles.error)}>{inputError}</span>
          )}
          <div className={clsx(styles.noteDescription)}>
            Bạn có thể thay đổi điều này sau.
          </div>
          <Button
            disabled={!canNext()}
            primary
            className={clsx(styles.btnLogin)}
            onClick={handleSubmit}
          >
            Đăng ký
          </Button>

          <div className={clsx(styles.back)}>
            <Button to={config.routes.home} className={clsx(styles.btnBack)} onClick={handleNext}>
              Bỏ qua
            </Button>
          </div>
        </div>
      </div>
      <div className={clsx(styles.divFooter)}>
        <div className={clsx(styles.divNote)}>
          <span>Bạn không có tài khoản?</span>
          <Link to={config.routes.signup} className={clsx(styles.btnLink)}>
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

export default CreateName;
