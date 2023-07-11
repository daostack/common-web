import React, { FC } from "react";
import { Profile } from "@/pages/MyAccount/components/Profile";
import { MainRoutesProvider } from "@/shared/contexts";
import { CommonSidenavLayoutTabs } from "@/shared/layouts";
import { Container } from "@/shared/ui-kit";
import styles from "./Profile.module.scss";

const ProfilePage: FC = () => {
  return (
    <MainRoutesProvider>
      <Container className={styles.container}>
        <Profile />
      </Container>
      <CommonSidenavLayoutTabs className={styles.tabs} />
    </MainRoutesProvider>
  );
};

export default ProfilePage;
