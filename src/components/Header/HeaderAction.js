import clsx from "clsx";
import styles from "./Header.module.scss";
import Button from "~/components/Button";
import { PlusIcon, MessageIcon } from "~/components/Icons";
import Tippy from "@tippyjs/react";
import { FuiToast } from "~/untils/fuiToast";

export default function HeaderActions({ currentUser, setIsOpenModal,children ,isMobile}) {
  const handletest = () => {
    FuiToast("success", "This is a success message!", {
      duration: 3000,
    });
  };

  return (
    <div className={clsx({[styles.mobileActions]:isMobile},styles.actions)}>
      {currentUser ? (
        <>
          <Button text outline className={clsx(styles.btnUpload)} onClick={handletest}>
            <PlusIcon width="2rem" height="2rem" className={clsx(styles.actionIcon)} />
            Tải lên
          </Button>
          <Tippy delay={200} content="Tin nhắn" placement="bottom">
            <button className={clsx(styles.actionBtn)}>
              <MessageIcon className={clsx(styles.icon)} />
              <div className={clsx(styles.infoMess)}>13</div>
            </button>
          </Tippy>
        </>
      ) : (
        <>
          <Button onClick={handletest} text outline className={clsx(styles.btnUpload)}>
            <PlusIcon width="2rem" height="2rem" className={clsx(styles.actionIcon)} />
            Tải lên
          </Button>
          <Button primary onClick={() => setIsOpenModal(true)}>Đăng nhập</Button>
        </>
      )}
      {children}
    </div>
  );
}
