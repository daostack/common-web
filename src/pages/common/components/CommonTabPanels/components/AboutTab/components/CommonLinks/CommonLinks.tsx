import React, { FC } from "react";
import classNames from "classnames";
import { Link2Icon } from "@/shared/icons";
import { CommonLink } from "@/shared/models";
import styles from "./CommonLinks.module.scss";

interface CommonLinksProps {
  className?: string;
  links?: CommonLink[];
}

const CommonLinks: FC<CommonLinksProps> = (props) => {
  const { className, links = [] } = props;

  if (links.length === 0) {
    return null;
  }

  return (
    <ul className={classNames(styles.list, className)}>
      {links.map((link, index) => (
        <li key={index} className={styles.listItem}>
          <a
            className={styles.link}
            href={link.value}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.linkIconWrapper}>
              <Link2Icon className={styles.linkIcon} />
            </span>
            {link.title}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default CommonLinks;
