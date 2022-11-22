import React, { FC } from "react";
import classNames from "classnames";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Button, ButtonSize, ButtonVariant } from "@/shared/ui-kit";
import { formatPrice } from "@/shared/utils";
import { KeyValueItem, KeyValuePairs } from "./components";
import styles from "./CommonHeader.module.scss";

interface CommonHeaderProps {
  commonSrc: string;
  commonName: string;
  description: string;
  joinButtonText?: string;
}

const CommonHeader: FC<CommonHeaderProps> = (props) => {
  const {
    commonSrc,
    commonName,
    description,
    joinButtonText = "Join the effort",
  } = props;
  const isTabletView = useIsTabletView();
  const isJoinButtonVisible = !isTabletView;
  const items: KeyValueItem[] = [
    {
      id: "available-funds",
      name: "Available Funds",
      value: formatPrice(142100, { shouldMillify: false }),
    },
    {
      id: "members",
      name: "Members",
      value: "182",
    },
  ];

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <img
          className={styles.commonImage}
          src={commonSrc}
          alt={`${commonName}'s image`}
        />
        <div>
          <h1 className={styles.commonName} title={commonName}>
            {commonName}
          </h1>
          <p className={styles.description} title={description}>
            {description}
          </p>
        </div>
      </header>
      <div className={styles.rightHalf}>
        {isJoinButtonVisible && (
          <Button
            className={classNames(styles.joinButton, {
              [styles.joinButtonWithMargin]: true,
            })}
            variant={ButtonVariant.OutlineBlue}
            size={ButtonSize.Medium}
          >
            {joinButtonText}
          </Button>
        )}
        <KeyValuePairs items={items} />
      </div>
    </section>
  );
};

export default CommonHeader;
