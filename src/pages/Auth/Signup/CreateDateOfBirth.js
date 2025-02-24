import clsx from "clsx";
import styles from "../Auth.module.scss";
import { Link } from "react-router-dom";
import { LogoIcon, QuestionIcon } from "~/components/Icons";
import config from "~/config";
import Button from "~/components/Button";
import { useState } from "react";
import BirthdayPicker from "~/components/BirthdayPicker";
function CreateDateOfBirth({ isModal = false }) {
  const [birthday, setBirthday] = useState({
    day: null,
    month: null,
    year: new Date().getFullYear(),
  });

  const birthdayError = !birthday.day || !birthday.month || !birthday.year;

  const handleBirthdayChange = (newValue) => {
    setBirthday(newValue);
  };

  const canNext = () => {
    return (
      birthday.day !== null && birthday.month !== null && birthday.year !== null
    );
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
          <div className={clsx(styles.divTitle)}>
            Ngày sinh của bạn là ngày nào?
          </div>
          <BirthdayPicker onChange={handleBirthdayChange} />
          {birthdayError && (
            <span className={clsx(styles.error)}>Vui lòng nhập đầy đủ ngày sinh.</span>
          )}
          <div className={clsx(styles.noteDescription)}>
            Ngày sinh của bạn sẽ không được hiển thị công khai.
          </div>
          <Button
            disabled={!canNext()}
            primary
            className={clsx(styles.btnLogin)}
          >
            Đăng ký
          </Button>

          <div className={clsx(styles.back)}>
            <Button to={config.routes.home} className={clsx(styles.btnBack)}>
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

export default CreateDateOfBirth;
