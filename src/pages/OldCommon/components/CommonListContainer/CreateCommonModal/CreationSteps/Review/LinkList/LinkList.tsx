import React, { FC } from "react";
import { ButtonLink } from "@/shared/components";
import LinkIcon from "@/shared/icons/link.icon";
import { CommonLink } from "@/shared/models";
import "./index.scss";

interface LinkListProps {
  links: CommonLink[];
}

const LinkList: FC<LinkListProps> = ({ links }) => {
  if (links.length === 0) {
    return null;
  }

  return (
    <ul className="create-common-review-link-list">
      {links.map((link, index) => (
        <li key={index}>
          <ButtonLink
            key={index}
            className="create-common-review-link-list__link"
            href={link.value}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkIcon className="create-common-review-link-list__link-icon" />
            {link.title}
          </ButtonLink>
        </li>
      ))}
    </ul>
  );
};

export default LinkList;
