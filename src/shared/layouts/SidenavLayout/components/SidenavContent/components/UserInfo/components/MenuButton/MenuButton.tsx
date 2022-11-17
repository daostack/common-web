import React, { FC } from "react";
import { Menu } from "@headlessui/react";
import { Content } from "../Content";

interface MenuButtonProps {
  avatarURL?: string;
  userName?: string;
}

const MenuButton: FC<MenuButtonProps> = (props) => {
  const { avatarURL, userName } = props;

  return (
    <Menu.Button as={React.Fragment}>
      <Content avatarURL={avatarURL} userName={userName} />
    </Menu.Button>
  );
};

export default MenuButton;
