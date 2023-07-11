import React, { FC } from "react";
import { Profile } from "@/pages/MyAccount/components/Profile";
import { RoutesV04Provider } from "@/shared/contexts";
import { CommonSidenavLayoutTabs } from "@/shared/layouts";
import { Container } from "@/shared/ui-kit";
import styles from "./Profile.module.scss";

const ProfilePage_v04: FC = () => {
  return (
    <RoutesV04Provider>
      <Container className={styles.container}>
        <Profile />
      </Container>
      <CommonSidenavLayoutTabs className={styles.tabs} />
    </RoutesV04Provider>
  );
};

export default ProfilePage_v04;
