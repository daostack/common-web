import React, { FC } from "react";
import { Profile } from "@/pages/MyAccount/components/Profile";
import { Container } from "@/shared/ui-kit";
import styles from "./Profile.module.scss";

const ProfilePage: FC = () => {
  return (
    <Container className={styles.container}>
      <Profile />
    </Container>
  );
};

export default ProfilePage;
