import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";
import {
  Autocomplete,
  AutocompleteOption,
  Button,
  Dropdown,
  DropdownOption,
  ModalFooter,
} from "@/shared/components";
import { Form, TextField } from "@/shared/components/Form/Formik";
import { ProposalsTypes, ScreenSize } from "@/shared/constants";
import AvatarIcon from "@/shared/icons/avatar.icon";
import {
  Circle,
  CirclesPermissions,
  CommonMember,
  CommonMemberWithUserInfo,
  Governance,
} from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { getUserName } from "@/shared/utils";
import { StageName } from "../../StageName";
import { MemberInfo } from "../MemberInfo";
import { AssignCircleData } from "../types";
import { getAllowedCirclesToBeAssigned } from "./helpers";
import validationSchema from "./validationSchema";
import "./index.scss";

interface ConfigurationProps {
  governance: Governance;
  commonMember: CommonMember & CirclesPermissions;
  commonMembers: CommonMemberWithUserInfo[];
  initialData: AssignCircleData | null;
  onFinish: (data: AssignCircleData) => void;
}

interface FormValues {
  description: string;
}

const INITIAL_VALUES: FormValues = {
  description: "",
};

const Configuration: FC<ConfigurationProps> = (props) => {
  const {
    governance,
    commonMember: currentCommonMember,
    commonMembers,
    initialData,
    onFinish,
  } = props;
  const formRef = useRef<FormikProps<FormValues>>(null);
  const isInitialCircleUpdate = useRef(true);
  const [circle, setCircle] = useState<Circle | null>(
    initialData?.circle || null,
  );
  const [commonMember, setCommonMember] =
    useState<CommonMemberWithUserInfo | null>(
      initialData?.commonMember || null,
    );
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const governanceCircles = Object.values(governance.circles);
  const allowedCirclesToBeAssigned = useMemo(
    () =>
      getAllowedCirclesToBeAssigned(
        governanceCircles,
        currentCommonMember.allowedProposals[ProposalsTypes.ASSIGN_CIRCLE],
      ),
    [
      governance.circles,
      currentCommonMember.allowedProposals[ProposalsTypes.ASSIGN_CIRCLE],
    ],
  );
  const foundCircleId = governanceCircles.find(
    ({ id }) => id === circle?.id,
  )?.id;
  const circleOptions = useMemo<DropdownOption[]>(
    () =>
      allowedCirclesToBeAssigned.map((circle) => ({
        text: circle.name,
        searchText: circle.name,
        value: circle.id,
      })),
    [governanceCircles, allowedCirclesToBeAssigned],
  );
  const memberOptions = useMemo(
    () =>
      foundCircleId
        ? commonMembers.reduce<AutocompleteOption[]>(
            (acc, member) =>
              !member.circleIds.includes(foundCircleId)
                ? acc.concat({
                    text: (
                      <MemberInfo
                        className="assign-circle-configuration__member-info"
                        user={member.user}
                      />
                    ),
                    searchText: getUserName(member.user),
                    value: member.id,
                  })
                : acc,
            [],
          )
        : [],
    [commonMembers, foundCircleId],
  );

  const handleCircleSelect = (selectedCircleId: unknown) => {
    const circle = Object.values(governance.circles).find(
      ({ id }) => id === selectedCircleId,
    );
    setCircle(circle || null);
  };

  const handleCommonMemberSelect = (selectedCommonMemberId: unknown) => {
    const member = commonMembers.find(
      ({ id }) => id === selectedCommonMemberId,
    );
    setCommonMember(member || null);
  };

  const handleContinue = () => {
    formRef.current?.submitForm();
  };

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {
      if (circle && commonMember) {
        onFinish({
          circle,
          commonMember,
          description: values.description,
        });
      }
    },
    [circle, commonMember, onFinish],
  );

  useEffect(() => {
    if (isInitialCircleUpdate.current) {
      isInitialCircleUpdate.current = false;
      return;
    }

    setCommonMember(null);
  }, [circle?.id]);

  return (
    <div className="assign-circle-configuration">
      <StageName
        className="assign-circle-configuration__stage-name"
        name="Assign members to a circle"
        icon={
          <AvatarIcon className="assign-circle-configuration__avatar-icon" />
        }
      />
      <Formik
        initialValues={INITIAL_VALUES}
        onSubmit={handleSubmit}
        innerRef={formRef}
        validationSchema={validationSchema}
        validateOnMount
      >
        {({ isValid }) => (
          <Form className="assign-circle-configuration__form">
            {allowedCirclesToBeAssigned.length > 0 ? (
              <Dropdown
                className="assign-circle-configuration__circle-dropdown"
                options={circleOptions}
                value={circle?.id}
                onSelect={handleCircleSelect}
                label="Circle to assign to"
                placeholder="Select Circle"
                shouldBeFixed={false}
              />
            ) : (
              <p className="assign-circle-configuration__info-text">
                You don’t have permissions to assign circles
              </p>
            )}
            {circle && (
              <>
                {memberOptions.length > 0 ? (
                  <Autocomplete
                    className="assign-circle-configuration__member-autocomplete"
                    options={memberOptions}
                    value={commonMember?.id}
                    onSelect={handleCommonMemberSelect}
                    label="Member"
                    placeholder="Select Member"
                    shouldBeFixed={false}
                  />
                ) : (
                  <p className="assign-circle-configuration__info-text">
                    There are no common members to be assigned to the selected
                    circle.
                  </p>
                )}
              </>
            )}
            <TextField
              className="assign-circle-configuration__input"
              id="description"
              name="description"
              label="Description"
              rows={isMobileView ? 4 : 3}
              isTextarea
              styles={{
                label: "assign-circle-configuration__input-label",
              }}
            />
            <ModalFooter sticky>
              <div className="assign-circle-configuration__modal-footer">
                <Button
                  key="assign-circle-configuration"
                  className="assign-circle-configuration__submit-button"
                  onClick={handleContinue}
                  disabled={!commonMember || !isValid}
                  shouldUseFullWidth
                >
                  {isMobileView ? "Continue" : "Create Proposal"}
                </Button>
              </div>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Configuration;
