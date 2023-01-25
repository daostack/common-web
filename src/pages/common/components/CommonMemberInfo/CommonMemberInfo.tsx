import React, { FC, useEffect, useState, useMemo } from "react";
import classNames from "classnames";
import { Popover } from "@headlessui/react";
import { CommonService, ProposalService } from "@/services";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { Portal } from "@/shared/ui-kit";
import {
  getCirclesWithHighestTier,
  getFilteredByIdCircles,
} from "@/shared/utils";
import { PopoverPanel, PopoverButton } from "./components";
import styles from "./CommonMemberInfo.module.scss";

interface CommonMemberInfoProps {
  className?: string;
  circles: Governance["circles"];
  circlesMap?: (CommonMember & CirclesPermissions)["circles"]["map"];
  commonId: string;
  commonMember: CommonMember;
  isMobileVersion?: boolean;
}

const CommonMemberInfo: FC<CommonMemberInfoProps> = (props) => {
  const {
    className,
    circles,
    circlesMap,
    commonMember,
    commonId,
    isMobileVersion,
  } = props;
  const governanceCircles = useMemo(
    () => Object.values(circles || {}),
    [circles],
  );
  const circleIds: string[] = useMemo(
    () => Object.values(circlesMap || {}),
    [circlesMap],
  );
  const [pendingCircles, setPendingCircles] = useState(
    new Map<string, boolean>(),
  );
  const [circleMembersCount, setCircleMembersCount] = useState(
    new Map<string, number>(),
  );
  const [pendingCircleName, setPendingCircleName] = useState("");
  const filteredByIdCircles = getFilteredByIdCircles(
    governanceCircles,
    circleIds,
  );
  const userId = commonMember.userId;

  useEffect(() => {
    if (!governanceCircles.length) {
      return;
    }

    const unsubscribe = CommonService.subscribeToCircleMemberCountByCircleIds(
      {
        commonId,
        circleIds: governanceCircles.map(({ id }) => id),
      },
      (circlesCountMap) => {
        setCircleMembersCount(circlesCountMap);
      },
    );

    return unsubscribe;
  }, [governanceCircles]);

  useEffect(() => {
    if (!commonId || !commonMember) {
      return;
    }

    const unsubscribe = ProposalService.subscribeToUserPendingCircleProposals(
      commonId,
      userId,
      (data) => {
        const pendingCircleMap = new Map<string, boolean>();
        let circleName = "";
        governanceCircles.forEach(({ id: circleId, name }) => {
          const isPendingCircle = data.some(
            (proposal) => proposal.data.args.circleId === circleId,
          );

          if (isPendingCircle) {
            circleName = name;
          }
          pendingCircleMap.set(circleId, isPendingCircle);
        });

        setPendingCircleName(circleName);
        setPendingCircles(pendingCircleMap);
      },
    );

    return unsubscribe;
  }, [commonId, userId, governanceCircles]);

  const circleNames = getCirclesWithHighestTier(filteredByIdCircles)
    .map(({ name }) => name)
    .join(", ");

  return (
    <Popover className={classNames(styles.container, className)}>
      <PopoverButton
        isMobileVersion={isMobileVersion}
        circleNames={circleNames}
        pendingCircleName={pendingCircleName}
      />
      {isMobileVersion ? (
        <Portal>
          <PopoverPanel
            commonId={commonId}
            governanceCircles={governanceCircles}
            pendingCircles={pendingCircles}
            circleIds={circleIds}
            userId={userId}
            circleMembersCount={circleMembersCount}
          />
        </Portal>
      ) : (
        <PopoverPanel
          commonId={commonId}
          governanceCircles={governanceCircles}
          pendingCircles={pendingCircles}
          circleIds={circleIds}
          userId={userId}
          circleMembersCount={circleMembersCount}
        />
      )}
    </Popover>
  );
};

export default CommonMemberInfo;
