import React, { useEffect, useCallback, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import classNames from "classnames";

import { Proposal } from "@/shared/models";
import { ProposalListItem, ProposalDetailModal } from "../../../../Common/components";
import { Loader, Modal } from "@/shared/components";
import { useModal } from "@/shared/hooks";
import { ROUTE_PATHS, ScreenSize } from "@/shared/constants";
import {
    selectUserProposalList,
    selectCurrentProposal,
    selectCommonDetail,
} from "../../../../Common/store/selectors";
import { selectUser } from "../../../../Auth/store/selectors";
import {
  getLoading,
  getScreenSize,
} from "../../../../../shared/store/selectors";
import {
    getCommonDetail,
    loadUserProposalList,
    loadProposalDetail,
    clearCurrentProposal,
    closeCurrentCommon,
} from "../../../../Common/store/actions";
import "./index.scss";

const MyProposalsContainer: FC = () => {
    const dispatch = useDispatch();
    const proposals = useSelector(selectUserProposalList());
    const user = useSelector(selectUser());
    const currentProposal = useSelector(selectCurrentProposal());
    const currentCommon = useSelector(selectCommonDetail());
    const loading = useSelector(getLoading());
    const screenSize = useSelector(getScreenSize());
    const { isShowing, onOpen, onClose } = useModal(false);
    const isMobileView = screenSize === ScreenSize.Mobile;

    const commonMember = currentCommon?.members.find(
        (member) => member.userId === user?.uid
    );
    const isCommonMember = Boolean(commonMember);

    const getProposalDetail = useCallback(
        (payload: Proposal) => {
        dispatch(loadProposalDetail.request(payload));
        onOpen();
        },
        [dispatch, onOpen]
    );

    const closeModalHandler = useCallback(() => {
        onClose();
        dispatch(clearCurrentProposal());
    }, [onClose, dispatch]);

    useEffect(() => {
        if (proposals.length === 0 && user?.uid)
            dispatch(loadUserProposalList.request(user?.uid));
    }, [dispatch, proposals, user]);

    useEffect(() => {
        if (!currentProposal) return;

        dispatch(
            getCommonDetail.request({
                payload: currentProposal?.commonId,
            })
        );

        return () => {
            dispatch(closeCurrentCommon());
        };
    }, [dispatch, currentProposal]);

    return (
        <>
            {
                isShowing && <Modal
                    isShowing={isShowing}
                    onClose={closeModalHandler}
                    mobileFullScreen
                    className={classNames("proposals", {
                        "mobile-full-screen": isMobileView,
                    })}
                    isHeaderSticky
                    shouldShowHeaderShadow={false}
                    styles={{
                        headerWrapper: "my-proposals__detail-modal-header-wrapper",
                    }}
                >
                    <ProposalDetailModal
                        proposal={currentProposal}
                        common={currentCommon}
                        onOpenJoinModal={() => true}
                        isCommonMember={isCommonMember}
                        isJoiningPending={false}
                    />
                </Modal>
            }
            <div className="my-proposals">
                <h2 className="my-proposals_header">
                    <NavLink
                        to={ROUTE_PATHS.MY_ACCOUNT_ACTIVITIES}
                    >
                        <img src="/icons/left-arrow.svg" alt="left-arrow" />
                        Proposals ({proposals.length})
                    </NavLink>
                </h2>
                {loading ? <Loader /> : null}
                <div className="my-proposals_proposals-list">
                    {
                        proposals.map(
                            proposal =>
                                <ProposalListItem
                                    proposal={proposal}
                                    key={proposal.id}
                                    loadProposalDetails={getProposalDetail}
                                />
                        )
                    }
                </div>
            </div>
        </>
    );
};

export default MyProposalsContainer;
