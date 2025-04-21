import clsx from "clsx";
import styles from "./Header.module.scss";
import Button from "~/components/Button";
import { PlusIcon, MessageIcon } from "~/components/Icons";
import Tippy from "@tippyjs/react";
import { useDispatch } from "react-redux";
import { setOpenForm } from "~/store/features/formAuthSlice";
import config from "~/config";

export default function HeaderActions({ currentUser, children, isMobile }) {
  const dispatch = useDispatch();

  return (
    <div className={clsx({ [styles.mobileActions]: isMobile }, styles.actions)}>
      {currentUser ? (
        <>
          <Button to={config.routes.upload} text outline className={clsx(styles.btnUpload)}>
            <PlusIcon
              width="2rem"
              height="2rem"
              className={clsx(styles.actionIcon)}
            />
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
          <Button text outline className={clsx(styles.btnUpload)} onClick={()=> dispatch(setOpenForm(true))}>
            <PlusIcon
              width="2rem"
              height="2rem"
              className={clsx(styles.actionIcon)}
            />
            Tải lên
          </Button>
          <Button primary onClick={() => dispatch(setOpenForm(true))}>
            Đăng nhập
          </Button>
        </>
      )}
      {children}
    </div>
  );
}
