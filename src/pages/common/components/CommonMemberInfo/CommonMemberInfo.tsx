import React, { FC, useEffect, useState } from "react";
import classNames from "classnames";
import { Popover } from "@headlessui/react";
import { ProposalService } from "@/services";
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
  const governanceCircles = Object.values(circles || {});
  const circleIds: string[] = Object.values(circlesMap || {});
  const [pendingCircles, setPendingCircles] = useState(
    new Map<string, boolean>(),
  );
  const filteredByIdCircles = getFilteredByIdCircles(
    governanceCircles,
    circleIds,
  );
  const userId = commonMember.userId;

  useEffect(() => {
    if (!commonId || !commonMember) {
      return;
    }

    const unsubscribe = ProposalService.subscribeToUserPendingCircleProposals(
      commonId,
      userId,
      (data) => {
        const pendingCircleMap = new Map<string, boolean>();
        governanceCircles.forEach(({ id: circleId }) => {
          pendingCircleMap.set(
            circleId,
            data.some((proposal) => proposal.data.args.circleId === circleId),
          );
        });

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
      />
      {isMobileVersion ? (
        <Portal>
          <PopoverPanel
            commonId={commonId}
            governanceCircles={governanceCircles}
            pendingCircles={pendingCircles}
            circleIds={circleIds}
          />
        </Portal>
      ) : (
        <PopoverPanel
          commonId={commonId}
          governanceCircles={governanceCircles}
          pendingCircles={pendingCircles}
          circleIds={circleIds}
        />
      )}
      <Portal>
        <PopoverPanel
          commonId={commonId}
          governanceCircles={governanceCircles}
          pendingCircles={pendingCircles}
          circleIds={circleIds}
        />
      </Portal>
    </Popover>
  );
};

export default CommonMemberInfo;
