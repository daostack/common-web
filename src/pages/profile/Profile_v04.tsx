import React, { FC, useState } from "react";
import { Profile } from "@/pages/MyAccount/components/Profile";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { RoutesV04Provider } from "@/shared/contexts";
import { CommonSidenavLayoutTabs } from "@/shared/layouts";
import { Container } from "@/shared/ui-kit";
import styles from "./Profile.module.scss";

const ProfilePage_v04: FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <RoutesV04Provider>
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
    </RoutesV04Provider>
  );
};

export default ProfilePage_v04;
