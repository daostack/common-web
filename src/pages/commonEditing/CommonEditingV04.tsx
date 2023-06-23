import React, { FC } from "react";
import { CommonCreationV04Page } from "../commonCreation";
import CommonEditing from "./CommonEditing";

const CommonEditingV04: FC = () => (
  <CommonEditing CommonCreationPage={CommonCreationV04Page} />
);

export default CommonEditingV04;
