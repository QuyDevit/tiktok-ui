import { useDispatch } from "react-redux";
import clsx from "clsx";
import styles from "./Alert.module.scss";
import { hide, useAlert } from "~/store/features/alertSlice";
import { useEffect, useRef } from "react";

function Alert() {
  const dispatch = useDispatch();
  const { isShow, message } = useAlert();
  const timerRef = useRef(null);

  useEffect(() => {
    if (isShow) {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        dispatch(hide());
      }, 5000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dispatch, isShow]);
  return (
    isShow && (
      <div className={clsx(styles.container)}>
        <span>{message}</span>
      </div>
    )
  );
}

export default Alert;
