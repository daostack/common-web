import React, { FC } from "react";
import { SearchIcon } from "@/shared/icons";
import { ButtonIcon } from "@/shared/ui-kit";
import styles from "./SearchButton.module.scss";

interface SearchButtonProps {
  onClick: () => void;
}

const SearchButton: FC<SearchButtonProps> = (props) => {
  const { onClick } = props;

  return (
    <ButtonIcon className={styles.buttonIcon} onClick={onClick}>
      <SearchIcon />
    </ButtonIcon>
  );
};

export default SearchButton;
