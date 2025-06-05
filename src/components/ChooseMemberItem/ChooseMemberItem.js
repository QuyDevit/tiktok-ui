import clsx from "clsx";
import styles from "./ChooseMemberItem.module.scss";
import Image from "../Image";

function ChooseMemberItem({ data, type = "group", isSelected, onSelect }) {
  return (
    <div className={clsx(styles.container)} onClick={onSelect}>
      <input
        type={type === "group" ? "checkbox" : "radio"}
        className={clsx(styles.checkItem)}
        checked={isSelected}
        onChange={() => {}}
      />
      <div className={clsx(styles.infoMember)}>
        <div className={clsx(styles.avatarWrapper)}>
          <Image src={data?.avatar} alt={data?.fullName} />
        </div>
        <p className={clsx(styles.userName)}>{data?.fullName}</p>
      </div>
    </div>
  );
}

export default ChooseMemberItem;
