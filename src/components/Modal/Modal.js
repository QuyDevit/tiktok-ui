import clsx from "clsx";
import styles from "./Modal.module.scss";
import { useEffect, useState } from "react";

function Modal({ children, className, isOpen, onClose,animationType = "fade", ...props }) {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setIsClosing(true);
            setTimeout(() => setIsClosing(false), 300); 
            document.body.style.overflow = "";
        }else{
            document.body.style.overflow = "hidden";
        }
    }, [isOpen]);

  return (
    <div className={clsx(styles.overlay,{ [styles.open]: isOpen,[styles.close]: isClosing })} onClick={onClose}>
      <div
        className={clsx(styles.modal,styles[animationType], className)}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
