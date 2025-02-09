
import {  useState } from "react";
import {
  CloseIcon,
} from "../Icons";
import Modal from "../Modal";
import styles from "./AuthModal.module.scss";
import clsx from "clsx";
import Login from "~/pages/Auth";

function AuthModal({ isOpen, onClose }) {
    const [isFormLogin,setIsFormLogin] =useState(true)
  return (
    <Modal
      isOpen={isOpen}
      animationType="bounceIn"
      onClose={onClose}
      className={clsx(styles.container)}
    >
      <button className={clsx(styles.closeBtn)} onClick={onClose}>
        <CloseIcon width="2.55rem" height="2.55rem" />
      </button>
      <Login isModal={true} isOpen={isOpen} isFormLogin={isFormLogin} setIsFormLogin={setIsFormLogin}/>
    </Modal>
  );
}

export default AuthModal;
