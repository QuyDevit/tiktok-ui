import PropTypes from "prop-types";
import React from "react";
import styles from "./AccountItem.module.scss";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Image from "../Image";
import {Link} from "react-router-dom";

export default function AccountItem({data,onClick}) {
  return (
    <Link to={`/@${data.nickname}`} className={clsx(styles.wrapper)} onClick={onClick} >
      <Image
        className={clsx(styles.avatar)}
        src={data.avatar}
        alt={data.fullName}
      />
      <div className={clsx(styles.info)}>
        <h4 className={clsx(styles.name)}>
          <span>{data.fullName}</span>
          {data.tick && <FontAwesomeIcon
            className={clsx(styles.check)}
            icon={faCheckCircle}
          />}
        </h4>
        <span className={clsx(styles.username)}>{data.nickname}</span>
      </div>
    </Link>
  );
}

AccountItem.propTypes = {
  data:PropTypes.object.isRequired
}
