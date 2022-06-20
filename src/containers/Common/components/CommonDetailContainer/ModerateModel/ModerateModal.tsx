import React, {useCallback} from "react";
import {ElementDropdownMenuItems, Modal} from "@/shared/components";
import {ModerateModalAction, MODERATION_TYPES, ModerationActionType} from "@/containers/Common/interfaces";
import {openModerateModal} from "@/containers/Common/store/actions";
import {useDispatch} from "react-redux";
import './index.scss';
import {Input} from "@/shared/components/Form";


interface ModerateModalProps{
    onClose: () => void;
    isShowing: boolean;
    moderationModalData:ModerateModalAction
}

const reasons = [
    "Nudity", "Violence", "Harassment",
"False News", "Spam", "Hate speech",
"Something Else"
];

const ModerateModal = ({isShowing,onClose,moderationModalData}:ModerateModalProps) =>{
    const dispatch = useDispatch();


    const closeModerateModalHandler = useCallback(() =>{
        onClose()
        dispatch(openModerateModal(null))
    },[])


    const getEntityType =  () =>{
        switch (moderationModalData.type){
            case MODERATION_TYPES.discussion:
                return   "discussion";
            case MODERATION_TYPES.proposals:
                return   "proposal";
            case MODERATION_TYPES.discussionMessage:
                return   "message";

        }
    }

    const getTitle = () =>{
        const  title = moderationModalData.actionType  === 'hide' ? "Hide ":"Report ";
  return title + getEntityType();
    }


    const getDescription = () =>{
        if(moderationModalData.actionType !== 'hide'){
            return <>
<div className="description-title">Please select a problem to continue</div>
                <div className="description-content">You can hide the {getEntityType()} after selecting a problem</div>
            </>
        }

        return                 <div className="description-content">Please tell us what’s wrong with this {getEntityType()} . No one else will see the content of this report</div>
    }

    return (<Modal      isShowing={isShowing}
                onClose={closeModerateModalHandler}
                mobileFullScreen
                isHeaderSticky
                shouldShowHeaderShadow={false}>
        <div className="moderate-modal-wrapper">
            <div className="moderate-title">{getTitle()}</div>
            <div className="moderate-description">{getDescription()}</div>
            <div className="moderate-content">
                <div className="reasons">
                    {
                        reasons.map(r =><div className={`reason-item ${r === 'Nudity' ? "active":''}`} key={r}>{r}</div>)
                    }
                </div>
                <div className="note-wrapper">
                    <div className="moderate-note">Moderator note:</div>
                    <Input
                        id="note"
                        name="note"
                        placeholder="Add Note"
                        isTextarea
                    />
                </div>
                <div className="action-wrapper">
                    <button
                        className="button-blue"
                    >
                    Hide
                    </button>
                </div>
            </div>
        </div>
    </Modal>)
}

export default ModerateModal;
