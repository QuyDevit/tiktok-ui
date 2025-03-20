import { CloseIcon } from "../Icons";
import Modal from "../Modal";
import styles from "./AuthModal.module.scss";
import clsx from "clsx";
import Auth from "~/pages/Auth";
import { useDispatch, useSelector } from "react-redux";
import { selectformType, setFormType, setOpenForm } from "~/store/features/formAuthSlice";
import { WithEmail, WithPhone, ResetPassword } from "~/pages/Auth/Login";
import { SignupEmail, SignupPhone, CreateName } from "~/pages/Auth/Signup";
import { useEffect } from "react";

function AuthModal({ isOpen }) {
  const dispatch = useDispatch();
  const currentForm = useSelector(selectformType);
  useEffect(() => {
    if (!isOpen) {
      dispatch(setFormType("login"));
    }
  }, [isOpen]);

  const renderForm = () => {
    switch (currentForm) {
      case "login":
        return <Auth isModal={true} isOpen={isOpen} />;
      case "signup":
        return <Auth isModal={true} isOpen={isOpen} isFormLogin={false} />;
      case "login-email":
        return <WithEmail isModal={true} />;
      case "login-phone":
        return <WithPhone isModal={true} />;
      case "resetpass-phone":
        return <ResetPassword isModal={true} resetWith="phone" />;
      case "resetpass-email":
        return <ResetPassword isModal={true} resetWith="email" />;
      case "signup-email":
        return <SignupEmail isModal={true} />;
      case "signup-phone":
        return <SignupPhone isModal={true} />;
      case "signup-username":
        return <CreateName isModal={true} />;

      default:
        return <Auth isModal={true} isOpen={isOpen} />;
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      animationType="bounceIn"
      // onClose={onClose}
      className={clsx(styles.container)}
    >
      <button className={clsx(styles.closeBtn)} onClick={() => dispatch(setOpenForm(false))}>
        <CloseIcon width="2.55rem" height="2.55rem" />
      </button>
      {renderForm()}
    </Modal>
  );
}

export default AuthModal;
