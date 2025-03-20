import clsx from "clsx";
import styles from "./Header.module.scss";
import { MeunuIcon, CloseIcon } from "~/components/Icons";
import HeaderActions from "./HeaderAction";

export default function HeaderMobile({ isMenuOpen, setIsMenuOpen, currentUser,children }) {
  const handleMenuOpen = () => setIsMenuOpen(true);
  const handleMenuClose = () => setIsMenuOpen(false);

  return (
    <div className={clsx(styles.mobileNav)}>
      <button className={clsx(styles.menuAction)} onClick={handleMenuOpen}>
        <MeunuIcon />
      </button>

      <div className={clsx(styles.menuWrapper, { [styles.open]: isMenuOpen })}>
        <button className={styles.closeMenu} onClick={handleMenuClose}>
          <CloseIcon />
        </button>
        <HeaderActions currentUser={currentUser} isMobile={true}/>
        {children}
      </div>
      
    </div>
  );
}
