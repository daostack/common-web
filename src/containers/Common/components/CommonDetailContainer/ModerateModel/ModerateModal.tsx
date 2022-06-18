import React, {useCallback} from "react";
import {ElementDropdownMenuItems, Modal} from "@/shared/components";
import {ModerateModalAction, ModerationActionType} from "@/containers/Common/interfaces";
import {openModerateModal} from "@/containers/Common/store/actions";
import {useDispatch} from "react-redux";

interface ModerateModalProps{
    onClose: () => void;
    isShowing: boolean;
    moderationModalData:ModerateModalAction
}


const ModerateModal = ({isShowing,onClose}:ModerateModalProps) =>{
    const dispatch = useDispatch();


    const closeModerateModalHandler = useCallback(() =>{
        onClose()
        dispatch(openModerateModal(null))
    },[])

    return (<Modal      isShowing={isShowing}
                onClose={closeModerateModalHandler}
                mobileFullScreen
                isHeaderSticky
                shouldShowHeaderShadow={false}>
        hello
    </Modal>)
}

export default ModerateModal;
