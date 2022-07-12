import React, { FC, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { Common, Proposal } from "@/shared/models";
import { useCommonMember } from "@/containers/Common/hooks";
import { ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { MemberAdmittance } from "../../../../../shared/models/governance/proposals";
import { selectCurrentProposal } from "../../../store/selectors";
import { Modal } from "../../../../../shared/components";
import ProposalItemComponent from "../ProposalsComponent/ProposalItemComponent";
import { clearCurrentProposal, loadProposalDetail } from "../../../store/actions";
import { useModal } from "../../../../../shared/hooks";
import { ProposalDetailModal } from "../ProposalDetailModal";



interface ProposalsListComponentProps {
    proposals: MemberAdmittance[];
    common: Common;
    emptyText: string;
}


const ProposalsList: FC<ProposalsListComponentProps> = ({ proposals, common, emptyText }) => {
    const {
        fetched: isCommonMemberFetched,
        data: commonMember,
        fetchCommonMember,
    } = useCommonMember();
    const { isShowing, onOpen, onClose } = useModal(false);

    const dispatch = useDispatch()
    const currentProposal = useSelector(selectCurrentProposal());

    const screenSize = useSelector(getScreenSize());

    const isMobileView = useMemo(() => screenSize === ScreenSize.Mobile, [screenSize]);

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
        fetchCommonMember(common.id)
    }, [])

    return <div className="proposals-component-wrapper">
        <Modal
            isShowing={isShowing}
            onClose={closeModalHandler}
            mobileFullScreen
            className={classNames("proposals", {
                "mobile-full-screen": isMobileView,
            })}
            isHeaderSticky
            shouldShowHeaderShadow={false}
        >
            <ProposalDetailModal
                proposal={currentProposal}
                common={common}
                onOpenJoinModal={() => null}
                commonMember={commonMember}
                isCommonMemberFetched={isCommonMemberFetched}

            />
        </Modal>
        {Boolean(proposals.length) && proposals.map((proposal) => (
            <ProposalItemComponent
                key={proposal.id}
                proposal={proposal}
                loadProposalDetail={getProposalDetail}
                commonMember={commonMember}
            />
        ))}
        {!proposals.length && <p className="proposals-component-wrapper-empty-text">{emptyText}</p>}
    </div >
}


export default ProposalsList;