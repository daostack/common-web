import React, { FC, MouseEventHandler, ReactNode } from "react";
import { useSlate } from "slate-react";
import { useModal } from "@/shared/hooks";
import { Link2Icon, ListMarkIcon } from "@/shared/icons";
import { ElementType } from "../../constants";
import {
  checkIsListType,
  isElementActive,
  toggleElement,
  toggleList,
} from "../../utils";
import { ToolbarButton } from "../ToolbarButton";
import { LinkModal } from "./components";
import styles from "./ElementButton.module.scss";

interface ElementButtonProps {
  elementType: ElementType;
}

const getIconByFormat = (elementType: ElementType): ReactNode => {
  if (elementType === ElementType.Heading) {
    return <span className={styles.headingMarkIcon}>T</span>;
  }
  if (checkIsListType(elementType)) {
    return <ListMarkIcon className={styles.listMarkIcon} />;
  }
  if (elementType === ElementType.Link) {
    return <Link2Icon className={styles.linkMarkIcon} />;
  }

  return null;
};

const ElementButton: FC<ElementButtonProps> = (props) => {
  const { elementType } = props;
  const editor = useSlate();
  const {
    isShowing: isLinkModalOpen,
    onOpen: onLinkModalOpen,
    onClose: onLinkModalClose,
  } = useModal(false);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    if (checkIsListType(elementType)) {
      toggleList(editor, elementType);
    } else if (elementType === ElementType.Link) {
      onLinkModalOpen();
    } else {
      toggleElement(editor, elementType);
    }
  };

  return (
    <>
      <ToolbarButton
        active={isElementActive(editor, elementType)}
        onClick={handleClick}
      >
        {getIconByFormat(elementType)}
      </ToolbarButton>
      {elementType === ElementType.Link && (
        <LinkModal
          editor={editor}
          isShowing={isLinkModalOpen}
          onClose={onLinkModalClose}
        />
      )}
    </>
  );
};

export default ElementButton;
