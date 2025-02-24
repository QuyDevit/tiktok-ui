import Button from "~/components/Button";
import styles from "./Menu.module.scss";
import clsx from "clsx";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

function MenuItem({ data, onClick }) {
  const { icon, title, to, separate, isSelected  } = data;
  const classes = clsx(styles.item, {
    [styles.separate]: separate,
  });
  return (
    <Button leftIcon={icon} to={ to !=="/logout" ? to :undefined} className={classes} onClick={onClick}>
      {title}{" "}
      {isSelected  && (
        <FontAwesomeIcon icon={faCheck} className={styles.checkIcon} />
      )}
    </Button>
  );
}

MenuItem.propTypes = {
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
};
export default MenuItem;
