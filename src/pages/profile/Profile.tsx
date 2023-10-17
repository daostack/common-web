import React, { FC, useState } from "react";
import { Profile } from "@/pages/MyAccount/components/Profile";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { MainRoutesProvider } from "@/shared/contexts";
import { CommonSidenavLayoutTabs } from "@/shared/layouts";
import { Container } from "@/shared/ui-kit";
import styles from "./Profile.module.scss";

const ProfilePage: FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <MainRoutesProvider>
      <Container
        className={styles.container}
        viewports={[
          ViewportBreakpointVariant.Desktop,
          ViewportBreakpointVariant.Laptop,
        ]}
      >
        <Profile onEditingChange={setIsEditing} />
      </Container>
      {!isEditing && <CommonSidenavLayoutTabs className={styles.tabs} />}
    </MainRoutesProvider>
  );
};

export default ProfilePage;
