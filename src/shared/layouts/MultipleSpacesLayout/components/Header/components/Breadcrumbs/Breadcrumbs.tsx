import React, { FC } from "react";
import { RightArrowThinIcon } from "@/shared/icons";
import { ProjectsStateItem } from "@/store/states";
import { BreadcrumbsItem } from "./components";
import styles from "./Breadcrumbs.module.scss";

const Breadcrumbs: FC = () => {
  const items: ProjectsStateItem[] = [
    {
      commonId: "1",
      image: "",
      name: "Common 1",
      directParent: null,
    },
    {
      commonId: "2",
      image: "",
      name: "Common 2 asd adsaasdasdasdasdaadasdasdadadadadadadadasd",
      directParent: null,
    },
    {
      commonId: "3",
      image: "",
      name: "Common 3",
      directParent: null,
    },
  ];

  return (
    <ul className={styles.container}>
      <BreadcrumbsItem activeItemId="1" items={items} />
      <li className={styles.iconItem}>
        <RightArrowThinIcon />
      </li>
      <BreadcrumbsItem activeItemId="2" items={items} />
    </ul>
  );
};

export default Breadcrumbs;
