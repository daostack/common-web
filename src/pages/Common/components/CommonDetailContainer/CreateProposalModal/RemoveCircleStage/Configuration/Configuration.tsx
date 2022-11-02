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
import { selectUser } from "@/pages/Auth/store/selectors";
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
  CommonMember,
  CommonMemberWithUserInfo,
  Governance,
} from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { getUserName } from "@/shared/utils";
import { getAllowedCirclesToBeAssigned } from "../../AssignCircleStage/Configuration/helpers";
import { StageName } from "../../StageName";
import { MemberInfo } from "../MemberInfo";
import { RemoveCircleData } from "../types";
import validationSchema from "./validationSchema";
import "./index.scss";

interface ConfigurationProps {
  governance: Governance;
  commonMember: CommonMember;
  commonMembers: CommonMemberWithUserInfo[];
  initialData: RemoveCircleData | null;
  onFinish: (data: RemoveCircleData) => void;
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
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const governanceCircles = Object.values(governance.circles);
  const allowedCirclesToBeRemoved = useMemo(
    () =>
      getAllowedCirclesToBeAssigned(
        governanceCircles,
        currentCommonMember.allowedProposals[ProposalsTypes.REMOVE_CIRCLE],
      ),
    [
      governance.circles,
      currentCommonMember.allowedProposals[ProposalsTypes.REMOVE_CIRCLE],
    ],
  );
  const foundCircleId = governanceCircles.find(
    ({ id }) => id === circle?.id,
  )?.id;
  const circleOptions = useMemo<DropdownOption[]>(
    () =>
      allowedCirclesToBeRemoved.map((circle) => ({
        text: circle.name,
        searchText: circle.name,
        value: circle.id,
      })),
    [governanceCircles, allowedCirclesToBeRemoved],
  );
  const memberOptions = useMemo(
    () =>
      foundCircleId
        ? commonMembers.reduce<AutocompleteOption[]>(
            (acc, member) =>
              member.userId !== userId &&
              Object.values(member.circles.map).includes(foundCircleId)
                ? acc.concat({
                    text: (
                      <MemberInfo
                        className="remove-circle-configuration__member-info"
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
    [commonMembers, userId, foundCircleId],
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
    <div className="remove-circle-configuration">
      <StageName
        className="remove-circle-configuration__stage-name"
        name="Remove members from a circle"
        icon={
          <AvatarIcon className="remove-circle-configuration__avatar-icon" />
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
          <Form className="remove-circle-configuration__form">
            {allowedCirclesToBeRemoved.length > 0 ? (
              <Dropdown
                className="remove-circle-configuration__circle-dropdown"
                options={circleOptions}
                value={circle?.id}
                onSelect={handleCircleSelect}
                label="Circle to remove from"
                placeholder="Select Circle"
                shouldBeFixed={false}
              />
            ) : (
              <p className="remove-circle-configuration__info-text">
                You don’t have permissions to remove circles
              </p>
            )}
            {circle && (
              <>
                {memberOptions.length > 0 ? (
                  <Autocomplete
                    className="remove-circle-configuration__member-autocomplete"
                    options={memberOptions}
                    value={commonMember?.id}
                    onSelect={handleCommonMemberSelect}
                    label="Member"
                    placeholder="Select Member"
                    shouldBeFixed={false}
                  />
                ) : (
                  <p className="remove-circle-configuration__info-text">
                    There are no common members to be removed from the selected
                    circle.
                  </p>
                )}
              </>
            )}
            <TextField
              className="remove-circle-configuration__input"
              id="description"
              name="description"
              label="Description"
              rows={isMobileView ? 4 : 3}
              isTextarea
              styles={{
                label: "remove-circle-configuration__input-label",
              }}
            />
            <ModalFooter sticky>
              <div className="remove-circle-configuration__modal-footer">
                <Button
                  key="remove-circle-configuration"
                  className="remove-circle-configuration__submit-button"
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
